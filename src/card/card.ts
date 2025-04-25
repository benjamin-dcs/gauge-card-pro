import { UnsubscribeFunc } from 'home-assistant-js-websocket';
import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  nothing,
  PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { GradientPath } from '../gradient-path/gradient-path';
import { styleMap } from 'lit/directives/style-map.js';
import hash from 'object-hash/dist/object_hash';
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
} from '../ha';
import { CacheManager } from '../mushroom/utils/cache-manager';
import {
  EDITOR_NAME,
  CARD_NAME,
  DEFAULT_VALUE_TEXT_COLOR,
  DEFAULT_NAME_COLOR,
  DEFAULT_MIN,
  DEFAULT_MAX,
  DEFAULT_NEEDLE_COLOR,
  DEFAULT_GRADIENT_RESOLUTION,
  GRADIENT_RESOLUTION_MAP,
  INFO_COLOR,
  WARNING_COLOR,
  ERROR_COLOR,
  SEVERITY_MAP,
} from './_const';
import { GaugeCardProCardConfig, migrate_parameters } from './config';
import { registerCustomCard } from '../mushroom/utils/custom-cards';
import { computeDarkMode } from '../mushroom/utils/base-element';
import { getValueFromPath } from '../utils/getValueFromPath';
import './gauge';
import tinygradient from 'tinygradient';

const templateCache = new CacheManager<TemplateResults>(1000);

type TemplateResults = Partial<
  Record<TemplateKey, RenderTemplateResult | undefined>
>;

type Gauge = 'outer' | 'inner';

registerCustomCard({
  type: CARD_NAME,
  name: 'Gauge Card Pro',
  description: 'Build beautiful Gauge cards using templates and gradients',
});

const TEMPLATE_KEYS = [
  'inner.max',
  'inner.min',
  'inner.segments',
  'inner.severity',
  'inner.value',
  'inner.value_text',
  'inner.value_text_color',
  'max',
  'min',
  'name_color',
  'needle_color',
  'primary',
  'primary_color',
  'secondary',
  'secondary_color',
  'segments',
  'severity',
  'value',
  'value_text',
  'value_text_color',
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

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement(EDITOR_NAME) as LovelaceCardEditor;
  }

  public static async getStubConfig(
    _hass: HomeAssistant
  ): Promise<GaugeCardProCardConfig> {
    return {
      type: `custom:${CARD_NAME}`,
      value: '{{ (range(0, 200) | random) / 100 - 1 }}',
      segments: [
        { from: -1, color: 'red' },
        { from: -0.5, color: 'yellow' },
        { from: 0, color: 'green' },
      ],
      value_text: '{{ (range(0, 200) | random) }}',
      min: '-1',
      max: '1',
      needle: true,
      gradient: true,
      gradient_resolution: 'medium',
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
      const current_key_value = getValueFromPath(this._config, 'key');
      const new_key_value = getValueFromPath(config, 'key');

      if (
        new_key_value !== current_key_value ||
        this._config?.entity != config.entity ||
        this._config?.entity2 != config.entity2
      ) {
        this._tryDisconnectKey(key);
      }
    });

    this._config = {
      tap_action: {
        action: 'more-info',
      },
      value: '{{ states(entity) | float(0) }}',
      value_text: '{{ states(entity) | float(0) | round(1) }}',
      ...config,
      inner:
        config.inner !== undefined
          ? {
              value: '{{ states(entity2) | float(0) }}',
              value_text: '{{ states(entity2) | float(0) | round(1) }}',
              ...config.inner,
            }
          : undefined,
    };
  }

  public connectedCallback() {
    super.connectedCallback();
    this._config = migrate_parameters(this._config);
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
    if (key === undefined) {
      return false;
    }
    return String(getValueFromPath(this._config, key))?.includes('{');
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
    if (typeof config_color === 'object') {
      config_color = Object(config_color);
      const keys = Object.keys(config_color);

      if (keys.includes('light_mode') && keys.includes('dark_mode')) {
        config_color = computeDarkMode(this.hass)
          ? config_color['dark_mode']
          : config_color['light_mode'];
      }
    }

    return config_color ?? default_color;
  }

  private _hasInnerGauge() {
    return this._config!.inner !== undefined;
  }

  private _computeSeverity(
    gauge: Gauge,
    numberValue: number
  ): string | undefined {
    if (gauge === 'outer' && this._config!.needle) {
      return undefined;
    }
    const _gauge = gauge === 'outer' ? '' : 'inner.';

    // new format
    const _segments = this.getValue(<TemplateKey>`${_gauge}segments`);
    if (_segments) {
      let segments = Object(_segments);
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
    const _sections = this.getValue(<TemplateKey>`${_gauge}severity`);
    if (!_sections) {
      return SEVERITY_MAP.normal;
    }
    const sections = Object(_sections);
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

  private _severityLevels(gauge: Gauge) {
    const _gauge = gauge === 'outer' ? '' : 'inner.';

    // new format
    const _segments = this.getValue(<TemplateKey>`${_gauge}segments`);
    if (_segments) {
      const segments = Object(_segments);
      return segments.map((segment) => ({
        level: segment?.from,
        stroke: segment?.color,
      }));
    }

    // old format
    const _sections = this.getValue(<TemplateKey>`${_gauge}severity`);
    if (!_sections) {
      return [{ level: 0, stroke: SEVERITY_MAP.normal }];
    }
    const sections = Object(_sections);
    const sectionsArray = Object.keys(sections);
    return sectionsArray.map((severity) => ({
      level: sections[severity],
      stroke: SEVERITY_MAP[severity],
    }));
  }

  private getRgbAtGaugePos(
    gauge: Gauge,
    min: number,
    max: number,
    value: number
  ): string {
    const interpolation =
      gauge === 'outer'
        ? this._config!.color_interpolation
        : this._config!.inner!.color_interpolation; // here we're sure to have an inner
    if (interpolation) {
      const gradienSegments = this._getGradientSegments(gauge, min, max);
      const _tinygradient = tinygradient(gradienSegments);
      let pos: number;
      pos = (value - min) / (max - min);
      pos = Math.round(pos * 100) / 100;

      if (pos < gradienSegments[0].pos) {
        return INFO_COLOR;
      }

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
    if (!this._config || !this.hass) {
      return nothing;
    }

    const value = Boolean(this.getValue('value'))
      ? Number(this.getValue('value'))
      : 0;
    const value_text = Boolean(this.getValue('value_text')?.toString())
      ? this.getValue('value_text')
      : value;
    const primary = Boolean(this.getValue('primary'))
      ? this.getValue('primary')
      : '';
    const secondary = Boolean(this.getValue('secondary'))
      ? this.getValue('secondary')
      : '';
    const min = Boolean(this.getValue('min'))
      ? Number(this.getValue('min'))
      : DEFAULT_MIN;
    const max = Boolean(this.getValue('max'))
      ? Number(this.getValue('max'))
      : DEFAULT_MAX;
    const gauge_color = !this._config!.needle
      ? this.getRgbAtGaugePos('outer', min, max, value)
      : undefined;

    const inner_value = this._hasInnerGauge()
      ? Number(this.getValue('inner.value'))
      : 0;
    const inner_value_text =
      this._hasInnerGauge() &&
      Boolean(this.getValue('inner.value_text')?.toString())
        ? this.getValue('inner.value_text')
        : '';
    const inner_min =
      this._hasInnerGauge() &&
      (Boolean(this.getValue('inner.min')) || this.getValue('inner.min') === 0) // 0 is evaluated as false
        ? Number(this.getValue('inner.min'))
        : min;
    const inner_max =
      this._hasInnerGauge() && Boolean(this.getValue('inner.max'))
        ? Number(this.getValue('inner.max'))
        : max;
    const inner_gauge_color = this._hasInnerGauge()
      ? this.getRgbAtGaugePos('inner', inner_min, inner_max, inner_value)
      : undefined;

    const hide_background = this._config!.hide_background
      ? 'background: none; border: none; box-shadow: none'
      : '';

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
          .inner_segments_only=${this._hasInnerGauge() &&
          this._config!.inner!.all_segments}
          .inner_gauge=${this._hasInnerGauge()}
          .inner_levels=${this._hasInnerGauge() &&
          this._config!.inner!.all_segments
            ? this._severityLevels('inner')
            : undefined}
          .inner_max=${inner_max}
          .inner_min=${inner_min}
          .inner_value=${inner_value}
          .inner_value_text=${inner_value_text}
          .inner_value_text_color=${this.getLightDarkModeColor(
            'inner.value_text_color',
            DEFAULT_VALUE_TEXT_COLOR
          )}
          .levels=${this._config!.needle
            ? this._severityLevels('outer')
            : undefined}
          .locale=${this.hass!.locale}
          .max=${max}
          .min=${min}
          .needle=${this._config!.needle}
          .needle_color=${this.getLightDarkModeColor(
            'needle_color',
            DEFAULT_NEEDLE_COLOR
          )}
          .value=${value}
          .value_text=${value_text}
          .value_text_color=${this.getLightDarkModeColor(
            'value_text_color',
            DEFAULT_VALUE_TEXT_COLOR
          )}
          style=${styleMap({
            '--gauge-color': gauge_color,
            '--inner-gauge-color': inner_gauge_color,
          })}
        ></gauge-card-pro-gauge>

        <div
          class="primary"
          style=${styleMap({
            color: this.getLightDarkModeColor(
              'primary_color',
              DEFAULT_NAME_COLOR
            ),
          })}
          .title=${primary}
        >
          ${primary}
        </div>
        <div
          class="secondary"
          style=${styleMap({
            color: this.getLightDarkModeColor(
              'secondary_color',
              DEFAULT_NAME_COLOR
            ),
          })}
          .title=${secondary}
        >
          ${secondary}
        </div>
      </ha-card>
    `;
  }

  private _getGradientSegments(
    gauge: Gauge,
    min: number,
    max: number
  ): gradienSegment[] {
    const severityLevels = this._severityLevels(gauge).sort(
      (a, b) => a.level - b.level
    );
    const num_levels = severityLevels.length;

    // gradient-path expects at least 2 segments
    if (num_levels < 2) {
      return [
        { color: severityLevels[0].stroke, pos: 0 },
        { color: severityLevels[0].stroke, pos: 1 },
      ];
    }

    let gradientSegments: gradienSegment[] = [];
    const diff = max - min;

    for (let i = 0; i < num_levels; i++) {
      let level = severityLevels[i].level;
      let color = severityLevels[i].stroke;
      let pos: number;

      if (color.includes('var(')) {
        color = window
          .getComputedStyle(document.body)
          .getPropertyValue(color.slice(4, -1));
      }

      if (level < min) {
        let next_level: number;
        let next_color: string;
        if (i + 1 < num_levels) {
          next_level = severityLevels[i + 1].level;
          next_color = severityLevels[i + 1].stroke;
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
          prev_level = severityLevels[i - 1].level;
          prev_color = severityLevels[i - 1].stroke;
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
      if (max <= severityLevels[0].level) {
        // current range below lowest segment
        return [
          { color: severityLevels[0].stroke, pos: 0 },
          { color: severityLevels[0].stroke, pos: 1 },
        ];
      } else {
        // current range above highest segment
        return [
          { color: severityLevels[num_levels - 1].stroke, pos: 0 },
          { color: severityLevels[num_levels - 1].stroke, pos: 1 },
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

  private _renderGradient(min: number, max: number): void {
    const levelPath = this.renderRoot
      .querySelector('ha-card > gauge-card-pro-gauge')
      ?.shadowRoot?.querySelector('#gradient-path');
    if (!levelPath) {
      return;
    }

    const gradientSegments = this._getGradientSegments('outer', min, max);
    if (!gradientSegments) {
      return;
    }
    const gradientResolution: string =
      this._config &&
      this._config.gradient_resolution !== undefined &&
      Object.keys(GRADIENT_RESOLUTION_MAP).includes(
        this._config.gradient_resolution
      )
        ? this._config.gradient_resolution
        : DEFAULT_GRADIENT_RESOLUTION;

    try {
      const gp = new GradientPath({
        path: levelPath,
        segments: GRADIENT_RESOLUTION_MAP[gradientResolution].segments,
        samples: GRADIENT_RESOLUTION_MAP[gradientResolution].samples,
        removeChild: false,
      });

      gp.render({
        type: 'path',
        fill: gradientSegments,
        width: 13,
        stroke: gradientSegments,
        strokeWidth: 1,
      });
    } catch (e) {
      console.error('{{ 🌈 Gauge Card Pro 🛠️ }} Error gradient:', e);
    }
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._config || !this.hass) {
      return;
    }

    const min = Boolean(this.getValue('min'))
      ? Number(this.getValue('min'))
      : DEFAULT_MIN;
    const max = Boolean(this.getValue('max'))
      ? Number(this.getValue('max'))
      : DEFAULT_MAX;

    const gradientPathContainer = this.renderRoot
      .querySelector('ha-card > gauge-card-pro-gauge')
      ?.shadowRoot?.querySelector('#gradient-path-container');

    if (
      this._config.gradient &&
      (gradientPathContainer === null ||
        gradientPathContainer === undefined ||
        min !== this._prev_min ||
        max !== this._prev_max)
    ) {
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
          template: String(key_value) ?? '',
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
        result: key_value ?? '',
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
      if (err.code === 'not_found' || err.code === 'template_error') {
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

        .primary {
          text-align: center;
          line-height: initial;
          width: 100%;
          font-size: 15px;
          margin-top: 8px;
        }
        .secondary {
          text-align: center;
          line-height: initial;
          width: 100%;
          font-size: 14px;
        }
      `,
    ];
  }
}
