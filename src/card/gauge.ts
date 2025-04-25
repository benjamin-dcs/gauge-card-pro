import { LitElement } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { css, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { afterNextRender } from '../ha';
import { getValueInPercentage, normalize } from '../ha';

const getAngle = (value: number, min: number, max: number) => {
  const percentage = getValueInPercentage(normalize(value, min, max), min, max);
  return (percentage * 180) / 100;
};

export interface LevelDefinition {
  level: number;
  stroke: string;
}

@customElement('gauge-card-pro-gauge')
export class GaugeCardProGauge extends LitElement {
  // MAIN GAUGE

  @property({ type: Number }) public max = 100;

  @property({ type: Number }) public min = 0;

  @property({ type: Number }) public value = 0;

  @property({ attribute: false, type: String }) public value_text?: string;

  @property({ type: String }) public value_text_color = '';

  @property({ type: Boolean }) public needle = false;

  @property({ type: String }) public needle_color = '';

  @property({ type: Boolean }) public gradient = false;

  @property({ type: Array }) public levels?: LevelDefinition[];

  // INNER GAUGE

  @property({ type: Boolean }) public inner_segments_only = false;

  @property({ type: Array }) public inner_levels?: LevelDefinition[];

  @property({ type: Number }) public inner_max = 100;

  @property({ type: Number }) public inner_min = 0;

  @property({ type: Boolean }) public inner_gauge = false;

  @property({ type: Number }) public inner_value = 0;

  @property({ attribute: false, type: String })
  public inner_value_text?: string;

  @property({ type: String }) public inner_value_text_color = '';

  @state() private _angle = 0;

  @state() private _angle_inner = 0;

  @state() private _updated = false;

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;
      this._angle = getAngle(this.value, this.min, this.max);
      this._angle_inner = this.inner_gauge
        ? getAngle(this.inner_value, this.inner_min, this.inner_max)
        : 0;
      this._rescaleValueTextSvg();
    });
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (!this._updated) {
      return;
    }

    this._angle = getAngle(this.value, this.min, this.max);
    this._angle_inner = this.inner_gauge
      ? getAngle(this.inner_value, this.inner_min, this.inner_max)
      : 0;

    if (changedProperties.has('value_text')) {
      this._rescaleValueTextSvg('outer');
    }

    if (changedProperties.has('inner_value_text')) {
      this._rescaleValueTextSvg('inner');
    }
  }

  // M -40 0 A 40 40 0 0 1 40 0
  protected render() {
    return svg`
      <svg id="gradient-dial" viewBox="-50 -50 100 50" class="gauge">
        ${
          !this.needle || !this.levels
            ? svg`<path
                class="dial"
                d="M -40 0 A 40 40 0 0 1 40 0"
              ></path>`
            : ''
        }

        ${
          this.needle && this.gradient
            ? svg`<path
                id="gradient-path"
                class="dial"
                d="M -40 0 A 40 40 0 0 1 40 0"
                style=${styleMap({ opacity: '0%' })}
              ></path>`
            : ''
        }

        ${
          this.needle && this.levels && !this.gradient
            ? this.levels
                .sort((a, b) => a.level - b.level)
                .map((level, idx) => {
                  let firstPath: TemplateResult | undefined;
                  if (idx === 0 && level.level !== this.min) {
                    const angle = getAngle(this.min, this.min, this.max);
                    firstPath = svg`<path
                        class="level"
                        d="M
                          ${0 - 40 * Math.cos((angle * Math.PI) / 180)}
                          ${0 - 40 * Math.sin((angle * Math.PI) / 180)}
                          A 40 40 0 0 1 40 0"
                        style=${styleMap({ stroke: 'var(--info-color)' })}
                      ></path>`;
                  }
                  const angle = getAngle(level.level, this.min, this.max);
                  return svg`${firstPath}<path
                      class="level"
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
        this.inner_gauge &&
        !this.inner_segments_only &&
        this.inner_value > this.inner_min
          ? svg`
            <svg viewBox="-50 -50 100 50" class="inner-gauge-svg">
              <path
                class="value-inner-stroke"
                d="M -32.5 0 A 32.5 32.5 0 1 0 32.5 0"
                style=${styleMap({ transform: `rotate(${this._angle_inner + 1.5}deg)` })}
              ></path>
              <path
                class="value-inner"
                d="M -32 0 A 32 32 0 1 0 32 0"
                style=${styleMap({ transform: `rotate(${this._angle_inner}deg)` })}
              ></path>
            </svg> 
          `
          : ''
      }  

      ${
        this.inner_gauge && this.inner_segments_only && this.inner_levels
          ? svg`
            <svg viewBox="-50 -50 100 50" class="inner-gauge-svg">
              <path
                class="value-inner-stroke"
                d="M -32.5 0 A 32.5 32.5 0 0 1 32.5 0"
              ></path>
              ${this.inner_levels
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
                          class="level-inner"
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
                        class="level-inner"
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

      ${
        this.needle
          ? svg`
            <svg viewBox="-50 -50 100 50" class="needle-svg">
              <path
                class="needle"
                d="M -27.5 -2.25 L -47.5 0 L -27.5 2.25 z"
                style=${styleMap({ transform: `rotate(${this._angle}deg)`, fill: this.needle_color })}
              ></path>
            </svg> 
          `
          : ''
      }    

      <svg class="text">
        <text 
          class="value-text"
          style=${styleMap({ fill: this.value_text_color })}>
          ${this.value_text}
        </text>
      </svg>

      <svg class="inner-text">
        <text 
          class="inner-value-text"
          style=${styleMap({ fill: this.inner_value_text_color })}>
          ${this.inner_value_text}
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

    if (['outer', 'both'].includes(gauge)) {
      _setViewBox('.text');
    }

    if (['inner', 'both'].includes(gauge)) {
      _setViewBox('.inner-text');
    }
  }

  static styles = css`
    :host {
      position: relative;
    }
    .dial {
      fill: none;
      stroke: var(--primary-background-color);
      stroke-width: 15;
    }
    .inner-gauge-svg {
      position: absolute;
      top: 0;
    }
    .value {
      fill: none;
      stroke-width: 15;
      stroke: var(--gauge-color);
      transition: all 1s ease 0s;
    }
    .value-inner {
      fill: none;
      stroke-width: 5;
      stroke: var(--inner-gauge-color);
      transition: all 1.5s ease 0s;
    }
    .value-inner-stroke {
      fill: none;
      stroke-width: 6;
      stroke: var(--card-background-color);
      transition: all 1.5s ease 0s;
    }
    .needle-svg {
      position: absolute;
      top: 0;
    }
    .needle {
      transition: all 1s ease 0s;
    }
    .level {
      fill: none;
      stroke-width: 15;
    }
    .level-inner {
      fill: none;
      stroke-width: 5;
    }
    .gauge {
      display: block;
    }
    .text {
      position: absolute;
      max-height: 40%;
      max-width: 55%;
      left: 50%;
      bottom: -6%;
      transform: translate(-50%, 0%);
      z-index: 0;
    }
    .value-text {
      font-size: 50px;
      text-anchor: middle;
      direction: ltr;
    }
    .inner-text {
      position: absolute;
      max-height: 22%;
      max-width: 45%;
      left: 50%;
      bottom: 29%;
      transform: translate(-50%, 0%);
      z-index: 1;
    }
    .inner-value-text {
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
