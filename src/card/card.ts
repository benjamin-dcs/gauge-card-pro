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
  DEFAULT_MIN,
  DEFAULT_MAX,
  DEFAULT_GRADIENT_RESOLUTION,
  GRADIENT_RESOLUTION_MAP,
  INFO_COLOR,
  WARNING_COLOR,
  ERROR_COLOR,
  SEVERITY_MAP,
} from "./_const";
import { GaugeCardProCardConfig } from "./config";
import { registerCustomCard } from "../mushroom/utils/custom-cards";
import "./gauge";

const templateCache = new CacheManager<TemplateResults>(1000);

type TemplateResults = Partial<
  Record<TemplateKey, RenderTemplateResult | undefined>
>;

registerCustomCard({
  type: CARD_NAME,
  name: "Gauge Card Pro",
  description: "Build beautiful Gauge cards using templates and gradients",
});

const TEMPLATE_KEYS = [
  "value",
  "valueText",
  "name",
  "min",
  "max",
  "segmentsTemplate",
  "severityTemplate",
] as const;
type TemplateKey = (typeof TEMPLATE_KEYS)[number];

type gradienSegment = {
  color: string;
  pos: number;
};

@customElement(CARD_NAME)
export class GaugeCardProCard extends LitElement implements LovelaceCard {
  @property({ type: Number }) public _prev_min?: number;

  @property({ type: Number }) public _prev_max?: number;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./editor");
    return document.createElement(EDITOR_NAME) as LovelaceCardEditor;
  }

  public static async getStubConfig(
    _hass: HomeAssistant
  ): Promise<GaugeCardProCardConfig> {
    return {
      type: `custom:${CARD_NAME}`,
      value: "{{ (range(0, 200) | random) / 100 - 1 }}",
      valueText: "{{ (range(0, 200) | random) }}",
      min: "-1",
      max: "1",
      needle: true,
      segments: [
        { from: -1, color: "red" },
        { from: -0.5, color: "yellow" },
        { from: 0, color: "green" },
      ],
      gradient: true,
      gradientResolution: "medium",
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
    TEMPLATE_KEYS.forEach((key) => {
      if (
        this._config?.[key] !== config[key] ||
        this._config?.entity != config.entity
      ) {
        this._tryDisconnectKey(key);
      }
    });
    this._config = {
      tap_action: {
        action: "toggle",
      },
      hold_action: {
        action: "more-info",
      },
      ...config,
    };
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
    if (!this._config) {
      return;
    }

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
    const value = this._config?.[key];
    return String(value)?.includes("{");
  }

  private getValue(key: TemplateKey) {
    return this.isTemplate(key)
      ? this._templateResults?.[key]?.result?.toString()
      : this._config?.[key];
  }

  private getSeverity() {
    const severity = this._templateResults?.["severityTemplate"]?.result;
    return severity ? Object(severity) : this._config!.severity;
  }

  private getSegments() {
    const segmentsTemplate =
      this._templateResults?.["segmentsTemplate"]?.result;
    return segmentsTemplate ? Object(segmentsTemplate) : this._config!.segments;
  }

  private _computeSeverity(numberValue: number): string | undefined {
    if (this._config!.needle) {
      return undefined;
    }

    // new format
    let segments = this.getSegments();
    if (segments) {
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
      return SEVERITY_MAP.normal;
    }

    // old format
    const sections = this.getSeverity();

    if (!sections) {
      return SEVERITY_MAP.normal;
    }

    const sectionsArray = Object.keys(sections);
    const sortable = sectionsArray.map((severity) => [
      severity,
      sections[severity],
    ]);

    for (const severity of sortable) {
      if (SEVERITY_MAP[severity[0]] == null || isNaN(severity[1])) {
        return SEVERITY_MAP.normal;
      }
    }
    sortable.sort((a, b) => a[1] - b[1]);

    if (numberValue >= sortable[0][1] && numberValue < sortable[1][1]) {
      return SEVERITY_MAP[sortable[0][0]];
    }
    if (numberValue >= sortable[1][1] && numberValue < sortable[2][1]) {
      return SEVERITY_MAP[sortable[1][0]];
    }
    if (numberValue >= sortable[2][1]) {
      return SEVERITY_MAP[sortable[2][0]];
    }
    return SEVERITY_MAP.normal;
  }

  private _severityLevels() {
    // new format
    const segments = this.getSegments();
    if (segments) {
      return segments.map((segment) => ({
        level: segment?.from,
        stroke: segment?.color,
      }));
    }

    // old format
    const sections = this.getSeverity();

    if (!sections) {
      return [{ level: 0, stroke: SEVERITY_MAP.normal }];
    }

    const sectionsArray = Object.keys(sections);
    return sectionsArray.map((severity) => ({
      level: sections[severity],
      stroke: SEVERITY_MAP[severity],
    }));
  }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    const value = Boolean(this.getValue("value"))
      ? Number(this.getValue("value"))
      : 0;
    const valueText = Boolean(this.getValue("valueText"))
      ? this.getValue("valueText")
      : "";
    const name = Boolean(this.getValue("name")) ? this.getValue("name") : "";
    const min = Boolean(this.getValue("min"))
      ? Number(this.getValue("min"))
      : DEFAULT_MIN;
    const max = Boolean(this.getValue("max"))
      ? Number(this.getValue("max"))
      : DEFAULT_MAX;

    return html`
      <ha-card
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this._config.hold_action),
          hasDoubleClick: hasAction(this._config.double_tap_action),
        })}
      >
        <gauge-card-pro-gauge
          .min=${min}
          .max=${max}
          .value=${value}
          .valueText=${valueText}
          .locale=${this.hass!.locale}
          style=${styleMap({
            "--gauge-color": this._computeSeverity(value),
          })}
          .needle=${this._config!.needle}
          .gradient=${this._config!.gradient}
          .levels=${this._config!.needle ? this._severityLevels() : undefined}
        ></gauge-card-pro-gauge>

        <div class="name" .title=${name}>${name}</div>
      </ha-card>
    `;
  }

  private _renderGradient(min: number, max: number): void {
    const levelPath = this.renderRoot
      .querySelector("ha-card > gauge-card-pro-gauge")
      ?.shadowRoot?.querySelector("#gradient-path");
    if (!levelPath) {
      return;
    }

    const severityLevels = this._severityLevels();
    let gradientSegments: gradienSegment[] = [];
    const diff = max - min;

    let firstSegmentCreated = false;
    for (let i = 0; i < severityLevels.length; i++) {
      let level = severityLevels[i].level;
      if (level < min || level > max) {
        continue;
      }
      level += min * -1;

      if (!firstSegmentCreated && level > min) {
        gradientSegments.push({ color: INFO_COLOR, pos: 0 });
      }

      const pos = level / diff;
      let color = severityLevels[i].stroke;

      if (color.includes("var(")) {
        color = window
          .getComputedStyle(document.body)
          .getPropertyValue(color.slice(4, -1));
      }

      gradientSegments.push({ color: color, pos: pos });
      firstSegmentCreated = true;
    }

    // gradient-path expects at least 2 segments
    if (gradientSegments.length < 2) {
      gradientSegments = [
        { color: WARNING_COLOR, pos: 0 },
        { color: ERROR_COLOR, pos: 1 },
      ];
    }

    //gradient-path expects an ordered array
    gradientSegments = gradientSegments.sort((a, b) => a.pos - b.pos);

    const gradientResolution: string =
      this._config &&
      this._config.gradientResolution !== undefined &&
      Object.keys(GRADIENT_RESOLUTION_MAP).includes(
        this._config.gradientResolution
      )
        ? this._config.gradientResolution
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
        width: 14,
        stroke: gradientSegments,
        strokeWidth: 1,
      });
    } catch (e) {
      console.error("{{ 🌈 Gauge Card Pro 🛠️ }} Error gradient:", e);
    }
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._config || !this.hass) {
      return;
    }

    const min = Boolean(this.getValue("min"))
      ? Number(this.getValue("min"))
      : DEFAULT_MIN;
    const max = Boolean(this.getValue("max"))
      ? Number(this.getValue("max"))
      : DEFAULT_MAX;

    // if ((min !== this._prev_min || max !== this._prev_max) && this._config.gradient) {
    if (this._config.gradient) {
      this._renderGradient(min, max);
    }

    this._prev_min = min;
    this._prev_max = max;

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
          template: String(this._config[key]) ?? "",
          entity_ids: this._config.entity_id,
          variables: {
            config: this._config,
            user: this.hass.user!.name,
            entity: this._config.entity,
          },
          strict: true,
        }
      );
      this._unsubRenderTemplates.set(key, sub);
      await sub;
    } catch (_err) {
      const result = {
        result: this._config[key] ?? "",
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
    if (!unsubRenderTemplate) {
      return;
    }

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

        .name {
          text-align: center;
          line-height: initial;
          color: var(--primary-text-color);
          width: 100%;
          font-size: 15px;
          margin-top: 8px;
        }
      `,
    ];
  }
}
