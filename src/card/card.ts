// External dependencies
import { mdiChevronRight } from "@mdi/js";
import hash from "object-hash/dist/object_hash";
import { UnsubscribeFunc } from "home-assistant-js-websocket";
import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  nothing,
  PropertyValues,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import type {
  ClimateEntity,
  HomeAssistant,
  HvacMode,
  LovelaceCard,
  LovelaceCardEditor,
  RenderTemplateResult,
} from "../dependencies/ha";
import {
  compareClimateHvacModes,
  computeDomain,
  subscribeRenderTemplate,
} from "../dependencies/ha";
import { isTemplate as _isTemplate } from "../dependencies/ha/common/string/has-template";

// Internalized external dependencies
import {
  CacheManager,
  computeDarkMode,
  registerCustomCard,
} from "../dependencies/mushroom";

// Local utilities
import * as Logger from "../utils/logger";
import { isValidFontSize } from "../utils/css/valid-font-size";
import { migrate_parameters } from "../utils/migrate-parameters";
import { getFeature } from "../utils/object/features";
import { getValueFromPath } from "../utils/object/get-value";
import { trySetValue } from "../utils/object/set-value";

// Local constants & types
import { DEFAULTS } from "../constants/defaults";
import { LOGGER_SETTINGS, VERSION } from "../constants/logger";
import type {
  FeatureStyle,
  GaugeCardProCardConfig,
  LightDarkModeColor,
} from "./config";
import type { Feature } from "./types";

// Feature utils
import {
  FEATURE_PAGE_ICON,
  FEATURE_PAGE_ICON_COLOR,
  FEATURE_PAGE_ORDER,
} from "./utils";

// Components (side-effect imports)
import "./components/icon-button";
import "./components/climate-fan-modes-control";
import "./components/climate-hvac-modes-control";
import "./components/climate-overview";
import "./components/climate-preset-modes-control";
import "./components/climate-swing-modes-control";
import "./components/climate-temperature-control";
import "./gauge";

//-----------------------------------------------------------------------------
// TEMPLATE CACHE / TYPES
//-----------------------------------------------------------------------------

const TEMPLATE_KEYS = [
  "icons.left.value",
  "icons.right.value",
  "inner.max",
  "inner.min",
  "inner.needle_color",
  "inner.segments",
  "inner.setpoint.color",
  "inner.setpoint.value",
  "inner.value",
  "max",
  "max_indicator.value",
  "max_indicator.label_color",
  "min",
  "min_indicator.value",
  "min_indicator.label_color",
  "needle_color",
  "segments",
  "setpoint.color",
  "setpoint.value",
  "shapes.main_needle",
  "shapes.main_min_indicator",
  "shapes.main_max_indicator",
  "shapes.main_setpoint_needle",
  "shapes.inner_needle",
  "shapes.inner_min_indicator",
  "shapes.inner_max_indicator",
  "shapes.inner_setpoint_needle",
  "titles.primary",
  "titles.primary_color",
  "titles.primary_font_size",
  "titles.secondary",
  "titles.secondary_color",
  "titles.secondary_font_size",
  "value",
  "value_texts.primary",
  "value_texts.primary_color",
  "value_texts.primary_unit",
  "value_texts.primary_font_size_reduction",
  "value_texts.secondary",
  "value_texts.secondary_color",
  "value_texts.secondary_unit",
] as const;
export type TemplateKey = (typeof TEMPLATE_KEYS)[number];
export type GetValueFn = <T = unknown>(key: TemplateKey) => T;

type TemplateResults = Partial<
  Record<TemplateKey, RenderTemplateResult | undefined>
>;

const templateCache = new CacheManager<TemplateResults>(1000);

//-----------------------------------------------------------------------------
// CARD REGISTRATION
//-----------------------------------------------------------------------------

registerCustomCard({
  type: "gauge-card-pro",
  name: "Gauge Card Pro",
  description: "Build beautiful Gauge cards using gradients and templates",
});

//-----------------------------------------------------------------------------
// CARD
//-----------------------------------------------------------------------------

@customElement("gauge-card-pro")
export class GaugeCardProCard extends LitElement implements LovelaceCard {
  constructor() {
    super();
    Logger.initializeLogger(VERSION);
  }

  public readonly log = Logger.createLogger();

  // HA / config
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() public _config?: GaugeCardProCardConfig;

  // Debug
  private _lastLoggedTemplateResults?: string;

  // Shared/config header properties
  private header?: string;

  // Features
  private featureEntity?: string;
  private enabledFeaturePages?: Feature[];
  @state() private activeFeaturePage?: Feature;

  // Background
  private hideBackground = false;

  // Template handling
  private _templatedKeys: Set<TemplateKey> = new Set();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private _nonTemplatedTemplateKeysCache = new Map<TemplateKey, any>();
  @state() private _templateResults?: TemplateResults;
  @state() private _unsubRenderTemplates: Map<
    TemplateKey,
    Promise<UnsubscribeFunc>
  > = new Map();

  // -------------------------------------------

  //-----------------------------------------------------------------------------
  // LOVELACE CARD API
  //-----------------------------------------------------------------------------

  public getCardSize(): number {
    return 4;
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editor/editor");
    return document.createElement(
      "gauge-card-pro-editor"
    ) as LovelaceCardEditor;
  }

  public static async getStubConfig(
    hass: HomeAssistant
  ): Promise<GaugeCardProCardConfig> {
    const entities = Object.keys(hass.states);
    const numbers = entities.filter((e) =>
      ["counter", "input_number", "number", "sensor"].includes(e.split(".")[0])
    );
    return {
      type: `custom:gauge-card-pro`,
      entity: numbers[0],
      segments: [
        { pos: 0, color: "red" },
        { pos: 25, color: "#FFA500" },
        { pos: 50, color: "rgb(255, 255, 0)" },
        { pos: 100, color: "var(--green-color)" },
      ],
      needle: true,
      gradient: true,
      titles: {
        primary: "{{ state_attr(entity, 'friendly_name') }}",
      },
    };
  }

  public setConfig(config: GaugeCardProCardConfig): void {
    if (config.log_debug === true) {
      this.log.SetLogLevel(Logger.LogLevel.DEBUG);
    } else {
      this.log.SetLogLevel(LOGGER_SETTINGS.DEFAULT_LOG_LEVEL);
    }

    config = migrate_parameters(config);

    TEMPLATE_KEYS.forEach((key) => {
      const currentKeyValue = getValueFromPath(this._config, key);
      const newKeyValue = getValueFromPath(config, key);

      if (
        newKeyValue !== currentKeyValue ||
        this._config?.entity != config.entity ||
        this._config?.entity2 != config.entity2
      ) {
        this._tryDisconnectKey(key);
      }
    });

    config = trySetValue(
      config,
      "tap_action.action",
      "more-info",
      true,
      false
    ).result;

    config = trySetValue(
      config,
      "primary_value_text_tap_action.action",
      "none",
      true,
      false
    ).result;

    config = trySetValue(
      config,
      "secondary_value_text_tap_action.action",
      "none",
      true,
      false
    ).result;

    config = trySetValue(
      config,
      "inner.mode",
      DEFAULTS.inner.mode,
      false,
      false
    ).result;

    this.header = config.header ?? undefined;

    // Features
    this.featureEntity =
      config.feature_entity !== undefined
        ? config.feature_entity
        : config?.entity?.startsWith("climate")
          ? config.entity
          : undefined;

    if (this.featureEntity !== undefined) {
      const _enabledFeatures = new Set(config.features?.map((f) => f.type));
      this.enabledFeaturePages = FEATURE_PAGE_ORDER.filter((p) =>
        _enabledFeatures.has(p)
      );
      if (this.enabledFeaturePages.length >= 1) {
        this.activeFeaturePage = this.enabledFeaturePages[0];
      }
    }

    // Background
    this.hideBackground = config.hide_background ?? false;

    // Determine templated keys for quicker access to templates
    // Cache non-templated template keys as they are fixed values
    const templatedKeys = new Set<TemplateKey>();
    TEMPLATE_KEYS.forEach((key) => {
      const value = getValueFromPath(config, key);
      if (value !== undefined) {
        if (_isTemplate(String(value))) {
          templatedKeys.add(key);
        } else {
          this._nonTemplatedTemplateKeysCache.set(key, value);
        }
      }
    });
    this._templatedKeys = templatedKeys;

    this._config = config;

    this.log.debug("(setConfig) Config:", config);
    this.log.debug("(setConfig) Deteced Templates:", this._templatedKeys);
    this.log.debug(
      "(setConfig) Non-Templated:",
      this._nonTemplatedTemplateKeysCache
    );
  }

  //-----------------------------------------------------------------------------
  // LIT LIFECYCLE
  //-----------------------------------------------------------------------------

  public connectedCallback() {
    super.connectedCallback();
    this._tryConnect();
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this._tryDisconnect();

    if (this._config && this._templateResults) {
      const key = this._computeCacheKey();
      templateCache.set(key, this._templateResults);
    }
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);
    if (!this._config) return;

    if (!this._templateResults) {
      const key = this._computeCacheKey();
      if (templateCache.has(key)) {
        this._templateResults = templateCache.get(key)!;
      } else {
        this._templateResults = {};
      }
    }
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._config || !this.hass) {
      return;
    }

    this._tryConnect();
  }

  //-----------------------------------------------------------------------------
  // RENDER
  //-----------------------------------------------------------------------------

  protected override render() {
    if (!this._config || !this.hass) return nothing;

    if (this.log.getLogLevelName() === "debug") {
      const _templateResultsString = JSON.stringify(this._templateResults);
      if (_templateResultsString !== this._lastLoggedTemplateResults) {
        this._lastLoggedTemplateResults = _templateResultsString;
        this.log.debug("(render) TemplateResults: ", this._templateResults);
      }
    }

    //-----------------------------------------------------------------------------
    // TITLES
    //-----------------------------------------------------------------------------

    // primary
    const primaryTitle = this.getValue("titles.primary");
    const primaryTitleColor =
      this.getLightDarkModeColor("titles.primary_color") ??
      DEFAULTS.ui.titleColor;
    let primaryTitleFontSize = this.getValue(
      "titles.primary_font_size"
    ) as string;
    if (!primaryTitleFontSize || !isValidFontSize(primaryTitleFontSize))
      primaryTitleFontSize = DEFAULTS.ui.titleFontSizePrimary;

    // secondary
    const secondaryTitle = this.getValue("titles.secondary");
    const secondaryTitleColor =
      this.getLightDarkModeColor("titles.secondary_color") ??
      DEFAULTS.ui.titleColor;
    let secondary_title_font_size = this.getValue<string>(
      "titles.secondary_font_size"
    );
    if (
      !secondary_title_font_size ||
      !isValidFontSize(secondary_title_font_size)
    )
      secondary_title_font_size = DEFAULTS.ui.titleFontSizeSecondary;

    //-----------------------------------------------------------------------------
    // FEATURES
    //-----------------------------------------------------------------------------

    let hasClimateOverviewFeature: boolean;
    let hasAdjustTemperatureFeature: boolean;
    let hasClimateHvacModesFeature: boolean;
    let climateHvacFeatureStyle: FeatureStyle | undefined;
    let hasClimateFanModesFeature: boolean;
    let climateFanFeatureStyle: FeatureStyle | undefined;
    let hasClimateSwingModesFeature: boolean;
    let climateSwingFeatureStyle: FeatureStyle | undefined;
    let hasClimatePresetModesFeature: boolean;
    let climatePresetFeatureStyle: FeatureStyle | undefined;

    let featureEntityObj: ClimateEntity | undefined;

    let hvacModes: HvacMode[] | undefined;
    let fanModes: string[] | undefined;
    let swingModes: string[] | undefined;
    let presetModes: string[] | undefined;

    let hasMoreThanOnePage: boolean = false;
    let hasFiveOrMoreIcons: boolean = false;

    if (
      this.featureEntity !== undefined &&
      this.enabledFeaturePages &&
      this.enabledFeaturePages.length >= 1
    ) {
      hasClimateOverviewFeature =
        this.enabledFeaturePages.includes("climate-overview");
      hasAdjustTemperatureFeature =
        this.enabledFeaturePages.includes("adjust-temperature");
      hasClimateFanModesFeature =
        this.enabledFeaturePages.includes("climate-fan-modes");
      hasClimateHvacModesFeature =
        this.enabledFeaturePages.includes("climate-hvac-modes");
      hasClimateSwingModesFeature = this.enabledFeaturePages.includes(
        "climate-swing-modes"
      );
      hasClimatePresetModesFeature = this.enabledFeaturePages.includes(
        "climate-preset-modes"
      );

      if (
        hasClimateOverviewFeature ||
        hasAdjustTemperatureFeature ||
        hasClimateHvacModesFeature ||
        hasClimateFanModesFeature ||
        hasClimateSwingModesFeature ||
        hasClimatePresetModesFeature
      ) {
        featureEntityObj =
          this.featureEntity && computeDomain(this.featureEntity) === "climate"
            ? (this.hass!.states[this.featureEntity] as ClimateEntity)
            : undefined;
      }

      if (featureEntityObj !== undefined) {
        if (hasClimateHvacModesFeature) {
          const hvacModesFeuture = getFeature(
            this._config,
            "climate-hvac-modes"
          );
          const _hvacModes =
            hvacModesFeuture?.hvac_modes ??
            featureEntityObj.attributes.hvac_modes ??
            [];
          hvacModes = featureEntityObj.attributes.hvac_modes
            .filter((mode) => _hvacModes.includes(mode))
            .sort(compareClimateHvacModes);
          if (!hvacModes) {
            hasClimateHvacModesFeature = false;
          } else {
            climateHvacFeatureStyle = hvacModesFeuture?.style;
          }
        }

        if (hasClimateFanModesFeature) {
          const fanModesFeature = getFeature(this._config, "climate-fan-modes");
          const _fanModes =
            fanModesFeature?.fan_modes ??
            featureEntityObj.attributes.fan_modes ??
            [];
          fanModes = featureEntityObj.attributes.fan_modes?.filter((mode) =>
            _fanModes.includes(mode)
          );
          if (!fanModes) {
            hasClimateFanModesFeature = false;
          } else {
            climateFanFeatureStyle = fanModesFeature?.style;
          }
        }

        if (hasClimateSwingModesFeature) {
          const swingModesFeature = getFeature(
            this._config,
            "climate-swing-modes"
          );
          const _swingModes =
            swingModesFeature?.swing_modes ??
            featureEntityObj.attributes.swing_modes ??
            [];
          swingModes = featureEntityObj.attributes.swing_modes?.filter((mode) =>
            _swingModes.includes(mode)
          );
          if (!swingModes) {
            hasClimateSwingModesFeature = false;
          } else {
            climateSwingFeatureStyle = swingModesFeature?.style;
          }
        }

        if (hasClimatePresetModesFeature) {
          const presetModesFeature = getFeature(
            this._config,
            "climate-preset-modes"
          );
          const _presetModes =
            presetModesFeature?.preset_modes ??
            featureEntityObj.attributes.preset_modes ??
            [];
          presetModes = featureEntityObj.attributes.preset_modes?.filter(
            (mode) => _presetModes.includes(mode)
          );
          if (!presetModes) {
            hasClimatePresetModesFeature = false;
          } else {
            climatePresetFeatureStyle = presetModesFeature?.style;
          }
        }

        hasMoreThanOnePage =
          [
            hasAdjustTemperatureFeature,
            hasClimateHvacModesFeature,
            hasClimateFanModesFeature,
            hasClimateSwingModesFeature,
            hasClimatePresetModesFeature,
          ].filter(Boolean).length > 1;

        hasFiveOrMoreIcons = Boolean(
          (hasClimateOverviewFeature &&
            hasAdjustTemperatureFeature &&
            hasClimateFanModesFeature &&
            hasClimateHvacModesFeature &&
            hasClimatePresetModesFeature &&
            hasClimateSwingModesFeature) ||
          (hasClimateFanModesFeature &&
            climateFanFeatureStyle !== "dropdown" &&
            fanModes &&
            fanModes.length >= 5) ||
          (hasClimateHvacModesFeature &&
            climateHvacFeatureStyle !== "dropdown" &&
            hvacModes &&
            hvacModes.length >= 5) ||
          (hasClimatePresetModesFeature &&
            climatePresetFeatureStyle !== "dropdown" &&
            presetModes &&
            presetModes.length >= 5) ||
          (hasClimateSwingModesFeature &&
            climateSwingFeatureStyle !== "dropdown" &&
            swingModes &&
            swingModes.length >= 5)
        );
      }
    }

    return html`
      <ha-card
        style=${styleMap({
          background: this.hideBackground ? "none" : undefined,
          border: this.hideBackground ? "none" : undefined,
          "box-shadow": this.hideBackground ? "none" : undefined,
        })}
      >
        ${this.header !== undefined
          ? html` <h1 class="card-header">${this.header}</h1>`
          : nothing}
        <gauge-card-pro-gauge
          .log=${this.log}
          .hass=${this.hass}
          .config=${this._config}
          .getValue=${(key: TemplateKey) => this.getValue(key)}
          .getLightDarkModeColor=${(key: TemplateKey) =>
            this.getLightDarkModeColor(key)}
        >
        </gauge-card-pro-gauge>

        ${featureEntityObj !== undefined &&
        (hasClimateOverviewFeature! ||
          hasAdjustTemperatureFeature! ||
          hasClimateHvacModesFeature! ||
          hasClimateFanModesFeature! ||
          hasClimateSwingModesFeature!)
          ? html` <div
              class="controls-row"
              style=${styleMap({
                "grid-template-columns": hasMoreThanOnePage
                  ? "36px auto 36px"
                  : undefined,
                "max-width":
                  hasMoreThanOnePage && hasFiveOrMoreIcons
                    ? "300px"
                    : hasMoreThanOnePage
                      ? "250px"
                      : "208px",
              })}
            >
              ${hasMoreThanOnePage
                ? html` <div style="display: flex; justify-self: start;">
                    <gcp-icon-button
                      appearance="square"
                      title="Back to first page"
                      @click=${(ev) => this.setFirstFeaturePage(ev)}
                      style=${styleMap({
                        "--icon-color":
                          FEATURE_PAGE_ICON_COLOR[this.activeFeaturePage!],
                        "--bg-color": `color-mix(in srgb, ${FEATURE_PAGE_ICON_COLOR[this.activeFeaturePage!]} 20%, transparent)`,
                      })}
                    >
                      <ha-svg-icon
                        .path=${FEATURE_PAGE_ICON[this.activeFeaturePage!]}
                      ></ha-svg-icon>
                    </gcp-icon-button>
                  </div>`
                : nothing}
              ${hasClimateOverviewFeature!
                ? html` <gcp-climate-overview
                    style=${styleMap({
                      display:
                        this.activeFeaturePage !== "climate-overview"
                          ? "none"
                          : undefined,
                    })}
                    .hass=${this.hass}
                    .entity=${featureEntityObj}
                    .hasAdjustTemperatureFeature=${hasAdjustTemperatureFeature!}
                    .hasClimateHvacModesFeature=${hasClimateHvacModesFeature!}
                    .hasClimateFanModesFeature=${hasClimateFanModesFeature!}
                    .hasClimateSwingModesFeature=${hasClimateSwingModesFeature!}
                    .hasClimatePresetModesFeature=${hasClimatePresetModesFeature!}
                    .setPage=${(ev: CustomEvent, page: Feature) =>
                      this.setFeaturePage(ev, page)}
                  >
                  </gcp-climate-overview>`
                : nothing}
              ${hasAdjustTemperatureFeature!
                ? html` <gcp-climate-temperature-control
                    style=${styleMap({
                      display:
                        this.activeFeaturePage !== "adjust-temperature"
                          ? "none"
                          : undefined,
                    })}
                    .lang=${this.lang}
                    .callService=${this.hass.callService}
                    .unit_temp=${this.hass!.config.unit_system.temperature}
                    .entity=${featureEntityObj}
                  >
                  </gcp-climate-temperature-control">`
                : nothing}
              ${hasClimateHvacModesFeature!
                ? html` <gcp-climate-hvac-modes-control
                    style=${styleMap({
                      display:
                        this.activeFeaturePage !== "climate-hvac-modes"
                          ? "none"
                          : undefined,
                    })}
                    .lang=${this.lang}
                    .callService=${this.hass.callService}
                    .entity=${featureEntityObj}
                    .modes=${hvacModes!}
                    .featureStyle=${climateHvacFeatureStyle}
                  >
                  </gcp-climate-hvac-modes-control>`
                : nothing}
              ${hasClimateFanModesFeature!
                ? html` <gcp-climate-fan-modes-control
                    style=${styleMap({
                      display:
                        this.activeFeaturePage !== "climate-fan-modes"
                          ? "none"
                          : undefined,
                    })}
                    .lang=${this.lang}
                    .callService=${this.hass.callService}
                    .entity=${featureEntityObj}
                    .modes=${fanModes}
                    .featureStyle=${climateFanFeatureStyle}
                  >
                  </gcp-climate-fan-modes-control>`
                : nothing}
              ${hasClimateSwingModesFeature!
                ? html` <gcp-climate-swing-control
                    style=${styleMap({
                      display:
                        this.activeFeaturePage !== "climate-swing-modes"
                          ? "none"
                          : undefined,
                    })}
                    .lang=${this.lang}
                    .callService=${this.hass.callService}
                    .entity=${featureEntityObj}
                    .modes=${swingModes}
                    .featureStyle=${climateSwingFeatureStyle}
                  >
                  </gcp-climate-swing-control>`
                : nothing}
              ${hasClimatePresetModesFeature!
                ? html` <gcp-climate-preset-modes-control
                    style=${styleMap({
                      display:
                        this.activeFeaturePage !== "climate-preset-modes"
                          ? "none"
                          : undefined,
                    })}
                    .lang=${this.lang}
                    .callService=${this.hass.callService}
                    .entity=${featureEntityObj}
                    .modes=${presetModes}
                    .featureStyle=${climatePresetFeatureStyle}
                  >
                  </gcp-climate-preset-modes-control>`
                : nothing}
              ${this.enabledFeaturePages!.length > 1
                ? html` <div style="display: flex; justify-self: end;">
                    <gcp-icon-button
                      appearance="plain"
                      @click=${(ev) => this.nextFeaturePage(ev)}
                    >
                      <ha-svg-icon .path=${mdiChevronRight}></ha-svg-icon>
                    </gcp-icon-button>
                  </div>`
                : nothing}
            </div>`
          : nothing}
        ${primaryTitle
          ? html` <div
              class="title primary-title"
              style=${styleMap({
                color: primaryTitleColor,
                "font-size": primaryTitleFontSize,
              })}
              .title=${primaryTitle}
            >
              ${primaryTitle}
            </div>`
          : nothing}
        ${secondaryTitle
          ? html` <div
              class="title"
              style=${styleMap({
                color: secondaryTitleColor,
                "font-size": secondary_title_font_size,
              })}
              .title=${secondaryTitle}
            >
              ${secondaryTitle}
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  //-----------------------------------------------------------------------------
  // ACTION HANDLING
  //-----------------------------------------------------------------------------

  private setFirstFeaturePage(ev: CustomEvent) {
    ev.stopPropagation();
    if (!this.enabledFeaturePages) return;
    this.activeFeaturePage = this.enabledFeaturePages[0];
  }

  private setFeaturePage(ev: CustomEvent, page: Feature) {
    ev.stopPropagation();
    if (!this.enabledFeaturePages) return;
    this.activeFeaturePage = page;
  }

  private nextFeaturePage(ev: CustomEvent) {
    ev.stopPropagation();
    if (!this.enabledFeaturePages) return;
    const i = this.enabledFeaturePages.indexOf(this.activeFeaturePage!);
    this.activeFeaturePage =
      this.enabledFeaturePages[(i + 1) % this.enabledFeaturePages.length];
  }

  //-----------------------------------------------------------------------------
  // TEMPLATE HANDLING
  //-----------------------------------------------------------------------------

  private async _tryConnect(): Promise<void> {
    this._templatedKeys.forEach((key) => {
      this._tryConnectKey(key);
    });
  }

  private async _tryConnectKey(key: TemplateKey): Promise<void> {
    if (
      this._unsubRenderTemplates.get(key) !== undefined ||
      !this.hass ||
      !this._config ||
      !this.isTemplate(key)
    ) {
      return;
    }

    const key_value = getValueFromPath(this._config, key);

    try {
      const sub = subscribeRenderTemplate(
        this.hass.connection,
        (result) => {
          this._templateResults = {
            ...this._templateResults,
            [key]: result,
          };
        },
        {
          template: String(key_value),
          entity_ids: this._config.entity_id,
          variables: {
            config: this._config,
            user: this.hass.user!.name,
            entity: this._config.entity,
            entity2: this._config.entity2,
          },
          strict: true,
        }
      );
      this._unsubRenderTemplates.set(key, sub);
      await sub;
    } catch {
      const result = {
        result: key_value ?? "",
        listeners: {
          all: false,
          domains: [],
          entities: [],
          time: false,
        },
      };
      this._templateResults = {
        ...this._templateResults,
        [key]: result,
      };
      this._unsubRenderTemplates.delete(key);
    }
  }

  private async _tryDisconnect(): Promise<void> {
    Array.from(this._unsubRenderTemplates.keys()).forEach((key) => {
      this._tryDisconnectKey(key);
    });
  }

  private async _tryDisconnectKey(key: TemplateKey): Promise<void> {
    const unsubRenderTemplate = this._unsubRenderTemplates.get(key);
    if (!unsubRenderTemplate) return;

    try {
      const unsub = await unsubRenderTemplate;
      unsub();
      this._unsubRenderTemplates.delete(key);
    } catch (err: any) {
      if (err.code === "not_found" || err.code === "template_error") {
        // If we get here, the connection was probably already closed. Ignore.
      } else {
        throw err;
      }
    }
  }

  private isTemplate(key: TemplateKey): boolean {
    if (key === undefined) return false;
    if (this._templatedKeys && this._templatedKeys.size)
      return this._templatedKeys.has(key);
    return _isTemplate(String(getValueFromPath(this._config, key)));
  }

  public getValue<T = unknown>(key: TemplateKey): T {
    // Use .get() directly instead of .has() + .get() (reduces Map operations)
    let value = this._nonTemplatedTemplateKeysCache?.get(key);
    if (value !== undefined) return value as T;

    value = this.isTemplate(key)
      ? this._templateResults?.[key]?.result
      : getValueFromPath(this._config, key);

    return value as T;
  }

  public getLightDarkModeColor(key: TemplateKey): string | undefined {
    const configColor = this.getValue(key) as string | LightDarkModeColor;
    if (
      typeof configColor === "object" &&
      configColor !== null &&
      "light_mode" in configColor &&
      "dark_mode" in configColor
    ) {
      return computeDarkMode(this.hass)
        ? configColor.dark_mode
        : configColor.light_mode;
    }

    if (typeof configColor === "string") {
      return configColor;
    }

    return;
  }

  private _computeCacheKey() {
    return hash(this._config);
  }

  //-----------------------------------------------------------------------------
  // STYLES
  //-----------------------------------------------------------------------------

  static get styles(): CSSResultGroup {
    return css`
      ha-card {
        height: 100%;
        overflow: hidden;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-sizing: border-box;
        --icon-size: 36px;
        --spacing: 10px;
        --control-border-radius: 12px;
        --control-height: 32px;
        --control-button-ratio: 1;
        --control-icon-size: 0.5em;
        --control-spacing: 12px;
      }

      ha-card.action {
        cursor: pointer;
      }

      ha-card:focus {
        outline: none;
      }

      .card-header,
      :host ::slotted(.card-header) {
        color: var(--ha-card-header-color, var(--primary-text-color));
        font-family: var(--ha-card-header-font-family, inherit);
        font-size: var(--ha-card-header-font-size, var(--ha-font-size-2xl));
        letter-spacing: -0.012em;
        line-height: var(--ha-line-height-expanded);
        display: block;
        margin-block-start: 0;
        margin-block-end: 0;
        font-weight: var(--ha-font-weight-normal);
        margin: 0;
        padding: 0;
        width: 100%;
      }

      gauge-card-pro-gauge {
        position: relative;
        width: 100%;
        aspect-ratio: 2 / 1;
        max-width: 250px;
      }

      .title {
        text-align: center;
        line-height: initial;
        width: 100%;
      }

      .primary-title {
        margin-top: 8px;
      }

      .controls-row {
        display: grid;
        align-items: center;
        margin-top: 8px;
        width: 100%;
        min-width: 0;
      }
    `;
  }
}
