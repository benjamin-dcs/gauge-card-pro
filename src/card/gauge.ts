// External dependencies
import { html, LitElement, svg } from "lit";
import type { PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

// Internalized external dependencies
import { afterNextRender, HomeAssistant } from "../dependencies/ha";

// Local utilities
import { getAngle } from "../utils/number/get-angle";
import { isIcon, getIcon } from "../utils/string/icon";

// Local constants & types
import {
  MAIN_GAUGE_NEEDLE,
  MAIN_GAUGE_NEEDLE_WITH_INNER,
  MAIN_GAUGE_SETPOINT_NEEDLE,
  INNER_GAUGE_NEEDLE,
  INNER_GAUGE_ON_MAIN_NEEDLE,
} from "./const";

// Core functionality
import { Gauge, GaugeSegment, GradientSegment } from "./config";
import { gaugeCSS } from "./css/gauge";
import { GradientRenderer } from "./_gradient-renderer";

@customElement("gauge-card-pro-gauge")
export class GaugeCardProGauge extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  // main gauge
  @property({ type: Boolean }) public gradient = false;
  @property({ type: Number }) public max = 100;
  @property({ type: Number }) public min = 0;
  @property({ type: Boolean }) public needle = false;
  @property({ type: String }) public needleColor = "";
  @property({ type: Array }) public segments?: GaugeSegment[];
  @property({ type: Array }) public gradientSegments?: GradientSegment[];
  @property({ type: String }) public gradientResolution?: string;
  @property({ type: Number }) public value = 0;

  // value texts
  @property({ attribute: false, type: String })
  public primaryValueText?: string;
  @property({ type: String })
  public primaryValueTextColor = "";
  @property({ type: String }) public primaryValueTextFontSizeReduction = "";

  @property({ attribute: false, type: String })
  public secondaryValueText?: string;
  @property({ type: String }) public secondaryValueTextColor = "";

  // inner gauge
  @property({ type: Boolean }) public hasInnerGauge = false;

  @property({ type: Boolean }) public innerGradient = false;
  @property({ type: Number }) public innerMax = 100;
  @property({ type: Number }) public innerMin = 0;
  @property({ type: Boolean }) public innerMode = "severity";
  @property({ type: String }) public innerNeedleColor = "";
  @property({ type: Array }) public innerSegments?: GaugeSegment[];
  @property({ type: Array }) public innerGradientSegments?: GradientSegment[];
  @property({ type: String }) public innerGradientResolution?: string;
  @property({ type: Number }) public innerValue = 0;

  // setpoint
  @property({ type: Boolean }) public setpoint = false;
  @property({ type: String }) public setpointNeedleColor = "";
  @property({ type: Number }) public setpointValue = 0;

  // icons
  @property({ type: Number }) public iconIcon?: string;
  @property({ type: String }) public iconColor?: string;
  @property({ type: String }) public iconLabel?: string;

  @state() private _angle = 0;
  @state() private _inner_angle = 0;
  @state() private _setpoint_angle = 0;
  @state() private _updated = false;

  // gradient renderers
  private _mainGaugeGradient = new GradientRenderer("main");
  private _innerGaugeGradient = new GradientRenderer("inner");

  static styles = gaugeCSS;

  private shouldRenderGradient(gauge: Gauge): boolean {
    if (gauge === "main") {
      return (
        this.needle && this.gradient && this.gradientSegments !== undefined
      );
    }
    return (
      this.hasInnerGauge &&
      this.innerGradient &&
      ["static", "needle"].includes(this.innerMode) &&
      this.innerGradientSegments !== undefined
    );
  }

  private _calculate_angles() {
    this._angle = getAngle(this.value, this.min, this.max);
    this._inner_angle = this.hasInnerGauge
      ? getAngle(this.innerValue, this.innerMin, this.innerMax)
      : 0;
    this._setpoint_angle = getAngle(this.setpointValue, this.min, this.max);
  }

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;
      this._calculate_angles();
      this._rescaleValueTextSvg();

      if (this.shouldRenderGradient("main")) {
        this._mainGaugeGradient.initialize(
          this.renderRoot.querySelector("#main-gradient path"),
          this.gradientResolution
        );
      }

      if (this.shouldRenderGradient("inner")) {
        this._innerGaugeGradient.initialize(
          this.renderRoot.querySelector("#inner-gradient path"),
          this.innerGradientResolution
        );
      }
    });
  }

  protected render() {
    return svg`
      <svg id="main-gauge" viewBox="-50 -50 100 50" class="gauge">
        ${
          !this.needle
            ? svg`<path
                class="dial"
                d="M -40 0 A 40 40 0 0 1 40 0"
              ></path>
              <path
                class="value"
                d="M -40 0 A 40 40 0 1 0 40 0"
                style=${styleMap({ transform: `rotate(${this._angle}deg)` })}
              > </path>`
            : ""
        }

        ${
          this.needle && !this.gradient
            ? this.segments!.sort((a, b) => a.from - b.from).map((segment) => {
                const angle = getAngle(segment.from, this.min, this.max);
                return svg`<path
                      class="segment"
                      d="M
                        ${0 - 40 * Math.cos((angle * Math.PI) / 180)}
                        ${0 - 40 * Math.sin((angle * Math.PI) / 180)}
                        A 40 40 0 0 1 40 0"
                      style=${styleMap({ stroke: segment.color })}
                    ></path>`;
              })
            : ""
        }

        ${
          this.shouldRenderGradient("main")
            ? svg`
            <svg id="main-gradient" style="overflow: auto">
              <path
                fill="none"
                d="M -40 0 A 40 40 0 0 1 40 0"
              ></path>
            </svg>`
            : ""
        }
            
      </svg>

      ${
        this.hasInnerGauge
          ? svg`
            <svg id="inner-gauge" viewBox="-50 -50 100 50" class="inner-gauge">
      
          ${
            this.innerMode == "severity" && this.innerValue > this.innerMin
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
              : ""
          }  

          ${
            ["static", "needle"].includes(this.innerMode)
              ? svg`
                <path
                    class="inner-value-stroke"
                    d="M -32.5 0 A 32.5 32.5 0 0 1 32.5 0"
                ></path>`
              : ""
          }

          ${
            this.shouldRenderGradient("inner")
              ? svg`
              <svg id="inner-gradient" style="overflow: auto">
                <path
                  fill="none"
                  d="M -32 0 A 32 32 0 0 1 32 0"
                ></path>
              </svg>`
              : ""
          }

          ${
            !this.innerGradient &&
            ["static", "needle"].includes(this.innerMode) &&
            this.innerSegments
              ? svg`
                  ${this.innerSegments
                    .sort((a, b) => a.from - b.from)
                    .map((segment) => {
                      const angle = getAngle(
                        segment.from,
                        this.innerMin,
                        this.innerMax
                      );
                      return svg`<path
                            class="inner-segment"
                            d="M
                              ${0 - 32 * Math.cos((angle * Math.PI) / 180)}
                              ${0 - 32 * Math.sin((angle * Math.PI) / 180)}
                              A 32 32 0 0 1 32 0"
                            style=${styleMap({ stroke: segment.color })}
                          ></path>`;
                    })}
                </svg>`
              : ""
          }
        `
          : ""
      }

      ${
        this.needle || this.innerMode === "needle" || this.setpoint
          ? svg`
        <svg viewBox="-50 -50 100 50" class="needles">

          ${
            this.needle
              ? svg`
                <path
                  class="needle"
                  d=${
                    this.innerMode === "needle" ||
                    (this.innerMode === "on_main" && this.needle)
                      ? MAIN_GAUGE_NEEDLE_WITH_INNER
                      : MAIN_GAUGE_NEEDLE
                  }
                  style=${styleMap({ transform: `rotate(${this._angle}deg)`, fill: this.needleColor })}
                ></path>`
              : ""
          }

          ${
            this.setpoint
              ? svg`
                <path
                  class="needle"
                  d=${MAIN_GAUGE_SETPOINT_NEEDLE}
                  style=${styleMap({ transform: `rotate(${this._setpoint_angle}deg)`, fill: this.setpointNeedleColor })}
                ></path>`
              : ""
          } 

          ${
            this.innerMode === "needle" ||
            (this.innerMode === "on_main" && this.needle)
              ? svg`
                <path
                  class="needle"
                  d=${this.innerMode === "needle" ? INNER_GAUGE_NEEDLE : INNER_GAUGE_ON_MAIN_NEEDLE}
                  style=${styleMap({ transform: `rotate(${this._inner_angle}deg)`, fill: this.innerNeedleColor })}
                ></path>`
              : ""
          } 

        </svg>`
          : ""
      }
      
      ${
        !isIcon(this.primaryValueText)
          ? svg`
            <svg 
              class="primary-value-text"
              style=${styleMap({ "max-height": this.primaryValueTextFontSizeReduction })}>
              <text 
                class="value-text"
                style=${styleMap({ fill: this.primaryValueTextColor })}>
                ${this.primaryValueText}
              </text>
            </svg>`
          : html`<div class="primary-value-icon">
              <ha-state-icon
                .hass=${this.hass}
                .icon=${getIcon(this.primaryValueText!)}
                class="value-state-icon primary-value-state-icon"
                style=${styleMap({ color: this.primaryValueTextColor })}
              ></ha-state-icon>
            </div>`
      }

      ${
        !isIcon(this.secondaryValueText)
          ? svg`
            <svg class="secondary-value-text">
              <text 
                class="value-text"
                style=${styleMap({ fill: this.secondaryValueTextColor })}>
                ${this.secondaryValueText}
              </text>
            </svg>`
          : html`<div class="secondary-value-icon">
              <ha-state-icon
                .hass=${this.hass}
                .icon=${getIcon(this.secondaryValueText!)}
                class="value-state-icon secondary-value-state-icon"
                style=${styleMap({ color: this.secondaryValueTextColor })}
              ></ha-state-icon>
            </div>`
      }
      ${
        this.iconIcon
          ? html`<div class="icon-container">
              <div class="icon-inner-container">
                <ha-state-icon
                  .hass=${this.hass}
                  .icon=${this.iconIcon}
                  style=${styleMap({ color: this.iconColor })}
                ></ha-state-icon>
                <div
                  class="icon-label"
                  style=${styleMap({
                    color: "var(--primary-text-color)",
                    "font-size": "10px",
                  })}
                  .title=${this.iconLabel}
                >
                  ${this.iconLabel}
                </div>
              </div>
            </div> `
          : ""
      }
      `;
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (!this._updated) {
      return;
    }

    this._calculate_angles();

    if (changedProperties.has("primaryValueText")) {
      this._rescaleValueTextSvg("primary");
    }

    if (changedProperties.has("secondaryValueText")) {
      this._rescaleValueTextSvg("secondary");
    }

    if (this.gradient && this.needle && this.gradientSegments) {
      this._mainGaugeGradient.render(this.min, this.max, this.gradientSegments);
    }

    if (
      this.innerGradient &&
      ["static", "needle"].includes(this.innerMode) &&
      this.innerGradientSegments
    ) {
      this._innerGaugeGradient.render(
        this.innerMin,
        this.innerMax,
        this.innerGradientSegments
      );
    }
  }

  /**
   * Set the viewbox of the SVG containing the value to perfectly fit the text.
   * That way it will auto-scale correctly.
   */
  private _rescaleValueTextSvg(gauge: string = "both") {
    const _setViewBox = (element: string) => {
      const svgRoot = this.shadowRoot!.querySelector(element)!;
      const box = svgRoot.querySelector("text")!.getBBox()!;
      svgRoot.setAttribute(
        "viewBox",
        `${box.x} ${box!.y} ${box.width} ${box.height}`
      );
    };

    if (["primary", "both"].includes(gauge) && !isIcon(this.primaryValueText)) {
      _setViewBox(".primary-value-text");
    }

    if (
      ["secondary", "both"].includes(gauge) &&
      !isIcon(this.secondaryValueText)
    ) {
      _setViewBox(".secondary-value-text");
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gauge-card-pro-gauge": GaugeCardProGauge;
  }
}
