// External dependencies
import { UnsubscribeFunc } from "home-assistant-js-websocket";
import { html, LitElement, nothing, PropertyValues, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import hash from "object-hash/dist/object_hash";

// Core HA helpers
import {
  actionHandler,
  ActionHandlerEvent,
  afterNextRender,
  batteryLevelIcon,
  batteryStateColorProperty,
  blankBeforePercent,
  handleAction,
  hasAction,
  HomeAssistant,
  LovelaceCard,
  LovelaceCardEditor,
  RenderTemplateResult,
  subscribeRenderTemplate,
} from "../dependencies/ha";

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
import { trySetValue } from "../utils/object/set-value";
import { isIcon, getIcon } from "../utils/string/icon";
import { isValidFontSize } from "../utils/css/valid-font-size";

// Local constants & types
import { cardCSS } from "./css/card";
import { gaugeCSS } from "./css/gauge";
import {
  VERSION,
  EDITOR_NAME,
  CARD_NAME,
  DEFUALT_ICON_COLOR,
  DEFAULT_INNER_MODE,
  DEFAULT_MIN,
  DEFAULT_MIN_INDICATOR_COLOR,
  DEFAULT_MIN_MAX_INDICATOR_OPACITY,
  DEFAULT_MAX,
  DEFAULT_MAX_INDICATOR_COLOR,
  DEFAULT_NEEDLE_COLOR,
  DEFAULT_SETPOINT_NEELDLE_COLOR,
  DEFAULT_TITLE_COLOR,
  DEFAULT_TITLE_FONT_SIZE_PRIMARY,
  DEFAULT_TITLE_FONT_SIZE_SECONDARY,
  DEFAULT_VALUE_TEXT_COLOR,
  MAIN_GAUGE_NEEDLE,
  MAIN_GAUGE_NEEDLE_WITH_INNER,
  MAIN_GAUGE_MIN_MAX_INDICATOR,
  MAIN_GAUGE_SETPOINT_NEEDLE,
  INNER_GAUGE_NEEDLE,
  INNER_GAUGE_ON_MAIN_NEEDLE,
  INNER_GAUGE_MIN_MAX_INDICATOR,
  INNER_GAUGE_SETPOINT_NEEDLE,
  INNER_GAUGE_SETPOINT_ON_MAIN_NEEDLE,
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
  getGradientSegments as _getGradientSegments,
  computeSeverity as _computeSeverity,
} from "./_segments";
import { GradientRenderer } from "./_gradient-renderer";

const templateCache = new CacheManager<TemplateResults>(1000);

type TemplateResults = Partial<
  Record<TemplateKey, RenderTemplateResult | undefined>
>;

registerCustomCard({
  type: CARD_NAME,
  name: "Gauge Card Pro",
  description: "Build beautiful Gauge cards using gradients and templates",
});

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
  "min",
  "needle_color",
  "segments",
  "setpoint.color",
  "setpoint.value",
  "shapes.main_needle",
  "shapes.main_needle_with_inner",
  "shapes.main_min_indicator",
  "shapes.main_min_indicator_with_inner",
  "shapes.main_max_indicator",
  "shapes.main_max_indicator_with_inner",
  "shapes.main_setpoint_needle",
  "shapes.inner_needle",
  "shapes.inner_needle_on_main",
  "shapes.inner_min_indicator",
  "shapes.inner_max_indicator",
  "shapes.inner_setpoint_needle",
  "shapes.inner_setpoint_needle_on_main",
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

@customElement(CARD_NAME)
export class GaugeCardProCard extends LitElement implements LovelaceCard {
  constructor() {
    super();
    Logger.initializeLogger(VERSION);
  }

  // template handling
  @state() private _templateResults?: TemplateResults;
  @state() private _unsubRenderTemplates: Map<
    TemplateKey,
    Promise<UnsubscribeFunc>
  > = new Map();

  private _mainGaugeGradient = new GradientRenderer("main");
  private _innerGaugeGradient = new GradientRenderer("inner");

  @property({ attribute: false }) public hass?: HomeAssistant;

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

  // shared main gauge properties
  private gradient = false;
  private gradientBackground = false;
  private gradientSegments?: GradientSegment[];
  private max = 100;
  private maxIndicator = false;
  private maxIndicatorValue?: number;
  private min = 0;
  private minIndicator = false;
  private minIndicatorValue?: number;
  private needle = false;
  private value = 0;

  // shared setpoint properties
  private setpoint = false;
  private setpointValue = 0;

  // shared inner gauge properties
  private hasInnerGauge = false;
  private innerGradient?: boolean;
  private innerGradientBackground? = false;
  private innerGradientSegments?: GradientSegment[];
  private innerMax?: number;
  private innerMaxIndicator?: boolean;
  private innerMaxIndicatorValue?: number;
  private innerMin?: number;
  private innerMinIndicator?: boolean;
  private innerMinIndicatorValue?: number;
  private innerMode?: string;
  private innerValue?: number;

  // shared inner setpoint properties
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

  private hideBackground = false;

  // -------------------------------------------

  static styles = [cardCSS, gaugeCSS];

  public getCardSize(): number {
    return 4;
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./editor");
    return document.createElement(EDITOR_NAME) as LovelaceCardEditor;
  }

  public static async getStubConfig(
    hass: HomeAssistant
  ): Promise<GaugeCardProCardConfig> {
    const entities = Object.keys(hass.states);
    const numbers = entities.filter((e) =>
      ["counter", "input_number", "number", "sensor"].includes(e.split(".")[0])
    );
    return {
      type: `custom:${CARD_NAME}`,
      entity: numbers[0],
      segments: [
        { from: 0, color: "red" },
        { from: 25, color: "#FFA500" },
        { from: 50, color: "rgb(255, 255, 0)" },
        { from: 100, color: "var(--green-color)" },
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

    this.needle = config.needle ?? false;
    this.gradient = config.gradient ?? false;
    this.gradientBackground = config.gradient_background ?? false;

    this.hasInnerGauge =
      config.inner != null && typeof config.inner === "object";

    this.innerGradient = this.hasInnerGauge
      ? (config!.inner?.gradient ?? false)
      : undefined;
    this.innerGradientBackground = this.hasInnerGauge
      ? (config!.inner?.gradient_background ?? false)
      : undefined;
    this.innerMode = this.hasInnerGauge
      ? (config!.inner?.mode ?? "severity")
      : undefined;

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

    this._config = config;
  }

  private getSegments(gauge: Gauge, min: number, max: number) {
    return _getSegments(this, gauge, min, max);
  }

  private getGradientSegments(gauge: Gauge, min: number, max: number) {
    return _getGradientSegments(this, gauge, min, max);
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
    } else if (templateValueText) {
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
  ): undefined | { value: number; color: string | undefined } {
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

    return value === undefined ? undefined : { value, color };
  }

  private getSetpoint(
    gauge: Gauge
  ): undefined | { value: number; color: string | undefined } {
    const isMain = gauge === "main";
    const type = isMain
      ? this._config?.setpoint?.type
      : this._config?.inner?.setpoint?.type;
    const colorKey: TemplateKey = isMain
      ? "setpoint.color"
      : "inner.setpoint.color";

    if (type === undefined) return undefined;

    let value: number | undefined;
    const color = this.getLightDarkModeColor(
      colorKey,
      DEFAULT_SETPOINT_NEELDLE_COLOR
    );

    if (type === "entity") {
      const configValue = isMain
        ? this._config?.setpoint?.value
        : this._config?.inner?.setpoint?.value;
      if (typeof configValue !== "string") return undefined;

      const stateObj = this.hass?.states[configValue];
      if (!stateObj) return undefined;

      value = NumberUtils.tryToNumber(stateObj.state);
    } else if (type === "number") {
      const configValue = isMain
        ? this._config?.setpoint?.value
        : this._config?.inner?.setpoint?.value;
      value = NumberUtils.tryToNumber(configValue);
    } else if (type === "template") {
      value = NumberUtils.tryToNumber(
        isMain
          ? this.getValue("setpoint.value")
          : this.getValue("inner.setpoint.value")
      );
    }

    return value === undefined ? undefined : { value, color };
  }

  private getIcon():
    | undefined
    | { icon: string; color: string | undefined; label: string | undefined } {
    if (!this._config?.icon) return;
    const type = this._config.icon.type;

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
        label: value["label"] ?? "",
      };
    }

    const stateObj = this.hass?.states[value];
    if (!stateObj) return;

    switch (type) {
      case "battery":
        const level = stateObj.state;
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

        return { icon: icon, color: color, label: label };
      default:
        return;
    }
  }

  private getValidatedPath(key: TemplateKey): string | undefined {
    const path = this.getValue(key);
    return path === "" || isValidSvgPath(path) ? path : undefined;
  }

  /**
   *
   * @param gauge - main or inner - The gauge to check
   *
   * Conditions set 1:
   *   - Has needle
   *   - Has segments
   *   - Gradient is enabled
   *
   * Conditions set 2:
   *   - No Needle
   *   - Has segments
   *   - Gradient-backgrond is enabled
   *
   * @returns true of false whether the config should of rendering a gradient
   */
  private shouldRenderGradient(gauge: Gauge): boolean {
    if (gauge === "main") {
      return (
        this.gradientSegments !== undefined &&
        ((this.needle && this.gradient) ||
          (!this.needle && this.gradientBackground))
      );
    }
    return (
      this.hasInnerGauge &&
      this.innerGradientSegments !== undefined &&
      ((this.innerGradient === true &&
        ["static", "needle"].includes(this.innerMode!)) ||
        (this.innerGradientBackground === true &&
          this.innerMode === "severity"))
    );
  }

  private _calculate_angles() {
    this._angle = getAngle(this.value, this.min, this.max);
    if (this.minIndicator) {
      this._min_indicator_angle = getAngle(
        this.minIndicatorValue!,
        this.min,
        this.max
      );
    }
    if (this.maxIndicator) {
      this._max_indicator_angle =
        180 - getAngle(this.maxIndicatorValue!, this.min, this.max);
    }
    this._setpoint_angle = getAngle(this.setpointValue, this.min, this.max);

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

  //-----------------------------------------------------------------------------
  // TEMPLATE HANDLING
  //-----------------------------------------------------------------------------

  private async _tryConnect(): Promise<void> {
    TEMPLATE_KEYS.forEach((key) => {
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
    TEMPLATE_KEYS.forEach((key) => {
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
    return String(getValueFromPath(this._config, key))?.includes("{");
  }

  // Public for unit-tests
  public getValue(key: TemplateKey): any {
    return this.isTemplate(key)
      ? this._templateResults?.[key]?.result
      : getValueFromPath(this._config, key);
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

    //-----------------------------------------------------------------------------
    // MAIN GAUGE
    //-----------------------------------------------------------------------------
    this.min = NumberUtils.toNumberOrDefault(this.getValue("min"), DEFAULT_MIN);
    this.max = NumberUtils.toNumberOrDefault(this.getValue("max"), DEFAULT_MAX);

    const primaryValueAndValueText = this.getValueAndValueText(
      "main",
      this.min
    );
    this.value = primaryValueAndValueText.value;

    const needleColor = this.getLightDarkModeColor(
      "needle_color",
      DEFAULT_NEEDLE_COLOR
    );

    const severityGaugeColor = !this.needle
      ? this.computeSeverity("main", this.min, this.max, this.value)
      : undefined;

    this.gradientSegments =
      (this.needle && this.gradient) ||
      (!this.needle && this.gradientBackground)
        ? this.getGradientSegments("main", this.min, this.max)
        : undefined;

    const segments =
      this.needle && !this.gradient
        ? this.getSegments("main", this.min, this.max)
        : undefined;

    // min indicator
    const _minIndicator = this.getMinMaxIndicatorSetpoint(
      "main",
      "min_indicator"
    );
    this.minIndicator = _minIndicator !== undefined;
    this.minIndicatorValue = _minIndicator?.value;
    const minIndicatorColor = _minIndicator?.color;
    const minIndicatorOpacity =
      this._config.min_indicator?.opacity ?? DEFAULT_MIN_MAX_INDICATOR_OPACITY;

    // max indicator
    const _maxIndicator = this.getMinMaxIndicatorSetpoint(
      "main",
      "max_indicator"
    );
    this.maxIndicator = _maxIndicator !== undefined;
    this.maxIndicatorValue = _maxIndicator?.value;
    const maxIndicatorColor = _maxIndicator?.color;
    const maxIndicatorOpacity =
      this._config.max_indicator?.opacity ?? DEFAULT_MIN_MAX_INDICATOR_OPACITY;

    // setpoint
    const _setpoint = this.getMinMaxIndicatorSetpoint("main", "setpoint");
    this.setpoint = _setpoint !== undefined;
    this.setpointValue = _setpoint?.value ?? this.min;
    const setpointNeedleColor = _setpoint?.color;

    // secondary
    let secondaryValueAndValueText;
    const secondaryValueTextColor = this.getLightDarkModeColor(
      "value_texts.secondary_color",
      DEFAULT_VALUE_TEXT_COLOR
    );

    let innerSeverityGaugeColor: string | undefined;
    let innerNeedleColor: string | undefined;
    let innerSegments: GaugeSegment[] | undefined;

    let _innerMinIndicator:
      | { value: number; color: string | undefined }
      | undefined;
    let innerMinIndicatorColor: string | undefined;
    let innerMinIndicatorOpacity: number | undefined;

    let _innerMaxIndicator:
      | { value: number; color: string | undefined }
      | undefined;
    let innerMaxIndicatorColor: string | undefined;
    let innerMaxIndicatorOpacity: number | undefined;

    let innerSetpointNeedleColor: string | undefined;

    //-----------------------------------------------------------------------------
    // INNER GAUGE
    //-----------------------------------------------------------------------------
    if (this.hasInnerGauge) {
      this.innerMax = NumberUtils.toNumberOrDefault(
        this.getValue("inner.max"),
        this.max
      );

      this.innerMin = NumberUtils.toNumberOrDefault(
        this.getValue("inner.min"),
        this.min
      );

      secondaryValueAndValueText = this.getValueAndValueText(
        "inner",
        this.innerMin
      );
      this.innerValue = secondaryValueAndValueText.value;

      innerNeedleColor = this.getLightDarkModeColor(
        "inner.needle_color",
        DEFAULT_NEEDLE_COLOR
      );

      innerSeverityGaugeColor =
        this.hasInnerGauge &&
        this.innerMode == "severity" &&
        this.innerValue! > this.innerMin!
          ? this.computeSeverity(
              "inner",
              this.innerMin!,
              this.innerMax!,
              this.innerValue!
            )
          : undefined;

      // segments
      if (
        !this.innerGradient &&
        ["static", "needle"].includes(this.innerMode!)
      ) {
        innerSegments = this.getSegments("inner", this.innerMin, this.innerMax);
      }

      // gradient resolution
      if (
        (this.innerGradient &&
          ["static", "needle"].includes(this.innerMode!)) ||
        (this.innerMode === "severity" && this.innerGradientBackground)
      ) {
        console.log("setting innerGradientSegments");
        this.innerGradientSegments = this.getGradientSegments(
          "inner",
          this.innerMin,
          this.innerMax
        );
      }

      // min indicator
      _innerMinIndicator = this.getMinMaxIndicatorSetpoint(
        "inner",
        "min_indicator"
      );
      this.innerMinIndicator = _innerMinIndicator !== undefined;
      this.innerMinIndicatorValue = _innerMinIndicator?.value;
      innerMinIndicatorColor = _innerMinIndicator?.color;
      innerMinIndicatorOpacity =
        this._config.inner!.min_indicator?.opacity ??
        DEFAULT_MIN_MAX_INDICATOR_OPACITY;

      // max indicator
      _innerMaxIndicator = this.getMinMaxIndicatorSetpoint(
        "inner",
        "max_indicator"
      );
      this.innerMaxIndicator = _innerMaxIndicator !== undefined;
      this.innerMaxIndicatorValue = _innerMaxIndicator?.value;
      innerMaxIndicatorColor = _innerMaxIndicator?.color;
      innerMaxIndicatorOpacity =
        this._config.inner!.max_indicator?.opacity ??
        DEFAULT_MIN_MAX_INDICATOR_OPACITY;

      // setpoint
      const _innerSetpoint = this.getMinMaxIndicatorSetpoint(
        "inner",
        "setpoint"
      );
      this.innerSetpoint = _innerSetpoint !== undefined;
      this.innerSetpointValue = _innerSetpoint?.value ?? this.innerMin;
      innerSetpointNeedleColor = _innerSetpoint?.color;
    } else {
      secondaryValueAndValueText = this.getValueAndValueText("inner", 0);
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
    if (icon) {
      iconIcon = icon.icon;
      iconColor = icon.color;
      this.iconLabel = icon.label ?? "";
    }

    //-----------------------------------------------------------------------------
    // SHAPES
    //-----------------------------------------------------------------------------
    const mainNeedleShape =
      this.getValidatedPath("shapes.main_needle") ?? MAIN_GAUGE_NEEDLE;
    const mainNeedleShapeWithInner =
      this.getValidatedPath("shapes.main_needle_with_inner") ??
      MAIN_GAUGE_NEEDLE_WITH_INNER;
    const mainMinIndicatorShape =
      this.getValidatedPath("shapes.main_min_indicator") ??
      MAIN_GAUGE_MIN_MAX_INDICATOR;
    const mainMinIndicatorWithInnerShape =
      this.getValidatedPath("shapes.main_min_indicator_with_inner") ??
      MAIN_GAUGE_MIN_MAX_INDICATOR;
    const mainMaxIndicatorShape =
      this.getValidatedPath("shapes.main_max_indicator") ??
      MAIN_GAUGE_MIN_MAX_INDICATOR;
    const mainMaxIndicatorWithInnerShape =
      this.getValidatedPath("shapes.main_max_indicator_with_inner") ??
      MAIN_GAUGE_MIN_MAX_INDICATOR;
    const mainSetpointNeedleShape =
      this.getValidatedPath("shapes.main_setpoint_needle") ??
      MAIN_GAUGE_SETPOINT_NEEDLE;

    const innerNeedleShape =
      this.getValidatedPath("shapes.inner_needle") ?? INNER_GAUGE_NEEDLE;
    const innerNeedleShapeOnMain =
      this.getValidatedPath("shapes.inner_needle_on_main") ??
      INNER_GAUGE_ON_MAIN_NEEDLE;
    const innerMinIndicatorShape =
      this.getValidatedPath("shapes.inner_min_indicator") ??
      INNER_GAUGE_MIN_MAX_INDICATOR;
    const innerMaxIndicatorShape =
      this.getValidatedPath("shapes.inner_max_indicator") ??
      INNER_GAUGE_MIN_MAX_INDICATOR;
    const innerSetpointNeedleShape =
      this.getValidatedPath("shapes.inner_setpoint_needle") ??
      INNER_GAUGE_SETPOINT_NEEDLE;
    const InnerSetpointNeedleShapeOnMain =
      this.getValidatedPath("shapes.inner_setpoint_needle_on_main") ??
      INNER_GAUGE_SETPOINT_ON_MAIN_NEEDLE;

    return html`
      <ha-card
        style=${styleMap({
          background: this.hideBackground ? "none" : "#aaaaaa",
          border: this.hideBackground ? "none" : undefined,
          "box-shadow": this.hideBackground ? "none" : undefined,
        })}
        @action=${this._handleCardAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this._config.hold_action),
          hasDoubleClick: hasAction(this._config.double_tap_action),
        })}
        role=${ifDefined(this.hasCardAction ? "button" : undefined)}
        tabindex=${ifDefined(this.hasCardAction ? "0" : undefined)}
      >
        <gauge-card-pro-gauge
          style=${styleMap({
            position: "relative",
          })}
        >
          <svg id="main-gauge" viewBox="-50 -50 100 50" class="elements-group">
            ${this.needle && !this.gradient
              ? segments!
                  .sort((a, b) => a.pos - b.pos)
                  .map((segment) => {
                    const angle = getAngle(segment.pos, this.min, this.max);
                    return svg`<path
                          class="segment"
                          d="M
                            ${0 - 40 * Math.cos((angle * Math.PI) / 180)}
                            ${0 - 40 * Math.sin((angle * Math.PI) / 180)}
                            A 40 40 0 0 1 40 0"
                          style=${styleMap({ stroke: segment.color })}
                        ></path>`;
                  })
              : ""}
            ${!this.needle
              ? svg`<path
                    class="main-background"
                    style=${styleMap({ stroke: !this.gradientBackground ? "var(--primary-background-color)" : "#ffffff" })}
                    d="M -40 0 A 40 40 0 0 1 40 0"
                  ></path>`
              : ""}
            ${this.shouldRenderGradient("main")
              ? svg`
                <svg id="main-gradient" 
                  class=${classMap({ "gradient-background": !this.needle && this.gradientBackground === true })}  
                  style=${styleMap({ overflow: "auto" })}
                  >
                  <path
                    fill="none"
                    d="M -40 0 A 40 40 0 0 1 40 0"
                  ></path>
                </svg>`
              : ""}
            ${this.value > this.min && (!this.needle || this.gradientBackground)
              ? svg`<path
                    class="value"
                    d="M -40 0 A 40 40 0 1 0 40 0"
                    style=${styleMap({ stroke: severityGaugeColor, transform: `rotate(${this._angle}deg)` })}
                  > </path>`
              : ""}
            ${this.needle &&
            this.minIndicator &&
            this.minIndicatorValue! > this.min
              ? svg`<path
                    class="min-max-indicator"
                    d=${
                      this.innerMode === "needle" ||
                      (this.innerMode === "on_main" && this.needle)
                        ? mainMinIndicatorWithInnerShape
                        : mainMinIndicatorShape
                    }
                    style=${styleMap({
                      fill: minIndicatorColor,
                      "fill-opacity": minIndicatorOpacity,
                      transform: `rotate(${this._min_indicator_angle}deg)`,
                      stroke: "var(--main-min-indicator-stroke-color)",
                      "stroke-width": "var(--main-min-indicator-stroke-width)",
                    })}
                  > </path>`
              : ""}
            ${this.needle &&
            this.maxIndicator &&
            this.maxIndicatorValue! < this.max
              ? svg`<path
                    class="min-max-indicator"
                    d=${
                      this.innerMode === "needle" ||
                      (this.innerMode === "on_main" && this.needle)
                        ? mainMaxIndicatorWithInnerShape
                        : mainMaxIndicatorShape
                    }
                    style=${styleMap({
                      fill: maxIndicatorColor,
                      "fill-opacity": maxIndicatorOpacity,
                      transform: `rotate(-${this._max_indicator_angle}deg)`,
                      stroke: "var(--main-max-indicator-stroke-color)",
                      "stroke-width": "var(--main-max-indicator-stroke-width)",
                    })}
                  > </path>`
              : ""}
          </svg>

          ${this.hasInnerGauge
            ? svg`
                <svg id="inner-gauge" viewBox="-50 -50 100 50" class="elements-group inner-gauge">

              ${
                ["static", "needle"].includes(this.innerMode!) ||
                (this.innerMode == "severity" && this.innerGradientBackground)
                  ? svg`
                    <path
                        class="inner-value-stroke"
                        d="M -32.5 0 A 32.5 32.5 0 0 1 32.5 0"
                    ></path>`
                  : ""
              }

              ${
                this.innerMode == "severity" &&
                ((!this.innerGradientBackground &&
                  this.innerValue! > this.innerMin!) ||
                  this.innerGradientBackground)
                  ? this.innerGradientBackground
                    ? svg`
                        <path
                          class="inner-gradient-bg-bg"
                          d="M -32 0 A 32 32 0 1 1 32 0"
                        ></path>
                    `
                    : svg`
                        <path
                          class="inner-value-stroke"
                          d="M -32.5 0 A 32.5 32.5 0 1 0 32.5 0"
                          style=${styleMap({ transform: `rotate(${this._inner_angle + 1.5}deg)` })}
                        ></path>
                    `
                  : ""
              }
              
              ${
                this.shouldRenderGradient("inner")
                  ? svg`
                  <svg id="inner-gradient" 
                    style=${styleMap({ overflow: "auto" })}
                    class=${classMap({ "gradient-background": this.innerMode == "severity" && this.innerGradientBackground === true })}
                    >
                    <path
                      fill="none"
                      d="M -32 0 A 32 32 0 0 1 32 0"
                    ></path>
                  </svg>`
                  : ""
              }
          
              ${
                this.innerValue! > this.innerMin! &&
                (this.innerMode == "severity" || this.innerGradientBackground)
                  ? svg`
                      <path
                        class="inner-value"
                        d="M -32 0 A 32 32 0 1 0 32 0"
                        style=${styleMap({ stroke: innerSeverityGaugeColor, transform: `rotate(${this._inner_angle}deg)` })}
                      ></path>
                  `
                  : ""
              }  

              ${
                !this.innerGradient &&
                ["static", "needle"].includes(this.innerMode!) &&
                innerSegments
                  ? svg`
                      ${innerSegments
                        .sort((a, b) => a.pos - b.pos)
                        .map((segment) => {
                          const angle = getAngle(
                            segment.pos,
                            this.innerMin!,
                            this.innerMax!
                          );
                          return svg`<path
                                class="inner-segment"
                                d="M
                                  ${0 - 32 * Math.cos((angle * Math.PI) / 180)}
                                  ${0 - 32 * Math.sin((angle * Math.PI) / 180)}
                                  A 32 32 0 0 1 32 0"
                                style=${styleMap({ stroke: segment.color })}
                              ></path>`;
                        })}
                    </svg>`
                  : ""
              }

              ${
                ["static", "needle"].includes(this.innerMode!) &&
                this.innerMinIndicator &&
                this.innerMinIndicatorValue! > this.innerMin!
                  ? svg`<path
                      class="min-max-indicator"
                      d=${innerMinIndicatorShape}
                      style=${styleMap({
                        fill: innerMinIndicatorColor,
                        "fill-opacity": innerMinIndicatorOpacity,
                        transform: `rotate(${this._inner_min_indicator_angle}deg)`,
                        stroke: "var(--inner-min-indicator-stroke-color)",
                        "stroke-width":
                          "var(--inner-min-indicator-stroke-width)",
                      })}
                    > </path>`
                  : ""
              }
              ${
                ["static", "needle"].includes(this.innerMode!) &&
                this.innerMaxIndicator &&
                this.innerMaxIndicatorValue! < this.innerMax!
                  ? svg`<path
                      class="min-max-indicator"
                      d=${innerMaxIndicatorShape}
                      style=${styleMap({
                        fill: innerMaxIndicatorColor,
                        "fill-opacity": innerMaxIndicatorOpacity,
                        transform: `rotate(-${this._inner_max_indicator_angle}deg)`,
                        stroke: "var(--inner-max-indicator-stroke-color)",
                        "stroke-width":
                          "var(--inner-max-indicator-stroke-width)",
                      })}
                    > </path>`
                  : ""
              }
            `
            : ""}
          ${this.needle || this.innerMode === "needle" || this.setpoint
            ? svg`
            <svg viewBox="-50 -50 100 50" class="elements-group needles">

              ${
                this.needle
                  ? svg`
                    <path
                      class="needle"
                      d=${
                        this.innerMode === "needle" ||
                        (this.innerMode === "on_main" && this.needle)
                          ? mainNeedleShapeWithInner
                          : mainNeedleShape
                      }
                      style=${styleMap({
                        transform: `rotate(${this._angle}deg)`,
                        fill: needleColor,
                        stroke: "var(--main-needle-stroke-color)",
                        "stroke-width": "var(--main-needle-stroke-width)",
                      })}
                    ></path>`
                  : ""
              }

              ${
                this.setpoint
                  ? svg`
                    <path
                      class="needle"
                      d=${mainSetpointNeedleShape}
                      style=${styleMap({
                        transform: `rotate(${this._setpoint_angle}deg)`,
                        fill: setpointNeedleColor,
                        stroke: "var(--main-setpoint-needle-stroke-color)",
                        "stroke-width":
                          "var(--main-setpoint-needle-stroke-width)",
                      })}
                    ></path>`
                  : ""
              } 

              ${
                this.innerMode === "needle" ||
                (this.innerMode === "on_main" && this.needle)
                  ? svg`
                    <path
                      class="needle"
                      d=${this.innerMode === "on_main" ? innerNeedleShapeOnMain : innerNeedleShape}
                      style=${styleMap({
                        transform: `rotate(${this._inner_angle}deg)`,
                        fill: innerNeedleColor,
                        stroke: "var(--inner-needle-stroke-color)",
                        "stroke-width": "var(--inner-needle-stroke-width)",
                      })}
                    ></path>`
                  : ""
              } 

              ${
                this.innerSetpoint
                  ? svg`
                    <path
                      class="needle"
                      d=${this.innerMode === "on_main" ? InnerSetpointNeedleShapeOnMain : innerSetpointNeedleShape}
                      style=${styleMap({
                        transform: `rotate(${this._inner_setpoint_angle}deg)`,
                        fill: innerSetpointNeedleColor,
                        stroke: "var(--inner-setpoint-needle-stroke-color)",
                        "stroke-width":
                          "var(--inner-setpoint-needle-stroke-width)",
                      })}
                    ></path>`
                  : ""
              } 

            </svg>`
            : ""}
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
            : html`<div class="primary-value-icon">
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
            : html`<div class="secondary-value-icon">
                <ha-state-icon
                  .hass=${this.hass}
                  .icon=${getIcon(this.secondaryValueText!)}
                  class="icon secondary-value-state-icon"
                  style=${styleMap({ color: secondaryValueTextColor })}
                ></ha-state-icon>
              </div>`}
          ${iconIcon
            ? html`<div class="icon-container">
                <div class="icon-inner-container">
                  <ha-state-icon
                    class="icon"
                    .hass=${this.hass}
                    .icon=${iconIcon}
                    role=${ifDefined(this.hasIconAction ? "button" : undefined)}
                    tabindex=${ifDefined(this.hasIconAction ? "0" : undefined)}
                    style=${styleMap({ color: iconColor })}
                    @action=${(ev: CustomEvent) =>
                      this.hasIconAction ? this._handleIconAction(ev) : nothing}
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
              </div> `
            : ""}
        </gauge-card-pro-gauge>

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
          : ""}
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
          : ""}
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

      if (this.shouldRenderGradient("main")) {
        this._mainGaugeGradient.initialize(
          this.renderRoot.querySelector("#main-gradient path"),
          this._config!.gradient_resolution
        );
      }
      if (this.shouldRenderGradient("inner")) {
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
    this._tryConnect();

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

    if (this.shouldRenderGradient("main")) {
      this._mainGaugeGradient.render(
        this.min,
        this.max,
        this.gradientSegments!
      );
    }

    if (this.shouldRenderGradient("inner")) {
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
