// External dependencies
import { UnsubscribeFunc } from "home-assistant-js-websocket";
import { CSSResultGroup, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import hash from "object-hash/dist/object_hash";
import { mdiChevronRight } from "@mdi/js";

// Core HA helpers
import {
  ClimateEntity,
  compareClimateHvacModes,
  computeDomain,
  HomeAssistant,
  HvacMode,
  LovelaceCard,
  LovelaceCardEditor,
  RenderTemplateResult,
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
import { getValueFromPath } from "../utils/object/get-value";
import { migrate_parameters } from "../utils/migrate-parameters";
import { getFeature } from "../utils/object/features";
import { trySetValue } from "../utils/object/set-value";
import { isValidFontSize } from "../utils/css/valid-font-size";

// Local constants & types
import { cardCSS } from "./css/card";
import {
  VERSION,
  LOGGER_SETTINGS,
  DEFAULT_INNER_MODE,
  DEFAULT_TITLE_COLOR,
  DEFAULT_TITLE_FONT_SIZE_PRIMARY,
  DEFAULT_TITLE_FONT_SIZE_SECONDARY,
} from "./const";
import { GaugeCardProCardConfig, Feature, FeatureStyle } from "./config";

import {
  FEATURE_PAGE_ORDER,
  FEATURE_PAGE_ICON,
  FEATURE_PAGE_ICON_COLOR,
} from "./utils";

// Components
import "./components/icon-button";
import "./components/climate-fan-modes-control";
import "./components/climate-hvac-modes-control";
import "./components/climate-overview";
import "./components/climate-swing-modes-control";
import "./components/climate-temperature-control";
import "./gauge";

const templateCache = new CacheManager<TemplateResults>(1000);

type TemplateResults = Partial<
  Record<TemplateKey, RenderTemplateResult | undefined>
>;

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

registerCustomCard({
  type: "gauge-card-pro",
  name: "Gauge Card Pro",
  description: "Build beautiful Gauge cards using gradients and templates",
});

@customElement("gauge-card-pro")
export class GaugeCardProCard extends LitElement implements LovelaceCard {
  constructor() {
    super();
    Logger.initializeLogger(VERSION);
  }

  public readonly log = Logger.createLogger();

  //debug properties
  private _lastLoggedTemplateResults?: string;

  @property({ attribute: false }) public hass?: HomeAssistant;

  // template handling
  private _templatedKeys: Set<TemplateKey> = new Set();
  private _nonTemplatedTemplateKeysCache = new Map<TemplateKey, any>();
  @state() private _templateResults?: TemplateResults;
  @state() private _unsubRenderTemplates: Map<
    TemplateKey,
    Promise<UnsubscribeFunc>
  > = new Map();

  @state() public _config?: GaugeCardProCardConfig;

  // shared/config header properties
  private header?: string;

  // features
  private featureEntity?: string;
  private enabledFeaturePages?: Feature[];
  @state() private activeFeaturePage?: Feature;

  private hideBackground = false;

  // -------------------------------------------

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

  setConfig(config: GaugeCardProCardConfig): void {
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
      DEFAULT_INNER_MODE,
      false,
      false
    ).result;

    this.header = config.header ?? undefined;

    // features
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
      if (this.enabledFeaturePages.length >= 1)
        this.activeFeaturePage = this.enabledFeaturePages[0];
    }

    // background
    this.hideBackground = config.hide_background ?? false;

    // determine templated keys for quicker access to templates
    // cache non-templated template keys as they are fixed values
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
    // connect only for templated keys (no per-update scanning)
    // this._tryConnect();

    this.log.debug("(setConfig) Config:", config);
    this.log.debug("(setConfig) Deteced Templates:", this._templatedKeys);
    this.log.debug(
      "(setConfig) Non-Templated:",
      this._nonTemplatedTemplateKeysCache
    );
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
          template: String(key_value) ?? "",
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
    } catch (_err) {
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

  public getValue(key: TemplateKey): any {
    // Use .get() directly instead of .has() + .get() (reduces Map operations)
    let value = this._nonTemplatedTemplateKeysCache?.get(key);
    if (value !== undefined) return value;

    value = this.isTemplate(key)
      ? this._templateResults?.[key]?.result
      : getValueFromPath(this._config, key);

    return value;
  }

  private getLightDarkModeColor(
    key: TemplateKey,
    defaultColor: string
  ): string {
    const configColor = this.getValue(key);
    if (typeof configColor === "object") {
      const keys = Object.keys(configColor);

      if (keys.includes("light_mode") && keys.includes("dark_mode")) {
        return computeDarkMode(this.hass)
          ? configColor["dark_mode"]
          : configColor["light_mode"];
      }
      return defaultColor;
    }

    return configColor ?? defaultColor;
  }

  private _computeCacheKey() {
    return hash(this._config);
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

  protected willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
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

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._config || !this.hass) {
      return;
    }

    this._tryConnect();
  }

  protected render() {
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
    const primaryTitleColor = this.getLightDarkModeColor(
      "titles.primary_color",
      DEFAULT_TITLE_COLOR
    );
    let primaryTitleFontSize = this.getValue("titles.primary_font_size");
    if (!primaryTitleFontSize || !isValidFontSize(primaryTitleFontSize))
      primaryTitleFontSize = DEFAULT_TITLE_FONT_SIZE_PRIMARY;

    // secondary
    const secondaryTitle = this.getValue("titles.secondary");
    const secondaryTitleColor = this.getLightDarkModeColor(
      "titles.secondary_color",
      DEFAULT_TITLE_COLOR
    );
    let secondary_title_font_size = this.getValue("titles.secondary_font_size");
    if (
      !secondary_title_font_size ||
      !isValidFontSize(secondary_title_font_size)
    )
      secondary_title_font_size = DEFAULT_TITLE_FONT_SIZE_SECONDARY;

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

    let featureEntityObj: ClimateEntity | undefined;

    let hvacModes: HvacMode[];
    let fanModes: string[] | undefined;
    let swingModes: string[] | undefined;

    if (
      this.featureEntity !== undefined &&
      this.enabledFeaturePages !== undefined &&
      this.enabledFeaturePages?.length >= 1
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

      if (
        hasClimateOverviewFeature ||
        hasAdjustTemperatureFeature ||
        hasClimateHvacModesFeature ||
        hasClimateFanModesFeature ||
        hasClimateSwingModesFeature
      ) {
        featureEntityObj =
          this.featureEntity && computeDomain(this.featureEntity) === "climate"
            ? <ClimateEntity>this.hass!.states[this.featureEntity]
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
                "grid-template-columns":
                  this.enabledFeaturePages!.length > 1
                    ? "36px auto 36px"
                    : undefined,
                "max-width":
                  this.enabledFeaturePages!.length > 1 ? undefined : "300px",
                height: hasClimateSwingModesFeature! ? undefined : undefined,
              })}
            >
              ${this.enabledFeaturePages!.length > 1
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
                    .setPage=${(ev: CustomEvent, page: Feature) =>
                      this.setFeaturePage(ev, page)}
                  >
                  </gcp-climate-overview>`
                : nothing}
              ${hasAdjustTemperatureFeature!
                ? html` <gcp-climate-temperature-control
                      style=${styleMap({ display: this.activeFeaturePage !== "adjust-temperature" ? "none" : undefined })}
                      .hass=${this.hass}
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
                    .hass=${this.hass}
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
                    .hass=${this.hass}
                    .entity=${featureEntityObj}
                    .modes=${fanModes}
                    .featureStyle=${climateSwingFeatureStyle}
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
                    .hass=${this.hass}
                    .entity=${featureEntityObj}
                    .modes=${swingModes}
                    .featureStyle=${climateSwingFeatureStyle}
                  >
                  </gcp-climate-swing-control>`
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

  static get styles(): CSSResultGroup {
    return [cardCSS];
  }
}
