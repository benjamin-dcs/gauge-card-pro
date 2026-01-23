// External dependencies
import { UnsubscribeFunc } from "home-assistant-js-websocket";
import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  nothing,
  PropertyValues,
  svg,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";
import hash from "object-hash/dist/object_hash";
import { mdiChevronRight } from "@mdi/js";

// Core HA helpers
import {
  actionHandler,
  ActionHandlerEvent,
  afterNextRender,
  batteryLevelIcon,
  batteryStateColorProperty,
  blankBeforePercent,
  ClimateEntity,
  compareClimateHvacModes,
  handleAction,
  hasAction,
  HomeAssistant,
  HvacMode,
  isAvailable,
  LovelaceCard,
  LovelaceCardEditor,
  RenderTemplateResult,
  subscribeRenderTemplate,
} from "../dependencies/ha";
import { isTemplate as _isTemplate } from "../dependencies/ha/common/string/has-template";

// Internalized external dependencies
import * as Logger from "../dependencies/calendar-card-pro";
import { isValidSvgPath } from "../dependencies/is-svg-path/valid-svg-path";
import {
  CacheManager,
  computeDarkMode,
  registerCustomCard,
} from "../dependencies/mushroom";

// Local utilities
import { getAngle } from "../utils/number/get-angle";
import { getValueFromPath } from "../utils/object/get-value";
import { migrate_parameters } from "../utils/migrate-parameters";
import {
  formatEntityToLocal,
  formatNumberToLocal,
} from "../utils/number/format-to-locale";
import { NumberUtils } from "../utils/number/numberUtils";
import { getFeature } from "../utils/object/features";
import { trySetValue } from "../utils/object/set-value";
import { isIcon, getIcon } from "../utils/string/icon";
import { isValidFontSize } from "../utils/css/valid-font-size";
import { localize } from "./utils/localize";
import { getHvacModeColor, getHvacModeIcon } from "./utils/utils";

// Local constants & types
import { defaultColorCss } from "./css/default-colors";
import { cardCSS } from "./css/card";
import { genericGaugeCSS } from "./css/generic-gauge";
import { mainGaugeCSS } from "./css/main-gauge";
import { innerGaugeCSS } from "./css/inner-gauge";
import {
  VERSION,
  DEFAULT_GRADIENT_BACKGROUND_OPACITY,
  DEFAULT_GRADIENT_RESOLUTION,
  DEFUALT_ICON_COLOR,
  DEFAULT_INNER_MODE,
  DEFAULT_MIN,
  DEFAULT_MIN_INDICATOR_COLOR,
  DEFAULT_MIN_INDICATOR_LABEL_COLOR,
  DEFAULT_MIN_MAX_INDICATOR_OPACITY,
  DEFAULT_MAX,
  DEFAULT_MAX_INDICATOR_COLOR,
  DEFAULT_MAX_INDICATOR_LABEL_COLOR,
  DEFAULT_NEEDLE_COLOR,
  DEFAULT_SETPOINT_NEELDLE_COLOR,
  DEFAULT_TITLE_COLOR,
  DEFAULT_TITLE_FONT_SIZE_PRIMARY,
  DEFAULT_TITLE_FONT_SIZE_SECONDARY,
  DEFAULT_VALUE_TEXT_COLOR,
  MAIN_GAUGE_NEEDLE,
  MAIN_GAUGE_NEEDLE_WITH_INNER,
  MAIN_GAUGE_SEVERITY_MARKER,
  MAIN_GAUGE_CONIC_GRADIENT_MASK,
  MAIN_GAUGE_MIN_MAX_INDICATOR,
  MAIN_GAUGE_SETPOINT_NEEDLE,
  MAIN_GAUGE_SETPOINT_NEEDLE_WITH_LABEL,
  MAIN_GAUGE_MASK_FULL,
  MAIN_GAUGE_MASK_MEDIUM,
  MAIN_GAUGE_MASK_SMALL,
  INNER_GAUGE_NEEDLE,
  INNER_GAUGE_SEVERITY_MARKER,
  INNER_GAUGE_CONIC_GRADIENT_MASK,
  INNER_GAUGE_ON_MAIN_NEEDLE,
  INNER_GAUGE_MIN_MAX_INDICATOR,
  INNER_GAUGE_SETPOINT_NEEDLE,
  INNER_GAUGE_SETPOINT_ON_MAIN_NEEDLE,
  INNER_GAUGE_MASK_FULL,
  INNER_GAUGE_STROKE_MASK_FULL,
  INNER_GAUGE_MASK_SMALL,
  INNER_GAUGE_STROKE_MASK_SMALL,
} from "./const";
import {
  Gauge,
  GaugeCardProCardConfig,
  GaugeSegment,
  GradientSegment,
} from "./config";

// Core functionality
import {
  getSegments as _getSegments,
  getConicGradientString as _getConicGradientString,
  getGradientSegments as _getGradientSegments,
  computeSeverity as _computeSeverity,
} from "./_segments";
import { GradientRenderer } from "./_gradient-renderer";

import "./components/icon-button";
import "./components/climate-hvac-modes-control";
import "./components/climate-temperature-control";

const templateCache = new CacheManager<TemplateResults>(1000);

type TemplateResults = Partial<
  Record<TemplateKey, RenderTemplateResult | undefined>
>;

type FeaturePage = "adjust-temperature" | "climate-hvac-modes";
const FEATURE_PAGE_ORDER: readonly FeaturePage[] = [
  "adjust-temperature",
  "climate-hvac-modes",
] as const;

const TEMPLATE_KEYS = [
  "icon.value",
  "inner.max",
  "inner.min",
  "inner.needle_color",
  "inner.segments",
  "inner.setpoint.color",
  "inner.setpoint.value",
  "inner.value",
  "max",
  "max_indicator.label_color",
  "min",
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

  @property({ attribute: false }) public hass?: HomeAssistant;

  // template handling
  private _templatedKeys: Set<TemplateKey> = new Set();
  private _nonTemplatedTemplateKeysCache = new Map<TemplateKey, any>();
  private _templateValueRenderCache?: Map<TemplateKey, any>;
  @state() private _templateResults?: TemplateResults;
  @state() private _unsubRenderTemplates: Map<
    TemplateKey,
    Promise<UnsubscribeFunc>
  > = new Map();

  private _mainGaugeGradient = new GradientRenderer("main");
  private _innerGaugeGradient = new GradientRenderer("inner");

  @state() public _config?: GaugeCardProCardConfig;
  @state() private _angle = 0;
  @state() private _min_indicator_angle = 0;
  @state() private _max_indicator_angle = 0;
  @state() private _inner_angle = 0;
  @state() private _inner_min_indicator_angle = 0;
  @state() private _inner_max_indicator_angle = 0;
  @state() private _inner_setpoint_angle = 0;
  @state() private _setpoint_angle = 0;
  @state() private _updated = false;

  // shared/config header properties
  private header?: string;

  // shared/config main gauge properties
  private hasMainGradient = false;
  private mainGradientResolution?: string | number;
  private hasMainGradientBackground = false;
  private mainGradientSegments?: GradientSegment[];
  private mainMax = 100;
  private hasMainMaxIndicator = false;
  private mainMaxIndicatorValue?: number;
  private hasMainMaxIndicatorLabel = false;
  private mainMin = 0;
  private hasMainMinIndicator = false;
  private mainMinIndicatorValue?: number;
  private hasMainMinIndicatorLabel = false;
  private hasMainNeedle = false;
  private mainValue = 0;
  private mainRoundStyle?: string;
  private mainRound = false;
  private mainMaskUrl?: string;
  private mainMask?: string;

  // shared/config setpoint properties
  private hasMainSetpoint = false;
  private mainSetpointValue = 0;
  private hasMainSetpointLabel = false;

  // shared/config inner gauge properties
  private hasInnerGauge = false;
  private hasInnerGradient?: boolean;
  private innerGradientResolution?: string | number;
  private hasInnerGradientBackground? = false;
  private innerGradientSegments?: GradientSegment[];
  private innerMax?: number;
  private innerMaxIndicator?: boolean;
  private innerMaxIndicatorValue?: number;
  private innerMin?: number;
  private innerMinIndicator?: boolean;
  private innerMinIndicatorValue?: number;
  private innerMode?: string;
  private innerValue?: number;
  private innerRoundStyle?: string;
  private innerRound?: boolean;
  private innerMaskUrl?: string;
  private innerMask?: string;
  private innerMaskStrokeUrl?: string;
  private innerMaskStroke?: string;

  // shared/config inner setpoint properties
  private innerSetpoint = false;
  private innerSetpointValue = 0;

  // scalable svg labels
  @state() private primaryValueText = "";
  @state() private secondaryValueText = "";
  @state() private iconLabel = "";

  // actions
  private hasCardAction = false;
  private hasPrimaryValueTextAction = false;
  private hasSecondaryValueTextAction = false;
  private hasIconAction = false;

  // features
  private featureEntity?: string;
  private enabledFeaturePages?: FeaturePage[];
  @state() private activeFeaturePage?: FeaturePage;

  private hideBackground = false;

  // -------------------------------------------

  static get styles(): CSSResultGroup {
    return [
      css`
        :host {
          ${defaultColorCss}
        }
      `,
      cardCSS,
      genericGaugeCSS,
      mainGaugeCSS,
      innerGaugeCSS,
    ];
  }

  public getCardSize(): number {
    return 4;
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./editor/editor");
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
      "icon_tap_action.action",
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

    this.hasMainNeedle = config.needle ?? false;
    this.hasMainGradient = config.gradient ?? false;
    this.mainGradientResolution = this.hasMainGradient
      ? (config.gradient_resolution ?? DEFAULT_GRADIENT_RESOLUTION)
      : undefined;
    this.hasMainGradientBackground = config.gradient_background ?? false;

    // rounding
    this.mainRoundStyle = config.round;
    this.mainRound =
      this.mainRoundStyle !== undefined && this.mainRoundStyle !== "off";

    if (this.mainRound) {
      this.mainMaskUrl = "url(#main-rounding)";

      this.mainMask =
        this.mainRoundStyle === "full"
          ? MAIN_GAUGE_MASK_FULL
          : this.mainRoundStyle === "medium"
            ? MAIN_GAUGE_MASK_MEDIUM
            : MAIN_GAUGE_MASK_SMALL;
    }

    this.hasInnerGauge =
      config.inner != null && typeof config.inner === "object";
    if (this.hasInnerGauge) {
      this.hasInnerGradient = config!.inner?.gradient ?? false;
      this.innerGradientResolution = this.hasInnerGradient
        ? (config.inner!.gradient_resolution ?? DEFAULT_GRADIENT_RESOLUTION)
        : undefined;
      this.hasInnerGradientBackground =
        config!.inner?.gradient_background ?? false;
      this.innerMode = config!.inner?.mode ?? "severity";

      // rounding
      this.innerRoundStyle = config.inner!.round;
      this.innerRound =
        this.innerRoundStyle !== undefined && this.innerRoundStyle !== "off";

      if (this.innerRound) {
        this.innerMaskUrl = "url(#inner-rounding)";
        this.innerMaskStrokeUrl = "url(#inner-stroke-rounding)";

        this.innerMask =
          this.innerRoundStyle === "full"
            ? INNER_GAUGE_MASK_FULL
            : INNER_GAUGE_MASK_SMALL;
        this.innerMaskStroke =
          this.innerRoundStyle === "full"
            ? INNER_GAUGE_STROKE_MASK_FULL
            : INNER_GAUGE_STROKE_MASK_SMALL;
      }
    } else {
      this.hasInnerGradient = undefined;
      this.hasInnerGradientBackground = undefined;
      this.innerMode = undefined;
    }

    // background
    this.hideBackground = config!.hide_background ?? false;

    // actions
    this.hasCardAction = hasAction(config?.tap_action);
    this.hasPrimaryValueTextAction = hasAction(
      config?.primary_value_text_tap_action
    );
    this.hasSecondaryValueTextAction = hasAction(
      config?.secondary_value_text_tap_action
    );
    this.hasIconAction = hasAction(config?.icon_tap_action);

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
    this._tryConnect();
  }

  private getSegments(gauge: Gauge, min: number, max: number) {
    return _getSegments(this, gauge, min, max);
  }

  private getConicGradientString(
    gauge: Gauge,
    min: number,
    max: number,
    opacity: number | undefined
  ) {
    return _getConicGradientString(this, gauge, min, max, true, opacity);
  }

  private getGradientSegments(gauge: Gauge, min: number, max: number) {
    return _getGradientSegments(this, gauge, min, max, true);
  }

  private computeSeverity(
    gauge: Gauge,
    min: number,
    max: number,
    value: number
  ) {
    return _computeSeverity(this, gauge, min, max, value);
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

  private getValueAndValueText(gauge: Gauge, defaultValue: number) {
    const isMain = gauge === "main";
    const valueKey: TemplateKey = isMain ? "value" : "inner.value";
    const valueTextKey: TemplateKey = isMain
      ? "value_texts.primary"
      : "value_texts.secondary";
    const unitKey: TemplateKey = isMain
      ? "value_texts.primary_unit"
      : "value_texts.secondary_unit";
    const unitBeforeValue = isMain
      ? (this._config?.value_texts?.primary_unit_before_value ?? false)
      : (this._config?.value_texts?.secondary_unit_before_value ?? false);
    const entity = isMain ? this._config?.entity : this._config?.entity2;

    const templateValue = this.getValue(valueKey);
    const templateValueText = this.getValue(valueTextKey);

    let valueText: string | undefined = undefined;
    let stateObj;
    if (entity !== undefined) stateObj = this.hass!.states[entity];

    const value =
      NumberUtils.tryToNumber(templateValue) ??
      NumberUtils.toNumberOrDefault(stateObj?.state, defaultValue);

    // Allow empty string to overwrite value_text
    if (templateValueText === "") {
      return { value: value, valueText: "" };
    } else if (templateValueText !== undefined) {
      if (NumberUtils.isNumeric(templateValueText)) {
        valueText = formatNumberToLocal(this.hass!, templateValueText) ?? "";
      } else {
        return { value: value, valueText: templateValueText };
      }
    } else {
      if (templateValue || entity === undefined) {
        valueText = formatNumberToLocal(this.hass!, templateValue) ?? "";
      } else {
        valueText = formatEntityToLocal(this.hass!, entity!) ?? "";
      }
    }

    const _unit = this.getValue(unitKey);
    let unit =
      _unit === ""
        ? ""
        : _unit || stateObj?.attributes?.unit_of_measurement || "";

    if (unitBeforeValue) {
      // For now always a space between unit and value
      valueText = unit !== "" ? `${unit} ${valueText}` : valueText;
    } else {
      if (unit === "%") {
        unit = `${blankBeforePercent(this.hass!.locale)}%`;
      } else if (unit !== "") {
        unit = ` ${unit}`;
      }
      valueText = valueText + unit;
    }

    return { value, valueText };
  }

  private getMinMaxIndicatorSetpoint(
    gauge: Gauge,
    element: "min_indicator" | "max_indicator" | "setpoint"
  ):
    | undefined
    | { value: number; color: string | undefined; label: boolean | undefined } {
    const isMain = gauge === "main";
    const type = getValueFromPath(
      this._config,
      `${isMain ? "" : "inner."}${element}.type`
    );
    const default_color =
      element === "min_indicator"
        ? DEFAULT_MIN_INDICATOR_COLOR
        : element === "max_indicator"
          ? DEFAULT_MAX_INDICATOR_COLOR
          : DEFAULT_SETPOINT_NEELDLE_COLOR;
    const colorKey: TemplateKey = <TemplateKey>(
      `${isMain ? "" : "inner."}${element}.color`
    );

    if (type === undefined) return undefined;

    let value: number | undefined;
    const color = this.getLightDarkModeColor(colorKey, default_color);

    if (type === "entity") {
      const configValue = getValueFromPath(
        this._config,
        `${isMain ? "" : "inner."}${element}.value`
      );

      if (typeof configValue !== "string") return undefined;

      const stateObj = this.hass?.states[configValue];
      if (!stateObj) return undefined;

      value = NumberUtils.tryToNumber(stateObj.state);
    } else if (type === "number") {
      const configValue = getValueFromPath(
        this._config,
        `${isMain ? "" : "inner."}${element}.value`
      );
      value = NumberUtils.tryToNumber(configValue);
    } else if (type === "template") {
      value = NumberUtils.tryToNumber(
        isMain
          ? this.getValue(<TemplateKey>`${element}.value`)
          : this.getValue(<TemplateKey>`inner.${element}.value`)
      );
    }

    let label: boolean | undefined = undefined;
    if (isMain) {
      label = this._config?.[element]?.label ?? false;
    }

    return value === undefined ? undefined : { value, color, label };
  }

  private getIcon():
    | undefined
    | {
        icon: string;
        color: string | undefined;
        left: boolean;
        label: string | undefined;
      } {
    if (!this._config?.icon) return;
    const type = this._config.icon.type;
    const left = this._config.icon.left ?? false;

    const value = this.getValue("icon.value");
    if (type === "template") {
      if (
        !value ||
        typeof value !== "object" ||
        !Object.keys(value).includes("icon")
      )
        return;

      return {
        icon: value["icon"],
        color: value["color"] ?? DEFUALT_ICON_COLOR,
        left: left,
        label: value["label"] ?? "",
      };
    }

    switch (type) {
      case "battery": {
        const batteryStateObj = this.hass?.states[value];
        if (!batteryStateObj) return;

        const level = batteryStateObj.state;
        const threshold = NumberUtils.tryToNumber(this._config.icon.threshold);

        if (
          threshold !== undefined &&
          NumberUtils.isNumeric(level) &&
          Number(level) >= threshold
        )
          return;

        const state_entity = this._config.icon.state;
        const isCharging =
          state_entity != undefined &&
          ["charging", "on"].includes(
            this.hass?.states[state_entity]?.state ?? ""
          );
        const icon = batteryLevelIcon(level, isCharging);
        const color = `var(${batteryStateColorProperty(level)})`;

        let label = "";
        const hide_label = this._config.icon.hide_label;

        if (hide_label !== true) {
          label = NumberUtils.isNumeric(level)
            ? `${Math.round(Number(level))}${blankBeforePercent(this.hass!.locale)}%`
            : level;
        }

        return { icon: icon, color: color, left: left, label: label };
      }
      case "hvac-mode": {
        const hvacModeEntity = value ?? this._config.feature_entity;
        const hvacModeStateObj = <ClimateEntity>(
          this.hass?.states[hvacModeEntity]
        );
        if (!hvacModeStateObj) return;

        const hvacMode = <HvacMode>hvacModeStateObj.state;
        const icon = getHvacModeIcon(hvacMode);
        const color = getHvacModeColor(hvacMode);

        let label = "";
        const hide_label = this._config.icon.hide_label;
        if (hide_label !== true) {
          label = localize(this.hass!, `hvac_mode_titles.${hvacMode}`);
        }

        return { icon: icon, color: color, left: left, label: label };
      }
      default:
        return;
    }
  }

  private getValidatedSvgPath(key: TemplateKey): string | undefined {
    const path = this.getValue(key);
    return path === "" || isValidSvgPath(path) ? path : undefined;
  }

  private _usesGradient(gauge: Gauge): boolean {
    if (gauge === "main") {
      return (
        this.mainGradientSegments !== undefined &&
        ((this.hasMainNeedle && this.hasMainGradient) ||
          (!this.hasMainNeedle && this.hasMainGradientBackground))
      );
    }
    return (
      this.hasInnerGauge &&
      this.innerGradientSegments !== undefined &&
      ((this.hasInnerGradient === true &&
        ["static", "needle"].includes(this.innerMode!)) ||
        (this.hasInnerGradientBackground === true &&
          this.innerMode === "severity"))
    );
  }

  private usesConicGradient(gauge: Gauge): boolean {
    if (gauge === "main") {
      return (
        this._usesGradient("main") && this.mainGradientResolution === "auto"
      );
    }
    return (
      this._usesGradient("inner") && this.innerGradientResolution === "auto"
    );
  }

  private usesGradientPath(gauge: Gauge): boolean {
    if (gauge === "main") {
      return (
        this._usesGradient("main") && this.mainGradientResolution !== "auto"
      );
    }
    return (
      this._usesGradient("inner") && this.innerGradientResolution !== "auto"
    );
  }

  private _calculate_angles() {
    this._angle = getAngle(this.mainValue, this.mainMin, this.mainMax);
    if (this.hasMainMinIndicator) {
      this._min_indicator_angle = getAngle(
        this.mainMinIndicatorValue!,
        this.mainMin,
        this.mainMax
      );
    }
    if (this.hasMainMaxIndicator) {
      this._max_indicator_angle =
        180 - getAngle(this.mainMaxIndicatorValue!, this.mainMin, this.mainMax);
    }
    this._setpoint_angle = getAngle(
      this.mainSetpointValue,
      this.mainMin,
      this.mainMax
    );

    this._inner_angle = this.hasInnerGauge
      ? getAngle(this.innerValue!, this.innerMin!, this.innerMax!)
      : 0;
    if (this.innerMinIndicator) {
      this._inner_min_indicator_angle = getAngle(
        this.innerMinIndicatorValue!,
        this.innerMin!,
        this.innerMax!
      );
    }
    if (this.innerMaxIndicator) {
      this._inner_max_indicator_angle =
        180 -
        getAngle(this.innerMaxIndicatorValue!, this.innerMin!, this.innerMax!);
    }
    this._inner_setpoint_angle =
      this.innerSetpoint !== undefined
        ? getAngle(this.innerSetpointValue, this.innerMin!, this.innerMax!)
        : 0;
  }

  //-----------------------------------------------------------------------------
  // ACTION HANDLING
  //-----------------------------------------------------------------------------

  private _handleCardAction(ev: ActionHandlerEvent) {
    handleAction(this, this.hass!, this._config!, ev.detail.action!);
  }

  private _handlePrimaryValueTextAction(ev: CustomEvent) {
    ev.stopPropagation();
    const config = {
      entity: this._config!.entity,
      tap_action: this._config!.primary_value_text_tap_action,
      hold_action: this._config!.primary_value_text_hold_action,
      double_tap_action: this._config!.primary_value_text_double_tap_action,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
  }

  private _handleSecondaryValueTextAction(ev: CustomEvent) {
    ev.stopPropagation();
    const config = {
      entity: this._config!.entity2,
      tap_action: this._config!.secondary_value_text_tap_action,
      hold_action: this._config!.secondary_value_text_hold_action,
      double_tap_action: this._config!.secondary_value_text_double_tap_action,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
  }

  private _handleIconAction(ev: CustomEvent) {
    ev.stopPropagation();
    const config = {
      entity:
        this._config!.icon?.type === "battery"
          ? this._config!.icon.value
          : undefined,
      tap_action: this._config!.icon_tap_action,
      hold_action: this._config!.icon_hold_action,
      double_tap_action: this._config!.icon_double_tap_action,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
  }

  private nextFeaturePage(e: CustomEvent) {
    e.stopPropagation();
    if (!this.enabledFeaturePages) return;
    const i = this.enabledFeaturePages.indexOf(this.activeFeaturePage!);
    this.activeFeaturePage =
      this.enabledFeaturePages[(i + 1) % this.enabledFeaturePages.length];
  }

  //-----------------------------------------------------------------------------
  // SVG TEXT SCALING
  //
  // Set the viewbox of the SVG containing the value to perfectly fit the text.
  // That way it will auto-scale correctly.
  //-----------------------------------------------------------------------------

  private _rescaleValueTextSvg(gauge = "both") {
    const _setViewBox = (element: string) => {
      const svgRoot = this.shadowRoot!.querySelector(element)!;
      const box = svgRoot.querySelector("text")!.getBBox()!;
      svgRoot.setAttribute(
        "viewBox",
        `${box.x} ${box!.y} ${box.width} ${box.height}`
      );
    };

    if (["primary", "both"].includes(gauge) && !isIcon(this.primaryValueText)) {
      _setViewBox(".primary-value-text");
    }

    if (
      ["secondary", "both"].includes(gauge) &&
      !isIcon(this.secondaryValueText)
    ) {
      _setViewBox(".secondary-value-text");
    }
  }

  private _rescaleIconLabelTextSvg() {
    if (!this.iconLabel) return;

    const svgRoot = this.shadowRoot!.querySelector(".icon-label-text")!;
    const box = svgRoot.querySelector("text")!.getBBox()!;
    svgRoot.setAttribute(
      "viewBox",
      `${box.x} ${box!.y} ${box.width} ${box.height}`
    );
  }

  private _updateMainMinIndicatorLabel() {
    if (!this.hasMainMinIndicatorLabel) return;

    const text = this.shadowRoot?.querySelector<SVGTextElement>(
      "#main-min-indicator-label"
    );
    if (!text) return;

    const textBBox = text.getBBox();
    const labelAngle = this._min_indicator_angle - 5;
    const startY = 39.5 * Math.sin((labelAngle * Math.PI) / 180);
    const width = textBBox.width;
    const lengthY = Math.abs(width * Math.cos((labelAngle * Math.PI) / 180));
    const endHeight = startY - lengthY;

    // Position text
    // Makes the text stick to the bottom in case of overflow
    if (this._min_indicator_angle < 90 && endHeight <= 0) {
      text.setAttribute("transform", "translate(0 -39.5) rotate(185 0 39.5)");
      text.setAttribute("text-anchor", "start");
    } else {
      text.setAttribute(
        "transform",
        `translate(0 -39.5) rotate(${180 + labelAngle} 0 39.5)`
      );
      text.setAttribute("text-anchor", "end");
    }
  }

  private _updateMainMaxIndicatorLabel() {
    if (!this.hasMainMaxIndicatorLabel) return;

    const text = this.shadowRoot?.querySelector<SVGTextElement>(
      "#main-max-indicator-label"
    );
    if (!text) return;

    const textBBox = text.getBBox();
    const labelAngle = this._max_indicator_angle - 5;
    const startY = 39.5 * Math.sin((labelAngle * Math.PI) / 180);
    const width = textBBox.width;
    const lengthY = Math.abs(width * Math.cos((labelAngle * Math.PI) / 180));
    const endHeight = startY - lengthY;

    // Position text
    // Makes the text stick to the bottom in case of overflow
    if (
      (this._max_indicator_angle < 90 && endHeight <= 0) ||
      this._max_indicator_angle === 0
    ) {
      text.setAttribute("transform", "translate(0 -39.5) rotate(-5 0 39.5)");
      text.setAttribute("text-anchor", "end");
    } else {
      text.setAttribute(
        "transform",
        `translate(0 -39.5) rotate(-${labelAngle} 0 39.5)`
      );
      text.setAttribute("text-anchor", "start");
    }
  }

  private _updateMainSetpointLabel() {
    if (!this.hasMainSetpointLabel) return;

    const group = this.shadowRoot?.querySelector<SVGGElement>(
      "#main-setpoint-group"
    );
    const pill = this.shadowRoot?.querySelector<SVGRectElement>(
      "#main-setpoint-pill"
    );
    const text = this.shadowRoot?.querySelector<SVGTextElement>(
      "#main-setpoint-label"
    );
    if (!group || !pill || !text) return;

    const textBBox = text.getBBox();
    const pillPadX = 2;
    const pillPadY = 1;

    const startY = 44 * Math.sin((this._setpoint_angle * Math.PI) / 180);
    const halfWidthPill = textBBox.width / 2 + pillPadX;
    const halfWidthPillLengthY = Math.abs(
      halfWidthPill * Math.cos((this._setpoint_angle * Math.PI) / 180)
    );
    const endHeight = startY - halfWidthPillLengthY;

    // Position group
    // Makes the label stick to the bottom in case of overflow
    let labelAngle = this._setpoint_angle - 90; // _setpoint_angle is from 0 to 180
    if (endHeight <= 0) {
      if (this._setpoint_angle < 90) {
        // Label in left half of gauge
        labelAngle =
          (Math.sinh(halfWidthPillLengthY / 44) / Math.PI) * 180 - 90;
      } else {
        // Label in right half of gauge
        labelAngle =
          90 - (Math.sinh(halfWidthPillLengthY / 44) / Math.PI) * 180;
      }
    }
    group.setAttribute(
      "transform",
      `translate(0 -44) rotate(${labelAngle} 0 44)`
    );

    // Size Pill
    pill.setAttribute("width", String(textBBox.width + pillPadX * 2));
    pill.setAttribute("height", String(textBBox.height + pillPadY * 2));
    pill.setAttribute(
      "transform",
      `translate(-${textBBox.width / 2 + pillPadX} -${textBBox.height / 2 + pillPadY})`
    );

    // Pill radius
    const h = textBBox.height + pillPadY * 2;
    pill.setAttribute("rx", String(h / 2));
    pill.setAttribute("ry", String(h / 2));
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

  private isTemplate(key: TemplateKey) {
    if (key === undefined) return false;
    if (this._templatedKeys && this._templatedKeys.size)
      return this._templatedKeys.has(key);
    return _isTemplate(String(getValueFromPath(this._config, key)));
  }

  public getValue(key: TemplateKey): any {
    if (
      this._templateValueRenderCache &&
      this._templateValueRenderCache.has(key)
    )
      return this._templateValueRenderCache.get(key);
    if (this._nonTemplatedTemplateKeysCache.has(key))
      return this._nonTemplatedTemplateKeysCache.get(key);
    const val = this.isTemplate(key)
      ? this._templateResults?.[key]?.result
      : getValueFromPath(this._config, key);
    if (this._templateValueRenderCache)
      this._templateValueRenderCache.set(key, val);
    return val;
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

  protected render() {
    if (!this._config || !this.hass) return nothing;
    this._templateValueRenderCache = new Map<TemplateKey, any>();

    //-----------------------------------------------------------------------------
    // MAIN GAUGE
    //-----------------------------------------------------------------------------
    this.mainMin = NumberUtils.toNumberOrDefault(
      this.getValue("min"),
      DEFAULT_MIN
    );
    this.mainMax = NumberUtils.toNumberOrDefault(
      this.getValue("max"),
      DEFAULT_MAX
    );

    const primaryValueAndValueText = this.getValueAndValueText(
      "main",
      this.mainMin
    );
    this.mainValue = primaryValueAndValueText.value;

    const mainSeverityGaugeColor = !this.hasMainNeedle
      ? this.computeSeverity("main", this.mainMin, this.mainMax, this.mainValue)
      : undefined;

    const hasMainSeverityGaugeMarker = !this.hasMainNeedle
      ? (this._config.marker ?? false)
      : undefined;

    const mainSegments =
      this.hasMainNeedle && !this.hasMainGradient
        ? this.getSegments("main", this.mainMin, this.mainMax)
        : undefined;

    this.mainGradientSegments =
      (this.hasMainNeedle && this.hasMainGradient) ||
      (!this.hasMainNeedle && this.hasMainGradientBackground)
        ? this.getGradientSegments("main", this.mainMin, this.mainMax)
        : undefined;

    const mainGradientBackgroundOpacity =
      !this.hasMainNeedle && this.hasMainGradientBackground
        ? (this._config.gradient_background_opacity ??
          DEFAULT_GRADIENT_BACKGROUND_OPACITY)
        : undefined;

    const mainConicSegments = this.usesConicGradient("main")
      ? this.getConicGradientString(
          "main",
          this.mainMin,
          this.mainMax,
          mainGradientBackgroundOpacity
        )
      : undefined;

    // min indicator
    let mainMinIndicatorShape: string | undefined;
    let mainMinIndicatorColor: string | undefined;
    let mainMinIndicatorOpacity: number | undefined;
    let mainMinIndicatorLabel: number | undefined;
    let mainMinIndicatorLabelColor: string | undefined;

    const mainMinIndicator = this.getMinMaxIndicatorSetpoint(
      "main",
      "min_indicator"
    );
    this.hasMainMinIndicator = mainMinIndicator !== undefined;
    this.mainMinIndicatorValue = mainMinIndicator?.value;
    const shouldRenderMainMinIndicator =
      this.hasMainNeedle &&
      this.hasMainMinIndicator &&
      this.mainMinIndicatorValue! > this.mainMin;

    if (this.hasMainMinIndicator) {
      if (shouldRenderMainMinIndicator) {
        mainMinIndicatorShape =
          this.getValidatedSvgPath("shapes.main_min_indicator") ??
          MAIN_GAUGE_MIN_MAX_INDICATOR;
        mainMinIndicatorColor = mainMinIndicator?.color;
        mainMinIndicatorOpacity =
          this._config.min_indicator?.opacity ??
          DEFAULT_MIN_MAX_INDICATOR_OPACITY;
      }
      this.hasMainMinIndicatorLabel = mainMinIndicator!.label!;
      if (this.hasMainMinIndicatorLabel) {
        mainMinIndicatorLabel = this.mainMinIndicatorValue!;
        mainMinIndicatorLabelColor = this.getLightDarkModeColor(
          "min_indicator.label_color",
          DEFAULT_MIN_INDICATOR_LABEL_COLOR
        );
        const precision = this._config.min_indicator?.precision;
        if (precision !== undefined) {
          const factor = 10 ** precision;
          mainMinIndicatorLabel =
            Math.round(mainMinIndicatorLabel * factor) / factor;
        }
      }
    }

    // max indicator
    let mainMaxIndicatorShape: string | undefined;
    let mainMaxIndicatorColor: string | undefined;
    let mainMaxIndicatorOpacity: number | undefined;
    let mainMaxIndicatorLabel: number | undefined;
    let mainMaxIndicatorLabelColor: string | undefined;

    const mainMaxIndicator = this.getMinMaxIndicatorSetpoint(
      "main",
      "max_indicator"
    );
    this.hasMainMaxIndicator = mainMaxIndicator !== undefined;
    this.mainMaxIndicatorValue = mainMaxIndicator?.value;
    const shouldRenderMainMaxIndicator =
      this.hasMainNeedle &&
      this.hasMainMaxIndicator &&
      this.mainMaxIndicatorValue! < this.mainMax;

    if (this.hasMainMaxIndicator) {
      if (shouldRenderMainMaxIndicator) {
        mainMaxIndicatorShape =
          this.getValidatedSvgPath("shapes.main_max_indicator") ??
          MAIN_GAUGE_MIN_MAX_INDICATOR;
        mainMaxIndicatorColor = mainMaxIndicator?.color;
        mainMaxIndicatorOpacity =
          this._config.max_indicator?.opacity ??
          DEFAULT_MIN_MAX_INDICATOR_OPACITY;
      }

      this.hasMainMaxIndicatorLabel = mainMaxIndicator!.label!;
      if (this.hasMainMaxIndicatorLabel) {
        mainMaxIndicatorLabel = this.mainMaxIndicatorValue!;
        mainMaxIndicatorLabelColor = this.getLightDarkModeColor(
          "max_indicator.label_color",
          DEFAULT_MAX_INDICATOR_LABEL_COLOR
        );
        const precision = this._config.max_indicator?.precision;
        if (precision !== undefined) {
          const factor = 10 ** precision;
          mainMaxIndicatorLabel =
            Math.round(mainMaxIndicatorLabel * factor) / factor;
        }
      }
    }

    // setpoint
    let mainSetpointNeedleShape: string | undefined;
    let mainSetpointNeedleColor: string | undefined;
    let mainSetpointLabel: number | undefined;

    const mainSetpoint = this.getMinMaxIndicatorSetpoint("main", "setpoint");
    this.hasMainSetpoint = mainSetpoint !== undefined;
    this.mainSetpointValue = mainSetpoint?.value ?? this.mainMin;
    if (this.hasMainSetpoint) {
      this.hasMainSetpointLabel = mainSetpoint!.label!;
      mainSetpointLabel = this.mainSetpointValue;
      mainSetpointNeedleShape =
        this.getValidatedSvgPath("shapes.main_setpoint_needle") ??
        (!this.hasMainSetpointLabel
          ? MAIN_GAUGE_SETPOINT_NEEDLE
          : MAIN_GAUGE_SETPOINT_NEEDLE_WITH_LABEL);
      mainSetpointNeedleColor = mainSetpoint?.color;

      const precision = this._config.setpoint?.precision;
      if (this.hasMainSetpointLabel && precision !== undefined) {
        const factor = 10 ** precision;
        mainSetpointLabel = Math.round(mainSetpointLabel * factor) / factor;
      }
    }

    // secondary
    let secondaryValueAndValueText;
    const secondaryValueTextColor = this.getLightDarkModeColor(
      "value_texts.secondary_color",
      DEFAULT_VALUE_TEXT_COLOR
    );

    //-----------------------------------------------------------------------------
    // INNER GAUGE
    //-----------------------------------------------------------------------------
    let innerSeverityGaugeColor: string | undefined;
    let hasInnerSeverityGaugeMarker: boolean | undefined;

    let innerSegments: GaugeSegment[] | undefined;
    let innerConicSegments: string | undefined;
    let innerGradientBackgroundOpacity: number | undefined;

    let _innerMinIndicator:
      | { value: number; color: string | undefined }
      | undefined;
    let shouldRenderInnerMinIndicator: boolean | undefined;
    let innerMinIndicatorShape: string | undefined;
    let innerMinIndicatorColor: string | undefined;
    let innerMinIndicatorOpacity: number | undefined;

    let _innerMaxIndicator:
      | { value: number; color: string | undefined }
      | undefined;
    let shouldRenderInnerMaxIndicator: boolean | undefined;
    let innerMaxIndicatorShape: string | undefined;
    let innerMaxIndicatorColor: string | undefined;
    let innerMaxIndicatorOpacity: number | undefined;

    let innerSetpointNeedleShape: string | undefined;
    let innerSetpointNeedleColor: string | undefined;

    if (this.hasInnerGauge) {
      this.innerMin = NumberUtils.toNumberOrDefault(
        this.getValue("inner.min"),
        this.mainMin
      );

      this.innerMax = NumberUtils.toNumberOrDefault(
        this.getValue("inner.max"),
        this.mainMax
      );

      secondaryValueAndValueText = this.getValueAndValueText(
        "inner",
        this.innerMin
      );
      this.innerValue = secondaryValueAndValueText.value;

      innerSeverityGaugeColor =
        this.innerMode === "severity" && this.innerValue! > this.innerMin!
          ? this.computeSeverity(
              "inner",
              this.innerMin!,
              this.innerMax!,
              this.innerValue!
            )
          : undefined;

      hasInnerSeverityGaugeMarker =
        this.innerMode === "severity" && this.innerValue! > this.innerMin!
          ? (this._config.inner!.marker ?? false)
          : undefined;

      // segments
      if (
        !this.hasInnerGradient &&
        ["static", "needle"].includes(this.innerMode!)
      ) {
        innerSegments = this.getSegments("inner", this.innerMin, this.innerMax);
      }

      // gradient resolution
      if (
        (this.hasInnerGradient &&
          ["static", "needle"].includes(this.innerMode!)) ||
        (this.innerMode === "severity" && this.hasInnerGradientBackground)
      ) {
        this.innerGradientSegments = this.getGradientSegments(
          "inner",
          this.innerMin,
          this.innerMax
        );
      }

      // gradient background
      innerGradientBackgroundOpacity =
        this.innerMode === "severity" && this.hasInnerGradientBackground
          ? (this._config.inner!.gradient_background_opacity ??
            DEFAULT_GRADIENT_BACKGROUND_OPACITY)
          : undefined;

      // conic gradient
      innerConicSegments = this.usesConicGradient("inner")
        ? this.getConicGradientString(
            "inner",
            this.innerMin,
            this.innerMax,
            innerGradientBackgroundOpacity
          )
        : undefined;

      // min indicator
      _innerMinIndicator = this.getMinMaxIndicatorSetpoint(
        "inner",
        "min_indicator"
      );
      this.innerMinIndicator = _innerMinIndicator !== undefined;
      this.innerMinIndicatorValue = _innerMinIndicator?.value;
      shouldRenderInnerMinIndicator =
        ["static", "needle"].includes(this.innerMode!) &&
        this.innerMinIndicator &&
        this.innerMinIndicatorValue! > this.innerMin!;
      if (shouldRenderInnerMinIndicator) {
        innerMinIndicatorShape =
          this.getValidatedSvgPath("shapes.inner_min_indicator") ??
          INNER_GAUGE_MIN_MAX_INDICATOR;
        innerMinIndicatorColor = _innerMinIndicator?.color;
        innerMinIndicatorOpacity =
          this._config.inner!.min_indicator?.opacity ??
          DEFAULT_MIN_MAX_INDICATOR_OPACITY;
      }

      // max indicator
      _innerMaxIndicator = this.getMinMaxIndicatorSetpoint(
        "inner",
        "max_indicator"
      );
      this.innerMaxIndicator = _innerMaxIndicator !== undefined;
      this.innerMaxIndicatorValue = _innerMaxIndicator?.value;
      shouldRenderInnerMaxIndicator =
        ["static", "needle"].includes(this.innerMode!) &&
        this.innerMaxIndicator &&
        this.innerMaxIndicatorValue! < this.innerMax!;
      if (shouldRenderInnerMaxIndicator) {
        innerMaxIndicatorShape =
          this.getValidatedSvgPath("shapes.inner_max_indicator") ??
          INNER_GAUGE_MIN_MAX_INDICATOR;
        innerMaxIndicatorColor = _innerMaxIndicator?.color;
        innerMaxIndicatorOpacity =
          this._config.inner!.max_indicator?.opacity ??
          DEFAULT_MIN_MAX_INDICATOR_OPACITY;
      }

      // setpoint
      const _innerSetpoint = this.getMinMaxIndicatorSetpoint(
        "inner",
        "setpoint"
      );
      this.innerSetpoint = _innerSetpoint !== undefined;
      this.innerSetpointValue = _innerSetpoint?.value ?? this.innerMin;
      if (this.innerSetpoint) {
        innerSetpointNeedleShape =
          this.getValidatedSvgPath("shapes.inner_setpoint_needle") ??
          (this.innerMode !== "on_main"
            ? INNER_GAUGE_SETPOINT_NEEDLE
            : INNER_GAUGE_SETPOINT_ON_MAIN_NEEDLE);
        innerSetpointNeedleColor = _innerSetpoint?.color;
      }
    } else {
      secondaryValueAndValueText = this.getValueAndValueText("inner", 0);
    }

    //-----------------------------------------------------------------------------
    // VALUE NEEDLES
    //-----------------------------------------------------------------------------

    let needleShape: string | undefined;
    let needleColor: string | undefined;

    if (this.hasMainNeedle) {
      needleShape =
        this.getValidatedSvgPath("shapes.main_needle") ??
        (this.innerMode === "needle" ||
        (this.innerMode === "on_main" && this.hasMainNeedle)
          ? MAIN_GAUGE_NEEDLE_WITH_INNER
          : MAIN_GAUGE_NEEDLE);

      needleColor = this.getLightDarkModeColor(
        "needle_color",
        DEFAULT_NEEDLE_COLOR
      );
    }

    let innerNeedleShape: string | undefined;
    let innerNeedleColor: string | undefined;

    if (this.hasInnerGauge) {
      if (
        this.innerMode === "needle" ||
        (this.innerMode === "on_main" && this.hasMainNeedle)
      ) {
        innerNeedleShape =
          this.getValidatedSvgPath("shapes.inner_needle") ??
          (this.innerMode !== "on_main"
            ? INNER_GAUGE_NEEDLE
            : INNER_GAUGE_ON_MAIN_NEEDLE);

        innerNeedleColor = this.getLightDarkModeColor(
          "inner.needle_color",
          DEFAULT_NEEDLE_COLOR
        );
      } else {
        innerNeedleShape = undefined;
        innerNeedleColor = undefined;
      }
    }

    //-----------------------------------------------------------------------------
    // VALUE TEXTS
    //-----------------------------------------------------------------------------

    // primary
    this.primaryValueText = primaryValueAndValueText.valueText;
    const primaryValueTextColor = this.getLightDarkModeColor(
      "value_texts.primary_color",
      DEFAULT_VALUE_TEXT_COLOR
    );
    const primaryValueTextFontSizeReduction = `
      ${
        40 -
        Math.min(
          Math.max(
            NumberUtils.toNumberOrDefault(
              this.getValue("value_texts.primary_font_size_reduction"),
              0
            ),
            0
          ),
          15
        )
      }%`;

    // secondary
    this.secondaryValueText = secondaryValueAndValueText.valueText;

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
    // ICON
    //-----------------------------------------------------------------------------
    const icon = this.getIcon();
    let iconIcon: string | undefined;
    let iconColor: string | undefined;
    let iconLeft = false;
    if (icon) {
      iconIcon = icon.icon;
      iconColor = icon.color;
      iconLeft = icon.left;
      this.iconLabel = icon.label ?? "";
    }

    //-----------------------------------------------------------------------------
    // FEATURES
    //-----------------------------------------------------------------------------

    let hasAdjustTemperatureFeature: boolean;
    let hasClimateHvacModesFeature: boolean;
    let featureEntityObj: ClimateEntity | undefined;
    let hvacModes: HvacMode[];

    if (
      this.featureEntity !== undefined &&
      this.enabledFeaturePages !== undefined &&
      this.enabledFeaturePages?.length >= 1
    ) {
      hasAdjustTemperatureFeature =
        this.enabledFeaturePages.includes("adjust-temperature");
      hasClimateHvacModesFeature =
        this.enabledFeaturePages.includes("climate-hvac-modes");

      if (hasAdjustTemperatureFeature || hasClimateHvacModesFeature) {
        featureEntityObj = this.featureEntity
          ? <ClimateEntity>this.hass!.states[this.featureEntity]
          : undefined;
      }

      if (featureEntityObj !== undefined && hasClimateHvacModesFeature) {
        const _hvacModesConfig =
          getFeature(this._config, "climate-hvac-modes")?.hvac_modes ??
          featureEntityObj?.attributes.hvac_modes ??
          [];
        hvacModes = featureEntityObj!.attributes.hvac_modes
          .filter((mode) => _hvacModesConfig.includes(mode))
          .sort(compareClimateHvacModes);
      }
    }

    return html`
      <ha-card
        style=${styleMap({
          background: this.hideBackground ? "none" : undefined,
          border: this.hideBackground ? "none" : undefined,
          "box-shadow": this.hideBackground ? "none" : undefined,
        })}
        role=${ifDefined(this.hasCardAction ? "button" : undefined)}
        tabindex=${ifDefined(this.hasCardAction ? "0" : undefined)}
      >
        ${this.header !== undefined
          ? html` <h1
              class="card-header"
              style=${styleMap({
                "line-height": "var(--ha-line-height-condensed)",
                "padding-top": "0px",
                "padding-bottom": "16px",
                width: "100%",
              })}
            >
              ${this.header}
            </h1>`
          : nothing}
        <gauge-card-pro-gauge
          style=${styleMap({
            position: "relative",
          })}
          @action=${this._handleCardAction}
          .actionHandler=${actionHandler({
            hasHold: hasAction(this._config.hold_action),
            hasDoubleClick: hasAction(this._config.double_tap_action),
          })}
        >
          <svg id="main-gauge" viewBox="-50 -50 100 50" class="elements-group">
            <defs>
              <clipPath
                id="main-rounding"
                x="-50"
                y="-50"
                width="100"
                height="50"
              >
                <path d="${this.mainMask}" />
              </clipPath>
              <clipPath
                id="main-conic-gradient"
                x="-50"
                y="-50"
                width="100"
                height="50"
              >
                <path d="${this.mainMask ?? MAIN_GAUGE_CONIC_GRADIENT_MASK}" />
              </clipPath>
            </defs>

            ${this.hasMainNeedle && !this.hasMainGradient
              ? svg`
                  <g clipPath=${ifDefined(this.mainMaskUrl)}>
                    <g>
                      ${mainSegments!.map((segment) => {
                        const angle = getAngle(
                          segment.pos,
                          this.mainMin,
                          this.mainMax
                        );
                        return svg`
                          <path
                            class="segment"
                            d="M
                              ${0 - 40 * Math.cos((angle * Math.PI) / 180)}
                              ${0 - 40 * Math.sin((angle * Math.PI) / 180)}
                              A 40 40 0 0 1 40 0"
                            style=${styleMap({ stroke: segment.color })}
                          ></path>
                        `;
                      })}
                    </g>
                  </g>`
              : nothing}
            ${!this.hasMainNeedle
              ? svg`
                <path
                  class="main-background"
                  style=${styleMap({ stroke: !this.hasMainGradientBackground ? "var(--primary-background-color)" : "#ffffff" })}
                  d="M -40 0 A 40 40 0 0 1 40 0"
                  clip-path="${this.mainMaskUrl}"
                ></path>`
              : nothing}
            ${this.usesConicGradient("main")
              ? svg`
                  <foreignObject
                    xmlns="http://www.w3.org/1999/xhtml"
                    x="-50"
                    y="-50"
                    width="100"
                    height="100"
                    clip-path="url(#main-conic-gradient)"
                  >
                    <div
                      style=${styleMap({
                        width: "100%",
                        height: "100%",
                        background: `conic-gradient(from -90deg, ${mainConicSegments})`,
                      })}
                    ></div>
                  </foreignObject>`
              : nothing}
            ${this.usesGradientPath("main")
              ? svg`
                <svg id="main-gradient" viewBox="0 0 100 50"
                  style=${styleMap({
                    overflow: "auto",
                    opacity:
                      !this.hasMainNeedle && this.hasMainGradientBackground
                        ? mainGradientBackgroundOpacity
                        : undefined,
                  })}
                  clip-path=${ifDefined(this.mainMaskUrl)}
                  >
                  <path
                    fill="none"
                    d="M -40 0 A 40 40 0 0 1 40 0"
                  ></path>
                </svg>`
              : nothing}
            ${this.mainValue > this.mainMin &&
            (!this.hasMainNeedle || this.hasMainGradientBackground)
              ? svg`
                <g clip-path=${ifDefined(this.mainMaskUrl)}>
                  <g
                    class="normal-transition" 
                    style=${styleMap({ transform: `rotate(${this._angle}deg)`, transformOrigin: "0px 0px" })}>
                    <path
                      class="main-severity-gauge"
                      style=${styleMap({ stroke: mainSeverityGaugeColor })}
                      d="M -40 0 A 40 40 0 1 0 40 0"
                    ></path>
                  </g>
                  ${
                    hasMainSeverityGaugeMarker
                      ? svg`
                      <g 
                        class="normal-transition"
                        style=${styleMap({ transform: `rotate(${this._angle}deg)`, transformOrigin: "0px 0px" })}>
                        <path
                          class="main-marker"
                          d="${MAIN_GAUGE_SEVERITY_MARKER}"
                        ></path>
                      </g>`
                      : nothing
                  }
                </g>`
              : nothing}
            ${shouldRenderMainMinIndicator
              ? svg`
                <g clip-path=${ifDefined(this.mainMaskUrl)}>
                  <g 
                    class="slow-transition" 
                    style=${styleMap({ transform: `rotate(${this._min_indicator_angle}deg)`, transformOrigin: "0px 0px" })}>
                    <path
                      d=${mainMinIndicatorShape}
                      style=${styleMap({
                        fill: mainMinIndicatorColor,
                        "fill-opacity": mainMinIndicatorOpacity,
                        stroke: "var(--main-min-indicator-stroke-color)",
                        "stroke-width":
                          "var(--main-min-indicator-stroke-width)",
                      })}
                    ></path>
                  </g>
                  ${
                    this.hasMainMinIndicatorLabel
                      ? svg`
                      <text
                        class="label-text slow-transition"
                        id="main-min-indicator-label"
                        style=${styleMap({ fill: mainMinIndicatorLabelColor, rotate: "90deg" })}
                        dominant-baseline="middle"
                      >
                        ${mainMinIndicatorLabel}
                      </text>`
                      : nothing
                  }
                </g>`
              : nothing}
            ${shouldRenderMainMaxIndicator
              ? svg`
                <g clip-path=${ifDefined(this.mainMaskUrl)}>
                  <g 
                    class="slow-transition" 
                    style=${styleMap({ transform: `rotate(-${this._max_indicator_angle}deg)`, transformOrigin: "0px 0px" })}>
                    <path
                      style=${styleMap({
                        fill: mainMaxIndicatorColor,
                        "fill-opacity": mainMaxIndicatorOpacity,
                        stroke: "var(--main-max-indicator-stroke-color)",
                        "stroke-width":
                          "var(--main-max-indicator-stroke-width)",
                      })}
                      d=${mainMaxIndicatorShape}
                    ></path>
                  </g>
                  ${
                    this.hasMainMaxIndicatorLabel
                      ? svg`
                      <text
                        class="label-text slow-transition"
                        id="main-max-indicator-label"
                        style=${styleMap({ fill: mainMaxIndicatorLabelColor, rotate: "90deg" })}
                        dominant-baseline="middle"
                      >
                        ${mainMaxIndicatorLabel}
                      </text>`
                      : nothing
                  }
                </g>`
              : nothing}
          </svg>

          ${this.hasInnerGauge
            ? svg`
                <svg id="inner-gauge" viewBox="-50 -50 100 50" class="elements-group inner-gauge">
                  <defs>
                    <clipPath
                      id="inner-rounding"
                      x="-50"
                      y="-50"
                      width="100"
                      height="50"
                    >
                      <path d="${this.innerMask}" />
                    </clipPath>
                    <clipPath
                      id="inner-stroke-rounding"
                      x="-50"
                      y="-50"
                      width="100"
                      height="50"
                    >
                      <path d="${this.innerMaskStroke}" />
                    </clipPath>
                    <clipPath
                      id="inner-conic-gradient"
                      x="-50"
                      y="-50"
                      width="100"
                      height="50"
                    >
                      <path d="${this.innerMask ?? INNER_GAUGE_CONIC_GRADIENT_MASK}" />
                    </clipPath>
                  </defs>

              ${
                ["static", "needle"].includes(this.innerMode!) ||
                (this.innerMode == "severity" &&
                  this.hasInnerGradientBackground)
                  ? svg`
                    <path
                        class="inner-gauge-stroke"
                        d="M -32.5 0 A 32.5 32.5 0 0 1 32.5 0"
                        clip-path=${ifDefined(this.innerMaskStrokeUrl)}
                    ></path>`
                  : nothing
              }

              ${
                this.innerMode == "severity" &&
                ((!this.hasInnerGradientBackground &&
                  this.innerValue! > this.innerMin!) ||
                  this.hasInnerGradientBackground)
                  ? this.hasInnerGradientBackground
                    ? svg`
                        <path
                          class="inner-gradient-bg-bg"
                          d="M -32 0 A 32 32 0 1 1 32 0"
                          clip-path=${ifDefined(this.innerMaskUrl)}
                        ></path>`
                    : svg`
                        <g clip-path=${ifDefined(this.innerMaskStrokeUrl)}>
                          <g 
                            style=${styleMap({ transform: `rotate(${Math.min(this._inner_angle + 1.5, 180)}deg)`, transformOrigin: "0px 0px" })}
                            class="normal-transition">
                            <path
                              class="inner-gauge-stroke"
                              d="M -32.5 0 A 32.5 32.5 0 1 0 32.5 0"
                            ></path>
                          </g>
                        </g>`
                  : nothing
              }

              ${
                this.usesConicGradient("inner")
                  ? svg`
                  <foreignObject
                    xmlns="http://www.w3.org/1999/xhtml"
                    x="-50"
                    y="-50"
                    width="100"
                    height="100"
                    clip-path="url(#inner-conic-gradient)"
                  >
                    <div
                      style=${styleMap({
                        width: "100%",
                        height: "100%",
                        background: `conic-gradient(from -90deg, ${innerConicSegments})`,
                      })}
                    ></div>
                  </foreignObject>`
                  : nothing
              }
              
              ${
                this.usesGradientPath("inner")
                  ? svg`
                    <svg id="inner-gradient" 
                      style=${styleMap({
                        overflow: "auto",
                        opacity:
                          this.innerMode == "severity" &&
                          this.hasInnerGradientBackground
                            ? innerGradientBackgroundOpacity
                            : undefined,
                      })}
                      clip-path=${ifDefined(this.innerMaskUrl)}
                      >
                      <path
                        fill="none"
                        d="M -32 0 A 32 32 0 0 1 32 0"
                      ></path>
                    </svg>`
                  : nothing
              }
          
              ${
                this.innerValue! > this.innerMin! &&
                (this.innerMode == "severity" ||
                  this.hasInnerGradientBackground)
                  ? svg`
                    <g clip-path=${ifDefined(this.innerMaskUrl)}>
                      <g 
                        class="normal-transition" 
                        style=${styleMap({ transform: `rotate(${this._inner_angle}deg)`, transformOrigin: "0px 0px" })}>
                        <path
                          class="inner-severity-gauge"
                          d="M -32 0 A 32 32 0 1 0 32 0"
                          style=${styleMap({ stroke: innerSeverityGaugeColor })}
                        ></path>
                      </g>
                      ${
                        hasInnerSeverityGaugeMarker
                          ? svg`
                          <g
                            class="normal-transition"  
                            style=${styleMap({ transform: `rotate(${this._inner_angle}deg)`, transformOrigin: "0px 0px" })}>
                            <path
                              class="inner-marker"
                              d="${INNER_GAUGE_SEVERITY_MARKER}"
                            ></path>
                          </g>`
                          : nothing
                      }
                    </g>`
                  : nothing
              }  

              ${
                !this.hasInnerGradient &&
                ["static", "needle"].includes(this.innerMode!) &&
                innerSegments
                  ? svg`
                      <g clip-path=${ifDefined(this.innerMaskUrl)}>
                      <g>
                      ${innerSegments.map((segment) => {
                        const angle = getAngle(
                          segment.pos,
                          this.innerMin!,
                          this.innerMax!
                        );
                        return svg`
                            <g clip-path=${ifDefined(this.innerMaskUrl)}>
                              <g>
                                <path
                                  class="inner-segment"
                                  d="M
                                    ${0 - 32 * Math.cos((angle * Math.PI) / 180)}
                                    ${0 - 32 * Math.sin((angle * Math.PI) / 180)}
                                    A 32 32 0 0 1 32 0"
                                  style=${styleMap({ stroke: segment.color })}
                                ></path>
                              `;
                      })}
                        </g>
                            </g>
                    </svg>`
                  : nothing
              }

              ${
                shouldRenderInnerMinIndicator
                  ? svg`
                    <g clip-path=${ifDefined(this.innerMaskUrl)}>
                      <g 
                        class="slow-transition" 
                        style=${styleMap({ transform: `rotate(${this._inner_min_indicator_angle}deg)`, transformOrigin: "0px 0px" })}>
                        <path
                          style=${styleMap({
                            fill: innerMinIndicatorColor,
                            "fill-opacity": innerMinIndicatorOpacity,
                            stroke: "var(--inner-min-indicator-stroke-color)",
                            "stroke-width":
                              "var(--inner-min-indicator-stroke-width)",
                          })}
                          d=${innerMinIndicatorShape}
                        > </path>
                      </g>
                    </g>`
                  : nothing
              }

              ${
                shouldRenderInnerMaxIndicator
                  ? svg`
                    <g clip-path=${ifDefined(this.innerMaskUrl)}>
                      <g 
                        class="slow-transition" 
                        style=${styleMap({ transform: `rotate(-${this._inner_max_indicator_angle}deg)`, transformOrigin: "0px 0px" })}>
                        <path
                          style=${styleMap({
                            fill: innerMaxIndicatorColor,
                            "fill-opacity": innerMaxIndicatorOpacity,
                            stroke: "var(--inner-max-indicator-stroke-color)",
                            "stroke-width":
                              "var(--inner-max-indicator-stroke-width)",
                          })}
                          d=${innerMaxIndicatorShape}
                        > </path>
                      </g>
                    </g>`
                  : nothing
              }
            `
            : nothing}
          ${this.hasMainNeedle ||
          this.innerMode === "needle" ||
          this.hasMainSetpoint ||
          this.innerSetpoint
            ? svg`
            <svg viewBox="-50 -50 100 50" class="elements-group needles">

              ${
                this.hasMainNeedle
                  ? svg`
                    <path
                      class="normal-transition"
                      d=${needleShape}
                      style=${styleMap({
                        transform: `rotate(${this._angle}deg)`,
                        fill: needleColor,
                        stroke: "var(--main-needle-stroke-color)",
                        "stroke-width": "var(--main-needle-stroke-width)",
                      })}
                    ></path>`
                  : nothing
              }

              ${
                this.hasMainSetpoint
                  ? svg`
                    ${
                      this.hasMainSetpointLabel
                        ? svg`
                          <g 
                            class="label-group"
                            id="main-setpoint-group">
                            <rect 
                              class="label-pill"
                              id="main-setpoint-pill"
                            ></rect>
                            <text
                              class="label-text normal-transition"
                              id="main-setpoint-label"
                              style=${styleMap({ fill: mainSetpointNeedleColor, "text-anchor": "middle" })}
                              dominant-baseline="middle"
                            >
                              ${mainSetpointLabel}
                            </text>
                          </g>`
                        : nothing
                    }
                    <path
                      class="normal-transition"
                      d=${mainSetpointNeedleShape}
                      style=${styleMap({
                        transform: `rotate(${this._setpoint_angle}deg)`,
                        fill: mainSetpointNeedleColor,
                        stroke: "var(--main-setpoint-needle-stroke-color)",
                        "stroke-width":
                          "var(--main-setpoint-needle-stroke-width)",
                      })}
                    ></path>`
                  : nothing
              } 

              ${
                this.innerMode === "needle" ||
                (this.innerMode === "on_main" && this.hasMainNeedle)
                  ? svg`
                    <path
                      class="normal-transition"
                      d=${innerNeedleShape}
                      style=${styleMap({
                        transform: `rotate(${this._inner_angle}deg)`,
                        fill: innerNeedleColor,
                        stroke: "var(--inner-needle-stroke-color)",
                        "stroke-width": "var(--inner-needle-stroke-width)",
                      })}
                    ></path>`
                  : nothing
              } 

              ${
                this.innerSetpoint
                  ? svg`
                    <path
                      class="normal-transition"
                      d=${innerSetpointNeedleShape}
                      style=${styleMap({
                        transform: `rotate(${this._inner_setpoint_angle}deg)`,
                        fill: innerSetpointNeedleColor,
                        stroke: "var(--inner-setpoint-needle-stroke-color)",
                        "stroke-width":
                          "var(--inner-setpoint-needle-stroke-width)",
                      })}
                    ></path>`
                  : nothing
              } 

            </svg>`
            : nothing}
          ${!isIcon(this.primaryValueText)
            ? svg`
              <svg
                class="elements-group primary-value-text"
                style=${styleMap({ "max-height": primaryValueTextFontSizeReduction })}
                role=${ifDefined(this.hasPrimaryValueTextAction ? "button" : undefined)}
                tabindex=${ifDefined(this.hasPrimaryValueTextAction ? "0" : undefined)}
                @action=${(ev: CustomEvent) =>
                  this.hasPrimaryValueTextAction
                    ? this._handlePrimaryValueTextAction(ev)
                    : nothing}
                @click=${(ev: CustomEvent) =>
                  this.hasPrimaryValueTextAction
                    ? ev.stopPropagation()
                    : nothing}
                @touchend=${(ev: CustomEvent) =>
                  this.hasPrimaryValueTextAction
                    ? ev.stopPropagation()
                    : nothing}
                .actionHandler=${actionHandler({
                  hasHold: hasAction(
                    this._config!.primary_value_text_hold_action
                  ),
                  hasDoubleClick: hasAction(
                    this._config!.primary_value_text_double_tap_action
                  ),
                })}
              >
                <text 
                  class="value-text"
                  style=${styleMap({ fill: primaryValueTextColor })}>
                  ${this.primaryValueText}
                </text>
              </svg>`
            : html` <div class="primary-value-icon">
                <ha-state-icon
                  .hass=${this.hass}
                  .icon=${getIcon(this.primaryValueText!)}
                  class="icon primary-value-state-icon"
                  style=${styleMap({ color: primaryValueTextColor })}
                ></ha-state-icon>
              </div>`}
          ${!isIcon(this.secondaryValueText)
            ? svg`
              <svg 
                class="secondary-value-text"
                role=${ifDefined(this.hasSecondaryValueTextAction ? "button" : undefined)}
                tabindex=${ifDefined(this.hasSecondaryValueTextAction ? "0" : undefined)}
                @action=${(ev: CustomEvent) =>
                  this.hasSecondaryValueTextAction
                    ? this._handleSecondaryValueTextAction(ev)
                    : nothing}
                @click=${(ev: CustomEvent) =>
                  this.hasSecondaryValueTextAction
                    ? ev.stopPropagation()
                    : nothing}
                @touchend=${(ev: CustomEvent) =>
                  this.hasSecondaryValueTextAction
                    ? ev.stopPropagation()
                    : nothing}
                .actionHandler=${actionHandler({
                  hasHold: hasAction(
                    this._config!.secondary_value_text_hold_action
                  ),
                  hasDoubleClick: hasAction(
                    this._config!.secondary_value_text_double_tap_action
                  ),
                })}
                >
                <text 
                  class="value-text"
                  style=${styleMap({ fill: secondaryValueTextColor })}>
                  ${this.secondaryValueText}
                </text>
              </svg>`
            : html` <div class="secondary-value-icon">
                <ha-state-icon
                  .hass=${this.hass}
                  .icon=${getIcon(this.secondaryValueText!)}
                  class="icon secondary-value-state-icon"
                  style=${styleMap({ color: secondaryValueTextColor })}
                ></ha-state-icon>
              </div>`}
          ${iconIcon
            ? html`
                <div class="icon-container">
                  <div
                    class="icon-inner-container"
                    style=${styleMap({
                      "margin-left": iconLeft ? "0%" : "auto",
                      "margin-right": iconLeft ? "auto" : "0%",
                    })}
                  >
                    <ha-state-icon
                      class="icon"
                      .hass=${this.hass}
                      .icon=${iconIcon}
                      role=${ifDefined(
                        this.hasIconAction ? "button" : undefined
                      )}
                      tabindex=${ifDefined(
                        this.hasIconAction ? "0" : undefined
                      )}
                      style=${styleMap({ color: iconColor })}
                      @action=${(ev: CustomEvent) =>
                        this.hasIconAction
                          ? this._handleIconAction(ev)
                          : nothing}
                      @click=${(ev: CustomEvent) =>
                        this.hasIconAction ? ev.stopPropagation() : nothing}
                      @touchend=${(ev: CustomEvent) =>
                        this.hasIconAction ? ev.stopPropagation() : nothing}
                      .actionHandler=${actionHandler({
                        hasHold: hasAction(this._config!.icon_hold_action),
                        hasDoubleClick: hasAction(
                          this._config!.icon_double_tap_action
                        ),
                      })}
                    ></ha-state-icon>

                    <svg class="icon-label-text">
                      <text
                        class="value-text"
                        style=${styleMap({ fill: "var(--primary-text-color)" })}
                      >
                        ${this.iconLabel}
                      </text>
                    </svg>
                  </div>
                </div>
              `
            : nothing}
        </gauge-card-pro-gauge>

        ${featureEntityObj !== undefined &&
        (hasAdjustTemperatureFeature! || hasClimateHvacModesFeature!)
          ? html` <div
              class="action-row"
              style=${styleMap({
                "grid-template-columns":
                  this.enabledFeaturePages!.length > 1
                    ? "36px auto 36px"
                    : undefined,
                "max-width":
                  this.enabledFeaturePages!.length > 1 ? undefined : "300px",
              })}
            >
              ${this.enabledFeaturePages!.length > 1
                ? html` <div></div`
                : nothing}
              ${hasAdjustTemperatureFeature!
                ? html` <gcp-climate-temperature-control
                      .hass=${this.hass}
                      .entity=${featureEntityObj}
                      style=${styleMap({ display: this.activeFeaturePage !== "adjust-temperature" ? "none" : undefined })}
                    >
                    </gcp-climate-temperature-control">`
                : nothing}
              ${hasClimateHvacModesFeature!
                ? html` <gcp-climate-hvac-modes-control
                    .hass=${this.hass}
                    .entity=${featureEntityObj}
                    .modes=${hvacModes!}
                    style=${styleMap({
                      display:
                        this.activeFeaturePage !== "climate-hvac-modes"
                          ? "none"
                          : undefined,
                    })}
                  >
                  </gcp-climate-hvac-modes-control>`
                : nothing}
              ${this.enabledFeaturePages!.length > 1
                ? html` <div class="right-button button">
                    <gcp-icon-button
                      appearance="plain"
                      @click=${(e) => this.nextFeaturePage(e)}
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

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;
      this._calculate_angles();
      this._rescaleValueTextSvg();
      this._rescaleIconLabelTextSvg();
      this._updateMainMinIndicatorLabel();
      this._updateMainMaxIndicatorLabel();
      this._updateMainSetpointLabel();

      if (this.usesGradientPath("main")) {
        this._mainGaugeGradient.initialize(
          this.renderRoot.querySelector("#main-gradient path"),
          this._config!.gradient_resolution
        );
      }
      if (this.usesGradientPath("inner")) {
        this._innerGaugeGradient.initialize(
          this.renderRoot.querySelector("#inner-gradient path"),
          this._config!.inner!.gradient_resolution
        );
      }
    });
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._config || !this.hass || !this._updated) return;

    this._calculate_angles();

    if (changedProperties.has("primaryValueText")) {
      this._rescaleValueTextSvg("primary");
    }

    if (changedProperties.has("secondaryValueText")) {
      this._rescaleValueTextSvg("secondary");
    }

    if (changedProperties.has("iconLabel")) {
      this._rescaleIconLabelTextSvg();
    }

    if (changedProperties.has("_min_indicator_angle")) {
      this._updateMainMinIndicatorLabel();
    }

    if (changedProperties.has("_max_indicator_angle")) {
      this._updateMainMaxIndicatorLabel();
    }

    if (changedProperties.has("_setpoint_angle")) {
      this._updateMainSetpointLabel();
    }

    if (this.usesGradientPath("main")) {
      this._mainGaugeGradient.render(
        this.mainMin,
        this.mainMax,
        this.mainGradientSegments!
      );
    }

    if (this.usesGradientPath("inner")) {
      this._innerGaugeGradient.render(
        this.innerMin!,
        this.innerMax!,
        this.innerGradientSegments!
      );
    }
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this._tryDisconnect();

    if (this._config && this._templateResults) {
      const key = this._computeCacheKey();
      templateCache.set(key, this._templateResults);
    }
  }
}
