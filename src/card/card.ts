// External dependencies
import { UnsubscribeFunc } from "home-assistant-js-websocket";
import { html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";
import hash from "object-hash/dist/object_hash";

// Core HA helpers
import {
  actionHandler,
  ActionHandlerEvent,
  batteryLevelIcon,
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
import { batteryStateColorProperty } from "../dependencies/ha";
import * as Logger from "../dependencies/calendar-card-pro";
import {
  CacheManager,
  computeDarkMode,
  registerCustomCard,
} from "../dependencies/mushroom";

// Local utilities
import { getValueFromPath } from "../utils/object/get-value";
import { migrate_parameters } from "../utils/migrate-parameters";
import {
  formatEntityToLocal,
  formatNumberToLocal,
} from "../utils/number/format-to-locale";
import { NumberUtils } from "../utils/number/numberUtils";
import { trySetValue } from "../utils/object/set-value";
import { isValidFontSize } from "../utils/css/valid-font-size";

// Local constants & types
import { cardCSS } from "./css/card";
import {
  VERSION,
  EDITOR_NAME,
  CARD_NAME,
  DEFUALT_ICON_COLOR,
  DEFAULT_INNER_MODE,
  DEFAULT_MIN,
  DEFAULT_MAX,
  DEFAULT_NEEDLE_COLOR,
  DEFAULT_SETPOINT_NEELDLE_COLOR,
  DEFAULT_TITLE_COLOR,
  DEFAULT_TITLE_FONT_SIZE_PRIMARY,
  DEFAULT_TITLE_FONT_SIZE_SECONDARY,
  DEFAULT_VALUE_TEXT_COLOR,
  MAIN_GAUGE_NEEDLE,
  MAIN_GAUGE_NEEDLE_WITH_INNER,
  MAIN_GAUGE_SETPOINT_NEEDLE,
  INNER_GAUGE_NEEDLE,
  INNER_GAUGE_ON_MAIN_NEEDLE,
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
import { getSegments, getGradientSegments, computeSeverity } from "./_segments";
import "./gauge";

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
  "needle_shapes.main",
  "needle_shapes.main_with_inner",
  "needle_shapes.main_setpoint",
  "needle_shapes.inner",
  "needle_shapes.inner_on_main",
  "needle_shapes.inner_setpoint",
  "needle_shapes.inner_setpoint_on_main",
  "segments",
  "setpoint.color",
  "setpoint.value",
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

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() public _config?: GaugeCardProCardConfig;

  // template handling
  @state() private _templateResults?: TemplateResults;
  @state() private _unsubRenderTemplates: Map<
    TemplateKey,
    Promise<UnsubscribeFunc>
  > = new Map();

  // // gradient renderers
  // private _mainGaugeGradient = new GradientRenderer("main");
  // private _innerGaugeGradient = new GradientRenderer("inner");

  /**
   * Get the configured segments array (from & color).
   * Adds an extra first segment in case the first 'from' is larger than the 'min' of the gauge.
   * Each segment is validated. On error returns full red.
   */
  private _getSegments(gauge: Gauge, min: number) {
    return getSegments(this, gauge, min);
  }

  /**
   * Get the configured segments array formatted as a tinygradient array (pos & color; from 0 to 1).
   * Adds an extra first solid segment in case the first 'from' is larger than the 'min' of the gauge.
   * Interpolates in case the first and/or last segment are beyond min/max.
   * Each segment is validated. On error returns full red.
   */
  private _getGradientSegments(gauge: Gauge, min: number, max: number) {
    return getGradientSegments(this, gauge, min, max);
  }

  /**
   * Compute the segment color at a specific value
   */
  private _computeSeverity(
    gauge: Gauge,
    min: number,
    max: number,
    value: number
  ) {
    return computeSeverity(this, gauge, min, max, value);
  }

  static styles = cardCSS;

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

    this._config = config;
  }

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

  private _computeCacheKey() {
    return hash(this._config);
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

  private _handleAction(ev: ActionHandlerEvent) {
    handleAction(this, this.hass!, this._config!, ev.detail.action!);
  }

  public isTemplate(key: TemplateKey) {
    if (key === undefined) return false;
    return String(getValueFromPath(this._config, key))?.includes("{");
  }

  public getValue(key: TemplateKey): any {
    return this.isTemplate(key)
      ? this._templateResults?.[key]?.result
      : getValueFromPath(this._config, key);
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

  protected render() {
    if (!this._config || !this.hass) return nothing;

    // primary
    const gradient = this._config!.gradient;
    const hasNeedle = this._config!.needle;
    const needleColor = this.getLightDarkModeColor(
      "needle_color",
      DEFAULT_NEEDLE_COLOR
    );
    const min = NumberUtils.toNumberOrDefault(
      this.getValue("min"),
      DEFAULT_MIN
    );
    const max = NumberUtils.toNumberOrDefault(
      this.getValue("max"),
      DEFAULT_MAX
    );
    const segments =
      hasNeedle && !gradient ? this._getSegments("main", min) : undefined;
    const gradientSegments =
      hasNeedle && gradient
        ? this._getGradientSegments("main", min, max)
        : undefined;
    const gradientResolution = this._config.gradient_resolution;

    const primaryValueAndValueText = this.getValueAndValueText("main", min);
    const value = primaryValueAndValueText.value;
    const primaryValueText = primaryValueAndValueText.valueText;
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
    let secondaryValueAndValueText;
    let secondaryValueText: string | undefined;
    const secondaryValueTextColor = this.getLightDarkModeColor(
      "value_texts.secondary_color",
      DEFAULT_VALUE_TEXT_COLOR
    );

    const hasInnerGauge =
      this._config.inner != null && typeof this._config.inner === "object";

    let innerGradient: boolean | undefined;
    let innerMax: number | undefined;
    let innerMin: number | undefined;
    let innerMode: string | undefined;
    let innerNeedleColor: string | undefined;
    let innerSegments: GaugeSegment[] | undefined;
    let innerGradientSegments: GradientSegment[] | undefined;
    let innerGradientResolution: string | number | undefined;
    let innerValue: number | undefined;
    let innerSetpoint: { value: number; color: string | undefined } | undefined;
    let innerSetpointValue: number | undefined;
    let innerSetpointNeedleColor: string | undefined;

    if (hasInnerGauge) {
      innerGradient = this._config!.inner?.gradient;
      innerMax = NumberUtils.toNumberOrDefault(this.getValue("inner.max"), max);
      innerMin = NumberUtils.toNumberOrDefault(this.getValue("inner.min"), min);
      innerMode = this._config!.inner!.mode;
      innerNeedleColor = this.getLightDarkModeColor(
        "inner.needle_color",
        DEFAULT_NEEDLE_COLOR
      );
      if (!innerGradient && ["static", "needle"].includes(innerMode!)) {
        innerSegments = this._getSegments("inner", innerMin);
      }

      if (innerGradient && ["static", "needle"].includes(innerMode!)) {
        innerGradientSegments = this._getGradientSegments(
          "inner",
          innerMin,
          innerMax
        );

        innerGradientResolution = this._config.inner!.gradient_resolution;
      }

      const stateObj2 = this._config.entity2
        ? this.hass.states[this._config.entity2]
        : undefined;

      let _innerValue = this.getValue("inner.value");
      if (!_innerValue && stateObj2) {
        _innerValue = stateObj2.state;
      }
      innerValue = NumberUtils.toNumberOrDefault(_innerValue, min);
      innerSetpoint = this.getSetpoint("inner");
      innerSetpointValue = innerSetpoint?.value;
      innerSetpointNeedleColor = innerSetpoint?.color;

      secondaryValueAndValueText = this.getValueAndValueText("inner", innerMin);
      innerValue = secondaryValueAndValueText.value;
    } else {
      secondaryValueAndValueText = this.getValueAndValueText("inner", 0);
    }
    secondaryValueText = secondaryValueAndValueText.valueText;

    // setpoint needle
    const setpoint = this.getSetpoint("main");
    const setpointValue = setpoint?.value;
    const setpointNeedleColor = setpoint?.color;

    // primary title
    const primaryTitle = this.getValue("titles.primary");
    const primaryTitleColor = this.getLightDarkModeColor(
      "titles.primary_color",
      DEFAULT_TITLE_COLOR
    );
    let primaryTitleFontSize = this.getValue("titles.primary_font_size");
    if (!primaryTitleFontSize || !isValidFontSize(primaryTitleFontSize))
      primaryTitleFontSize = DEFAULT_TITLE_FONT_SIZE_PRIMARY;

    // secondary title
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

    // styles
    const gaugeColor = !this._config!.needle
      ? this._computeSeverity("main", min, max, value!)
      : undefined;
    const innerGaugeColor =
      hasInnerGauge && innerMode == "severity" && innerValue! > innerMin!
        ? this._computeSeverity("inner", innerMin!, innerMax!, innerValue!)
        : undefined;

    // icon
    const icon = this.getIcon();
    let iconIcon: string | undefined;
    let iconColor: string | undefined;
    let iconLabel: string | undefined;
    if (icon) {
      iconIcon = icon.icon;
      iconColor = icon.color;
      iconLabel = icon.label;
    }

    // needle shapes
    const needleShapeMain =
      this.getValue("needle_shapes.main") ?? MAIN_GAUGE_NEEDLE;
    const needleShapeMainWithInner =
      this.getValue("needle_shapes.main_with_inner") ??
      MAIN_GAUGE_NEEDLE_WITH_INNER;
    const needleShapeMainSetpoint =
      this.getValue("needle_shapes.main_setpoint") ??
      MAIN_GAUGE_SETPOINT_NEEDLE;
    const needleShapeInner =
      this.getValue("needle_shapes.inner") ?? INNER_GAUGE_NEEDLE;
    const needleShapeInnerOnMain =
      this.getValue("needle_shapes.inner_on_main") ??
      INNER_GAUGE_ON_MAIN_NEEDLE;
    const needleShapeInnerSetpoint =
      this.getValue("needle_shapes.inner_setpoint") ??
      INNER_GAUGE_SETPOINT_NEEDLE;
    const needleShapeInnerSetpointOnMain =
      this.getValue("needle_shapes.inner_setpoint_on_main") ??
      INNER_GAUGE_SETPOINT_ON_MAIN_NEEDLE;

    // background
    const hideBackground = this._config!.hide_background
      ? "background: none; border: none; box-shadow: none"
      : undefined;

    const hasCardAction =
      !this._config?.tap_action ||
      hasAction(this._config?.tap_action) ||
      hasAction(this._config?.hold_action) ||
      hasAction(this._config?.double_tap_action);

    return html`
      <ha-card
        style=${hideBackground}
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this._config.hold_action),
          hasDoubleClick: hasAction(this._config.double_tap_action),
        })}
        role=${ifDefined(hasCardAction ? "button" : undefined)}
        tabindex=${ifDefined(hasCardAction ? "0" : undefined)}
      >
        <gauge-card-pro-gauge
          .hass=${this.hass}
          ._config=${this._config}
          .gradient=${gradient}
          .max=${max}
          .min=${min}
          .needle=${hasNeedle}
          .needleColor=${needleColor}
          .primaryValueText=${primaryValueText}
          .primaryValueTextColor=${primaryValueTextColor}
          .primaryValueTextFontSizeReduction=${primaryValueTextFontSizeReduction}
          .secondaryValueText=${secondaryValueText}
          .secondaryValueTextColor=${secondaryValueTextColor}
          .segments=${segments}
          .gradientSegments=${gradientSegments}
          .gradientResolution=${gradientResolution}
          .value=${value}
          .hasInnerGauge=${hasInnerGauge}
          .innerGradient=${innerGradient}
          .iconIcon=${iconIcon}
          .iconColor=${iconColor}
          .iconLabel=${iconLabel}
          .innerMax=${innerMax}
          .innerMin=${innerMin}
          .innerMode=${innerMode}
          .innerNeedleColor=${innerNeedleColor}
          .innerSegments=${innerSegments}
          .innerSetpoint=${innerSetpoint !== undefined}
          .innerSetpointNeedleColor=${innerSetpointNeedleColor}
          .innerSetpointValue=${innerSetpointValue}
          .innerGradientSegments=${innerGradientSegments}
          .innerGradientResolution=${innerGradientResolution}
          .innerValue=${innerValue}
          .setpoint=${setpoint !== undefined}
          .setpointNeedleColor=${setpointNeedleColor}
          .setpointValue=${setpointValue}
          .needleShapeMain=${needleShapeMain}
          .needleShapeMainWithInner=${needleShapeMainWithInner}
          .needleShapeMainSetpoint=${needleShapeMainSetpoint}
          .needleShapeInner=${needleShapeInner}
          .needleShapeInnerOnMain=${needleShapeInnerOnMain}
          .needleShapeInnerSetpoint=${needleShapeInnerSetpoint}
          .needleShapeInnerSetpointOnMain=${needleShapeInnerSetpointOnMain}
          style=${styleMap({
            "--gauge-color": gaugeColor,
            "--inner-gauge-color": innerGaugeColor,
          })}
        ></gauge-card-pro-gauge>

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

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._config || !this.hass) return;
    this._tryConnect();
  }

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
}
