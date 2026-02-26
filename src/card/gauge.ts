// External dependencies
import {
  css,
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
  computeDomain,
  handleAction,
  hasAction,
  HomeAssistant,
  HvacMode,
  isAvailable,
  UNAVAILABLE,
} from "../dependencies/ha";

// Internalized external dependencies
import { isValidSvgPath } from "../dependencies/is-svg-path/valid-svg-path";
import { computeDarkMode } from "../dependencies/mushroom";

// Local utilities
import { Logger } from "../utils/logger";

import { getAngle } from "../utils/number/get-angle";
import { getValueFromPath } from "../utils/object/get-value";
import {
  formatEntityToLocal,
  formatNumberToLocal,
} from "../utils/number/format-to-locale";
import { NumberUtils } from "../utils/number/numberUtils";
import { localize } from "../utils/localize";
import {
  getFanModeIcon,
  getHvacModeColor,
  getHvacModeIcon,
  getSwingModeIcon,
} from "./utils";

import { DEFAULTS } from "../constants/defaults";
import { MAIN_GAUGE } from "../constants/svg/gauge-main";
import { INNER_GAUGE } from "../constants/svg/gauge-inner";

import { MinMaxIndicator, Setpoint } from "./types";
import {
  GaugeCardProCardConfig,
  GradientResolutions,
  innerGaugeModes,
  SeverityColorModes,
} from "./config";
import { Gauge } from "./types";

import { TemplateKey } from "./card";

// Core functionality
import {
  getSegments as _getSegments,
  getConicGradientString as _getConicGradientString,
  computeSeverity as _computeSeverity,
} from "./_segments";

import { MainGaugeConfigModel, MainGaugeDataModel } from "./main-gauge";
import "./main-gauge";

import { InnerGaugeConfigModel, InnerGaugeViewModel } from "./inner-gauge";
import "./inner-gauge";

import { ValueElementsViewModel } from "./value-elements";
import "./value-elements";

import { IconConfig, IconData } from "./icons";
import "./icons";

const INVALID_ENTITY = "invalid_entity";

@customElement("gauge-card-pro-gauge")
export class GaugeCardProGauge extends LitElement {
  @property({ attribute: false })
  public log!: Logger;

  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public config!: GaugeCardProCardConfig;

  @property({ attribute: false })
  public getValue!: (key: TemplateKey) => any;

  // viewmodels
  @state() private mainConfig?: MainGaugeConfigModel;
  @state() private innerConfig?: InnerGaugeConfigModel;

  @state() private leftIconConfig?: IconConfig;
  @state() private rightIconConfig?: IconConfig;

  @state() private _angle = 0;
  @state() private _min_indicator_angle = 0;
  @state() private _max_indicator_angle = 0;
  @state() private _setpoint_angle = 0;
  @state() private _inner_angle = 0;
  @state() private _inner_min_indicator_angle = 0;
  @state() private _inner_max_indicator_angle = 0;
  @state() private _inner_setpoint_angle = 0;
  @state() private _updated = false;

  // main gauge properties
  private mainValue = 0;
  private mainMin: number = DEFAULTS.values.min;
  private mainMax: number = DEFAULTS.values.max;
  private hasMainNeedle = false;

  // severity mode
  private mainSeverityCentered?: boolean;
  private mainSeverityColorMode?: SeverityColorModes;
  private hasMainGradientBackground?: boolean;

  // needle mode
  private hasMainGradient?: boolean;
  private mainGradientResolution?: string | number;

  private hasMainMinIndicator = false;
  private mainMinIndicatorValue?: number;

  private hasMainMaxIndicator = false;
  private mainMaxIndicatorValue?: number;

  private hasMainSetpoint = false;
  private mainSetpointValue?: number;

  // inner gauge properties
  private hasInnerGauge = false;

  private innerValue?: number;
  private innerMin?: number;
  private innerMax?: number;

  private innerMode?: innerGaugeModes;

  // severity mode
  private innerSeverityCentered?: boolean;
  private innerSeverityColorMode?: SeverityColorModes;

  // needle mode
  private hasInnerGradient?: boolean;
  private innerGradientResolution?: string | number;
  private hasInnerGradientBackground?: boolean;

  private hasInnerMaxIndicator?: boolean;
  private innerMaxIndicatorValue?: number;

  private hasInnerMinIndicator?: boolean;
  private innerMinIndicatorValue?: number;

  private hasInnerSetpoint?: boolean;
  private innerSetpointValue?: number;

  // scalable svg labels
  @state() private primaryValueText = "";
  @state() private secondaryValueText = "";
  @state() private iconLeftLabel = "";
  @state() private iconRightLabel = "";

  // actions
  private hasCardAction = false;
  private hasIconLeftAction = false;
  private hasIconRightAction = false;

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("config")) {
      this.hasMainNeedle = this.config.needle ?? false;

      // severity mode
      if (!this.hasMainNeedle) {
        // undefine needle variables
        this.hasMainGradient = undefined;

        this.mainSeverityColorMode =
          this.config.severity_color_mode ?? DEFAULTS.severity.colorMode;
        this.mainSeverityCentered = this.config.severity_centered ?? false;
        this.hasMainGradientBackground =
          this.config.gradient_background ?? false;
      }

      if (this.hasMainNeedle) {
        // undefine severity variables
        this.mainSeverityColorMode = undefined;
        this.mainSeverityCentered = undefined;
        this.hasMainGradientBackground = undefined;

        this.hasMainGradient = this.config.gradient ?? false;
      }

      // above are conditional for usesGradient()
      this.mainGradientResolution = this.usesGradientBackground("main")
        ? (this.config.gradient_resolution ?? DEFAULTS.gradient.resolution)
        : undefined;

      // inner
      this.hasInnerGauge =
        this.config.inner != null && typeof this.config.inner === "object";

      if (this.hasInnerGauge) {
        this.innerMode = this.config.inner!.mode ?? "severity";

        if (this.innerMode === "severity") {
          // undefine needle variables
          this.hasInnerGradient = undefined;

          this.innerSeverityColorMode =
            this.config.inner!.severity_color_mode ??
            DEFAULTS.severity.colorMode;
          this.innerSeverityCentered =
            this.config.inner!.severity_centered ?? false;
          this.hasInnerGradientBackground =
            this.config.inner!.gradient_background ?? false;
        } else {
          // undefine severity variables
          this.innerSeverityColorMode = undefined;
          this.innerSeverityCentered = undefined;
          this.hasInnerGradientBackground = undefined;

          this.hasInnerGradient = this.config.inner!.gradient ?? false;
        }

        // above are conditional for usesGradient()
        this.innerGradientResolution = this.usesGradientBackground("inner")
          ? (this.config.inner!.gradient_resolution ??
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

      // actions
      this.hasCardAction = hasAction(this.config.tap_action);

      // build viewmodels
      this.mainConfig = {
        mode: !this.hasMainNeedle
          ? "severity"
          : this.hasMainGradient
            ? "gradient-arc"
            : "flat-arc",
        round: this.config.round,
      };

      this.mainConfig!.severity = !this.hasMainNeedle
        ? {
            mode: this.mainSeverityColorMode!,
            fromCenter: this.mainSeverityCentered!,
            withGradientBackground: this.hasMainGradientBackground!,
          }
        : undefined;

      if (this.hasInnerGauge) {
        this.innerConfig = {
          mode:
            this.innerMode === "severity"
              ? "severity"
              : this.hasInnerGradient
                ? "gradient-arc"
                : "flat-arc",
          round: this.config.inner?.round,
        };

        this.innerConfig.severity =
          this.innerMode === "severity"
            ? {
                mode: this.innerSeverityColorMode!,
                fromCenter: this.innerSeverityCentered!,
                withGradientBackground: this.hasInnerGradientBackground!,
              }
            : undefined;
      } else {
        this.innerConfig = undefined;
      }

      if (this.config.icons?.left) {
        const type = this.config.icons.left.type;
        const defaultActionEntity = this.config.entity;
        const tapAction = this.config!.icon_left_tap_action;
        const holdAction = this.config!.icon_left_hold_action;
        const doubleTapAction = this.config!.icon_left_double_tap_action;

        switch (type) {
          case "battery": {
            this.leftIconConfig = {
              actionEntity: this.config.icons.left.value ?? defaultActionEntity,
              tapAction: tapAction,
              holdAction: holdAction,
              doubleTapAction: doubleTapAction,
            };
            break;
          }
          case "fan-mode":
          case "swing-mode":
          case "hvac-mode": {
            this.leftIconConfig = {
              actionEntity: this.config.feature_entity ?? defaultActionEntity,
              tapAction: tapAction,
              holdAction: holdAction,
              doubleTapAction: doubleTapAction,
            };
            break;
          }
          case "template": {
            this.leftIconConfig = {
              actionEntity: defaultActionEntity,
              tapAction: tapAction,
              holdAction: holdAction,
              doubleTapAction: doubleTapAction,
            };
            break;
          }
        }
      }

      if (this.config.icons?.right) {
        const type = this.config.icons.right.type;
        const defaultActionEntity = this.config.entity;
        const tapAction = this.config!.icon_right_tap_action;
        const holdAction = this.config!.icon_right_hold_action;
        const doubleTapAction = this.config!.icon_right_double_tap_action;

        switch (type) {
          case "battery": {
            this.rightIconConfig = {
              actionEntity:
                this.config.icons.right.value ?? defaultActionEntity,
              tapAction: tapAction,
              holdAction: holdAction,
              doubleTapAction: doubleTapAction,
            };
            break;
          }
          case "fan-mode":
          case "swing-mode":
          case "hvac-mode": {
            this.rightIconConfig = {
              actionEntity: this.config.feature_entity ?? defaultActionEntity,
              tapAction: tapAction,
              holdAction: holdAction,
              doubleTapAction: doubleTapAction,
            };
            break;
          }
          case "template": {
            this.rightIconConfig = {
              actionEntity: defaultActionEntity,
              tapAction: tapAction,
              holdAction: holdAction,
              doubleTapAction: doubleTapAction,
            };
            break;
          }
        }
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

    if (this.hasMainSetpoint) {
      this._setpoint_angle = getAngle(
        this.mainSetpointValue!,
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

    if (this.hasInnerMinIndicator) {
      this._inner_min_indicator_angle = getAngle(
        this.innerMinIndicatorValue!,
        this.innerMin!,
        this.innerMax!
      );
    }
    if (this.hasInnerMaxIndicator) {
      this._inner_max_indicator_angle =
        180 -
        getAngle(this.innerMaxIndicatorValue!, this.innerMin!, this.innerMax!);
    }

    if (this.hasInnerSetpoint) {
      this._inner_setpoint_angle = getAngle(
        this.innerSetpointValue!,
        this.innerMin!,
        this.innerMax!
      );
    }
  }

  private _handleCardAction(ev: ActionHandlerEvent) {
    handleAction(this, this.hass!, this.config!, ev.detail.action!);
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

  private getLightDarkModeColor(key: TemplateKey): string | undefined {
    const configColor = this.getValue(key);
    if (typeof configColor === "object") {
      const keys = Object.keys(configColor);

      if (keys.includes("light_mode") && keys.includes("dark_mode")) {
        return computeDarkMode(this.hass)
          ? configColor["dark_mode"]
          : configColor["light_mode"];
      }
      return;
    }

    return configColor;
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
    resolution: GradientResolutions = DEFAULTS.gradient.resolution,
    opacity?: number
  ) {
    return _getConicGradientString(
      this.log,
      this.getValue,
      gauge,
      min,
      max,
      true,
      resolution,
      opacity
    );
  }

  /**
   * For main uses:
   * - this.hasMainNeedle
   * - this.hasMainGradient
   * - this.hasMainGradientBackground
   *
   * For inner uses:
   * - this.innerMode
   * - this.hasInnerGradient
   * - this.hasInnerGradientBackground
   */
  private usesGradientBackground(gauge: Gauge): boolean {
    if (gauge === "main") {
      // don't check for 'this.config.segments == null'
      // a default segment will be returned

      return (
        (this.hasMainNeedle
          ? this.hasMainGradient
          : this.hasMainGradientBackground) ?? false
      );
    }
    // don't check for 'this.config.inner?.segments == null'
    // a default segment will be returned

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

  //-----------------------------------------------------------------------------
  // SEVERITY ARC
  //-----------------------------------------------------------------------------

  private getSeverityGradientClippath(gauge: Gauge): string {
    const angle = gauge === "main" ? this._angle : this._inner_angle;
    const centered =
      gauge === "main"
        ? this.config.severity_centered
        : this.config.inner?.severity_centered;

    const clamped = Math.max(0, Math.min(180, angle));
    const t = Math.PI - (clamped * Math.PI) / 180;

    const xOut = +(50 * Math.cos(t)).toFixed(3);
    const yOut = +(-50 * Math.sin(t)).toFixed(3);

    if (centered && angle == 90) {
      return "";
    } else if (centered) {
      const sweep = angle <= 90 ? 0 : 1;
      return [
        `M 0 0`,
        `L 0 -50`,
        `A 50 50 0 0 ${sweep} ${xOut} ${yOut}`,
        `L 0 0`,
        `Z`,
      ].join(" ");
    } else {
      return [
        `M 0 0`,
        `L -50 0`,
        `A 50 50 0 0 1 ${xOut} ${yOut}`,
        `L 0 0`,
        `Z`,
      ].join(" ");
    }
  }

  private getMinMaxIndicator(
    gauge: Gauge,
    element: "min_indicator" | "max_indicator"
  ): undefined | { value: number; opts: MinMaxIndicator } {
    let minMaxIndicator = this.getMinMaxIndicatorSetpoint(gauge, element);
    if (!minMaxIndicator) return;
    const isMain = gauge === "main";
    const prefixPath = `${isMain ? "" : "inner."}${element}`;
    const opts = <MinMaxIndicator>minMaxIndicator.opts;

    const opacity = getValueFromPath(this.config, `${prefixPath}.opacity`);
    opts.opacity = opacity;

    return minMaxIndicator;
  }

  private getSetpoint(
    gauge: Gauge
  ): undefined | { value: number; opts: Setpoint } {
    const setpoint = this.getMinMaxIndicatorSetpoint(gauge, "setpoint");
    if (!setpoint) return;

    return setpoint;
  }

  private getMinMaxIndicatorSetpoint(
    gauge: Gauge,
    element: "min_indicator" | "max_indicator" | "setpoint"
  ): undefined | { value: number; opts: MinMaxIndicator | Setpoint } {
    const isMain = gauge === "main";
    const prefixPath = `${isMain ? "" : "inner."}${element}`;

    const type = getValueFromPath(this.config, `${prefixPath}.type`);
    if (type === undefined) return undefined;

    const angle = isMain
      ? element === "min_indicator"
        ? this._min_indicator_angle
        : element === "max_indicator"
          ? this._max_indicator_angle
          : this._setpoint_angle
      : element === "min_indicator"
        ? this._inner_min_indicator_angle
        : element === "max_indicator"
          ? this._inner_max_indicator_angle
          : this._inner_setpoint_angle;

    const colorKey: TemplateKey = <TemplateKey>`${prefixPath}.color`;
    const color = this.getLightDarkModeColor(colorKey);

    let value: number | undefined;
    if (type === "attribute") {
      const entity = isMain ? this.config?.entity : this.config?.entity2;
      if (!entity) return undefined;

      const configValue = getValueFromPath(this.config, `${prefixPath}.value`);
      if (typeof configValue !== "string") return undefined;

      const stateObj = this.hass?.states[entity];
      if (!stateObj) return undefined;

      value = NumberUtils.tryToNumber(stateObj.attributes[configValue]);
    } else if (type === "entity") {
      const configValue = getValueFromPath(this.config, `${prefixPath}.value`);

      if (typeof configValue !== "string") return undefined;

      const stateObj = this.hass?.states[configValue];
      if (!stateObj) return undefined;

      value = NumberUtils.tryToNumber(stateObj.state);
    } else if (type === "number") {
      const configValue = getValueFromPath(this.config, `${prefixPath}.value`);
      value = NumberUtils.tryToNumber(configValue);
    } else if (type === "template") {
      value = NumberUtils.tryToNumber(
        isMain
          ? this.getValue(<TemplateKey>`${element}.value`)
          : this.getValue(<TemplateKey>`inner.${element}.value`)
      );
    }

    if (!value) return;

    const shapeElement = element === "setpoint" ? "setpoint_needle" : element;
    const customShape = this.getValidatedSvgPath(
      `shapes.${gauge}_${shapeElement}`
    );

    let opts: MinMaxIndicator | Setpoint = {
      angle: angle,
      color: color,
      customShape: customShape,
    };

    if (isMain) {
      const hasLabel = this.config?.[element]?.label ?? false;
      if (hasLabel) {
        const precision = getValueFromPath(
          this.config,
          `${prefixPath}.precision`
        );
        if (precision !== undefined) {
          const factor = 10 ** precision;
          value = Math.round(value * factor) / factor;
        }
        const text = formatNumberToLocal(this.hass, value);

        const color = this.getLightDarkModeColor(
          getValueFromPath(this.config, `${prefixPath}.label_color`)
        );

        opts.label = {
          text: text!,
          color: color,
          hasInner: this.hasInnerGauge,
        };
      }
    }

    return { value: value, opts: opts };
  }

  private getIconData(side: "left" | "right"): IconData | undefined {
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
        color: value["color"] ?? DEFAULTS.ui.iconColor,
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

        return {
          icon: icon,
          color: color,
          label: label,
        };
      }
      case "fan-mode": {
        const fanModeEntity = value ?? this.config.feature_entity;
        if (!fanModeEntity || computeDomain(fanModeEntity) !== "climate")
          return;

        const fanModeStateObj = <ClimateEntity>this.hass?.states[fanModeEntity];
        if (!fanModeStateObj) return;

        const fanMode = fanModeStateObj.attributes.fan_mode;
        if (!fanMode) return;
        const icon = getFanModeIcon(fanMode);

        let label = "";
        const hide_label = this.config.icons[side].hide_label;
        if (hide_label !== true) {
          const translationKey = `features.fan_modes.${fanMode.toLowerCase()}`;
          label = localize(this.hass, translationKey);
          if (label === translationKey) label = fanMode;
        }

        return {
          icon: icon,
          color: undefined,
          label: label,
        };
      }
      case "hvac-mode": {
        const hvacModeEntity = value ?? this.config.feature_entity;
        if (!hvacModeEntity || computeDomain(hvacModeEntity) !== "climate")
          return;

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
          const translationKey = `features.hvac_modes.${hvacMode.toLowerCase()}`;
          label = localize(this.hass!, translationKey);
          if (label === translationKey) label = hvacMode;
        }

        return {
          icon: icon,
          color: color,
          label: label,
        };
      }
      case "swing-mode": {
        const swingModeEntity = value ?? this.config.feature_entity;
        if (!swingModeEntity || computeDomain(swingModeEntity) !== "climate")
          return;

        const swingModeStateObj = <ClimateEntity>(
          this.hass?.states[swingModeEntity]
        );
        if (!swingModeStateObj) return;

        const swingMode = swingModeStateObj.attributes.swing_mode;
        if (!swingMode) return;
        const icon = getSwingModeIcon(swingMode);

        let label = "";
        const hide_label = this.config.icons[side].hide_label;
        if (hide_label !== true) {
          const translationKey = `features.swing_modes.${swingMode.toLowerCase()}`;
          label = localize(this.hass, translationKey);
          if (label === translationKey) label = swingMode;
        }

        return {
          icon: icon,
          color: undefined,
          label: label,
        };
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
      this.getValue,
      severity_color_mode,
      gauge,
      min,
      max,
      value,
      clamp_min
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
    const attribute = isMain
      ? this.config?.attribute
      : this.config?.inner?.attribute;

    const templateValue = this.getValue(valueKey);
    const templateValueText = this.getValue(valueTextKey);

    let valueText: string | undefined = undefined;
    let stateObj;
    if (entity !== undefined) stateObj = this.hass!.states[entity];

    let value =
      NumberUtils.tryToNumber(templateValue) ??
      (attribute !== undefined
        ? NumberUtils.tryToNumber(stateObj?.attributes[attribute])
        : NumberUtils.tryToNumber(stateObj?.state));

    if (value === undefined) {
      if (entity && !stateObj) {
        return { value: defaultValue, valueText: INVALID_ENTITY };
      } else if (stateObj && !isAvailable(stateObj)) {
        return { value: defaultValue, valueText: UNAVAILABLE };
      } else {
        value = defaultValue;
      }
    }

    // Allow empty string to overwrite value_text
    if (templateValueText === "") {
      return { value: value, valueText: "" };
    } else if (templateValueText !== undefined) {
      if (NumberUtils.isNumeric(templateValueText)) {
        valueText = formatNumberToLocal(this.hass!, templateValueText) ?? "";
      } else {
        return { value: value, valueText: templateValueText };
      }
    } else if (attribute) {
      valueText = formatNumberToLocal(this.hass!, value) ?? "";
    } else {
      valueText = formatEntityToLocal(this.hass!, entity!) ?? "";
    }

    const _unit = this.getValue(unitKey);
    let unit =
      _unit === ""
        ? ""
        : _unit ||
          (attribute ? "" : stateObj?.attributes?.unit_of_measurement) ||
          "";

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
      DEFAULTS.values.min
    );
    this.mainMax = NumberUtils.toNumberOrDefault(
      this.getValue("max"),
      DEFAULTS.values.max
    );

    const primaryValueAndValueText = this.getValueAndValueText(
      "main",
      this.mainMin
    );
    this.mainValue = primaryValueAndValueText.value;

    const mainGradientResolution = NumberUtils.isNumeric(
      this.mainGradientResolution
    )
      ? this.mainGradientResolution
      : DEFAULTS.gradient.resolution;

    const mainGradientBackgroundOpacity =
      !this.hasMainNeedle && this.hasMainGradientBackground
        ? (this.config.gradient_background_opacity ??
          DEFAULTS.gradient.backgroundOpacity)
        : undefined;

    const _mainMinIndicator = this.getMinMaxIndicator("main", "min_indicator");
    this.hasMainMinIndicator = _mainMinIndicator !== undefined;
    this.mainMinIndicatorValue = _mainMinIndicator?.value;
    const mainMinIndicatorOpts = _mainMinIndicator?.opts;

    const _mainMaxIndicator = this.getMinMaxIndicator("main", "max_indicator");
    this.hasMainMaxIndicator = _mainMaxIndicator !== undefined;
    this.mainMaxIndicatorValue = _mainMaxIndicator?.value;
    const mainMaxIndicatorOpts = _mainMaxIndicator?.opts;

    const _mainSetpoint = this.getSetpoint("main");
    this.hasMainSetpoint = _mainSetpoint !== undefined;
    this.mainSetpointValue = _mainSetpoint?.value;
    const mainSetpointOpts = _mainSetpoint?.opts;

    // secondary
    let secondaryValueAndValueText;
    const secondaryValueTextColor = this.getLightDarkModeColor(
      "value_texts.secondary_color"
    );

    //-----------------------------------------------------------------------------
    // INNER GAUGE
    //-----------------------------------------------------------------------------
    let innerVM: InnerGaugeViewModel;

    let innerGradientBackgroundOpacity: number | undefined;
    let innerSetpointOpts: Setpoint | undefined;

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

      const innerGradientResolution = NumberUtils.isNumeric(
        this.innerGradientResolution
      )
        ? this.innerGradientResolution
        : DEFAULTS.gradient.resolution;

      innerGradientBackgroundOpacity =
        this.innerMode === "severity" && this.hasInnerGradientBackground
          ? (this.config.inner!.gradient_background_opacity ??
            DEFAULTS.gradient.backgroundOpacity)
          : undefined;

      const _innerMinIndicator = this.getMinMaxIndicator(
        "inner",
        "min_indicator"
      );
      this.hasInnerMinIndicator = _innerMinIndicator !== undefined;
      this.innerMinIndicatorValue = _innerMinIndicator?.value;
      const innerMinIndicator = _innerMinIndicator?.opts;

      const _innerMaxIndicator = this.getMinMaxIndicator(
        "inner",
        "max_indicator"
      );
      this.hasInnerMaxIndicator = _innerMaxIndicator !== undefined;
      this.innerMaxIndicatorValue = _innerMaxIndicator?.value;
      const innerMaxIndicator = _innerMaxIndicator?.opts;

      const _innerSetpoint = this.getSetpoint("inner");
      this.hasInnerSetpoint = _innerSetpoint !== undefined;
      this.innerSetpointValue = _innerSetpoint?.value;
      innerSetpointOpts = _innerSetpoint?.opts;

      //-----------------------------------------------------------------------------
      // INNER VIEWMODEL
      //-----------------------------------------------------------------------------

      innerVM = {
        data: {
          min: this.innerMin,
          max: this.innerMax,
        },
        gradientBackground: "",
        min_indicator: innerMinIndicator,
        max_indicator: innerMaxIndicator,
        unavailable: [UNAVAILABLE, INVALID_ENTITY].includes(
          this.secondaryValueText
        ),
      };

      if (this.usesGradientBackground("inner")) {
        innerVM.gradientBackground = this.getConicGradientString(
          "inner",
          this.innerMin,
          this.innerMax,
          innerGradientResolution,
          innerGradientBackgroundOpacity
        );
      }

      if (this.innerMode !== "severity" && !this.hasInnerGradient) {
        innerVM.flatSegments = {
          segments: this.getSegments("inner", this.innerMin, this.innerMax),
        };
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
                this.innerValue!
              );
        innerVM.severity = {
          angle: this._inner_angle,
          color: color!,
        };
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
          ? MAIN_GAUGE.needles.withInner
          : MAIN_GAUGE.needles.normal);

      needleColor = this.getLightDarkModeColor("needle_color");
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
            ? INNER_GAUGE.needles.normal
            : INNER_GAUGE.needles.onMain);

        innerNeedleColor = this.getLightDarkModeColor("inner.needle_color");
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
      "value_texts.primary_color"
    );

    // secondary
    this.secondaryValueText = secondaryValueAndValueText.valueText;

    //-----------------------------------------------------------------------------
    // ICON
    //-----------------------------------------------------------------------------
    const leftIcon = this.getIconData("left");
    const rightIcon = this.getIconData("right");

    //-----------------------------------------------------------------------------
    // MAIN VIEWMODEL
    //-----------------------------------------------------------------------------

    let mainData: MainGaugeDataModel = {
      data: {
        min: this.mainMin,
        max: this.mainMax,
      },
      gradientBackground: "",
      min_indicator: mainMinIndicatorOpts,
      max_indicator: mainMaxIndicatorOpts,
      unavailable: [UNAVAILABLE, INVALID_ENTITY].includes(
        this.primaryValueText
      ),
    };

    if (this.usesGradientBackground("main")) {
      mainData.gradientBackground = this.getConicGradientString(
        "main",
        this.mainMin,
        this.mainMax,
        mainGradientResolution,
        mainGradientBackgroundOpacity
      );
    }

    if (this.hasMainNeedle && !this.hasMainGradient) {
      mainData.flatSegments = {
        segments: this.getSegments("main", this.mainMin, this.mainMax),
      };
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

      mainData.severity = {
        angle: this._angle,
        color: color!,
      };
    }

    //-----------------------------------------------------------------------------
    // VALUE ELEMENTS VIEWMODEL
    //-----------------------------------------------------------------------------

    const mainNeedleValueElement = this.hasMainNeedle
      ? {
          angle: this._angle,
          color: this.getLightDarkModeColor("needle_color"),
          shape: this.getValidatedSvgPath("shapes.main_needle"),
          hasInner: this.hasInnerGauge,
        }
      : undefined;

    const innerNeedleValueElement =
      this.hasInnerGauge &&
      this.innerMode &&
      ["needle", "on_main"].includes(this.innerMode)
        ? {
            angle: this._inner_angle,
            color: this.getLightDarkModeColor("inner.needle_color"),
            shape: this.getValidatedSvgPath("shapes.inner_needle"),
            mode: this.innerMode,
          }
        : undefined;

    let innerSetpointValueElement = innerSetpointOpts
      ? {
          mode: this.innerMode!,
          ...innerSetpointOpts,
        }
      : undefined;

    const primaryValueTextValueElement = this.primaryValueText
      ? {
          text: this.primaryValueText,
          color: primaryValueTextColor,
          actionEntity: this.config!.entity,
          tapAction: this.config!.primary_value_text_tap_action,
          holdAction: this.config!.primary_value_text_hold_action,
          doubleTapAction: this.config!.primary_value_text_double_tap_action,
        }
      : undefined;

    const secondaryValueTextValueElement = this.secondaryValueText
      ? {
          text: this.secondaryValueText,
          color: secondaryValueTextColor,
          actionEntity: this.config!.entity1,
          tapAction: this.config!.secondary_value_text_tap_action,
          holdAction: this.config!.secondary_value_text_hold_action,
          doubleTapAction: this.config!.secondary_value_text_double_tap_action,
        }
      : undefined;

    const valueElementsVM: ValueElementsViewModel = {
      mainNeedle: mainNeedleValueElement,
      mainSetpoint: mainSetpointOpts,
      innerNeedle: innerNeedleValueElement,
      innerSetpoint: innerSetpointValueElement,
      primaryValueText: primaryValueTextValueElement,
      secondaryValueText: secondaryValueTextValueElement,
    };

    return html`
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
        <gauge-card-pro-main-gauge .config=${this.mainConfig} .data=${mainData}>
        </gauge-card-pro-main-gauge>
        ${this.hasInnerGauge
          ? html` <gauge-card-pro-inner-gauge
              .config=${this.innerConfig}
              .data=${innerVM!}
            >
            </gauge-card-pro-inner-gauge>`
          : nothing}
        ${this.hasMainNeedle ||
        this.hasMainSetpoint ||
        (this.innerMode && ["needle", "on_main"].includes(this.innerMode)) ||
        this.hasInnerSetpoint ||
        this.primaryValueText ||
        this.secondaryValueText
          ? html`<gauge-card-pro-gauge-value-elements
              .data=${valueElementsVM}
              .hass=${this.hass}
            ></gauge-card-pro-gauge-value-elements>`
          : nothing}
        ${leftIcon || rightIcon
          ? html`<gauge-card-pro-gauge-icons
              .hass=${this.hass}
              .leftConfig=${this.leftIconConfig}
              .leftData=${leftIcon}
              .rightConfig=${this.rightIconConfig}
              .rightData=${rightIcon}
            ></gauge-card-pro-gauge-icons>`
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

  private _rescaleSvgText(
    element: "all" | "icon-left-label" | "icon-right-label" = "all"
  ) {
    const shouldHandle = (key: string) => element === "all" || element === key;

    const setViewBox = (selector: string) => {
      const svgRoot = this.shadowRoot!.querySelector(selector)!;
      const box = svgRoot.querySelector("text")!.getBBox();
      svgRoot.setAttribute(
        "viewBox",
        `${box.x} ${box.y} ${box.width} ${box.height}`
      );
    };

    if (shouldHandle("icon-left-label") && this.iconLeftLabel) {
      setViewBox("#icon-left-label");
    }
    if (shouldHandle("icon-right-label") && this.iconRightLabel) {
      setViewBox("#icon-right-label");
    }
  }

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;
      this._calculate_angles();
      this._rescaleSvgText();
    });
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this.config || !this.hass || !this._updated || !changedProperties)
      return;

    this._calculate_angles();

    if (changedProperties.has("iconLeftLabel")) {
      this._rescaleSvgText("icon-left-label");
    }

    if (changedProperties.has("iconRightLabel")) {
      this._rescaleSvgText("icon-right-label");
    }
  }

  static get styles(): CSSResultGroup {
    return [
      css`
        .gauge {
          position: absolute;
          inset: 0;
        }
        gauge-card-pro-main-gauge,
        gauge-card-pro-inner-gauge,
        gauge-card-pro-value-elements,
        gauge-card-pro-gauge-icons {
          position: absolute;
          inset: 0;
        }
      `,
    ];
  }
}
