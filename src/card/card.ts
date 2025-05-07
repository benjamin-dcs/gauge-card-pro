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
import { GradientPath } from "../gradient-path/gradient-path";
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
  DEFAULT_GRADIENT_RESOLUTION,
  DEFAULT_INNER_MODE,
  DEFAULT_INNER_VALUE,
  DEFAULT_MIN,
  DEFAULT_MAX,
  DEFAULT_NEEDLE_COLOR,
  DEFAULT_SETPOINT_NEELDLE_COLOR,
  DEFAULT_SEVERITY_COLOR,
  DEFAULT_TITLE_COLOR,
  DEFAULT_TITLE_FONT_SIZE_PRIMARY,
  DEFAULT_TITLE_FONT_SIZE_SECONDARY,
  DEFUALT_VALUE,
  DEFAULT_VALUE_TEXT_PRIMARY,
  DEFAULT_VALUE_TEXT_COLOR,
  GRADIENT_RESOLUTION_MAP,
  INFO_COLOR,
} from "./_const";
import { GaugeCardProCardConfig, GaugeSegment } from "./config";
import { migrate_parameters } from "../utils/migrate-parameters";
import { registerCustomCard } from "../mushroom/utils/custom-cards";
import { computeDarkMode } from "../mushroom/utils/base-element";
import { getComputedColor } from "../utils/color/computed-color";
import { isValidFontSize } from "../utils/css/valid-font-size";
import { toNumberOrDefault } from "../utils/number/number-or-default";
import { getValueFromPath } from "../utils/object/get-value";
import { trySetValue } from "../utils/object/set-value";
import "./gauge";
import tinygradient from "tinygradient";

const templateCache = new CacheManager<TemplateResults>(1000);

type TemplateResults = Partial<
  Record<TemplateKey, RenderTemplateResult | undefined>
>;

type Gauge = "main" | "inner";

registerCustomCard({
  type: CARD_NAME,
  name: "Gauge Card Pro",
  description: "Build beautiful Gauge cards using templates and gradients",
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
type TemplateKey = (typeof TEMPLATE_KEYS)[number];

type gradienSegment = {
  color?: string;
  pos: number;
};

@customElement(CARD_NAME)
export class GaugeCardProCard extends LitElement implements LovelaceCard {
  @property({ type: Number }) public _prev_min?: number;
  @property({ type: Number }) public _prev_max?: number;

  @property({ type: Number }) public _prev_inner_min?: number;
  @property({ type: Number }) public _prev_inner_max?: number;

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

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: GaugeCardProCardConfig;

  @state() private _templateResults?: TemplateResults;

  @state() private _unsubRenderTemplates: Map<
    TemplateKey,
    Promise<UnsubscribeFunc>
  > = new Map();

  @property({ reflect: true, type: String })
  public layout: string | undefined;

  public getCardSize(): number {
    return 4;
  }

  setConfig(config: GaugeCardProCardConfig): void {
    config = migrate_parameters(config);

    TEMPLATE_KEYS.forEach((key) => {
      const current_key_value = getValueFromPath(this._config, "key");
      const new_key_value = getValueFromPath(config, "key");

      if (
        new_key_value !== current_key_value ||
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
    if (key === undefined) false;
    return String(getValueFromPath(this._config, key))?.includes("{");
  }

  private getValue(key: TemplateKey): any {
    return this.isTemplate(key)
      ? this._templateResults?.[key]?.result
      : getValueFromPath(this._config, key);
  }

  private getLightDarkModeColor(
    key: TemplateKey,
    default_color: string
  ): string {
    let config_color = this.getValue(key);
    if (typeof config_color === "object") {
      config_color = Object(config_color);
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
    return this._config!.inner !== undefined;
  }

  private _hasSetpoint() {
    return this._config!.setpoint?.value !== undefined;
  }

  private _computeSeverity(
    gauge: Gauge,
    numberValue: number
  ): string | undefined {
    if (gauge === "main" && this._config!.needle) return undefined;

    const _gauge = gauge === "main" ? "" : "inner.";
    const _segments = this.getValue(<TemplateKey>`${_gauge}segments`);

    if (!_segments) return DEFAULT_SEVERITY_COLOR;

    let segments: GaugeSegment[] = _segments;
    segments = [...segments].sort((a, b) => a.from - b.from);

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (
        segment &&
        numberValue >= segment.from &&
        (i + 1 === segments.length || numberValue < segments[i + 1]?.from)
      ) {
        return segment.color;
      }
    }
    return DEFAULT_SEVERITY_COLOR;
  }

  private _getSegments(gauge: Gauge): GaugeSegment[] {
    const _gauge = gauge === "main" ? "" : "inner.";
    const segments: GaugeSegment[] = this.getValue(
      <TemplateKey>`${_gauge}segments`
    );

    if (!segments || !(typeof segments === "object")) {
      return [{ from: 0, color: DEFAULT_SEVERITY_COLOR }];
    }
    return segments.sort((a, b) => a.from - b.from);
  }

  private getRgbAtGaugePos(
    gauge: Gauge,
    min: number,
    max: number,
    value: number
  ): string {
    const interpolation =
      gauge === "main"
        ? this._config!.color_interpolation
        : this._config!.inner!.color_interpolation; // here we're sure to have an inner
    if (interpolation) {
      const gradienSegments = this._getGradientSegments(gauge, min, max);
      const _tinygradient = tinygradient(gradienSegments);
      let pos: number;
      pos = (value - min) / (max - min);
      pos = Math.round(pos * 100) / 100;

      if (pos < gradienSegments[0].pos) return INFO_COLOR;

      pos = Math.min(1, pos);
      return _tinygradient.rgbAt(pos).toHexString();
    } else {
      return this._computeSeverity(gauge, value)!;
    }
  }

  private getRgbAtPos(
    min: number,
    color_min: string,
    max: number,
    color_max: string,
    value: number
  ): string {
    const gradienSegments = [
      { pos: 0, color: color_min },
      { pos: 1, color: color_max },
    ];
    const _tinygradient = tinygradient(gradienSegments);
    let pos: number;
    pos = (value - min) / (max - min);
    pos = Math.round(pos * 100) / 100;
    pos = Math.min(1, pos);
    pos = Math.max(0, pos);
    return _tinygradient.rgbAt(pos).toHexString();
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;

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
    const gauge_color = !this._config!.needle
      ? this.getRgbAtGaugePos("main", min, max, value)
      : undefined;
    const inner_gauge_color = this._hasInnerGauge()
      ? this.getRgbAtGaugePos("inner", inner_min, inner_max, inner_value)
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

    const hide_background = this._config!.hide_background
      ? "background: none; border: none; box-shadow: none"
      : "";

    return html`
      <ha-card
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this._config.hold_action),
          hasDoubleClick: hasAction(this._config.double_tap_action),
        })}
        style=${hide_background}
      >
        <gauge-card-pro-gauge
          .gradient=${this._config!.gradient}
          .max=${max}
          .min=${min}
          .needle=${this._config!.needle}
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
          .segments=${this._config!.needle
            ? this._getSegments("main")
            : undefined}
          .value=${value}
          .inner_gauge=${this._hasInnerGauge()}
          .inner_gradient=${this._config!.inner?.gradient}
          .inner_max=${inner_max}
          .inner_min=${inner_min}
          .inner_mode=${(this._hasInnerGauge() && this._config!.inner?.mode) ||
          undefined
            ? this._config!.inner?.mode
            : "severity"}
          .inner_needle_color=${this.getLightDarkModeColor(
            "inner.needle_color",
            DEFAULT_NEEDLE_COLOR
          )}
          .inner_segments=${this._hasInnerGauge() && this._config!.inner!.mode
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

  private _getGradientSegments(
    gauge: Gauge,
    min: number,
    max: number
  ): gradienSegment[] {
    const segments = this._getSegments(gauge);
    const num_levels = segments.length;

    // gradient-path expects at least 2 segments
    if (num_levels < 2) {
      return [
        { color: segments[0].color, pos: 0 },
        { color: segments[0].color, pos: 1 },
      ];
    }

    let gradientSegments: gradienSegment[] = [];
    const diff = max - min;

    for (let i = 0; i < num_levels; i++) {
      let level = segments[i].from;
      let color = getComputedColor(segments[i].color);
      let pos: number;

      if (level < min) {
        let next_level: number;
        let next_color: string;
        if (i + 1 < num_levels) {
          next_level = segments[i + 1].from;
          next_color = segments[i + 1].color;
          if (next_level < min) {
            // both current level and next level are invisible -> skip
            continue;
          }
        } else {
          continue;
        }
        color = this.getRgbAtPos(level, color, next_level, next_color, min);
        pos = 0;
      } else if (level > max) {
        let prev_level: number;
        let prev_color: string;
        if (i > 0) {
          prev_level = segments[i - 1].from;
          prev_color = segments[i - 1].color;
          if (prev_level > max) {
            // both current level and previous level are invisible -> skip
            continue;
          }
        } else {
          continue;
        }
        color = this.getRgbAtPos(prev_level, prev_color, level, color, max);
        pos = 1;
      } else {
        level = level - min;
        pos = level / diff;
      }

      gradientSegments.push({ color: color, pos: pos });
    }

    if (gradientSegments.length < 2) {
      if (max <= segments[0].from) {
        // current range below lowest segment
        let color = getComputedColor(segments[0].color);
        return [
          { color: color, pos: 0 },
          { color: color, pos: 1 },
        ];
      } else {
        // current range above highest segment
        let color = getComputedColor(segments[num_levels - 1].color);
        return [
          { color: color, pos: 0 },
          { color: color, pos: 1 },
        ];
      }
    }

    if (gradientSegments[0].pos !== 0) {
      gradientSegments.unshift({
        color: INFO_COLOR,
        pos: gradientSegments[0].pos,
      });
      gradientSegments.unshift({ color: INFO_COLOR, pos: 0 });
    }

    return gradientSegments;
  }

  private _renderGradient(gauge: Gauge, min: number, max: number): void {
    const levelPath = this.renderRoot
      .querySelector("ha-card > gauge-card-pro-gauge")
      ?.shadowRoot?.querySelector("#" + gauge + "-gauge")
      ?.querySelector("#gradient-path");

    if (!levelPath) return;

    const gradientSegments = this._getGradientSegments(gauge, min, max);
    if (!gradientSegments) return;

    const config = gauge === "main" ? this._config : this._config?.inner;
    const width = gauge === "main" ? 14 : 4;
    const gradientResolution: string =
      config &&
      config.gradient_resolution !== undefined &&
      Object.keys(GRADIENT_RESOLUTION_MAP).includes(config.gradient_resolution)
        ? config.gradient_resolution
        : DEFAULT_GRADIENT_RESOLUTION;

    try {
      const gp = new GradientPath({
        path: levelPath,
        segments: GRADIENT_RESOLUTION_MAP[gradientResolution].segments,
        samples: GRADIENT_RESOLUTION_MAP[gradientResolution].samples,
        removeChild: false,
      });

      gp.render({
        type: "path",
        fill: gradientSegments,
        width: width,
        stroke: gradientSegments,
        strokeWidth: 1,
      });
    } catch (e) {
      console.error("{{ 🌈 Gauge Card Pro 🛠️ }} Error gradient:", e);
    }
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._config || !this.hass) return;

    const handleGradient = (
      gauge: Gauge,
      hasGradient: boolean | undefined,
      min: number,
      max: number,
      prevMin: number | undefined,
      prevMax: number | undefined,
      updatePrev: (vals: [number | undefined, number | undefined]) => void
    ): void => {
      if (!hasGradient) {
        updatePrev([undefined, undefined]);
        return;
      }

      const gradientPathContainer = this.renderRoot
        .querySelector("ha-card > gauge-card-pro-gauge")
        ?.shadowRoot?.querySelector(`#${gauge}-gauge`)
        ?.querySelector("#gradient-path-container");

      if (!gradientPathContainer || min !== prevMin || max !== prevMax) {
        this._renderGradient(gauge, min, max);
        updatePrev([min, max]);
      }
    };

    const min = toNumberOrDefault(this.getValue("min"), DEFAULT_MIN);
    const max = toNumberOrDefault(this.getValue("max"), DEFAULT_MAX);

    handleGradient(
      "main",
      this._config!.gradient,
      min,
      max,
      this._prev_min,
      this._prev_max,
      (v) => {
        this._prev_min = v[0];
        this._prev_max = v[1];
      }
    );

    const inner_min = toNumberOrDefault(this.getValue("inner.min"), min);
    const inner_max = toNumberOrDefault(this.getValue("inner.max"), max);

    handleGradient(
      "inner",
      this._config!.inner?.gradient,
      inner_min,
      inner_max,
      this._prev_inner_min,
      this._prev_inner_max,
      (v) => {
        this._prev_inner_min = v[0];
        this._prev_inner_max = v[1];
      }
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
