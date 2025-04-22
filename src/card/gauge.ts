import { LitElement } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { css, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { afterNextRender } from '../ha';
import { getValueInPercentage, normalize } from '../ha';
import {
  MAIN_GAUGE_RADIUS,
  MAIN_GAUGE_RADIUS_WITH_INNER,
  INNER_GAUGE_RADIUS,
  MAIN_GAUGE_STROKE_WIDTH,
  MAIN_GAUGE_STROKE_WIDTH_WITH_INNER,
} from './_const';

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

  @property({ type: Number }) public inner_max = 100;

  @property({ type: Number }) public inner_min = 0;

  @property({ type: Boolean }) public inner_gauge = false;

  @property({ type: Array }) public inner_levels?: LevelDefinition[];

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
      this._angle_inner = getAngle(
        this.inner_value,
        this.inner_min,
        this.inner_max
      );
      this._rescaleSvg();
    });
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    // if (
    //   !this._updated ||
    //   (!changedProperties.has("value") &&
    //     !changedProperties.has("valueText") &&
    //     !changedProperties.has("min") &&
    //     !changedProperties.has("max") &&
    //     !changedProperties.has("needle"))
    // ) {
    //   return;
    // }

    if (!this._updated) {
      return;
    }

    this._angle = getAngle(this.value, this.min, this.max);
    this._angle_inner = getAngle(
      this.inner_value,
      this.inner_min,
      this.inner_max
    );
    this._rescaleSvg();
  }

  // M -40 0 A 40 40 0 0 1 40 0
  protected render() {
    const _main_gauge_radius = !this.inner_gauge
      ? MAIN_GAUGE_RADIUS
      : MAIN_GAUGE_RADIUS_WITH_INNER;

    const main_gauge_move = `M -${_main_gauge_radius} 0`;
    const main_gauge_arc = `A ${_main_gauge_radius} ${_main_gauge_radius} 0 1 0 ${_main_gauge_radius} 0`;
    const main_gauge_level_arc = `A ${_main_gauge_radius} ${_main_gauge_radius} 0 0 1 ${_main_gauge_radius} 0`;

    const _inner_gauge = `M -${INNER_GAUGE_RADIUS} 0 A ${INNER_GAUGE_RADIUS} ${INNER_GAUGE_RADIUS} 0 1 0 ${INNER_GAUGE_RADIUS} 0`;

    const stroke_width = !this.inner_gauge
      ? MAIN_GAUGE_STROKE_WIDTH
      : MAIN_GAUGE_STROKE_WIDTH_WITH_INNER;

    return svg`
      <svg id="gradient-dial" viewBox="-50 -50 100 50" class="gauge">
        ${
          !this.needle || !this.levels
            ? svg`<path
                class="dial"
                d="${main_gauge_move} ${main_gauge_level_arc}"
              ></path>`
            : ''
        }

        ${
          this.needle && this.levels && this.gradient
            ? svg`<path
                id="gradient-path"
                class="dial"
                d="${main_gauge_move} ${main_gauge_level_arc}"
                style=${styleMap({ opacity: '25%', stroke: '#000' })}
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
                          ${0 - _main_gauge_radius * Math.cos((angle * Math.PI) / 180)}
                          ${0 - _main_gauge_radius * Math.sin((angle * Math.PI) / 180)}
                          ${main_gauge_level_arc}"
                        style=${styleMap({ stroke: 'var(--info-color)', 'stroke-width': stroke_width })}
                      ></path>`;
                  }
                  const angle = getAngle(level.level, this.min, this.max);
                  return svg`${firstPath}<path
                      class="level"
                      d="M
                        ${0 - _main_gauge_radius * Math.cos((angle * Math.PI) / 180)}
                        ${0 - _main_gauge_radius * Math.sin((angle * Math.PI) / 180)}
                        ${main_gauge_level_arc}
                      "
                      style=${styleMap({ stroke: level.stroke, 'stroke-width': stroke_width })}
                    ></path>`;
                })
            : ''
        }
        ${
          !this.needle
            ? svg`<path
                class="value"
                d="${main_gauge_move} ${main_gauge_arc}"
                style=${styleMap({ transform: `rotate(${this._angle}deg)`, 'stroke-width': stroke_width })}
              > </path>`
            : ''
        }
       
      </svg>

      ${
        this.inner_gauge
          ? svg`
            <svg viewBox="-50 -50 100 50" style="position: absolute; top: 0">
              <path
                class="value_inner"
                d=${_inner_gauge}
                style=${styleMap({ transform: `rotate(${this._angle_inner}deg)` })}
              ></path>
            </svg> 
          `
          : ''
      }  

      ${
        this.needle
          ? svg`
            <svg viewBox="-50 -50 100 50" style="position: absolute; top: 0">
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

  private _rescaleSvg() {
    // Set the viewbox of the SVG containing the value to perfectly
    // fit the text
    // That way it will auto-scale correctly
    const svgRoot = this.shadowRoot!.querySelector('.text')!;
    const box = svgRoot.querySelector('text')!.getBBox()!;
    svgRoot.setAttribute(
      'viewBox',
      `${box.x} ${box!.y} ${box.width} ${box.height}`
    );

    const svgInnerRoot = this.shadowRoot!.querySelector('.inner-text')!;
    const innerBox = svgInnerRoot.querySelector('text')!.getBBox()!;
    svgInnerRoot.setAttribute(
      'viewBox',
      `${innerBox.x} ${innerBox!.y} ${innerBox.width} ${innerBox.height}`
    );
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
    .value {
      fill: none;
      stroke: var(--gauge-color);
      transition: all 1s ease 0s;
    }
    .value_inner {
      fill: none;
      stroke-width: 5;
      stroke: var(--inner-gauge-color);
      transition: all 1s ease 0s;
    }
    .needle {
      transition: all 1s ease 0s;
    }
    .level {
      fill: none;
      // stroke-width: 15;
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
    }
    .value-text {
      font-size: 50px;
      text-anchor: middle;
      direction: ltr;
    }
    .inner-text {
      position: absolute;
      max-height: 22%;
      max-width: 40%;
      left: 50%;
      bottom: 29%;
      transform: translate(-50%, 0%);
      border: 1;
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
