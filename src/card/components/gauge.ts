// External dependencies
import {
  CSSResultGroup,
  html,
  LitElement,
  nothing,
  PropertyValues,
  svg,
  TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import {
  actionHandler,
  ActionHandlerEvent,
  afterNextRender,
  batteryLevelIcon,
  batteryStateColorProperty,
  blankBeforePercent,
  ClimateEntity,
  handleAction,
  hasAction,
  HomeAssistant,
  HvacMode,
} from "../../dependencies/ha";

// Internalized external dependencies
import { isValidSvgPath } from "../../dependencies/is-svg-path/valid-svg-path";
import { computeDarkMode } from "../../dependencies/mushroom";

// Local utilities
import { Logger } from "../../utils/logger";

import { getAngle } from "../../utils/number/get-angle";
import { getValueFromPath } from "../../utils/object/get-value";
import {
  formatEntityToLocal,
  formatNumberToLocal,
} from "../../utils/number/format-to-locale";
import { NumberUtils } from "../../utils/number/numberUtils";
import { localize } from "../../utils/localize";
import { getHvacModeColor, getHvacModeIcon, getSwingModeIcon } from "../utils";
import { isIcon, getIcon } from "../../utils/string/icon";

import {
  DEFAULT_GRADIENT_BACKGROUND_OPACITY,
  DEFAULT_GRADIENT_RESOLUTION,
  DEFUALT_ICON_COLOR,
  DEFAULT_MIN,
  DEFAULT_MIN_INDICATOR_COLOR,
  DEFAULT_MIN_INDICATOR_LABEL_COLOR,
  DEFAULT_MIN_MAX_INDICATOR_OPACITY,
  DEFAULT_MAX,
  DEFAULT_MAX_INDICATOR_COLOR,
  DEFAULT_MAX_INDICATOR_LABEL_COLOR,
  DEFAULT_NEEDLE_COLOR,
  DEFAULT_SETPOINT_NEELDLE_COLOR,
  DEFAULT_VALUE_TEXT_COLOR,
  MAIN_GAUGE_NEEDLE,
  MAIN_GAUGE_NEEDLE_WITH_INNER,
  MAIN_GAUGE_SEVERITY_MARKER,
  MAIN_GAUGE_CONIC_GRADIENT_MASK,
  MAIN_GAUGE_MIN_MAX_INDICATOR,
  MAIN_GAUGE_MIN_MAX_INDICATOR_LABEL_TEXTPATH,
  MAIN_GAUGE_MIN_MAX_INDICATOR_LABEL_TEXTPATH_WITH_INNER,
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
} from "../const";

import {
  Gauge,
  GaugeCardProCardConfig,
  GaugeSegment,
  GradientSegment,
} from "../config";

import { TemplateKey } from "../card";

// Core functionality
import { gaugeCSS } from "../css/gauge";
import { gaugeMainCSS } from "../css/gauge-main";
import { gaugeInnerCSS } from "../css/gauge-inner";
import { gaugeIconCSS } from "../css/gauge-icon";
import { GradientRenderer } from "../_gradient-renderer";
import {
  getSegments as _getSegments,
  getConicGradientString as _getConicGradientString,
  getGradientSegments as _getGradientSegments,
  computeSeverity as _computeSeverity,
} from "../_segments";

@customElement("gauge-card-pro-gauge")
export class GaugeCardProGauge extends LitElement {
  @property({ attribute: false })
  public log!: Logger;

  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public config!: GaugeCardProCardConfig;

  @property({ attribute: false })
  public getValue!: (key: TemplateKey) => any;

  @state() private _angle = 0;
  @state() private _min_indicator_angle = 0;
  @state() private _max_indicator_angle = 0;
  @state() private _inner_angle = 0;
  @state() private _inner_min_indicator_angle = 0;
  @state() private _inner_max_indicator_angle = 0;
  @state() private _inner_setpoint_angle = 0;
  @state() private _setpoint_angle = 0;
  @state() private _updated = false;

  private _mainGaugeGradient = new GradientRenderer(this.log, "main");
  private _innerGaugeGradient = new GradientRenderer(this.log, "inner");

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
  @state() private iconLeftLabel = "";
  @state() private iconRightLabel = "";

  // actions
  private hasCardAction = false;
  private hasPrimaryValueTextAction = false;
  private hasSecondaryValueTextAction = false;
  private hasIconLeftAction = false;
  private hasIconRightAction = false;

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("config")) {
      this.hasMainNeedle = this.config.needle ?? false;
      this.hasMainGradient = this.config.gradient ?? false;
      this.mainGradientResolution = this.hasMainGradient
        ? (this.config.gradient_resolution ?? DEFAULT_GRADIENT_RESOLUTION)
        : undefined;
      this.hasMainGradientBackground = this.config.gradient_background ?? false;

      // rounding
      this.mainRoundStyle = this.config.round;
      this.mainRound =
        this.mainRoundStyle !== undefined && this.mainRoundStyle !== "off";

      // inner
      this.hasInnerGauge =
        this.config.inner != null && typeof this.config.inner === "object";

      // actions
      this.hasCardAction = hasAction(this.config.tap_action);
      this.hasPrimaryValueTextAction = hasAction(
        this.config.primary_value_text_tap_action
      );
      this.hasSecondaryValueTextAction = hasAction(
        this.config.secondary_value_text_tap_action
      );
      this.hasIconLeftAction = hasAction(this.config?.icon_left_tap_action);
      this.hasIconRightAction = hasAction(this.config?.icon_right_tap_action);

      if (this.mainRound) {
        this.mainMaskUrl = "url(#main-rounding)";

        this.mainMask =
          this.mainRoundStyle === "full"
            ? MAIN_GAUGE_MASK_FULL
            : this.mainRoundStyle === "medium"
              ? MAIN_GAUGE_MASK_MEDIUM
              : MAIN_GAUGE_MASK_SMALL;
      }

      if (this.hasInnerGauge) {
        this.hasInnerGradient = this.config.inner?.gradient ?? false;
        this.innerGradientResolution = this.hasInnerGradient
          ? (this.config.inner!.gradient_resolution ??
            DEFAULT_GRADIENT_RESOLUTION)
          : undefined;
        this.hasInnerGradientBackground =
          this.config.inner?.gradient_background ?? false;
        this.innerMode = this.config.inner?.mode ?? "severity";

        // rounding
        this.innerRoundStyle = this.config.inner!.round;
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
    }
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

  private _handleCardAction(ev: ActionHandlerEvent) {
    handleAction(this, this.hass!, this.config!, ev.detail.action!);
  }

  private _handlePrimaryValueTextAction(ev: CustomEvent) {
    ev.stopPropagation();
    const config = {
      entity: this.config!.entity,
      tap_action: this.config!.primary_value_text_tap_action,
      hold_action: this.config!.primary_value_text_hold_action,
      double_tap_action: this.config!.primary_value_text_double_tap_action,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
  }

  private _handleSecondaryValueTextAction(ev: CustomEvent) {
    ev.stopPropagation();
    const config = {
      entity: this.config!.entity2,
      tap_action: this.config!.secondary_value_text_tap_action,
      hold_action: this.config!.secondary_value_text_hold_action,
      double_tap_action: this.config!.secondary_value_text_double_tap_action,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
  }

  private _handleIconAction(side: "left" | "right", ev: CustomEvent) {
    ev.stopPropagation();
    const config = {
      entity:
        this.config!.icons?.[side]?.type === "battery"
          ? this.config!.icons[side].value
          : undefined,
      tap_action:
        side === "left"
          ? this.config!.icon_left_tap_action
          : this.config!.icon_right_tap_action,
      hold_action:
        side === "left"
          ? this.config!.icon_left_hold_action
          : this.config!.icon_right_hold_action,
      double_tap_action:
        side === "left"
          ? this.config!.icon_left_double_tap_action
          : this.config!.icon_right_double_tap_action,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
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

  //-----------------------------------------------------------------------------
  // BACKGROUND
  //-----------------------------------------------------------------------------

  private getSegments(gauge: Gauge, min: number, max: number) {
    return _getSegments(this.log, this.getValue, gauge, min, max);
  }

  private getConicGradientString(
    gauge: Gauge,
    min: number,
    max: number,
    opacity: number | undefined
  ) {
    return _getConicGradientString(
      this.log,
      this.getValue,
      gauge,
      min,
      max,
      true,
      opacity
    );
  }

  private getGradientSegments(gauge: Gauge, min: number, max: number) {
    return _getGradientSegments(this.log, this.getValue, gauge, min, max, true);
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

  private getMinMaxIndicatorSetpoint(
    gauge: Gauge,
    element: "min_indicator" | "max_indicator" | "setpoint"
  ):
    | undefined
    | { value: number; color: string | undefined; label: boolean | undefined } {
    const isMain = gauge === "main";
    const type = getValueFromPath(
      this.config,
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
        this.config,
        `${isMain ? "" : "inner."}${element}.value`
      );

      if (typeof configValue !== "string") return undefined;

      const stateObj = this.hass?.states[configValue];
      if (!stateObj) return undefined;

      value = NumberUtils.tryToNumber(stateObj.state);
    } else if (type === "number") {
      const configValue = getValueFromPath(
        this.config,
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
      label = this.config?.[element]?.label ?? false;
    }

    return value === undefined ? undefined : { value, color, label };
  }

  private getIcon(side: "left" | "right"):
    | undefined
    | {
        icon: string;
        color: string | undefined;
        label: string | undefined;
      } {
    if (!this.config?.icons?.[side]) return;
    const type = this.config.icons[side].type;

    const value = this.getValue(`icons.${side}.value`);
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
        label: value["label"] ?? "",
      };
    }

    switch (type) {
      case "battery": {
        const batteryStateObj = this.hass?.states[value];
        if (!batteryStateObj) return;

        const level = batteryStateObj.state;
        const threshold = NumberUtils.tryToNumber(
          this.config.icons[side].threshold
        );

        if (
          threshold !== undefined &&
          NumberUtils.isNumeric(level) &&
          Number(level) >= threshold
        )
          return;

        const state_entity = this.config.icons[side].state;
        const isCharging =
          state_entity != undefined &&
          ["charging", "on"].includes(
            this.hass?.states[state_entity]?.state ?? ""
          );
        const icon = batteryLevelIcon(level, isCharging);
        const color = `var(${batteryStateColorProperty(level)})`;

        let label = "";
        const hide_label = this.config.icons[side].hide_label;

        if (hide_label !== true) {
          label = NumberUtils.isNumeric(level)
            ? `${Math.round(Number(level))}${blankBeforePercent(this.hass!.locale)}%`
            : level;
        }

        return { icon: icon, color: color, label: label };
      }
      case "hvac-mode": {
        const hvacModeEntity = value ?? this.config.feature_entity;
        const hvacModeStateObj = <ClimateEntity>(
          this.hass?.states[hvacModeEntity]
        );
        if (!hvacModeStateObj) return;

        const hvacMode = <HvacMode>hvacModeStateObj.state;
        const icon = getHvacModeIcon(hvacMode);
        const color = getHvacModeColor(hvacMode);

        let label = "";
        const hide_label = this.config.icons[side].hide_label;
        if (hide_label !== true) {
          label = localize(this.hass!, `hvac_mode_titles.${hvacMode}`);
        }

        return { icon: icon, color: color, label: label };
      }
      case "swing-mode": {
        const swingModeEntity = value ?? this.config.feature_entity;
        const swingModeStateObj = <ClimateEntity>(
          this.hass?.states[swingModeEntity]
        );
        if (!swingModeStateObj) return;

        const swingMode = swingModeStateObj.attributes.swing_mode;
        if (!swingMode) return;
        const icon = getSwingModeIcon(swingMode);
        const color = getSwingModeIcon(swingMode);

        let label = "";
        const hide_label = this.config.icons[side].hide_label;
        if (hide_label !== true) {
          const translationKey = `card.swing_modes.${swingMode.toLowerCase()}`
          label = localize(this.hass, translationKey)
          if (label === translationKey) label = swingMode
        }

        return { icon: icon, color: color, label: label };
      }
      default:
        return;
    }
  }

  private getValidatedSvgPath(key: TemplateKey): string | undefined {
    const path = this.getValue(key);
    return path === "" || isValidSvgPath(path) ? path : undefined;
  }

  //-----------------------------------------------------------------------------
  // VALUE
  //-----------------------------------------------------------------------------

  private computeSeverity(
    gauge: Gauge,
    min: number,
    max: number,
    value: number
  ) {
    return _computeSeverity(
      this.log,
      this.getValue,
      this.config,
      gauge,
      min,
      max,
      value
    );
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
      ? (this.config?.value_texts?.primary_unit_before_value ?? false)
      : (this.config?.value_texts?.secondary_unit_before_value ?? false);
    const entity = isMain ? this.config?.entity : this.config?.entity2;

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

  protected render(): TemplateResult {
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

    this.mainGradientSegments =
      (this.hasMainNeedle && this.hasMainGradient) ||
      (!this.hasMainNeedle && this.hasMainGradientBackground)
        ? this.getGradientSegments("main", this.mainMin, this.mainMax)
        : undefined;

    const primaryValueAndValueText = this.getValueAndValueText(
      "main",
      this.mainMin
    );
    this.mainValue = primaryValueAndValueText.value;

    const mainSeverityGaugeColor = !this.hasMainNeedle
      ? this.computeSeverity("main", this.mainMin, this.mainMax, this.mainValue)
      : undefined;

    const hasMainSeverityGaugeMarker = !this.hasMainNeedle
      ? (this.config.marker ?? false)
      : undefined;

    const mainSegments =
      this.hasMainNeedle && !this.hasMainGradient
        ? this.getSegments("main", this.mainMin, this.mainMax)
        : undefined;

    const mainGradientBackgroundOpacity =
      !this.hasMainNeedle && this.hasMainGradientBackground
        ? (this.config.gradient_background_opacity ??
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
          this.config.min_indicator?.opacity ??
          DEFAULT_MIN_MAX_INDICATOR_OPACITY;
      }
      this.hasMainMinIndicatorLabel = mainMinIndicator!.label!;
      if (this.hasMainMinIndicatorLabel) {
        mainMinIndicatorLabel = this.mainMinIndicatorValue!;
        mainMinIndicatorLabelColor = this.getLightDarkModeColor(
          "min_indicator.label_color",
          DEFAULT_MIN_INDICATOR_LABEL_COLOR
        );
        const precision = this.config.min_indicator?.precision;
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
          this.config.max_indicator?.opacity ??
          DEFAULT_MIN_MAX_INDICATOR_OPACITY;
      }

      this.hasMainMaxIndicatorLabel = mainMaxIndicator!.label!;
      if (this.hasMainMaxIndicatorLabel) {
        mainMaxIndicatorLabel = this.mainMaxIndicatorValue!;
        mainMaxIndicatorLabelColor = this.getLightDarkModeColor(
          "max_indicator.label_color",
          DEFAULT_MAX_INDICATOR_LABEL_COLOR
        );
        const precision = this.config.max_indicator?.precision;
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

      const precision = this.config.setpoint?.precision;
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
          ? (this.config.inner!.marker ?? false)
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
          ? (this.config.inner!.gradient_background_opacity ??
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
          this.config.inner!.min_indicator?.opacity ??
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
          this.config.inner!.max_indicator?.opacity ??
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
    // ICON
    //-----------------------------------------------------------------------------
    const iconLeft = this.getIcon("left");
    let iconLeftIcon: string | undefined;
    let iconLeftColor: string | undefined;
    if (iconLeft) {
      iconLeftIcon = iconLeft.icon;
      iconLeftColor = iconLeft.color;
      this.iconLeftLabel = iconLeft.label ?? "";
    }

    const iconRight = this.getIcon("right");
    let iconRightIcon: string | undefined;
    let iconRightColor: string | undefined;
    if (iconRight) {
      iconRightIcon = iconRight.icon;
      iconRightColor = iconRight.color;
      this.iconRightLabel = iconRight.label ?? "";
    }

    return html`
      <div
        style=${styleMap({
          position: "relative",
        })}
        @action=${this._handleCardAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this.config.hold_action),
          hasDoubleClick: hasAction(this.config.double_tap_action),
        })}
        role=${ifDefined(this.hasCardAction ? "button" : undefined)}
        tabindex=${ifDefined(this.hasCardAction ? "0" : undefined)}
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
                      <g
                        class="slow-transition"
                        id="main-min-indicator-label-group" 
                        transform="rotate(${this._min_indicator_angle - 5} 0 0)"
                        >
                        <path
                          id="main-min-indicator-label-path"
                          d="${
                            this.hasInnerGauge
                              ? MAIN_GAUGE_MIN_MAX_INDICATOR_LABEL_TEXTPATH_WITH_INNER
                              : MAIN_GAUGE_MIN_MAX_INDICATOR_LABEL_TEXTPATH
                          }"
                          style=${styleMap({
                            fill: "none",
                          })}>
                      
                        > </path>

                        <text
                          class="label-text"
                          id="main-min-indicator-label"
                          style=${styleMap({
                            fill: mainMinIndicatorLabelColor,
                            "text-anchor": "end",
                          })}
                          dominant-baseline="middle"
                        >
                          <textPath
                            xlink:href="#main-min-indicator-label-path"
                            startOffset="100%"
                          >
                            ${mainMinIndicatorLabel}
                          </textPath>
                        </text>
                      </g>`
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
                      <g
                        class="slow-transition"
                        id="main-max-indicator-label-group" 
                        transform="rotate(${-this._max_indicator_angle + 5} 0 0)"
                        >
                        <path
                          id="main-max-indicator-label-path"
                          d="${
                            this.hasInnerGauge
                              ? MAIN_GAUGE_MIN_MAX_INDICATOR_LABEL_TEXTPATH_WITH_INNER
                              : MAIN_GAUGE_MIN_MAX_INDICATOR_LABEL_TEXTPATH
                          }"
                          style=${styleMap({
                            fill: "none",
                          })}>
                      
                        > </path>

                        <text
                          class="label-text"
                          id="main-max-indicator-label"
                          style=${styleMap({
                            fill: mainMaxIndicatorLabelColor,
                          })}
                          dominant-baseline="middle"
                        >
                          <textPath
                            xlink:href="#main-max-indicator-label-path"
                            startOffset="0%"
                          >
                            ${mainMaxIndicatorLabel}
                          </textPath>
                        </text>
                      </g>`
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
                .actionHandler=${actionHandler({
                  hasHold: hasAction(
                    this.config!.primary_value_text_hold_action
                  ),
                  hasDoubleClick: hasAction(
                    this.config!.primary_value_text_double_tap_action
                  ),
                })}
                @click=${(ev: CustomEvent) =>
                  this.hasPrimaryValueTextAction
                    ? ev.stopPropagation()
                    : nothing}
                @touchend=${(ev: CustomEvent) =>
                  this.hasPrimaryValueTextAction
                    ? ev.stopPropagation()
                    : nothing}
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
                .actionHandler=${actionHandler({
                  hasHold: hasAction(
                    this.config!.secondary_value_text_hold_action
                  ),
                  hasDoubleClick: hasAction(
                    this.config!.secondary_value_text_double_tap_action
                  ),
                })}
                @click=${(ev: CustomEvent) =>
                  this.hasSecondaryValueTextAction
                    ? ev.stopPropagation()
                    : nothing}
                @touchend=${(ev: CustomEvent) =>
                  this.hasSecondaryValueTextAction
                    ? ev.stopPropagation()
                    : nothing}
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
        ${iconLeftIcon || iconRightIcon
          ? html`
              <div class="icon-container">
                <div class="icon-inner-container icon-left">
                  ${iconLeftIcon
                    ? html` <ha-state-icon
                          class="icon icon-left"
                          .hass=${this.hass}
                          .icon=${iconLeftIcon}
                          role=${ifDefined(
                            this.hasIconLeftAction ? "button" : undefined
                          )}
                          tabindex=${ifDefined(
                            this.hasIconLeftAction ? "0" : undefined
                          )}
                          style=${styleMap({ color: iconLeftColor })}
                          @action=${(ev: CustomEvent) =>
                            this.hasIconLeftAction
                              ? this._handleIconAction("left", ev)
                              : nothing}
                          .actionHandler=${actionHandler({
                            hasHold: hasAction(
                              this.config!.icon_left_hold_action
                            ),
                            hasDoubleClick: hasAction(
                              this.config!.icon_left_double_tap_action
                            ),
                          })}
                          @click=${(ev: CustomEvent) =>
                            this.hasIconLeftAction
                              ? ev.stopPropagation()
                              : nothing}
                          @touchend=${(ev: CustomEvent) =>
                            this.hasIconLeftAction
                              ? ev.stopPropagation()
                              : nothing}
                        ></ha-state-icon>

                        <svg class="icon-label-text" id="icon-left-label">
                          <text
                            class="value-text"
                            style=${styleMap({
                              fill: "var(--primary-text-color)",
                            })}
                          >
                            ${this.iconLeftLabel}
                          </text>
                        </svg>`
                    : nothing}
                </div>
                <div class="icon-inner-container icon-right">
                  ${iconRightIcon
                    ? html` <ha-state-icon
                          class="icon icon-right"
                          .hass=${this.hass}
                          .icon=${iconRightIcon}
                          role=${ifDefined(
                            this.hasIconRightAction ? "button" : undefined
                          )}
                          tabindex=${ifDefined(
                            this.hasIconRightAction ? "0" : undefined
                          )}
                          style=${styleMap({ color: iconRightColor })}
                          @action=${(ev: CustomEvent) =>
                            this.hasIconRightAction
                              ? this._handleIconAction("right", ev)
                              : nothing}
                          .actionHandler=${actionHandler({
                            hasHold: hasAction(
                              this.config!.icon_right_hold_action
                            ),
                            hasDoubleClick: hasAction(
                              this.config!.icon_right_double_tap_action
                            ),
                          })}
                          @click=${(ev: CustomEvent) =>
                            this.hasIconRightAction
                              ? ev.stopPropagation()
                              : nothing}
                          @touchend=${(ev: CustomEvent) =>
                            this.hasIconRightAction
                              ? ev.stopPropagation()
                              : nothing}
                        ></ha-state-icon>

                        <svg class="icon-label-text" id="icon-right-label">
                          >
                          <text
                            class="value-text"
                            style=${styleMap({
                              fill: "var(--primary-text-color)",
                            })}
                          >
                            ${this.iconRightLabel}
                          </text>
                        </svg>`
                    : nothing}
                </div>
              </div>
            `
          : nothing}
      </div>
    `;
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
    if (!this.iconLeftLabel && !this.iconRightLabel) return;

    if (this.iconLeftLabel) {
      const svgRoot = this.shadowRoot!.querySelector("#icon-left-label")!;
      const box = svgRoot.querySelector("text")!.getBBox()!;
      svgRoot.setAttribute(
        "viewBox",
        `${box.x} ${box!.y} ${box.width} ${box.height}`
      );
    }

    if (this.iconRightLabel) {
      const svgRoot = this.shadowRoot!.querySelector("#icon-right-label")!;
      const box = svgRoot.querySelector("text")!.getBBox()!;
      svgRoot.setAttribute(
        "viewBox",
        `${box.x} ${box!.y} ${box.width} ${box.height}`
      );
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

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;
      this._calculate_angles();
      this._rescaleValueTextSvg();
      this._rescaleIconLabelTextSvg();
      this._updateMainSetpointLabel();

      if (this.usesGradientPath("main")) {
        this._mainGaugeGradient.initialize(
          this.renderRoot.querySelector("#main-gradient path"),
          this.config!.gradient_resolution
        );
      }
      if (this.usesGradientPath("inner")) {
        this._innerGaugeGradient.initialize(
          this.renderRoot.querySelector("#inner-gradient path"),
          this.config!.inner!.gradient_resolution
        );
      }
    });
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this.config || !this.hass || !this._updated || !changedProperties)
      return;

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

  static get styles(): CSSResultGroup {
    return [gaugeCSS, gaugeMainCSS, gaugeInnerCSS, gaugeIconCSS];
  }
}
