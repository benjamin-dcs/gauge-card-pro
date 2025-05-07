import { UnsubscribeFunc } from "home-assistant-js-websocket";
import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  nothing,
  PropertyValues,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { styleMap } from "lit/directives/style-map.js";
import hash from "object-hash/dist/object_hash";

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
import { CacheManager } from "../mushroom/utils/cache-manager";
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
import { Gauge, GaugeCardProCardConfig } from "./config";
import { migrate_parameters } from "../utils/migrate-parameters";
import { registerCustomCard } from "../mushroom/utils/custom-cards";
import { computeDarkMode } from "../mushroom/utils/base-element";
import { isValidFontSize } from "../utils/css/valid-font-size";
import { toNumberOrDefault } from "../utils/number/number-or-default";
import { getValueFromPath } from "../utils/object/get-value";
import { trySetValue } from "../utils/object/set-value";
import { getSegments, getRgbAtGaugePos } from "./_segments";
import { GradientRenderer } from "./_gradient-renderer";
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
  "value_texts.secondary",
  "value_texts.secondary_color",
] as const;
export type TemplateKey = (typeof TEMPLATE_KEYS)[number];

@customElement(CARD_NAME)
export class GaugeCardProCard extends LitElement implements LovelaceCard {
  private _getSegments(gauge: Gauge) {
    return getSegments(this, gauge);
  }

  private _getRgbAtGaugePos(
    gauge: Gauge,
    min: number,
    max: number,
    value: number
  ) {
    return getRgbAtGaugePos(this, gauge, min, max, value);
  }

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() public config?: GaugeCardProCardConfig;

  @state() private _templateResults?: TemplateResults;

  @state() private _unsubRenderTemplates: Map<
    TemplateKey,
    Promise<UnsubscribeFunc>
  > = new Map();

  @state() private main_gauge_gradient = new GradientRenderer("main");
  @state() private inner_gauge_gradient = new GradientRenderer("inner");

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
      const current_key_value = getValueFromPath(this.config, "key");
      const new_key_value = getValueFromPath(config, "key");

      if (
        new_key_value !== current_key_value ||
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
    this.config = config;
  }

  public connectedCallback() {
    super.connectedCallback();
    this._tryConnect();
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this._tryDisconnect();

    if (this.config && this._templateResults) {
      const key = this._computeCacheKey();
      templateCache.set(key, this._templateResults);
    }
  }

  private _computeCacheKey() {
    return hash(this.config);
  }

  protected willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (!this.config) return;

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
    handleAction(this, this.hass!, this.config!, ev.detail.action!);
  }

  public isTemplate(key: TemplateKey) {
    if (key === undefined) false;
    return String(getValueFromPath(this.config, key))?.includes("{");
  }

  public getValue(key: TemplateKey): any {
    return this.isTemplate(key)
      ? this._templateResults?.[key]?.result
      : getValueFromPath(this.config, key);
  }

  private getLightDarkModeColor(
    key: TemplateKey,
    default_color: string
  ): string {
    let config_color = this.getValue(key);
    if (typeof config_color === "object") {
      // config_color = Object(config_color);
      const keys = Object.keys(config_color);

      if (keys.includes("light_mode") && keys.includes("dark_mode")) {
        config_color = computeDarkMode(this.hass)
          ? config_color["dark_mode"]
          : config_color["light_mode"];
      }
    }

    return config_color ?? default_color;
  }

  private _hasInnerGauge() {
    return this.config!.inner !== undefined;
  }

  private _hasSetpoint() {
    return this.config!.setpoint?.value !== undefined;
  }

  protected render() {
    if (!this.config || !this.hass) return nothing;

    // main gauge
    const min = toNumberOrDefault(this.getValue("min"), DEFAULT_MIN);
    const max = toNumberOrDefault(this.getValue("max"), DEFAULT_MAX);
    const value = toNumberOrDefault(this.getValue("value"), 0);

    // value texts
    const primary_value_text = this.getValue("value_texts.primary") ?? value;
    const secondary_value_text = this.getValue("value_texts.secondary");

    // inner gauge
    const inner_min = toNumberOrDefault(this.getValue("inner.min"), min);
    const inner_max = toNumberOrDefault(this.getValue("inner.max"), max);
    const inner_value = toNumberOrDefault(this.getValue("inner.value"), 0);

    // setpoint needle
    const setpoint_value = toNumberOrDefault(
      this.getValue("setpoint.value"),
      0
    );

    // styles
    const gauge_color = !this.config!.needle
      ? this._getRgbAtGaugePos("main", min, max, value)
      : undefined;
    const inner_gauge_color = this._hasInnerGauge()
      ? this._getRgbAtGaugePos("inner", inner_min, inner_max, inner_value)
      : undefined;

    // card
    const primary_title = this.getValue("titles.primary");
    const _primary_title_font_size = this.getValue("titles.primary_font_size");
    const primary_title_font_size =
      _primary_title_font_size && isValidFontSize(_primary_title_font_size)
        ? _primary_title_font_size
        : DEFAULT_TITLE_FONT_SIZE_PRIMARY;

    const secondary_title = this.getValue("titles.secondary");
    const _secondary_title_font_size = this.getValue(
      "titles.secondary_font_size"
    );
    const secondary_title_font_size =
      _secondary_title_font_size && isValidFontSize(_secondary_title_font_size)
        ? _secondary_title_font_size
        : DEFAULT_TITLE_FONT_SIZE_SECONDARY;

    const hide_background = this.config!.hide_background
      ? "background: none; border: none; box-shadow: none"
      : "";

    return html`
      <ha-card
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this.config.hold_action),
          hasDoubleClick: hasAction(this.config.double_tap_action),
        })}
        style=${hide_background}
      >
        <gauge-card-pro-gauge
          .gradient=${this.config!.gradient}
          .max=${max}
          .min=${min}
          .needle=${this.config!.needle}
          .needle_color=${this.getLightDarkModeColor(
            "needle_color",
            DEFAULT_NEEDLE_COLOR
          )}
          .primary_value_text=${primary_value_text}
          .primary_value_text_color=${this.getLightDarkModeColor(
            "value_texts.primary_color",
            DEFAULT_VALUE_TEXT_COLOR
          )}
          .secondary_value_text=${secondary_value_text}
          .secondary_value_text_color=${this.getLightDarkModeColor(
            "value_texts.secondary_color",
            DEFAULT_VALUE_TEXT_COLOR
          )}
          .segments=${this.config!.needle
            ? this._getSegments("main")
            : undefined}
          .value=${value}
          .inner_gauge=${this._hasInnerGauge()}
          .inner_gradient=${this.config!.inner?.gradient}
          .inner_max=${inner_max}
          .inner_min=${inner_min}
          .inner_mode=${(this._hasInnerGauge() && this.config!.inner?.mode) ||
          undefined
            ? this.config!.inner?.mode
            : "severity"}
          .inner_needle_color=${this.getLightDarkModeColor(
            "inner.needle_color",
            DEFAULT_NEEDLE_COLOR
          )}
          .inner_segments=${this._hasInnerGauge() && this.config!.inner!.mode
            ? this._getSegments("inner")
            : undefined}
          .inner_value=${inner_value}
          .setpoint=${this._hasSetpoint()}
          .setpoint_needle_color=${this.getLightDarkModeColor(
            "setpoint.color",
            DEFAULT_SETPOINT_NEELDLE_COLOR
          )}
          .setpoint_value=${setpoint_value}
          .hass=${this.hass}
          style=${styleMap({
            "--gauge-color": gauge_color,
            "--inner-gauge-color": inner_gauge_color,
          })}
        ></gauge-card-pro-gauge>

        ${primary_title
          ? html` <div
              class="title primary-title"
              style=${styleMap({
                color: this.getLightDarkModeColor(
                  "titles.primary_color",
                  DEFAULT_TITLE_COLOR
                ),
                "font-size": primary_title_font_size,
              })}
              .title=${primary_title}
            >
              ${primary_title}
            </div>`
          : ""}
        ${secondary_title
          ? html` <div
              class="title"
              style=${styleMap({
                color: this.getLightDarkModeColor(
                  "titles.secondary_color",
                  DEFAULT_TITLE_COLOR
                ),
                "font-size": secondary_title_font_size,
              })}
              .title=${secondary_title}
            >
              ${secondary_title}
            </div>`
          : ""}
      </ha-card>
    `;
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this.config || !this.hass) return;

    const min = toNumberOrDefault(this.getValue("min"), DEFAULT_MIN);
    const max = toNumberOrDefault(this.getValue("max"), DEFAULT_MAX);
    this.main_gauge_gradient.render(
      this,
      this.config,
      min,
      max,
      this.renderRoot
    );

    const inner_min = toNumberOrDefault(this.getValue("inner.min"), min);
    const inner_max = toNumberOrDefault(this.getValue("inner.max"), max);
    this.inner_gauge_gradient.render(
      this,
      this.config,
      inner_min,
      inner_max,
      this.renderRoot
    );

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
          template: String(key_value) ?? "",
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

  static get styles(): CSSResultGroup {
    return [
      css`
        ha-card {
          height: 100%;
          overflow: hidden;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          box-sizing: border-box;
        }

        ha-card.action {
          cursor: pointer;
        }

        ha-card:focus {
          outline: none;
        }

        gauge-card-pro-gauge {
          width: 100%;
          max-width: 250px;
        }

        .title {
          text-align: center;
          line-height: initial;
          width: 100%;
        }

        .primary-title {
          margin-top: 8px;
        }
      `,
    ];
  }
}
