/* eslint-disable @typescript-eslint/no-explicit-any */
// External dependencies
import hash from "object-hash/dist/object_hash";
import type { UnsubscribeFunc } from "home-assistant-js-websocket";
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import type {
  ActionHandlerEvent,
  HomeAssistant,
  LovelaceCard,
  LovelaceCardEditor,
} from "../dependencies/ha";
import { handleAction, subscribeRenderTemplate } from "../dependencies/ha";
import { isTemplate as _isTemplate } from "../dependencies/ha/common/string/has-template";

// Internalized external dependencies
import { isValidSvgPath } from "../dependencies/is-svg-path/valid-svg-path";
import { computeDarkMode, registerCustomCard } from "../dependencies/mushroom";

// Local utilities
import * as Logger from "../utils/logger";
import { migrateConfig } from "../utils/migrate-config";
import { getValueFromPath } from "../utils/object/get-value";

// Local constants & types
import { DEFAULTS } from "../constants/defaults";
import { LOGGER_SETTINGS, VERSION } from "../constants/logger";
import type { GaugeCardProCardConfig } from "./config";
import type {
  ProcessConfigUpdateContext,
  ComputeDataContext,
  RenderGaugeContext,
  RenderControlsContext,
} from "./types/contexts";
import type {
  AnimatedElements,
  DraftInnerMinMaxIndicator,
  DraftInnerSetpoint,
  DraftMainMinMaxIndicator,
  DraftMainSetpoint,
  Feature,
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
import type {
  GetLightDarkModeColorFn,
  GetValueFn,
  TemplateKey,
  TemplateResults,
} from "./types/template";
import { TEMPLATE_KEYS, templateCache } from "./types/template";

import { cardStyles } from "./css/card";

// Core functionality
import {
  computeSeverity as _computeSeverity,
  getConicGradientString as _getConicGradientString,
  getFlatArcConicGradientString as _getFlatArcConicGradientString,
} from "./data/segments/get-segments";

import { setConfigDefaults } from "./config-setup/set-config-defaults";
import { processConfigUpdate } from "./config-setup/process-config-update";
import { computeData } from "./data/compute-data";

import { renderTitle } from "./render/titles";
import { renderGauge } from "./render/gauge";
import { renderControls } from "./render/controls";

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

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() _config?: GaugeCardProCardConfig;

  header?: string;

  // Features
  featureEntity?: string;
  enabledFeaturePages?: Feature[];
  hasSeparatedOverviewControls?: boolean;
  scrollableFeaturePages?: Feature[];
  @state() _activeFeaturePage?: Feature;

  // Background
  hideBackground = false;

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
    const entity = entities.find((e) =>
      ["counter", "input_number", "number", "sensor"].includes(e.split(".")[0])
    );
    return {
      type: `custom:gauge-card-pro`,
      entity: entity,
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
    config = setConfigDefaults(config);
    processConfigUpdate(this as unknown as ProcessConfigUpdateContext, config);

    // Template handling
    // Determine templated keys for quicker access to templates
    // Cache non-templated template keys as they are fixed values
    this._templatedKeys = new Set<TemplateKey>();
    this._nonTemplatedTemplateKeysCache = new Map<TemplateKey, any>();

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

      if (newKeyValue !== undefined) {
        if (_isTemplate(String(newKeyValue))) {
          this._templatedKeys.add(key);
        } else {
          this._nonTemplatedTemplateKeysCache.set(key, newKeyValue);
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

    computeData(this as unknown as ComputeDataContext);
  }

  protected override render() {
    if (!this._config || !this.hass) return nothing;

    // Debug logging of TemplateResults — only log when changed to avoid spamming logs, and only log in debug mode
    if (this.log.getLogLevelName() === "debug") {
      const _templateResultsString = JSON.stringify(this._templateResults);
      if (_templateResultsString !== this._lastLoggedTemplateResults) {
        this._lastLoggedTemplateResults = _templateResultsString;
        this.log.debug("(render) TemplateResults: ", this._templateResults);
      }
    }

    return html`
      <ha-card
        style=${styleMap(
          this.hideBackground
            ? { background: "none", border: "none", "box-shadow": "none" }
            : {}
        )}
      >
        ${this.renderHeader()}
        ${renderGauge(this as unknown as RenderGaugeContext)}
        ${renderControls(this as unknown as RenderControlsContext)}
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

  private renderHeader(): TemplateResult | typeof nothing {
    return this.header
      ? html`<h1 class="card-header">${this.header}</h1>`
      : nothing;
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

  private _tryConnect(): void {
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

  private _tryDisconnect(): void {
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
      this.getValueBound,
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
      this.getValueBound,
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
      this.getValueBound,
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
