// External dependencies
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

// Core HA helpers
import type {
  ActionHandlerEvent,
  ClimateEntity,
  HomeAssistant,
  HvacMode,
} from "../dependencies/ha";
import {
  UNAVAILABLE,
  actionHandler,
  afterNextRender,
  batteryLevelIcon,
  batteryStateColorProperty,
  blankBeforePercent,
  computeDomain,
  handleAction,
  hasAction,
  isAvailable,
} from "../dependencies/ha";

// Internalized external dependencies
import { isValidSvgPath } from "../dependencies/is-svg-path/valid-svg-path";

// Constants
import { DEFAULTS } from "../constants/defaults";

// Local utilities
import { formatEntityToLocal } from "../utils/number/format-to-locale";
import { formatNumberToLocal } from "../utils/number/format-to-locale";
import { getAngle } from "../utils/number/get-angle";
import { localize } from "../utils/localize";
import type { Logger } from "../utils/logger";
import { NumberUtils } from "../utils/number/numberUtils";
import { getValueFromPath } from "../utils/object/get-value";

// Local (card) utilities
import {
  getFanModeIcon,
  getHvacModeColor,
  getHvacModeIcon,
  getPresetModeIcon,
  getSwingModeIcon,
} from "./utils";

// Types
import type { Gauge } from "./types";
import type { MinMaxIndicator, Setpoint } from "./types";
import type {
  GaugeCardProCardConfig,
  GradientResolution,
  SeverityColorMode,
  InnerGaugeMode,
} from "./config";
import type { GetValueFn, TemplateKey } from "./card";

// Core functionality
import {
  computeSeverity as _computeSeverity,
  getConicGradientString as _getConicGradientString,
  getFlatArcConicGradientString as _getFlatArcConicGradientString,
} from "./segments/get-segments";

// Child elements + their types
import type { MainGaugeConfig, MainGaugeData } from "./main-gauge";
import "./main-gauge";

import type { InnerGaugeConfig, InnerGaugeData } from "./inner-gauge";
import "./inner-gauge";

import type {
  InnerGaugeNeedleData,
  InnerGaugeSetpointData,
  MainGaugeNeedleData,
  PrimaryValueTextData,
  ValueElementsConfig,
  ValueElementsData,
  ValueTextData,
} from "./value-elements";
import "./value-elements";

import type { IconConfig, IconData } from "./components/icons";
import "./components/icons";
import { deepEqual } from "../utils/object/deep-equal";

const INVALID_ENTITY = "invalid_entity";

type ValueAndValueText = {
  value: number | undefined;
  valueText: string;
};

type MinMaxIndictorWithValue = {
  value: number;
  opts: MinMaxIndicator;
};

type SetpointWithValue = {
  value: number;
  opts: Setpoint;
};

@customElement("gauge-card-pro-gauge")
export class GaugeCardProGauge extends LitElement {
  @property({ attribute: false })
  public log!: Logger;

  @property({ attribute: false })
  public hass!: HomeAssistant;

  @property({ attribute: false })
  public config!: GaugeCardProCardConfig;

  @property({ attribute: false })
  public getValue!: GetValueFn;

  @property({ attribute: false })
  public getLightDarkModeColor!: (key: TemplateKey) => string;

  private primaryValueAndValueText?: ValueAndValueText;
  private secondaryValueAndValueText?: ValueAndValueText;

  private mainMinIndicator?: MinMaxIndictorWithValue;
  private mainMaxIndicator?: MinMaxIndictorWithValue;

  private mainSetpoint?: SetpointWithValue;

  private innerMinIndicator?: MinMaxIndictorWithValue;
  private innerMaxIndicator?: MinMaxIndictorWithValue;

  private innerSetpoint?: SetpointWithValue;

  // viewmodels
  @state() private mainGaugeConfig?: MainGaugeConfig;
  @state() private mainGaugeData?: MainGaugeData;

  @state() private innerGaugeConfig?: InnerGaugeConfig;
  @state() private innerGaugeData?: InnerGaugeData;

  @state() private valueElementsConfig?: ValueElementsConfig;
  @state() private valueElementsData?: ValueElementsData;

  @state() private leftIconConfig?: IconConfig;
  @state() private leftIconData?: IconData;
  @state() private rightIconConfig?: IconConfig;
  @state() private rightIconData?: IconData;

  @state() private _updated = false;

  private _angle = 0;
  private _min_indicator_angle = 0;
  private _max_indicator_angle = 0;
  private _setpoint_angle = 0;
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

  //=============================================================================
  // LIFECYCLE METHODS
  //=============================================================================

  protected override willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);

    // Determine which upstream properties actually changed
    const configChanged = changedProperties.has("config");
    const hassChanged = changedProperties.has("hass");
    const needsDataUpdate = configChanged || hassChanged;

    if (!needsDataUpdate) return;

    if (configChanged) {
      this.updateConfig(); // your existing config processing
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

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;
      this.computeAgles();
    });
  }

  protected override render(): TemplateResult {
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
    `;
  }

  //=============================================================================
  // EVENT HANDLERS
  //=============================================================================

  private _handleCardAction(ev: ActionHandlerEvent) {
    handleAction(this, this.hass!, this.config!, ev.detail.action!);
  }

  //=============================================================================
  // CONFIG PROCESSING
  //=============================================================================

  private updateConfig() {
    this.hasMainNeedle = this.config.needle ?? false;

    // severity mode
    if (!this.hasMainNeedle) {
      // undefine needle variables
      this.hasMainGradient = undefined;

      this.mainSeverityColorMode =
        this.config.severity_color_mode ?? DEFAULTS.severity.colorMode;
      this.mainSeverityCentered = this.config.severity_centered ?? false;
      this.hasMainGradientBackground = this.config.gradient_background ?? false;
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
          this.config.inner!.severity_color_mode ?? DEFAULTS.severity.colorMode;
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
    this.mainGaugeConfig = {
      mode: !this.hasMainNeedle
        ? "severity"
        : this.hasMainGradient
          ? "gradient-arc"
          : "flat-arc",
      round: this.config.round,
    };

    this.mainGaugeConfig!.severity = !this.hasMainNeedle
      ? {
          mode: this.mainSeverityColorMode!,
          fromCenter: this.mainSeverityCentered!,
          withGradientBackground: this.hasMainGradientBackground!,
        }
      : undefined;

    if (this.hasInnerGauge) {
      this.innerGaugeConfig = {
        mode:
          this.innerMode === "severity"
            ? "severity"
            : this.hasInnerGradient
              ? "gradient-arc"
              : "flat-arc",
        round: this.config.inner?.round,
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

    this.valueElementsConfig = {
      primaryValueText: {
        actionEntity: this.config!.entity,
        tapAction: this.config!.primary_value_text_tap_action,
        holdAction: this.config!.primary_value_text_hold_action,
        doubleTapAction: this.config!.primary_value_text_double_tap_action,
      },
      secondaryValueText: {
        actionEntity: this.config!.entity2,
        tapAction: this.config!.secondary_value_text_tap_action,
        holdAction: this.config!.secondary_value_text_hold_action,
        doubleTapAction: this.config!.secondary_value_text_double_tap_action,
      },
    };

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
        case "hvac-mode":
        case "preset-mode":
        case "swing-mode": {
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
            actionEntity: this.config.icons.right.value ?? defaultActionEntity,
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

  //=============================================================================
  // COMPUTATION PIPELINE (in willUpdate call order)
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
    this.mainValue = this.primaryValueAndValueText?.value ?? this.mainMin;

    this.primaryValueAndValueText = this.getValueAndValueText("main");
    this.secondaryValueAndValueText = this.getValueAndValueText("inner");

    this.mainMinIndicator = this.getMinMaxIndicator("main", "min");
    this.mainMaxIndicator = this.getMinMaxIndicator("main", "max");
    this.mainSetpoint = this.getSetpoint("main");

    if (this.hasInnerGauge) {
      this.innerValue = this.secondaryValueAndValueText?.value ?? this.innerMin;

      this.innerMinIndicator = this.getMinMaxIndicator("inner", "min");
      this.innerMaxIndicator = this.getMinMaxIndicator("inner", "max");
      this.innerSetpoint = this.getSetpoint("inner");
    }
  }

  private computeAgles() {
    this._angle = getAngle(this.mainValue, this.mainMin, this.mainMax);

    if (this.mainMinIndicator) {
      this._min_indicator_angle = getAngle(
        this.mainMinIndicator.value,
        this.mainMin,
        this.mainMax
      );
    }

    if (this.mainMaxIndicator) {
      this._max_indicator_angle =
        180 - getAngle(this.mainMaxIndicator.value, this.mainMin, this.mainMax);
    }

    if (this.mainSetpoint) {
      this._setpoint_angle = getAngle(
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
        ? (this.config.gradient_background_opacity ??
          DEFAULTS.gradient.backgroundOpacity)
        : undefined;

    const primaryValueText = this.primaryValueAndValueText?.valueText ?? "";

    const candidate: MainGaugeData = {
      data: {
        min: this.mainMin,
        max: this.mainMax,
      },
      background: "",
      min_indicator: this.mainMinIndicator?.opts,
      max_indicator: this.mainMaxIndicator?.opts,
      unavailable: [UNAVAILABLE, INVALID_ENTITY].includes(primaryValueText),
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
        angle: this._angle,
        color: color!,
      };
    }

    if (!deepEqual(this.mainGaugeData, candidate)) {
      this.mainGaugeData = candidate;
    }
  }

  private computeInnerGaugeData() {
    if (!this.hasInnerGauge) return;

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
          ? (this.config.inner!.gradient_background_opacity ??
            DEFAULTS.gradient.backgroundOpacity)
          : undefined;
    }

    if (this.innerMin === undefined || this.innerMax === undefined) return;

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
    const primaryValueTextColor = this.getLightDarkModeColor(
      "value_texts.primary_color"
    );

    const secondaryValueText = this.secondaryValueAndValueText?.valueText;
    const secondaryValueTextColor = this.getLightDarkModeColor(
      "value_texts.secondary_color"
    );

    //-----------------------------------------------------------------------------
    // VALUE ELEMENTS VIEWMODEL
    //-----------------------------------------------------------------------------

    const mainNeedleValueElement: MainGaugeNeedleData | undefined = this
      .hasMainNeedle
      ? {
          angle: this._angle,
          color: this.getLightDarkModeColor("needle_color"),
          customShape: this.getValidatedSvgPath("shapes.main_needle"),
          innerMode: this.innerMode,
        }
      : undefined;

    const innerNeedleValueElement: InnerGaugeNeedleData | undefined =
      this.hasInnerGauge &&
      this.innerMode &&
      ["needle", "on_main"].includes(this.innerMode)
        ? {
            angle: this._inner_angle,
            color: this.getLightDarkModeColor("inner.needle_color"),
            customShape: this.getValidatedSvgPath("shapes.inner_needle"),
            gaugeMode: this.innerMode,
          }
        : undefined;

    const innerSetpointValueElement: InnerGaugeSetpointData | undefined = this
      .innerSetpoint
      ? {
          gaugeMode: this.innerMode!,
          ...this.innerSetpoint.opts,
        }
      : undefined;

    const primaryValueTextValueElement: PrimaryValueTextData | undefined =
      primaryValueText
        ? {
            text: primaryValueText,
            color: primaryValueTextColor,
          }
        : undefined;

    const secondaryValueTextValueElement: ValueTextData | undefined =
      secondaryValueText
        ? {
            text: secondaryValueText,
            color: secondaryValueTextColor,
          }
        : undefined;

    const candidate: ValueElementsData = {
      mainNeedle: mainNeedleValueElement,
      mainSetpoint: this.mainSetpoint?.opts,
      innerNeedle: innerNeedleValueElement,
      innerSetpoint: innerSetpointValueElement,
      primaryValueText: primaryValueTextValueElement,
      secondaryValueText: secondaryValueTextValueElement,
    };

    if (!deepEqual(this.valueElementsData, candidate)) {
      this.valueElementsData = candidate;
    }
  }

  private computeIconData() {
    this.leftIconData = this.getIconData("left");
    this.rightIconData = this.getIconData("right");
  }

  //=============================================================================
  // DATA RETRIEVAL HELPERS
  //=============================================================================

  private getValueAndValueText(gauge: Gauge): {
    value: number | undefined;
    valueText: string;
  } {
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

    let valueText: string | undefined;
    let stateObj;
    if (entity !== undefined) stateObj = this.hass!.states[entity];

    let value =
      NumberUtils.tryToNumber(templateValue) ??
      (attribute !== undefined
        ? NumberUtils.tryToNumber(stateObj?.attributes[attribute])
        : NumberUtils.tryToNumber(stateObj?.state));

    if (value === undefined) {
      if (entity && !stateObj) {
        return { value: undefined, valueText: INVALID_ENTITY };
      } else if (stateObj && !isAvailable(stateObj)) {
        return { value: undefined, valueText: UNAVAILABLE };
      } else {
        value = undefined;
      }
    }

    // Allow empty string to overwrite value_text
    if (templateValueText === "") {
      return { value: value, valueText: "" };
    } else if (templateValueText !== undefined) {
      if (NumberUtils.isNumeric(templateValueText)) {
        valueText = formatNumberToLocal(this.hass!, templateValueText) ?? "";
      } else {
        return { value: value, valueText: templateValueText as string };
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

  private getMinMaxIndicator(
    gauge: Gauge,
    element: "min" | "max"
  ): undefined | { value: number; opts: MinMaxIndicator } {
    const minMaxIndicator = this.getMinMaxIndicatorSetpoint(
      gauge,
      `${element}_indicator`
    );
    if (!minMaxIndicator) return;
    const isMain = gauge === "main";
    const prefixPath = `${isMain ? "" : "inner."}${element}`;
    const opts = minMaxIndicator.opts as MinMaxIndicator;

    const opacity = getValueFromPath(this.config, `${prefixPath}.opacity`) as
      | number
      | undefined;
    opts.opacity = opacity;

    return minMaxIndicator;
  }

  private getSetpoint(
    gauge: Gauge
  ): undefined | { value: number; opts: Setpoint } {
    const setpoint = this.getMinMaxIndicatorSetpoint(gauge, "setpoint");
    if (!setpoint) return;

    return setpoint as { value: number; opts: Setpoint };
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

    const colorKey: TemplateKey = `${prefixPath}.color` as TemplateKey;
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
          ? this.getValue(`${element}.value` as TemplateKey)
          : this.getValue(`inner.${element}.value` as TemplateKey)
      );
    }

    if (value === undefined || value === null) return;

    const shapeElement = element === "setpoint" ? "setpoint_needle" : element;
    const customShape = this.getValidatedSvgPath(
      `shapes.${gauge}_${shapeElement}`
    );

    const opts: MinMaxIndicator | Setpoint = {
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
        ) as number | undefined;
        if (precision !== undefined) {
          const factor = 10 ** precision;
          value = Math.round(value * factor) / factor;
        }
        const text = formatNumberToLocal(this.hass, value);

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
    const lang = this.hass.locale.language;

    if (type === "template") {
      // TODO: chatgpt:
      // type IconTemplateValue = {
      //   icon: string;
      //   color?: string;
      //   label?: string;
      // };

      // function isIconTemplateValue(v: unknown): v is IconTemplateValue {
      //   return (
      //     typeof v === "object" &&
      //     v !== null &&
      //     "icon" in v &&
      //     typeof (v as any).icon === "string" &&
      //     (!("color" in v) || typeof (v as any).color === "string") &&
      //     (!("label" in v) || typeof (v as any).label === "string")
      //   );
      // }
      //
      // const value = this.getValue<unknown>(`icons.${side}.value`);
      // if (!isIconTemplateValue(value)) return;
      const value = this.getValue(`icons.${side}.value`) as unknown;

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
        const value = this.getValue(`icons.${side}.value`) as
          | string
          | undefined;
        if (!value) return;

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

        return { icon, color, label };
      }
      case "fan-mode": {
        const value = this.getValue(`icons.${side}.value`) as
          | string
          | undefined;
        const fanModeEntity =
          value ?? this.config.feature_entity ?? this.config.entity;
        if (!fanModeEntity || computeDomain(fanModeEntity) !== "climate")
          return;

        const fanModeStateObj = this.hass?.states[
          fanModeEntity
        ] as ClimateEntity;
        if (!fanModeStateObj) return;

        const fanMode = fanModeStateObj.attributes.fan_mode;
        if (!fanMode) return;
        const icon = getFanModeIcon(fanMode);

        let label = "";
        const hide_label = this.config.icons[side].hide_label;
        if (hide_label !== true) {
          const translationKey = `features.fan_modes.${fanMode}`;
          label = localize(lang, translationKey);
          if (label === translationKey) label = fanMode;
        }

        return { icon, color: undefined, label };
      }
      case "hvac-mode": {
        const value = this.getValue(`icons.${side}.value`) as
          | string
          | undefined;
        const hvacModeEntity =
          value ?? this.config.feature_entity ?? this.config.entity;
        if (!hvacModeEntity || computeDomain(hvacModeEntity) !== "climate")
          return;

        const hvacModeStateObj = this.hass?.states[
          hvacModeEntity
        ] as ClimateEntity;
        if (!hvacModeStateObj) return;

        const hvacMode = hvacModeStateObj.state as HvacMode;
        const icon = getHvacModeIcon(hvacMode);
        const color = getHvacModeColor(hvacMode);

        let label = "";
        const hide_label = this.config.icons[side].hide_label;
        if (hide_label !== true) {
          const translationKey = `features.hvac_modes.${hvacMode}`;
          label = localize(lang, translationKey);
          if (label === translationKey) label = hvacMode;
        }

        return { icon, color, label };
      }
      case "preset-mode": {
        const value = this.getValue(`icons.${side}.value`) as
          | string
          | undefined;
        const presetModeEntity =
          value ?? this.config.feature_entity ?? this.config.entity;
        if (!presetModeEntity || computeDomain(presetModeEntity) !== "climate")
          return;

        const presetModeStateObj = this.hass?.states[
          presetModeEntity
        ] as ClimateEntity;
        if (!presetModeStateObj) return;

        const presetMode = presetModeStateObj.attributes.preset_mode;
        if (!presetMode) return;
        const icon = getPresetModeIcon(presetMode);

        let label = "";
        const hide_label = this.config.icons[side].hide_label;
        if (hide_label !== true) {
          const translationKey = `features.preset_modes.${presetMode.toLowerCase()}`;
          label = localize(lang, translationKey);
          if (label === translationKey) label = presetMode;
        }

        return { icon, color: undefined, label };
      }
      case "swing-mode": {
        const value = this.getValue(`icons.${side}.value`) as
          | string
          | undefined;
        const swingModeEntity =
          value ?? this.config.feature_entity ?? this.config.entity;
        if (!swingModeEntity || computeDomain(swingModeEntity) !== "climate")
          return;

        const swingModeStateObj = this.hass?.states[
          swingModeEntity
        ] as ClimateEntity;
        if (!swingModeStateObj) return;

        const swingMode = swingModeStateObj.attributes.swing_mode;
        if (!swingMode) return;
        const icon = getSwingModeIcon(swingMode);

        let label = "";
        const hide_label = this.config.icons[side].hide_label;
        if (hide_label !== true) {
          const translationKey = `features.swing_modes.${swingMode.toLowerCase()}`;
          label = localize(lang, translationKey);
          if (label === translationKey) label = swingMode;
        }

        return { icon, color: undefined, label };
      }
      default:
        return;
    }
  }

  private get showValueElements(): boolean {
    if (this.hasMainNeedle || this.mainSetpoint) return true;
    if (this.innerSetpoint || this.primaryValueAndValueText?.valueText || this.secondaryValueAndValueText?.valueText) return true;
    return !!this.innerMode && ["needle", "on_main"].includes(this.innerMode);
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
      this.getValue,
      severity_color_mode,
      gauge,
      min,
      max,
      value,
      clamp_min
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

  private getConicGradientString(
    gauge: Gauge,
    min: number,
    max: number,
    resolution: GradientResolution = DEFAULTS.gradient.resolution,
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

  private getFlatArcConicGradientString(
    gauge: Gauge,
    min: number,
    max: number
  ) {
    return _getFlatArcConicGradientString(
      this.log,
      this.getValue,
      gauge,
      min,
      max
    );
  }

  private getValidatedSvgPath(key: TemplateKey): string | undefined {
    const path = this.getValue(key) as string;
    return path === "" || isValidSvgPath(path) ? path : undefined;
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
