import { LitElement } from "lit";
import type { PropertyValues, TemplateResult } from "lit";
import { css, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { afterNextRender } from "../ha";
import { getValueInPercentage, normalize } from "../ha";

const getAngle = (value: number, min: number, max: number) => {
  const percentage = getValueInPercentage(normalize(value, min, max), min, max);
  return (percentage * 180) / 100;
};

export interface LevelDefinition {
  level: number;
  stroke: string;
}

@customElement("gauge-card-pro-gauge")
export class GaugeCardProGauge extends LitElement {
  @property({ type: Number }) public min = 0;

  @property({ type: Number }) public max = 100;

  @property({ type: Number }) public value = 0;

  @property({ attribute: false })
  public formatOptions?: Intl.NumberFormatOptions;

  @property({ attribute: false, type: String }) public valueText?: string;

  @property({ type: Boolean }) public needle = false;

  @property({ type: Boolean }) public gradient = false;

  @property({ type: Array }) public levels?: LevelDefinition[];

  @state() private _angle = 0;

  @state() private _updated = false;

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;
      this._angle = getAngle(this.value, this.min, this.max);
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
    this._rescaleSvg();
  }

  protected render() {
    return svg`
      <svg id="gradient-dial" viewBox="-50 -50 100 50" class="gauge">
        ${
          !this.needle || !this.levels
            ? svg`<path
                class="dial"
                d="M -40 0 A 40 40 0 0 1 40 0"
              ></path>`
            : ""
        }

        ${
          this.needle && this.levels && this.gradient
            ? svg`<path
                id="gradient-path"
                class="dial"
                d="M -40 0 A 40 40 0 0 1 40 0"
                style="opacity: 0%;"
              ></path>`
            : ""
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
                        stroke="var(--info-color)"
                        class="level"
                        d="M
                          ${0 - 40 * Math.cos((angle * Math.PI) / 180)}
                          ${0 - 40 * Math.sin((angle * Math.PI) / 180)}
                         A 40 40 0 0 1 40 0
                        "
                      ></path>`;
                  }
                  const angle = getAngle(level.level, this.min, this.max);
                  return svg`${firstPath}<path
                      stroke="${level.stroke}"
                      class="level"
                      d="M
                        ${0 - 40 * Math.cos((angle * Math.PI) / 180)}
                        ${0 - 40 * Math.sin((angle * Math.PI) / 180)}
                       A 40 40 0 0 1 40 0
                      "
                    ></path>`;
                })
            : ""
        }
        ${
          !this.needle
            ? svg`<path
                class="value"
                d="M -40 0 A 40 40 0 1 0 40 0"
                style=${styleMap({ transform: `rotate(${this._angle}deg)` })}
              > </path>`
            : ""
        }
       
      </svg>
      ${
        this.needle
          ? svg`
            <svg viewBox="-50 -50 100 50" style="position: absolute; top: 0">
              <path
                class="needle"
                d="M -25 -2.5 L -47.5 0 L -25 2.5 z"
                style=${styleMap({ transform: `rotate(${this._angle}deg)` })}
              ></path>
            </svg> 
          `
          : ""
      }      
      <svg class="text">
        <text class="value-text">
          ${this.valueText}
        </text>
      </svg>`;
  }

  private _rescaleSvg() {
    // Set the viewbox of the SVG containing the value to perfectly
    // fit the text
    // That way it will auto-scale correctly
    const svgRoot = this.shadowRoot!.querySelector(".text")!;
    const box = svgRoot.querySelector("text")!.getBBox()!;
    svgRoot.setAttribute(
      "viewBox",
      `${box.x} ${box!.y} ${box.width} ${box.height}`
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
      stroke-width: 15;
      stroke: var(--gauge-color);
      transition: all 1s ease 0s;
    }
    .needle {
      fill: var(--primary-text-color);
      transition: all 1s ease 0s;
    }
    .level {
      fill: none;
      stroke-width: 15;
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
      fill: var(--primary-text-color);
      text-anchor: middle;
      direction: ltr;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "gauge-card-pro-gauge": GaugeCardProGauge;
  }
}
