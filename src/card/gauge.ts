import { LitElement } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { css, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { afterNextRender } from '../ha';
import { getValueInPercentage, normalize } from '../ha';
import {
  MAIN_GAUGE_NEEDLE,
  MAIN_GAUGE_NEEDLE_WITH_INNER,
  MAIN_GAUGE_SETPOINT_NEEDLE,
  INNER_GAUGE_NEEDLE,
} from './_const';

const getAngle = (value: number, min: number, max: number) => {
  const percentage = getValueInPercentage(normalize(value, min, max), min, max);
  return (percentage * 180) / 100;
};

export interface SegmentDefinition {
  level: number;
  stroke: string;
}

@customElement('gauge-card-pro-gauge')
export class GaugeCardProGauge extends LitElement {
  // main gauge

  @property({ type: Boolean }) public gradient = false;
  @property({ type: Array }) public segments?: SegmentDefinition[];
  @property({ type: Number }) public max = 100;
  @property({ type: Number }) public min = 0;
  @property({ type: Boolean }) public needle = false;
  @property({ type: String }) public needle_color = '';
  @property({ type: Number }) public value = 0;

  // value texts
  @property({ attribute: false, type: String })
  public primary_value_text?: string;
  @property({ type: String }) public primary_value_text_color = '';

  @property({ attribute: false, type: String })
  public secondary_value_text?: string;
  @property({ type: String }) public secondary_value_text_color = '';

  // inner gauge

  @property({ type: Boolean }) public inner_gauge = false;
  @property({ type: Boolean }) public inner_gradient = false;
  @property({ type: Array }) public inner_segments?: SegmentDefinition[];
  @property({ type: Number }) public inner_max = 100;
  @property({ type: Number }) public inner_min = 0;
  @property({ type: Boolean }) public inner_mode = 'severity';
  @property({ type: String }) public inner_needle_color = '';
  @property({ type: Number }) public inner_value = 0;

  @property({ type: Boolean }) public setpoint = false;
  @property({ type: String }) public setpoint_needle_color = '';
  @property({ type: Number }) public setpoint_value = 0;

  @state() private _angle = 0;
  @state() private _inner_angle = 0;
  @state() private _setpoint_angle = 0;
  @state() private _updated = false;

  private _calculate_angles() {
    this._angle = getAngle(this.value, this.min, this.max);
    this._inner_angle = this.inner_gauge
      ? getAngle(this.inner_value, this.inner_min, this.inner_max)
      : 0;
    this._setpoint_angle = getAngle(this.setpoint_value, this.min, this.max);
  }

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;
      this._calculate_angles();
      this._rescaleValueTextSvg();
    });
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (!this._updated) {
      return;
    }

    this._calculate_angles();

    if (changedProperties.has('primary_value_text')) {
      this._rescaleValueTextSvg('primary');
    }

    if (changedProperties.has('secondary_value_text')) {
      this._rescaleValueTextSvg('secondary');
    }
  }

  protected render() {
    return svg`
      <svg id="main-gauge" viewBox="-50 -50 100 50" class="gauge">
        ${
          !this.needle || !this.segments
            ? svg`<path
                class="dial"
                d="M -40 0 A 40 40 0 0 1 40 0"
              ></path>`
            : ''
        }

        ${
          this.needle && this.segments && this.gradient
            ? svg`<path
                id="gradient-path"
                class="dial"
                d="M -40 0 A 40 40 0 0 1 40 0"
                style=${styleMap({ opacity: '0%' })}
              ></path>`
            : ''
        }

        ${
          this.needle && this.segments && !this.gradient
            ? this.segments
                .sort((a, b) => a.level - b.level)
                .map((level, idx) => {
                  let firstPath: TemplateResult | undefined;
                  if (idx === 0 && level.level !== this.min) {
                    const angle = getAngle(this.min, this.min, this.max);
                    firstPath = svg`<path
                        class="segment"
                        d="M
                          ${0 - 40 * Math.cos((angle * Math.PI) / 180)}
                          ${0 - 40 * Math.sin((angle * Math.PI) / 180)}
                          A 40 40 0 0 1 40 0"
                        style=${styleMap({ stroke: 'var(--info-color)' })}
                      ></path>`;
                  }
                  const angle = getAngle(level.level, this.min, this.max);
                  return svg`${firstPath}<path
                      class="segment"
                      d="M
                        ${0 - 40 * Math.cos((angle * Math.PI) / 180)}
                        ${0 - 40 * Math.sin((angle * Math.PI) / 180)}
                        A 40 40 0 0 1 40 0"
                      style=${styleMap({ stroke: level.stroke })}
                    ></path>`;
                })
            : ''
        }
        ${
          !this.needle
            ? svg`<path
                class="value"
                d="M -40 0 A 40 40 0 1 0 40 0"
                style=${styleMap({ transform: `rotate(${this._angle}deg)` })}
              > </path>`
            : ''
        }
      </svg>

      ${
        this.inner_gauge
          ? svg`
            <svg id="inner-gauge" viewBox="-50 -50 100 50" class="inner-gauge">
      
          ${
            this.inner_mode == 'severity' && this.inner_value > this.inner_min
              ? svg`
                  <path
                    class="inner-value-stroke"
                    d="M -32.5 0 A 32.5 32.5 0 1 0 32.5 0"
                    style=${styleMap({ transform: `rotate(${this._inner_angle + 1.5}deg)` })}
                  ></path>
                  <path
                    class="inner-value"
                    d="M -32 0 A 32 32 0 1 0 32 0"
                    style=${styleMap({ transform: `rotate(${this._inner_angle}deg)` })}
                  ></path>
              `
              : ''
          }  

          ${
            ['static', 'needle'].includes(this.inner_mode) &&
            this.inner_segments
              ? svg`
                <path
                    class="inner-value-stroke"
                    d="M -32.5 0 A 32.5 32.5 0 0 1 32.5 0"
                ></path>`
              : ''
          }

          ${
            ['static', 'needle'].includes(this.inner_mode) &&
            this.inner_segments &&
            this.inner_gradient
              ? svg`<path
                  id="gradient-path"
                  class="dial"
                  d="M -32 0 A 32 32 0 0 1 32 0"
                  style=${styleMap({ opacity: '0%' })}
                ></path>`
              : ''
          }

          ${
            ['static', 'needle'].includes(this.inner_mode) &&
            this.inner_segments &&
            !this.inner_gradient
              ? svg`
                  ${this.inner_segments
                    .sort((a, b) => a.level - b.level)
                    .map((level, idx) => {
                      let firstPath: TemplateResult | undefined;
                      if (idx === 0 && level.level !== this.inner_min) {
                        const angle = getAngle(
                          this.inner_min,
                          this.inner_min,
                          this.inner_max
                        );
                        firstPath = svg`<path
                              class="inner-segment"
                              d="M
                                ${0 - 32 * Math.cos((angle * Math.PI) / 180)}
                                ${0 - 32 * Math.sin((angle * Math.PI) / 180)}
                                A 32 32 0 0 1 32 0"
                              style=${styleMap({ stroke: 'var(--info-color)' })}
                            ></path>`;
                      }
                      const angle = getAngle(
                        level.level,
                        this.inner_min,
                        this.inner_max
                      );
                      return svg`${firstPath}<path
                            class="inner-segment"
                            d="M
                              ${0 - 32 * Math.cos((angle * Math.PI) / 180)}
                              ${0 - 32 * Math.sin((angle * Math.PI) / 180)}
                              A 32 32 0 0 1 32 0"
                            style=${styleMap({ stroke: level.stroke })}
                          ></path>`;
                    })}
                </svg>`
              : ''
          }
        `
          : ''
      }

      ${
        this.needle || this.inner_mode === 'needle' || this.setpoint
          ? svg`
        <svg viewBox="-50 -50 100 50" class="needles">

          ${
            this.needle
              ? svg`
                <path
                  class="needle"
                  d=${
                    this.inner_gauge && this.inner_mode === 'needle'
                      ? MAIN_GAUGE_NEEDLE_WITH_INNER
                      : MAIN_GAUGE_NEEDLE
                  }
                  style=${styleMap({ transform: `rotate(${this._angle}deg)`, fill: this.needle_color })}
                ></path>`
              : ''
          }

          ${
            this.setpoint
              ? svg`
                <path
                  class="needle"
                  d=${MAIN_GAUGE_SETPOINT_NEEDLE}
                  style=${styleMap({ transform: `rotate(${this._setpoint_angle}deg)`, fill: this.setpoint_needle_color })}
                ></path>`
              : ''
          } 

          ${
            this.inner_mode === 'needle'
              ? svg`
                <path
                  class="needle"
                  d=${INNER_GAUGE_NEEDLE}
                  style=${styleMap({ transform: `rotate(${this._inner_angle}deg)`, fill: this.inner_needle_color })}
                ></path>`
              : ''
          } 

        </svg>`
          : ''
      }
      
      <svg class="primary-value-text">
        <text 
          class="value-text"
          style=${styleMap({ fill: this.primary_value_text_color })}>
          ${this.primary_value_text}
        </text>
      </svg>

      <svg class="secondary-value-text">
        <text 
          class="value-text"
          style=${styleMap({ fill: this.secondary_value_text_color })}>
          ${this.secondary_value_text}
        </text>
      </svg>
      `;
  }

  private _rescaleValueTextSvg(gauge: string = 'both') {
    // Set the viewbox of the SVG containing the value to perfectly
    // fit the text
    // That way it will auto-scale correctly

    const _setViewBox = (element: string) => {
      const svgRoot = this.shadowRoot!.querySelector(element)!;
      const box = svgRoot.querySelector('text')!.getBBox()!;
      svgRoot.setAttribute(
        'viewBox',
        `${box.x} ${box!.y} ${box.width} ${box.height}`
      );
    };

    if (['primary', 'both'].includes(gauge)) {
      _setViewBox('.primary-value-text');
    }

    if (['secondary', 'both'].includes(gauge)) {
      _setViewBox('.secondary-value-text');
    }
  }

  static styles = css`
    :host {
      position: relative;
    }
    .gauge {
      display: block;
    }
    .dial {
      fill: none;
      stroke: var(--primary-background-color);
      stroke-width: 15;
    }
    .inner-gauge {
      position: absolute;
      top: 0;
    }
    .value {
      fill: none;
      stroke-width: 15;
      stroke: var(--gauge-color);
      transition: all 1s ease 0s;
    }
    .inner-value {
      fill: none;
      stroke-width: 5;
      stroke: var(--inner-gauge-color);
      transition: all 1.5s ease 0s;
    }
    .inner-value-stroke {
      fill: none;
      stroke-width: 6;
      stroke: var(--card-background-color);
      transition: all 1.5s ease 0s;
    }
    .needles {
      position: absolute;
      top: 0;
    }
    .needle {
      transition: all 1s ease 0s;
    }
    .segment {
      fill: none;
      stroke-width: 15;
    }
    .inner-segment {
      fill: none;
      stroke-width: 5;
    }
    .primary-value-text {
      position: absolute;
      max-height: 40%;
      max-width: 55%;
      left: 50%;
      bottom: -6%;
      transform: translate(-50%, 0%);
    }
    .secondary-value-text {
      position: absolute;
      max-height: 22%;
      max-width: 45%;
      left: 50%;
      bottom: 29%;
      transform: translate(-50%, 0%);
    }
    .value-text {
      font-size: 50px;
      text-anchor: middle;
      direction: ltr;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'gauge-card-pro-gauge': GaugeCardProGauge;
  }
}
