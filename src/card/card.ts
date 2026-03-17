/* eslint-disable @typescript-eslint/no-explicit-any */
// External dependencies
import { mdiChevronRight } from "@mdi/js";
import hash from "object-hash/dist/object_hash";
import type { UnsubscribeFunc } from "home-assistant-js-websocket";
import type { CSSResultGroup, HTMLTemplateResult, PropertyValues } from "lit";
import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import type {
  ActionHandlerEvent,
  ClimateEntity,
  HomeAssistant,
  HvacMode,
  LovelaceCard,
  LovelaceCardEditor,
} from "../dependencies/ha";
import {
  UNAVAILABLE,
  actionHandler,
  afterNextRender,
  compareClimateHvacModes,
  computeDomain,
  handleAction,
  hasAction,
  subscribeRenderTemplate,
} from "../dependencies/ha";
import { isTemplate as _isTemplate } from "../dependencies/ha/common/string/has-template";

// Internalized external dependencies
import { isValidSvgPath } from "../dependencies/is-svg-path/valid-svg-path";
import { computeDarkMode, registerCustomCard } from "../dependencies/mushroom";

// Local utilities
import * as Logger from "../utils/logger";
import { isValidFontSize } from "../utils/css/valid-font-size";
import { migrate_parameters } from "../utils/migrate-parameters";
import { getAngle } from "../utils/number/get-angle";
import { NumberUtils } from "../utils/number/numberUtils";
import { deepEqual } from "../utils/object/deep-equal";
import { getFeature } from "../utils/object/features";
import { getValueFromPath } from "../utils/object/get-value";
import { trySetValue } from "../utils/object/set-value";

// Local constants & types
import { DEFAULTS } from "../constants/defaults";
import { LOGGER_SETTINGS, VERSION } from "../constants/logger";
import type { GaugeCardProCardConfig } from "./config";
import type {
  Feature,
  FeatureStyle,
  Gauge,
  GradientResolution,
  IconConfig,
  IconData,
  InnerGaugeConfig,
  InnerGaugeData,
  InnerGaugeMode,
  InnerMinMaxIndicator,
  InnerSetpoint,
  LightDarkModeColor,
  MainGaugeConfig,
  MainGaugeData,
  MainMinMaxIndicator,
  MainSetpoint,
  Needle,
  PrimaryValueTextData,
  SeverityColorMode,
  ValueElementsConfig,
  ValueElementsData,
  ValueTextData,
} from "./types";

// Feature utils
import {
  FEATURE_PAGE_ICON,
  FEATURE_PAGE_ICON_COLOR,
  FEATURE_PAGE_ORDER,
} from "./utils";

// CSS
import { cardStyles } from "./css/card";

// Template types
import {
  TEMPLATE_KEYS,
  templateCache,
  type GetValueFn,
  type TemplateKey,
  type TemplateResults,
} from "./types-template";

// Core functionality
import {
  computeSeverity as _computeSeverity,
  getConicGradientString as _getConicGradientString,
  getFlatArcConicGradientString as _getFlatArcConicGradientString,
} from "./helpers/segments/get-segments";
import { getValueAndValueText } from "./helpers/get-value-and-valueText";
import { getIconData } from "./helpers/get-icon-data";
import {
  getMinMaxIndicator,
  getSetpoint,
  type Angles,
} from "./helpers/get-indicators";
import { INVALID_ENTITY } from "../constants/constants";

// Components (side-effect imports)
import "./main-gauge";
import "./inner-gauge";
import "./value-elements";
import "./components/icons";
import "./components/icon-button";
import "./components/climate-fan-modes-control";
import "./components/climate-hvac-modes-control";
import "./components/climate-overview";
import "./components/climate-preset-modes-control";
import "./components/climate-swing-modes-control";
import "./components/climate-temperature-control";
import { getIconConfig } from "./helpers/get-icon-config";
import { getValueElementsConfig } from "./helpers/get-value-elements-config";

//=============================================================================
// LOCAL TYPES
//=============================================================================

type ValueAndValueText = {
  value: number | undefined;
  valueText: string;
};

type DraftMainMinMaxIndicator = { value: number; opts: MainMinMaxIndicator };
type DraftMainSetpoint = { value: number; opts: MainSetpoint };

type DraftInnerMinMaxIndicator = { value: number; opts: InnerMinMaxIndicator };
type DraftInnerSetpoint = { value: number; opts: InnerSetpoint };

//=============================================================================
// CARD REGISTRATION
//=============================================================================

registerCustomCard({
  type: "gauge-card-pro",
  name: "Gauge Card Pro",
  description: "Build beautiful Gauge cards using gradients and templates",
});

//=============================================================================
// CARD
//=============================================================================

@customElement("gauge-card-pro")
export class GaugeCardProCard extends LitElement implements LovelaceCard {
  constructor() {
    super();
    Logger.initializeLogger(VERSION);
  }

  public readonly log = Logger.createLogger();

  // HA / config
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() public config?: GaugeCardProCardConfig;
  @state() private _updated = false;

  private header?: string;

  // Features
  private featureEntity?: string;
  private enabledFeaturePages?: Feature[];
  private hasSeparatedOverviewControls?: boolean;
  private scrollableFeaturePages?: Feature[];
  @state() private activeFeaturePage?: Feature;

  // Background
  private hideBackground = false;

  private primaryValueAndValueText?: ValueAndValueText;
  private secondaryValueAndValueText?: ValueAndValueText;

  private mainMinIndicator?: DraftMainMinMaxIndicator;
  private mainMaxIndicator?: DraftMainMinMaxIndicator;
  private mainSetpoint?: DraftMainSetpoint;

  private innerMinIndicator?: DraftInnerMinMaxIndicator;
  private innerMaxIndicator?: DraftInnerMinMaxIndicator;
  private innerSetpoint?: DraftInnerSetpoint;

  // view models — plain fields (not @state, computed during willUpdate)
  private mainGaugeConfig?: MainGaugeConfig;
  private mainGaugeData?: MainGaugeData;
  private innerGaugeConfig?: InnerGaugeConfig;
  private innerGaugeData?: InnerGaugeData;
  private valueElementsConfig?: ValueElementsConfig;
  private valueElementsData?: ValueElementsData;
  private leftIconConfig?: IconConfig;
  private leftIconData?: IconData;
  private rightIconConfig?: IconConfig;
  private rightIconData?: IconData;

  private _main_angle = 0;
  private _main_min_indicator_angle = 0;
  private _main_max_indicator_angle = 0;
  private _main_setpoint_angle = 0;
  private _inner_angle = 0;
  private _inner_min_indicator_angle = 0;
  private _inner_max_indicator_angle = 0;
  private _inner_setpoint_angle = 0;

  // main gauge properties
  private mainValue = 0;
  private mainMin: number = DEFAULTS.values.min;
  private mainMax: number = DEFAULTS.values.max;
  private hasMainNeedle = false;

  // severity mode
  private mainSeverityCentered?: boolean;
  private mainSeverityColorMode?: SeverityColorMode;
  private hasMainGradientBackground?: boolean;

  // needle mode
  private hasMainGradient?: boolean;
  private mainGradientResolution?: string | number;

  // inner gauge properties
  private hasInnerGauge = false;
  private innerValue?: number;
  private innerMin?: number;
  private innerMax?: number;
  private innerMode?: InnerGaugeMode;

  // severity mode
  private innerSeverityCentered?: boolean;
  private innerSeverityColorMode?: SeverityColorMode;

  // needle mode
  private hasInnerGradient?: boolean;
  private innerGradientResolution?: string | number;
  private hasInnerGradientBackground?: boolean;

  // actions
  private hasCardAction = false;

  // Template handling
  private _templatedKeys: Set<TemplateKey> = new Set();
  private readonly _nonTemplatedTemplateKeysCache = new Map<TemplateKey, any>();
  @state() private _templateResults?: TemplateResults;
  @state() private readonly _unsubRenderTemplates: Map<
    TemplateKey,
    Promise<UnsubscribeFunc>
  > = new Map();
  // Debug
  private _lastLoggedTemplateResults?: string;

  //=============================================================================
  // LOVELACE CARD API
  //=============================================================================

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
    const number_ = entities.find((e) =>
      ["counter", "input_number", "number", "sensor"].includes(e.split(".")[0])
    );
    return {
      type: `custom:gauge-card-pro`,
      entity: number_,
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
      this.log.setLogLevel(Logger.LogLevel.DEBUG);
    } else {
      this.log.setLogLevel(LOGGER_SETTINGS.DEFAULT_LOG_LEVEL);
    }

    config = migrate_parameters(config)!;

    TEMPLATE_KEYS.forEach((key) => {
      const currentKeyValue = getValueFromPath(this.config, key);
      const newKeyValue = getValueFromPath(config, key);

      if (
        newKeyValue !== currentKeyValue ||
        this.config?.entity != config.entity ||
        this.config?.entity2 != config.entity2
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
      config.feature_entity ??
      (config?.entity?.startsWith("climate") ? config.entity : undefined);

    if (this.featureEntity !== undefined) {
      const overviewFeature = getFeature(config, "climate-overview");
      if (overviewFeature !== undefined) {
        this.hasSeparatedOverviewControls = overviewFeature.separate ?? false;
      }

      const _enabledFeatures = new Set(config.features?.map((f) => f.type));
      this.enabledFeaturePages = FEATURE_PAGE_ORDER.filter((p) =>
        _enabledFeatures.has(p)
      );

      this.scrollableFeaturePages = this.enabledFeaturePages.filter(
        (p) => !(this.hasSeparatedOverviewControls && p === "climate-overview")
      );

      if (this.scrollableFeaturePages.length >= 1) {
        this.activeFeaturePage = this.scrollableFeaturePages[0];
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

    this.config = config;

    this.log.debug("(setConfig) Config:", config);
    this.log.debug("(setConfig) Detected Templates:", this._templatedKeys);
    this.log.debug(
      "(setConfig) Non-Templated:",
      this._nonTemplatedTemplateKeysCache
    );
  }

  //=============================================================================
  // LIT LIFECYCLE
  //=============================================================================

  public override connectedCallback() {
    super.connectedCallback();
    this._tryConnect();
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();
    this._tryDisconnect();

    if (this.config && this._templateResults) {
      const key = this._computeCacheKey();
      templateCache.set(key, this._templateResults);
    }
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);
    if (!this.config || !this.hass) return;

    if (!this._templateResults) {
      const key = this._computeCacheKey();
      if (templateCache.has(key)) {
        this._templateResults = templateCache.get(key)!;
      } else {
        this._templateResults = {};
      }
    }

    const configChanged = changedProperties.has("config");
    const hassChanged = changedProperties.has("hass");
    if (!configChanged && !hassChanged) return;

    if (configChanged) {
      this.updateConfig();
    }

    this.computeExtremes();
    this.computeValues();

    if (this._updated) {
      this.computeAgles();
    }

    this.computeMainGaugeData();
    this.computeInnerGaugeData();
    this.computeValueElementsData();
    this.computeIconData();
  }

  protected override render() {
    if (!this.config || !this.hass) return nothing;

    if (this.log.getLogLevelName() === "debug") {
      const _templateResultsString = JSON.stringify(this._templateResults);
      if (_templateResultsString !== this._lastLoggedTemplateResults) {
        this._lastLoggedTemplateResults = _templateResultsString;
        this.log.debug("(render) TemplateResults: ", this._templateResults);
      }
    }

    //=============================================================================
    // FEATURES
    //=============================================================================

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
            ? (this.hass.states[this.featureEntity] as ClimateEntity)
            : undefined;
      }

      if (featureEntityObj !== undefined) {
        if (hasClimateHvacModesFeature) {
          const hvacModesFeature = getFeature(
            this.config,
            "climate-hvac-modes"
          );
          const _hvacModes =
            hvacModesFeature?.hvac_modes ??
            featureEntityObj.attributes.hvac_modes ??
            [];
          hvacModes = featureEntityObj.attributes.hvac_modes
            .filter((mode) => _hvacModes.includes(mode))
            .sort(compareClimateHvacModes);
          if (hvacModes) {
            climateHvacFeatureStyle = hvacModesFeature?.style;
          } else {
            hasClimateHvacModesFeature = false;
          }
        }

        if (hasClimateFanModesFeature) {
          const fanModesFeature = getFeature(this.config, "climate-fan-modes");
          const _fanModes =
            fanModesFeature?.fan_modes ??
            featureEntityObj.attributes.fan_modes ??
            [];
          fanModes = featureEntityObj.attributes.fan_modes?.filter((mode) =>
            _fanModes.includes(mode)
          );
          if (fanModes) {
            climateFanFeatureStyle = fanModesFeature?.style;
          } else {
            hasClimateFanModesFeature = false;
          }
        }

        if (hasClimateSwingModesFeature) {
          const swingModesFeature = getFeature(
            this.config,
            "climate-swing-modes"
          );
          const _swingModes =
            swingModesFeature?.swing_modes ??
            featureEntityObj.attributes.swing_modes ??
            [];
          swingModes = featureEntityObj.attributes.swing_modes?.filter((mode) =>
            _swingModes.includes(mode)
          );
          if (swingModes) {
            climateSwingFeatureStyle = swingModesFeature?.style;
          } else {
            hasClimateSwingModesFeature = false;
          }
        }

        if (hasClimatePresetModesFeature) {
          const presetModesFeature = getFeature(
            this.config,
            "climate-preset-modes"
          );
          const _presetModes =
            presetModesFeature?.preset_modes ??
            featureEntityObj.attributes.preset_modes ??
            [];
          presetModes = featureEntityObj.attributes.preset_modes?.filter(
            (mode) => _presetModes.includes(mode)
          );
          if (presetModes) {
            climatePresetFeatureStyle = presetModesFeature?.style;
          } else {
            hasClimatePresetModesFeature = false;
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
            !this.hasSeparatedOverviewControls &&
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
        <div
          class="gauge"
          @action=${this._handleCardAction}
          .actionHandler=${actionHandler({
            hasHold: hasAction(this.config.hold_action),
            hasDoubleClick: hasAction(this.config.double_tap_action),
          })}
          role=${ifDefined(this.hasCardAction ? "button" : undefined)}
          tabindex=${ifDefined(this.hasCardAction ? "0" : undefined)}
        >
          <gauge-card-pro-main-gauge
            .config=${this.mainGaugeConfig}
            .data=${this.mainGaugeData}
          >
          </gauge-card-pro-main-gauge>
          ${this.hasInnerGauge && this.innerMode !== "on_main"
            ? html` <gauge-card-pro-inner-gauge
                .config=${this.innerGaugeConfig}
                .data=${this.innerGaugeData}
              >
              </gauge-card-pro-inner-gauge>`
            : nothing}
          ${this.showValueElements
            ? html`<gauge-card-pro-gauge-value-elements
                .hass=${this.hass}
                .config=${this.valueElementsConfig}
                .data=${this.valueElementsData}
              ></gauge-card-pro-gauge-value-elements>`
            : nothing}
          ${this.leftIconData || this.rightIconData
            ? html`<gauge-card-pro-gauge-icons
                .hass=${this.hass}
                .leftConfig=${this.leftIconConfig}
                .leftData=${this.leftIconData}
                .rightConfig=${this.rightIconConfig}
                .rightData=${this.rightIconData}
              ></gauge-card-pro-gauge-icons>`
            : nothing}
        </div>

        ${featureEntityObj !== undefined &&
        hasClimateOverviewFeature! &&
        this.hasSeparatedOverviewControls
          ? html` <div
              class="controls-row"
              style=${styleMap({
                "max-width": "208px",
              })}
            >
              <gcp-climate-overview
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
              </gcp-climate-overview>
            </div>`
          : nothing}
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
              ${hasClimateOverviewFeature! && !this.hasSeparatedOverviewControls
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
                    .version=${this.hass.connection.haVersion}
                    .entity=${featureEntityObj}
                    .modes=${hvacModes}
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
                    .version=${this.hass.connection.haVersion}
                    .entity=${featureEntityObj}
                    .modes=${fanModes}
                    .featureStyle=${climateFanFeatureStyle}
                  >
                  </gcp-climate-fan-modes-control>`
                : nothing}
              ${hasClimateSwingModesFeature!
                ? html` <gcp-climate-swing-modes-control
                    style=${styleMap({
                      display:
                        this.activeFeaturePage !== "climate-swing-modes"
                          ? "none"
                          : undefined,
                    })}
                    .lang=${this.lang}
                    .callService=${this.hass.callService}
                    .version=${this.hass.connection.haVersion}
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
                    .version=${this.hass.connection.haVersion}
                    .entity=${featureEntityObj}
                    .modes=${presetModes}
                    .featureStyle=${climatePresetFeatureStyle}
                  >
                  </gcp-climate-preset-modes-control>`
                : nothing}
              ${hasMoreThanOnePage
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
        ${this.renderTitle("primary")} ${this.renderTitle("secondary")}
      </ha-card>
    `;
  }

  private renderTitle(
    type: "primary" | "secondary"
  ): HTMLTemplateResult | typeof nothing {
    const title = this.getValue(`titles.${type}`);
    if (!title) return nothing;

    const color =
      this.getLightDarkModeColor(`titles.${type}_color`) ??
      DEFAULTS.ui.titleColor;
    let fontSize = this.getValue<string>(`titles.${type}_font_size`);
    if (!fontSize || !isValidFontSize(fontSize))
      fontSize =
        type === "primary"
          ? DEFAULTS.ui.titleFontSizePrimary
          : DEFAULTS.ui.titleFontSizeSecondary;

    return html` <div
      class=${classMap({
        title: true,
        "primary-title": type === "primary",
      })}
      style=${styleMap({
        color: color,
        "font-size": fontSize,
      })}
      .title=${title}
    >
      ${title}
    </div>`;
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;
    });
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this.config || !this.hass) {
      return;
    }

    this._tryConnect();
  }

  //=============================================================================
  // ACTION HANDLING
  //=============================================================================

  private _handleCardAction(ev: ActionHandlerEvent) {
    handleAction(this, this.hass!, this.config!, ev.detail.action);
  }

  private setFirstFeaturePage(ev: CustomEvent) {
    ev.stopPropagation();
    if (!this.scrollableFeaturePages) return;
    this.activeFeaturePage = this.scrollableFeaturePages[0];
  }

  private setFeaturePage(ev: CustomEvent, page: Feature) {
    ev.stopPropagation();
    if (!this.enabledFeaturePages) return;
    this.activeFeaturePage = page;
  }

  private nextFeaturePage(ev: CustomEvent) {
    ev.stopPropagation();
    if (!this.scrollableFeaturePages) return;
    const i = this.scrollableFeaturePages.indexOf(this.activeFeaturePage!);
    this.activeFeaturePage =
      this.scrollableFeaturePages[(i + 1) % this.scrollableFeaturePages.length];
  }

  //=============================================================================
  // TEMPLATE HANDLING
  //=============================================================================

  private async _tryConnect(): Promise<void> {
    this._templatedKeys.forEach((key) => {
      this._tryConnectKey(key);
    });
  }

  private async _tryConnectKey(key: TemplateKey): Promise<void> {
    if (
      this._unsubRenderTemplates.get(key) !== undefined ||
      !this.hass ||
      !this.config ||
      !this.isTemplate(key)
    ) {
      return;
    }

    const key_value = getValueFromPath(this.config, key);

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
          entity_ids: this.config.entity_id,
          variables: {
            config: this.config,
            user: this.hass.user!.name,
            entity: this.config.entity,
            entity2: this.config.entity2,
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
    if (this._templatedKeys?.size) return this._templatedKeys.has(key);
    return _isTemplate(String(getValueFromPath(this.config, key)));
  }

  public getValueBound = ((key) => this.getValue(key)) as GetValueFn;
  public getValue<T = unknown>(key: TemplateKey): T | undefined {
    // Use .get() directly instead of .has() + .get() (reduces Map operations)
    let value = this._nonTemplatedTemplateKeysCache?.get(key);
    if (value !== undefined) return value as T;

    value = this.isTemplate(key)
      ? this._templateResults?.[key]?.result
      : getValueFromPath(this.config, key);

    return value as T;
  }

  public getLightDarkModeColorBound = (key) => this.getLightDarkModeColor(key);
  public getLightDarkModeColor(key: TemplateKey): string | undefined {
    const configColor = this.getValue<string | LightDarkModeColor>(key);
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
    return undefined;
  }

  private _computeCacheKey() {
    return hash(this.config);
  }

  //=============================================================================
  // CONFIG PROCESSING
  //=============================================================================

  private updateConfig() {
    this.configureMainGauge();
    this.configureInnerGauge();
    this.configureCardActions();
    this.updateMainGaugeConfig();
    this.updateInnerGaugeConfig();
    this.updateValueElementsConfig();
    this.updateIconsConfigs();
  }

  private configureMainGauge() {
    this.hasMainNeedle = this.config!.needle ?? false;

    if (this.hasMainNeedle) {
      this.mainSeverityColorMode = undefined;
      this.mainSeverityCentered = undefined;
      this.hasMainGradientBackground = undefined;
      this.hasMainGradient = this.config!.gradient ?? false;
    } else {
      this.hasMainGradient = undefined;
      this.mainSeverityColorMode =
        this.config!.severity_color_mode ?? DEFAULTS.severity.colorMode;
      this.mainSeverityCentered = this.config!.severity_centered ?? false;
      this.hasMainGradientBackground =
        this.config!.gradient_background ?? false;
    }

    this.mainGradientResolution = this.usesGradientBackground("main")
      ? (this.config!.gradient_resolution ?? DEFAULTS.gradient.resolution)
      : undefined;
  }

  private configureInnerGauge() {
    this.hasInnerGauge =
      this.config!.inner != null && typeof this.config!.inner === "object";

    if (this.hasInnerGauge) {
      this.innerMode = this.config!.inner!.mode ?? "severity";

      if (this.innerMode === "severity") {
        this.hasInnerGradient = undefined;
        this.innerSeverityColorMode =
          this.config!.inner!.severity_color_mode ??
          DEFAULTS.severity.colorMode;
        this.innerSeverityCentered =
          this.config!.inner!.severity_centered ?? false;
        this.hasInnerGradientBackground =
          this.config!.inner!.gradient_background ?? false;
      } else {
        this.innerSeverityColorMode = undefined;
        this.innerSeverityCentered = undefined;
        this.hasInnerGradientBackground = undefined;
        this.hasInnerGradient = this.config!.inner!.gradient ?? false;
      }

      this.innerGradientResolution = this.usesGradientBackground("inner")
        ? (this.config!.inner!.gradient_resolution ??
          DEFAULTS.gradient.resolution)
        : undefined;
    } else {
      this.innerMode = undefined;
      this.innerSeverityColorMode = undefined;
      this.innerSeverityCentered = undefined;
      this.hasInnerGradientBackground = undefined;
      this.hasInnerGradient = undefined;
      this.innerGradientResolution = undefined;
    }
  }

  private configureCardActions() {
    this.hasCardAction = hasAction(this.config!.tap_action);
  }

  private updateMainGaugeConfig() {
    this.mainGaugeConfig = {
      mode: this.hasMainNeedle
        ? this.hasMainGradient
          ? "gradient-arc"
          : "flat-arc"
        : "severity",
      round: this.config!.round,
    };

    this.mainGaugeConfig.severity = !this.hasMainNeedle
      ? {
          mode: this.mainSeverityColorMode!,
          fromCenter: this.mainSeverityCentered!,
          withGradientBackground: this.hasMainGradientBackground!,
        }
      : undefined;
  }

  private updateInnerGaugeConfig() {
    if (this.hasInnerGauge) {
      this.innerGaugeConfig = {
        mode:
          this.innerMode === "severity"
            ? "severity"
            : this.hasInnerGradient
              ? "gradient-arc"
              : "flat-arc",
        round: this.config!.inner?.round,
      };

      this.innerGaugeConfig.severity =
        this.innerMode === "severity"
          ? {
              mode: this.innerSeverityColorMode!,
              fromCenter: this.innerSeverityCentered!,
              withGradientBackground: this.hasInnerGradientBackground!,
            }
          : undefined;
    } else {
      this.innerGaugeConfig = undefined;
    }
  }

  private updateValueElementsConfig() {
    this.valueElementsConfig = getValueElementsConfig(this.config!);
  }

  private updateIconsConfigs() {
    this.leftIconConfig = getIconConfig("left", this.config!);
    this.rightIconConfig = getIconConfig("right", this.config!);
  }

  //=============================================================================
  // DATA COMPUTATION PIPELINE (in willUpdate call order)
  //=============================================================================

  private computeExtremes() {
    this.mainMin = NumberUtils.toNumberOrDefault(
      this.getValue("min"),
      DEFAULTS.values.min
    );
    this.mainMax = NumberUtils.toNumberOrDefault(
      this.getValue("max"),
      DEFAULTS.values.max
    );

    if (this.hasInnerGauge) {
      this.innerMin = NumberUtils.toNumberOrDefault(
        this.getValue("inner.min"),
        this.mainMin
      );

      this.innerMax = NumberUtils.toNumberOrDefault(
        this.getValue("inner.max"),
        this.mainMax
      );
    }
  }

  private computeValues() {
    this.primaryValueAndValueText = getValueAndValueText(
      "main",
      this.config!,
      this.hass!,
      this.getValueBound
    );
    this.secondaryValueAndValueText = getValueAndValueText(
      "inner",
      this.config!,
      this.hass!,
      this.getValueBound
    );

    this.mainValue = this.primaryValueAndValueText?.value ?? this.mainMin;

    const angles: Angles = {
      main_angle: this._main_angle,
      main_min_indicator_angle: this._main_min_indicator_angle,
      main_max_indicator_angle: this._main_max_indicator_angle,
      main_setpoint_angle: this._main_setpoint_angle,
      inner_angle: this._inner_angle,
      inner_min_indicator_angle: this._inner_min_indicator_angle,
      inner_max_indicator_angle: this._inner_max_indicator_angle,
      inner_setpoint_angle: this._inner_setpoint_angle,
    };

    this.mainMinIndicator = getMinMaxIndicator(
      "main",
      "min",
      this.config!,
      this.hass!,
      this.getValueBound,
      this.getLightDarkModeColorBound,
      angles,
      this.hasInnerGauge
    ) as DraftMainMinMaxIndicator;
    this.mainMaxIndicator = getMinMaxIndicator(
      "main",
      "max",
      this.config!,
      this.hass!,
      this.getValueBound,
      this.getLightDarkModeColorBound,
      angles,
      this.hasInnerGauge
    ) as DraftMainMinMaxIndicator;
    this.mainSetpoint = getSetpoint(
      "main",
      this.config!,
      this.hass!,
      this.getValueBound,
      this.getLightDarkModeColorBound,
      angles
    ) as DraftMainSetpoint;

    if (this.hasInnerGauge) {
      this.innerValue = this.secondaryValueAndValueText?.value ?? this.innerMin;

      this.innerMinIndicator = getMinMaxIndicator(
        "inner",
        "min",
        this.config!,
        this.hass!,
        this.getValueBound,
        this.getLightDarkModeColorBound,
        angles,
        this.hasInnerGauge
      ) as DraftInnerMinMaxIndicator;
      this.innerMaxIndicator = getMinMaxIndicator(
        "inner",
        "max",
        this.config!,
        this.hass!,
        this.getValueBound,
        this.getLightDarkModeColorBound,
        angles,
        this.hasInnerGauge
      ) as DraftInnerMinMaxIndicator;
      this.innerSetpoint = getSetpoint(
        "inner",
        this.config!,
        this.hass!,
        this.getValueBound,
        this.getLightDarkModeColorBound,
        angles
      ) as DraftInnerSetpoint;
    }
  }

  private computeAgles() {
    this._main_angle = getAngle(this.mainValue, this.mainMin, this.mainMax);

    if (this.mainMinIndicator) {
      this._main_min_indicator_angle = getAngle(
        this.mainMinIndicator.value,
        this.mainMin,
        this.mainMax
      );
    }

    if (this.mainMaxIndicator) {
      this._main_max_indicator_angle =
        180 - getAngle(this.mainMaxIndicator.value, this.mainMin, this.mainMax);
    }

    if (this.mainSetpoint) {
      this._main_setpoint_angle = getAngle(
        this.mainSetpoint.value,
        this.mainMin,
        this.mainMax
      );
    }

    if (this.hasInnerGauge) {
      this._inner_angle = getAngle(
        this.innerValue!,
        this.innerMin!,
        this.innerMax!
      );
    }

    if (this.innerMinIndicator) {
      this._inner_min_indicator_angle = getAngle(
        this.innerMinIndicator.value,
        this.innerMin!,
        this.innerMax!
      );
    }
    if (this.innerMaxIndicator) {
      this._inner_max_indicator_angle =
        180 -
        getAngle(this.innerMaxIndicator.value, this.innerMin!, this.innerMax!);
    }

    if (this.innerSetpoint) {
      this._inner_setpoint_angle = getAngle(
        this.innerSetpoint.value,
        this.innerMin!,
        this.innerMax!
      );
    }
  }

  private computeMainGaugeData() {
    const mainGradientResolution = NumberUtils.isNumeric(
      this.mainGradientResolution
    )
      ? this.mainGradientResolution
      : DEFAULTS.gradient.resolution;

    const mainGradientBackgroundOpacity =
      !this.hasMainNeedle && this.hasMainGradientBackground
        ? (this.config!.gradient_background_opacity ??
          DEFAULTS.gradient.backgroundOpacity)
        : undefined;

    const candidate: MainGaugeData = {
      data: {
        min: this.mainMin,
        max: this.mainMax,
      },
      background: "",
      min_indicator: this.mainMinIndicator?.opts,
      max_indicator: this.mainMaxIndicator?.opts,
      unavailable: [UNAVAILABLE, INVALID_ENTITY].includes(
        this.primaryValueAndValueText?.valueText ?? ""
      ),
    };

    if (this.usesGradientBackground("main")) {
      candidate.background = this.getConicGradientString(
        "main",
        this.mainMin,
        this.mainMax,
        mainGradientResolution,
        mainGradientBackgroundOpacity
      );
    }

    if (this.hasMainNeedle && !this.hasMainGradient) {
      candidate.background = this.getFlatArcConicGradientString(
        "main",
        this.mainMin,
        this.mainMax
      );
    }

    if (!this.hasMainNeedle) {
      const color =
        this.mainSeverityColorMode === "gradient"
          ? this.getConicGradientString(
              "main",
              this.mainMin,
              this.mainMax,
              mainGradientResolution
            )
          : this.computeSeverity(
              "main",
              this.mainMin,
              this.mainMax,
              this.mainValue
            );

      candidate.severity = {
        angle: this._main_angle,
        color: color!,
      };
    }

    if (!deepEqual(this.mainGaugeData, candidate)) {
      this.mainGaugeData = candidate;
    }
  }

  private computeInnerGaugeData() {
    if (!this.hasInnerGauge) return;
    if (this.innerMin === undefined || this.innerMax === undefined) return;

    let innerGradientResolution: GradientResolution | undefined;
    let innerGradientBackgroundOpacity: number | undefined;

    if (this.innerMode !== "on_main") {
      innerGradientResolution = NumberUtils.isNumeric(
        this.innerGradientResolution
      )
        ? this.innerGradientResolution
        : DEFAULTS.gradient.resolution;

      innerGradientBackgroundOpacity =
        this.innerMode === "severity" && this.hasInnerGradientBackground
          ? (this.config!.inner!.gradient_background_opacity ??
            DEFAULTS.gradient.backgroundOpacity)
          : undefined;
    }

    const candidate: InnerGaugeData = {
      data: {
        min: this.innerMin,
        max: this.innerMax,
      },
      background: "",
      min_indicator: this.innerMinIndicator?.opts,
      max_indicator: this.innerMaxIndicator?.opts,
      unavailable: [UNAVAILABLE, INVALID_ENTITY].includes(
        this.secondaryValueAndValueText?.valueText ?? ""
      ),
    };

    if (this.usesGradientBackground("inner")) {
      candidate.background = this.getConicGradientString(
        "inner",
        this.innerMin,
        this.innerMax,
        innerGradientResolution,
        innerGradientBackgroundOpacity
      );
    }

    if (this.innerMode !== "severity" && !this.hasInnerGradient) {
      candidate.background = this.getFlatArcConicGradientString(
        "inner",
        this.innerMin,
        this.innerMax
      );
    }

    if (this.innerMode === "severity") {
      const color =
        this.innerSeverityColorMode === "gradient"
          ? this.getConicGradientString(
              "inner",
              this.innerMin,
              this.innerMax,
              innerGradientResolution
            )
          : this.computeSeverity(
              "inner",
              this.innerMin,
              this.innerMax,
              this.innerValue ?? this.innerMin
            );
      candidate.severity = {
        angle: this._inner_angle,
        color: color!,
      };
    }

    if (!deepEqual(this.innerGaugeData, candidate)) {
      this.innerGaugeData = candidate;
    }
  }

  private computeValueElementsData() {
    const primaryValueText = this.primaryValueAndValueText?.valueText;
    const secondaryValueText = this.secondaryValueAndValueText?.valueText;

    const mainNeedleValueElement: Needle | undefined = this.hasMainNeedle
      ? {
          angle: this._main_angle,
          color: this.getLightDarkModeColor("needle_color"),
          customShape: this.getValidatedSvgPath("shapes.main_needle"),
        }
      : undefined;

    const innerNeedleValueElement: Needle | undefined =
      this.hasInnerGauge &&
      this.innerMode &&
      ["needle", "on_main"].includes(this.innerMode)
        ? {
            angle: this._inner_angle,
            color: this.getLightDarkModeColor("inner.needle_color"),
            customShape: this.getValidatedSvgPath("shapes.inner_needle"),
          }
        : undefined;

    const primaryValueTextValueElement: PrimaryValueTextData | undefined =
      primaryValueText
        ? {
            text: primaryValueText,
            color: this.getLightDarkModeColor("value_texts.primary_color"),
            fontSizeReduction: this.getValue(
              "value_texts.primary_font_size_reduction"
            ),
          }
        : undefined;

    const secondaryValueTextValueElement: ValueTextData | undefined =
      secondaryValueText
        ? {
            text: secondaryValueText,
            color: this.getLightDarkModeColor("value_texts.secondary_color"),
          }
        : undefined;

    const candidate: ValueElementsData = {
      mainNeedle: mainNeedleValueElement,
      mainSetpoint: this.mainSetpoint?.opts,
      innerNeedle: innerNeedleValueElement,
      innerSetpoint: this.innerSetpoint?.opts,
      primaryValueText: primaryValueTextValueElement,
      secondaryValueText: secondaryValueTextValueElement,
      innerGaugeMode: this.innerMode,
    };

    if (!deepEqual(this.valueElementsData, candidate)) {
      this.valueElementsData = candidate;
    }
  }

  private computeIconData() {
    this.leftIconData = getIconData(
      "left",
      this.config!,
      this.hass!,
      this.getValueBound
    );
    this.rightIconData = getIconData(
      "right",
      this.config!,
      this.hass!,
      this.getValueBound
    );
  }

  private get showValueElements(): boolean {
    if (this.hasMainNeedle || this.mainSetpoint) return true;
    if (
      this.primaryValueAndValueText?.valueText ||
      this.secondaryValueAndValueText?.valueText
    ) {
      return true;
    }
    if (
      this.innerSetpoint ||
      (this.innerMode && ["needle", "on_main"].includes(this.innerMode))
    ) {
      return true;
    }
    return false;
  }

  //=============================================================================
  // LOW-LEVEL UTILITY WRAPPERS
  //=============================================================================

  private computeSeverity(
    gauge: Gauge,
    min: number,
    max: number,
    value: number
  ) {
    const severity_color_mode =
      (gauge === "main"
        ? this.mainSeverityColorMode
        : this.innerSeverityColorMode) ?? DEFAULTS.severity.colorMode;
    const clamp_min =
      (gauge === "main"
        ? this.mainSeverityCentered
        : this.innerSeverityCentered) ?? false;

    return _computeSeverity(
      this.log,
      ((key) => this.getValue(key)) as GetValueFn,
      severity_color_mode,
      gauge,
      min,
      max,
      value,
      clamp_min
    );
  }

  private usesGradientBackground(gauge: Gauge): boolean {
    if (gauge === "main") {
      return (
        (this.hasMainNeedle
          ? this.hasMainGradient
          : this.hasMainGradientBackground) ?? false
      );
    }

    const mode = this.innerMode;
    switch (mode) {
      case "static":
      case "needle":
        return this.hasInnerGradient ?? false;
      case "severity":
        return this.hasInnerGradientBackground ?? false;
      default:
        return false;
    }
  }

  private getConicGradientString(
    gauge: Gauge,
    min: number,
    max: number,
    resolution: GradientResolution = DEFAULTS.gradient.resolution,
    opacity?: number
  ) {
    return _getConicGradientString(
      this.log,
      ((key) => this.getValue(key)) as GetValueFn,
      gauge,
      min,
      max,
      resolution,
      opacity,
      true
    );
  }

  private getFlatArcConicGradientString(
    gauge: Gauge,
    min: number,
    max: number
  ) {
    return _getFlatArcConicGradientString(
      this.log,
      ((key) => this.getValue(key)) as GetValueFn,
      gauge,
      min,
      max
    );
  }

  private getValidatedSvgPath(key: TemplateKey): string | undefined {
    const path = this.getValue<string>(key);
    return path === "" || isValidSvgPath(path) ? path : undefined;
  }

  //=============================================================================
  // STYLES
  //=============================================================================

  static get styles(): CSSResultGroup {
    return cardStyles;
  }
}
