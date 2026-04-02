/* eslint-disable @typescript-eslint/no-explicit-any */
// External dependencies
import { mdiChevronRight } from "@mdi/js";
import hash from "object-hash/dist/object_hash";
import type { UnsubscribeFunc } from "home-assistant-js-websocket";
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
  compareClimateHvacModes,
  computeDomain,
  handleAction,
  subscribeRenderTemplate,
} from "../dependencies/ha";
import { isTemplate as _isTemplate } from "../dependencies/ha/common/string/has-template";

// Internalized external dependencies
import { isValidSvgPath } from "../dependencies/is-svg-path/valid-svg-path";
import { computeDarkMode, registerCustomCard } from "../dependencies/mushroom";

// Local utilities
import * as Logger from "../utils/logger";
import { migrateConfig } from "../utils/migrate-config";
import { getFeature } from "../utils/object/features";
import { getValueFromPath } from "../utils/object/get-value";
import { trySetValue } from "../utils/object/set-value";

// Local constants & types
import { DEFAULTS } from "../constants/defaults";
import { LOGGER_SETTINGS, VERSION } from "../constants/logger";
import type { GaugeCardProCardConfig } from "./config";
import type {
  AnimatedElements,
  ClimateFeatureState,
  ClimateModeFeatureState,
  DraftInnerMinMaxIndicator,
  DraftInnerSetpoint,
  DraftMainMinMaxIndicator,
  DraftMainSetpoint,
  Feature,
  FeatureStyle,
  Gauge,
  GradientResolution,
  IconConfig,
  IconData,
  InnerGaugeConfig,
  InnerGaugeData,
  InnerGaugeMode,
  LightDarkModeColor,
  MainGaugeConfig,
  MainGaugeData,
  SeverityColorMode,
  ValueAndValueText,
  ValueElementsConfig,
  ValueElementsData,
} from "./types/types";

// Feature utils
import {
  FEATURE,
  FEATURE_PAGE_ICON,
  FEATURE_PAGE_ICON_COLOR,
  FEATURE_PAGE_ORDER,
} from "../constants/features";

// CSS
import { cardStyles } from "./css/card";

// Template types
import type {
  GetValueFn,
  TemplateKey,
  TemplateResults,
} from "./types/template";
import {
  GetLightDarkModeColorFn,
  TEMPLATE_KEYS,
  templateCache,
} from "./types/template";

// Core functionality
import {
  computeSeverity as _computeSeverity,
  getConicGradientString as _getConicGradientString,
  getFlatArcConicGradientString as _getFlatArcConicGradientString,
} from "./helpers/segments/get-segments";

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
import { renderTitle } from "./helpers-render/titles";
import { renderClimateFeatureModesPage as _renderClimateFeatureModesPage } from "./helpers-render/climate-feature-modes-page";
import { updateConfig } from "./helpers/set-config";
import { ConfigUpdateContext } from "./types/set-config-context";
import { ComputeDataContext } from "./types/compute-data-context";
import { computeData } from "./helpers/compute-data";
import { RenderGaugeContext } from "./types/render-gauge-context";
import { renderGauge } from "./helpers-render/gauge";

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
  @state() _config?: GaugeCardProCardConfig;

  private header?: string;

  // Features
  private featureEntity?: string;
  private enabledFeaturePages?: Feature[];
  private hasSeparatedOverviewControls?: boolean;
  private scrollableFeaturePages?: Feature[];
  @state() private _activeFeaturePage?: Feature;

  // Background
  private hideBackground = false;

  primaryValueAndValueText?: ValueAndValueText;
  secondaryValueAndValueText?: ValueAndValueText;

  // view models — plain fields (not @state, computed during willUpdate)
  mainGaugeConfig?: MainGaugeConfig;
  mainGaugeData?: MainGaugeData;
  innerGaugeConfig?: InnerGaugeConfig;
  innerGaugeData?: InnerGaugeData;
  valueElementsConfig?: ValueElementsConfig;
  valueElementsData?: ValueElementsData;
  leftIconConfig?: IconConfig;
  leftIconData?: IconData;
  rightIconConfig?: IconConfig;
  rightIconData?: IconData;

  mainAngle = 0;
  mainMinIndicatorAngle = 0;
  mainMaxIndicatorAngle = 0;
  mainSetpointAngle = 0;
  innerAngle = 0;
  innerMinIndicatorAngle = 0;
  innerMaxIndicatorAngle = 0;
  innerSetpointAngle = 0;

  // main gauge properties
  mainValue = 0;
  mainMin: number = DEFAULTS.values.min;
  mainMax: number = DEFAULTS.values.max;
  hasMainNeedle = false;

  // severity mode
  mainSeverityCentered?: boolean;
  mainSeverityColorMode?: SeverityColorMode;
  hasMainGradientBackground?: boolean;

  // needle mode
  hasMainGradient?: boolean;
  mainGradientResolution?: string | number;

  mainMinIndicator?: DraftMainMinMaxIndicator;
  mainMaxIndicator?: DraftMainMinMaxIndicator;
  mainSetpoint?: DraftMainSetpoint;

  // inner gauge properties
  hasInnerGauge = false;
  innerValue?: number;
  innerMin?: number;
  innerMax?: number;
  innerMode?: InnerGaugeMode;

  // severity mode
  innerSeverityCentered?: boolean;
  innerSeverityColorMode?: SeverityColorMode;

  // needle mode
  hasInnerGradient?: boolean;
  innerGradientResolution?: string | number;
  hasInnerGradientBackground?: boolean;

  innerMinIndicator?: DraftInnerMinMaxIndicator;
  innerMaxIndicator?: DraftInnerMinMaxIndicator;
  innerSetpoint?: DraftInnerSetpoint;

  // actions
  hasCardAction = false;

  // Template handling
  private _templatedKeys: Set<TemplateKey> = new Set();
  private _nonTemplatedTemplateKeysCache = new Map<TemplateKey, any>();
  @state() private _templateResults?: TemplateResults;
  @state() private readonly _unsubRenderTemplates: Map<
    TemplateKey,
    Promise<UnsubscribeFunc>
  > = new Map();
  // Debug
  readonly _initializedAnimatedElements = new Set<AnimatedElements>();
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
        primary: {
          value: "{{ state_attr(entity, 'friendly_name') }}",
        },
      },
    };
  }

  public setConfig(config: GaugeCardProCardConfig): void {
    if (config.log_debug === true) {
      this.log.setLogLevel(Logger.LogLevel.DEBUG);
    } else {
      this.log.setLogLevel(LOGGER_SETTINGS.DEFAULT_LOG_LEVEL);
    }

    config = migrateConfig(config)!;

    config = trySetValue(
      config,
      "tap_action.action",
      "more-info",
      true,
      false
    ).result;

    config = trySetValue(
      config,
      "value_texts.primary.tap_action.action",
      "none",
      true,
      false
    ).result;

    config = trySetValue(
      config,
      "value_texts.secondary.tap_action.action",
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
      const overviewFeature = getFeature(config, FEATURE.CLIMATE_OVERVIEW);
      if (overviewFeature !== undefined) {
        this.hasSeparatedOverviewControls = overviewFeature.separate ?? false;
      }

      const _enabledFeatures = new Set(config.features?.map((f) => f.type));
      this.enabledFeaturePages = FEATURE_PAGE_ORDER.filter((p) =>
        _enabledFeatures.has(p)
      );

      this.scrollableFeaturePages = this.enabledFeaturePages.filter(
        (p) =>
          !(this.hasSeparatedOverviewControls && p === FEATURE.CLIMATE_OVERVIEW)
      );

      if (this.scrollableFeaturePages.length >= 1) {
        this._activeFeaturePage = this.scrollableFeaturePages[0];
      }
    }

    // Background
    this.hideBackground = config.hide_background ?? false;

    // Template handling
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

    // Determine templated keys for quicker access to templates
    // Cache non-templated template keys as they are fixed values
    this._templatedKeys = new Set<TemplateKey>();
    this._nonTemplatedTemplateKeysCache = new Map<TemplateKey, any>();

    TEMPLATE_KEYS.forEach((key) => {
      const value = getValueFromPath(config, key);
      if (value !== undefined) {
        if (_isTemplate(String(value))) {
          this._templatedKeys.add(key);
        } else {
          this._nonTemplatedTemplateKeysCache.set(key, value);
        }
      }
    });

    this._config = config;

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

    if (this._config && this._templateResults) {
      const key = this._computeCacheKey();
      templateCache.set(key, this._templateResults);
    }
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);
    if (!this._config || !this.hass) return;

    if (!this._templateResults) {
      const key = this._computeCacheKey();
      if (templateCache.has(key)) {
        this._templateResults = templateCache.get(key)!;
      } else {
        this._templateResults = {};
      }
    }

    const configChanged = changedProperties.has("_config");
    const hassChanged = changedProperties.has("hass");
    const templateResultsChanged = changedProperties.has("_templateResults");
    if (!configChanged && !hassChanged && !templateResultsChanged) return;

    if (configChanged) {
      updateConfig(this as unknown as ConfigUpdateContext);
    }

    computeData(this as unknown as ComputeDataContext);
  }

  protected override render() {
    if (!this._config || !this.hass) return nothing;

    if (this.log.getLogLevelName() === "debug") {
      const _templateResultsString = JSON.stringify(this._templateResults);
      if (_templateResultsString !== this._lastLoggedTemplateResults) {
        this._lastLoggedTemplateResults = _templateResultsString;
        this.log.debug("(render) TemplateResults: ", this._templateResults);
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
        ${this.renderHeader()}
        ${renderGauge(this as unknown as RenderGaugeContext)}
        ${this.renderControls()}
        ${renderTitle(
          "primary",
          this.getValueBound,
          this.getLightDarkModeColorBound
        )}
        ${renderTitle(
          "secondary",
          this.getValueBound,
          this.getLightDarkModeColorBound
        )}
      </ha-card>
    `;
  }

  private renderHeader(): TemplateResult {
    return html` ${this.header
      ? html` <h1 class="card-header">${this.header}</h1>`
      : nothing}`;
  }

  private renderControls(): TemplateResult {
    const {
      featureEntityObj,
      hasClimateOverviewFeature,
      hasAdjustTemperatureFeature,
      hvac,
      fan,
      swing,
      preset,
      hasMoreThanOnePage,
      hasFiveOrMoreIcons,
    } = this.computeClimateFeatureState();

    return html` ${featureEntityObj !== undefined &&
    hasClimateOverviewFeature &&
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
            .hasAdjustTemperatureFeature=${hasAdjustTemperatureFeature}
            .hasClimateHvacModesFeature=${hvac.enabled}
            .hasClimateFanModesFeature=${fan.enabled}
            .hasClimateSwingModesFeature=${swing.enabled}
            .hasClimatePresetModesFeature=${preset.enabled}
            .setPage=${(ev: CustomEvent, page: Feature) =>
              this.setFeaturePage(ev, page)}
          >
          </gcp-climate-overview>
        </div>`
      : nothing}
    ${featureEntityObj !== undefined &&
    (hasClimateOverviewFeature ||
      hasAdjustTemperatureFeature ||
      hvac.enabled ||
      fan.enabled ||
      swing.enabled)
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
                      FEATURE_PAGE_ICON_COLOR[this._activeFeaturePage!],
                    "--bg-color": `color-mix(in srgb, ${FEATURE_PAGE_ICON_COLOR[this._activeFeaturePage!]} 20%, transparent)`,
                  })}
                >
                  <ha-svg-icon
                    .path=${FEATURE_PAGE_ICON[this._activeFeaturePage!]}
                  ></ha-svg-icon>
                </gcp-icon-button>
              </div>`
            : nothing}
          ${hasClimateOverviewFeature && !this.hasSeparatedOverviewControls
            ? html` <gcp-climate-overview
                style=${styleMap({
                  display:
                    this._activeFeaturePage !== FEATURE.CLIMATE_OVERVIEW
                      ? "none"
                      : undefined,
                })}
                .hass=${this.hass}
                .entity=${featureEntityObj}
                .hasAdjustTemperatureFeature=${hasAdjustTemperatureFeature}
                .hasClimateHvacModesFeature=${hvac.enabled}
                .hasClimateFanModesFeature=${fan.enabled}
                .hasClimateSwingModesFeature=${swing.enabled}
                .hasClimatePresetModesFeature=${preset.enabled}
                .setPage=${(ev: CustomEvent, page: Feature) =>
                  this.setFeaturePage(ev, page)}
              >
              </gcp-climate-overview>`
            : nothing}
          ${hasAdjustTemperatureFeature
            ? html` <gcp-climate-temperature-control
                style=${styleMap({
                  display:
                    this._activeFeaturePage !== FEATURE.ADJUST_TEMPERATURE
                      ? "none"
                      : undefined,
                })}
                .callService=${this.hass!.callService}
                .entity=${featureEntityObj}
                .unitTemp=${this.hass!.config.unit_system.temperature}
              >
              </gcp-climate-temperature-control>`
            : nothing}
          ${hvac.enabled
            ? this.renderClimateFeatureModesPage(
                "hvac",
                featureEntityObj,
                hvac.modes,
                hvac.style
              )
            : nothing}
          ${fan.enabled
            ? this.renderClimateFeatureModesPage(
                "fan",
                featureEntityObj,
                fan.modes,
                fan.style
              )
            : nothing}
          ${swing.enabled
            ? this.renderClimateFeatureModesPage(
                "swing",
                featureEntityObj,
                swing.modes,
                swing.style
              )
            : nothing}
          ${preset.enabled
            ? this.renderClimateFeatureModesPage(
                "preset",
                featureEntityObj,
                preset.modes,
                preset.style
              )
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
      : nothing}`;
  }

  private renderClimateFeatureModesPage(
    feature: "hvac" | "fan" | "swing" | "preset",
    entity: ClimateEntity,
    modes: HvacMode[] | string[] | undefined,
    style: FeatureStyle | undefined
  ): TemplateResult {
    return _renderClimateFeatureModesPage(
      this.hass!,
      feature,
      entity,
      modes,
      style,
      this._activeFeaturePage
    );
  }

  //=============================================================================
  // CLIMATE FEATURE COMPUTATION
  //=============================================================================

  private computeClimateFeatureState(): ClimateFeatureState {
    const disabled: ClimateModeFeatureState = {
      enabled: false,
      modes: undefined,
      style: undefined,
    };
    const noState: ClimateFeatureState = {
      featureEntityObj: undefined,
      hasClimateOverviewFeature: false,
      hasAdjustTemperatureFeature: false,
      hvac: disabled,
      fan: disabled,
      swing: disabled,
      preset: disabled,
      hasMoreThanOnePage: false,
      hasFiveOrMoreIcons: false,
    };

    if (!this.featureEntity || !this.enabledFeaturePages?.length)
      return noState;

    const pages = this.enabledFeaturePages;
    const hasOverview = pages.includes(FEATURE.CLIMATE_OVERVIEW);
    const hasAdjustTemp = pages.includes(FEATURE.ADJUST_TEMPERATURE);
    const hasHvac = pages.includes(FEATURE.CLIMATE_HVAC_MODES);
    const hasFan = pages.includes(FEATURE.CLIMATE_FAN_MODES);
    const hasSwing = pages.includes(FEATURE.CLIMATE_SWING_MODES);
    const hasPreset = pages.includes(FEATURE.CLIMATE_PRESET_MODES);

    if (
      !(
        hasOverview ||
        hasAdjustTemp ||
        hasHvac ||
        hasFan ||
        hasSwing ||
        hasPreset
      )
    )
      return noState;

    const featureEntityObj =
      computeDomain(this.featureEntity) === "climate"
        ? (this.hass!.states[this.featureEntity] as ClimateEntity)
        : undefined;

    if (!featureEntityObj)
      return {
        ...noState,
        hasClimateOverviewFeature: hasOverview,
        hasAdjustTemperatureFeature: hasAdjustTemp,
      };

    const hvac = this.computeClimateHvacModeFeature(featureEntityObj, hasHvac);
    const fan = this.computeClimateFanModeFeature(featureEntityObj, hasFan);
    const swing = this.computeClimateSwingModeFeature(
      featureEntityObj,
      hasSwing
    );
    const preset = this.computeClimatePresetModeFeature(
      featureEntityObj,
      hasPreset
    );

    const hasMoreThanOnePage =
      [
        hasAdjustTemp,
        hvac.enabled,
        fan.enabled,
        swing.enabled,
        preset.enabled,
      ].filter(Boolean).length > 1;

    const hasFiveOrMoreIcons = Boolean(
      (hasOverview &&
        !this.hasSeparatedOverviewControls &&
        hasAdjustTemp &&
        fan.enabled &&
        hvac.enabled &&
        preset.enabled &&
        swing.enabled) ||
      (fan.enabled && fan.style !== "dropdown" && fan.modes.length >= 5) ||
      (hvac.enabled && hvac.style !== "dropdown" && hvac.modes.length >= 5) ||
      (preset.enabled &&
        preset.style !== "dropdown" &&
        preset.modes.length >= 5) ||
      (swing.enabled && swing.style !== "dropdown" && swing.modes.length >= 5)
    );

    return {
      featureEntityObj,
      hasClimateOverviewFeature: hasOverview,
      hasAdjustTemperatureFeature: hasAdjustTemp,
      hvac,
      fan,
      swing,
      preset,
      hasMoreThanOnePage,
      hasFiveOrMoreIcons,
    };
  }

  private computeClimateHvacModeFeature(
    entity: ClimateEntity,
    enabled: boolean
  ): ClimateModeFeatureState {
    if (!enabled) return { enabled: false, modes: undefined, style: undefined };
    const feature = getFeature(this._config!, FEATURE.CLIMATE_HVAC_MODES);
    const allowlist = feature?.hvac_modes ?? entity.attributes.hvac_modes ?? [];
    const modes = entity.attributes.hvac_modes
      .filter((m) => allowlist.includes(m))
      .sort(compareClimateHvacModes);
    if (!modes.length)
      return { enabled: false, modes: undefined, style: undefined };
    return { enabled: true, modes, style: feature?.style };
  }

  private computeClimateFanModeFeature(
    entity: ClimateEntity,
    enabled: boolean
  ): ClimateModeFeatureState {
    if (!enabled) return { enabled: false, modes: undefined, style: undefined };
    const feature = getFeature(this._config!, FEATURE.CLIMATE_FAN_MODES);
    const allowlist = feature?.fan_modes ?? entity.attributes.fan_modes ?? [];
    const modes = (entity.attributes.fan_modes ?? []).filter((m) =>
      allowlist.includes(m)
    );
    if (!modes.length)
      return { enabled: false, modes: undefined, style: undefined };
    return { enabled: true, modes, style: feature?.style };
  }

  private computeClimateSwingModeFeature(
    entity: ClimateEntity,
    enabled: boolean
  ): ClimateModeFeatureState {
    if (!enabled) return { enabled: false, modes: undefined, style: undefined };
    const feature = getFeature(this._config!, FEATURE.CLIMATE_SWING_MODES);
    const allowlist =
      feature?.swing_modes ?? entity.attributes.swing_modes ?? [];
    const modes = (entity.attributes.swing_modes ?? []).filter((m) =>
      allowlist.includes(m)
    );
    if (!modes.length)
      return { enabled: false, modes: undefined, style: undefined };
    return { enabled: true, modes, style: feature?.style };
  }

  private computeClimatePresetModeFeature(
    entity: ClimateEntity,
    enabled: boolean
  ): ClimateModeFeatureState {
    if (!enabled) return { enabled: false, modes: undefined, style: undefined };
    const feature = getFeature(this._config!, FEATURE.CLIMATE_PRESET_MODES);
    const allowlist =
      feature?.preset_modes ?? entity.attributes.preset_modes ?? [];
    const modes = (entity.attributes.preset_modes ?? []).filter((m) =>
      allowlist.includes(m)
    );
    if (!modes.length)
      return { enabled: false, modes: undefined, style: undefined };
    return { enabled: true, modes, style: feature?.style };
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._config || !this.hass) {
      return;
    }

    this._tryConnect();
  }

  //=============================================================================
  // ACTION HANDLING
  //=============================================================================

  private _handleCardAction(ev: ActionHandlerEvent) {
    handleAction(this, this.hass!, this._config!, ev.detail.action);
  }

  private setFirstFeaturePage(ev: CustomEvent) {
    ev.stopPropagation();
    if (!this.scrollableFeaturePages) return;
    this._activeFeaturePage = this.scrollableFeaturePages[0];
  }

  private setFeaturePage(ev: CustomEvent, page: Feature) {
    ev.stopPropagation();
    if (!this.enabledFeaturePages) return;
    this._activeFeaturePage = page;
  }

  private nextFeaturePage(ev: CustomEvent) {
    ev.stopPropagation();
    if (!this.scrollableFeaturePages) return;
    const i = this.scrollableFeaturePages.indexOf(this._activeFeaturePage!);
    this._activeFeaturePage =
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
    if (this._templatedKeys?.size) return this._templatedKeys.has(key);
    return _isTemplate(String(getValueFromPath(this._config, key)));
  }

  public getValueBound = ((key) => this.getValue(key)) as GetValueFn;
  public getValue<T = unknown>(key: TemplateKey): T | undefined {
    // Use .get() directly instead of .has() + .get() (reduces Map operations)
    let value = this._nonTemplatedTemplateKeysCache?.get(key);
    if (value !== undefined) return value as T;

    value = this.isTemplate(key)
      ? this._templateResults?.[key]?.result
      : getValueFromPath(this._config, key);

    return value as T;
  }

  public getLightDarkModeColorBound = ((key) =>
    this.getLightDarkModeColor(key)) as GetLightDarkModeColorFn;
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
    return hash(this._config);
  }

  //=============================================================================
  // LOW-LEVEL UTILITY WRAPPERS
  //=============================================================================

  computeSeverity(gauge: Gauge, min: number, max: number, value: number) {
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

  usesGradientBackground(gauge: Gauge): boolean {
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

  getConicGradientString(
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

  getFlatArcConicGradientString(gauge: Gauge, min: number, max: number) {
    return _getFlatArcConicGradientString(
      this.log,
      ((key) => this.getValue(key)) as GetValueFn,
      gauge,
      min,
      max
    );
  }

  getValidatedSvgPath(key: TemplateKey): string | undefined {
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
