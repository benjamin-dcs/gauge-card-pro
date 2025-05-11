// External dependencies
import { UnsubscribeFunc } from "home-assistant-js-websocket";
import { html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import hash from "object-hash/dist/object_hash";

// Core HA helpers
import {
  actionHandler,
  ActionHandlerEvent,
  handleAction,
  hasAction,
  HomeAssistant,
  LovelaceCard,
  LovelaceCardEditor,
  RenderTemplateResult,
  subscribeRenderTemplate,
} from "../ha";

// Mushroom utilities
import { computeDarkMode } from "../mushroom/utils/base-element";
import { CacheManager } from "../mushroom/utils/cache-manager";
import { registerCustomCard } from "../mushroom/utils/custom-cards";

// General utilities
import { getValueFromPath } from "../utils/object/get-value";
import { migrate_parameters } from "../utils/migrate-parameters";
import { toNumberOrDefault } from "../utils/number/number-or-default";
import { trySetValue } from "../utils/object/set-value";
import { isValidFontSize } from "../utils/css/valid-font-size";

// Local constants & types
import { cardCSS } from "./css/card";
import {
  EDITOR_NAME,
  CARD_NAME,
  DEFAULT_INNER_MODE,
  DEFAULT_INNER_VALUE,
  DEFAULT_MIN,
  DEFAULT_MAX,
  DEFAULT_NEEDLE_COLOR,
  DEFAULT_SETPOINT_NEELDLE_COLOR,
  DEFAULT_TITLE_COLOR,
  DEFAULT_TITLE_FONT_SIZE_PRIMARY,
  DEFAULT_TITLE_FONT_SIZE_SECONDARY,
  DEFUALT_VALUE,
  DEFAULT_VALUE_TEXT_PRIMARY,
  DEFAULT_VALUE_TEXT_COLOR,
} from "./_const";
import { Gauge, GaugeCardProCardConfig, GaugeSegment } from "./config";

// Core functionality
import { GradientRenderer } from "./_gradient-renderer";
import { getSegments, computeSeverity } from "./_segments";
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
  "inner.max",
  "inner.min",
  "inner.needle_color",
  "inner.segments",
  "inner.value",
  "max",
  "min",
  "needle_color",
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
  "value_texts.secondary",
  "value_texts.secondary_color",
  "value_texts.secondary_unit",
] as const;
export type TemplateKey = (typeof TEMPLATE_KEYS)[number];

@customElement(CARD_NAME)
export class GaugeCardProCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() public _config?: GaugeCardProCardConfig;

  // template handling
  @state() private _templateResults?: TemplateResults;
  @state() private _unsubRenderTemplates: Map<
    TemplateKey,
    Promise<UnsubscribeFunc>
  > = new Map();

  // gradient renderers
  private _mainGaugeGradient = new GradientRenderer("main");
  private _innerGaugeGradient = new GradientRenderer("inner");

  /**
   * Get the configured segments array (from & color).
   * Adds an extra first solid segment in case the first 'from' is larger than the 'min' of the gauge.
   * Each segment is validated. On error returns full red.
   */
  private _getSegments(gauge: Gauge, min: number) {
    return getSegments(this, gauge, min);
  }

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
    _hass: HomeAssistant
  ): Promise<GaugeCardProCardConfig> {
    const entities = Object.keys(_hass.states);
    const numbers = entities.filter((e) =>
      ["counter", "input_number", "number", "sensor"].includes(e.split(".")[0])
    );

    return {
      type: `custom:${CARD_NAME}`,
      entity: numbers[0],
      segments: [
        { from: 0, color: "red" },
        { from: 50, color: "yellow" },
        { from: 100, color: "green" },
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
      const currentKeyValue = getValueFromPath(this._config, "key");
      const newKeyValue = getValueFromPath(config, "key");

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

    config = trySetValue(config, "value", DEFUALT_VALUE).result;

    config = trySetValue(
      config,
      "value_texts.primary",
      DEFAULT_VALUE_TEXT_PRIMARY
    ).result;

    if (config.entity2 !== undefined) {
      config = trySetValue(
        config,
        "inner.value",
        DEFAULT_INNER_VALUE,
        false,
        false
      ).result;
    }
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
    }

    return configColor ?? defaultColor;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;

    // main gauge
    const hasGradient = this._config!.gradient;
    const hasNeedle = this._config!.needle;
    const needleColor = this.getLightDarkModeColor(
      "needle_color",
      DEFAULT_NEEDLE_COLOR
    );
    const max = toNumberOrDefault(this.getValue("max"), DEFAULT_MAX);
    const min = toNumberOrDefault(this.getValue("min"), DEFAULT_MIN);
    const segments =
      hasNeedle && !hasGradient ? this._getSegments("main", min) : undefined;
    const value = toNumberOrDefault(this.getValue("value"), 0);

    // primary value text
    const primaryUnit = this.getValue("value_texts.primary_unit") ?? "";
    let primaryValueText = this.getValue("value_texts.primary") ?? value;
    primaryValueText = primaryValueText + primaryUnit;

    const primaryValueTextColor = this.getLightDarkModeColor(
      "value_texts.primary_color",
      DEFAULT_VALUE_TEXT_COLOR
    );

    // secondary value text
    const secondaryUnit = this.getValue("value_texts.secondary_unit") ?? "";
    let secondaryValueText = this.getValue("value_texts.secondary");
    secondaryValueText = secondaryValueText
      ? secondaryValueText + secondaryUnit
      : "";

    const secondaryValueTextColor = this.getLightDarkModeColor(
      "value_texts.secondary_color",
      DEFAULT_VALUE_TEXT_COLOR
    );

    // inner gauge
    const hasInnerGauge = this._config!.inner !== undefined;

    let innerHasGradient: boolean | undefined;
    let innerMax: number | undefined;
    let innerMin: number | undefined;
    let innerMode: string | undefined;
    let innerNeedleColor: string | undefined;
    let innerSegments: GaugeSegment[] | undefined;
    let innerValue: number | undefined;

    if (hasInnerGauge) {
      innerHasGradient = this._config!.inner?.gradient;
      innerMax = toNumberOrDefault(this.getValue("inner.max"), max);
      innerMin = toNumberOrDefault(this.getValue("inner.min"), min);
      innerMode = this._config!.inner!.mode;
      innerNeedleColor = this.getLightDarkModeColor(
        "inner.needle_color",
        DEFAULT_NEEDLE_COLOR
      );
      if (!innerHasGradient && ["static", "needle"].includes(innerMode!))
        innerSegments = this._getSegments("inner", innerMin);
      innerValue = toNumberOrDefault(this.getValue("inner.value"), 0);
    }

    // setpoint needle
    const hasSetpoint = this._config!.setpoint?.value !== undefined;
    let setpointNeedleColor;
    let setpointValue;

    if (hasSetpoint) {
      setpointNeedleColor = this.getLightDarkModeColor(
        "setpoint.color",
        DEFAULT_SETPOINT_NEELDLE_COLOR
      );
      setpointValue = toNumberOrDefault(this.getValue("setpoint.value"), 0);
    }

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
      ? this._computeSeverity("main", min, max, value)
      : undefined;
    const innerGaugeColor = hasInnerGauge
      ? this._computeSeverity("inner", innerMin!, innerMax!, innerValue!)
      : undefined;

    // background
    const hideBackground = this._config!.hide_background
      ? "background: none; border: none; box-shadow: none"
      : "";

    return html`
      <ha-card
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this._config.hold_action),
          hasDoubleClick: hasAction(this._config.double_tap_action),
        })}
        style=${hideBackground}
      >
        <gauge-card-pro-gauge
          .hass=${this.hass}
          .hasGradient=${hasGradient}
          .max=${max}
          .min=${min}
          .needle=${hasNeedle}
          .needleColor=${needleColor}
          .primaryValueText=${primaryValueText}
          .primaryValueTextColor=${primaryValueTextColor}
          .secondaryValueText=${secondaryValueText}
          .secondaryValueTextColor=${secondaryValueTextColor}
          .segments=${segments}
          .value=${value}
          .hasInnerGauge=${hasInnerGauge}
          .innerHasGradient=${innerHasGradient}
          .innerMax=${innerMax}
          .innerMin=${innerMin}
          .innerMode=${innerMode}
          .innerNeedleColor=${innerNeedleColor}
          .innerSegments=${innerSegments}
          .innerValue=${innerValue}
          .setpoint=${hasSetpoint}
          .setpointNeedleColor=${setpointNeedleColor}
          .setpointValue=${setpointValue}
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

    this._mainGaugeGradient.render(this);
    this._innerGaugeGradient.render(this);

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
