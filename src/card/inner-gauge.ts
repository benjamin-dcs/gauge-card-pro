// External dependencies
import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  nothing,
  PropertyValues,
  svg,
  TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import { afterNextRender } from "../dependencies/ha";

// Local utilities
import { getAngle } from "../utils/number/get-angle";
import { getSeverityGradientValueClippath } from "./utils";

import { INNER_GAUGE } from "../constants/svg/gauge-inner";
import { MinMaxIndicator } from "./types";
import { GaugeSegment, innerRoundStyles, SeverityColorModes } from "./config";

import { renderMinMaxIndicator } from "./_min-max-indicator";
import { transitionsCSS } from "./css/transitions";

type GaugeData = {
  min: number;
  max: number;
};

type FlatSegments = {
  segments: GaugeSegment[];
};

type SeverityConfig = {
  mode: SeverityColorModes;
  withGradientBackground: boolean;
  fromCenter: boolean;
};

type SeverityData = {
  angle: number;
  color?: string;
};

export type InnerGaugeConfigModel = {
  mode: "flat-arc" | "gradient-arc" | "severity";
  round?: innerRoundStyles;
  severity?: SeverityConfig;
};

export type InnerGaugeViewModel = {
  data: GaugeData;
  flatSegments?: FlatSegments;
  severity?: SeverityData;
  gradientBackground?: string;
  min_indicator?: MinMaxIndicator;
  max_indicator?: MinMaxIndicator;
  unavailable: boolean;
};

@customElement("gauge-card-pro-inner-gauge")
export class GaugeCardProInnerGauge extends LitElement {
  @property({ attribute: false }) public config!: InnerGaugeConfigModel;
  @property({ attribute: false }) public data!: InnerGaugeViewModel;

  private isRounded: boolean = false;
  private roundMask: string | undefined = undefined;
  private roundMaskDivider: string | undefined = undefined;

  @state() private severityRoundAngle = 0;
  @state() private severityGradientValueClippath = "";

  @state() private severityCenteredDashArray = "";
  @state() private severityCenteredDashOffset = 0;
  @state() private severityDividerCenteredDashArray = "";
  @state() private severityDividerCenteredDashOffset = 0;

  @state() private _updated = false;

  private _calculate_severity_data() {
    if (this.config.mode === "severity") {
      const angle = this.data.severity?.angle!;

      this.severityRoundAngle =
        this.config.severity?.fromCenter && angle < 90
          ? 90 - (90 - angle)
          : -180 + angle;

      if (this.config.severity?.mode === "gradient") {
        this.severityGradientValueClippath = getSeverityGradientValueClippath(
          this.data.severity!.angle,
          this.config.severity.fromCenter
        );
      }

      if (this.config.severity?.fromCenter) {
        // somehow the +0.01 fixes some rendering glitches
        if (angle < 90) {
          this.severityCenteredDashArray = `${90 - angle} ${360 - (90 - angle) + 0.01}`;
          this.severityCenteredDashOffset = 90 - angle;

          this.severityDividerCenteredDashArray = `${90 - (angle - 1.5)} ${360 - (90 - (angle - 1.5))}`;
          this.severityDividerCenteredDashOffset = 90 - (angle - 1.5);
        } else {
          this.severityCenteredDashArray = `${angle - 90} ${360 - (angle - 90) + 0.01}`;
          this.severityCenteredDashOffset = 0;

          this.severityDividerCenteredDashArray = `${angle + 1.5 - 90} ${360 - (angle + 1.5 - 90)}`;
          this.severityDividerCenteredDashOffset = 0;
        }
      }
    }
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("config")) {
      this.isRounded = this.config.round != null && this.config.round !== "off";

      if (this.isRounded) {
        const roundStyle = this.config.round;
        this.roundMask =
          roundStyle === "full"
            ? INNER_GAUGE.masks.gauge.full
            : INNER_GAUGE.masks.gauge.small;

        if (this.config.mode === "severity") {
          this.roundMaskDivider =
            roundStyle === "full"
              ? INNER_GAUGE.masks.divider.severity.full
              : INNER_GAUGE.masks.divider.severity.small;
        } else {
          this.roundMaskDivider =
            roundStyle === "full"
              ? INNER_GAUGE.masks.divider.static.full
              : INNER_GAUGE.masks.divider.static.small;
        }
      } else {
        this.roundMask = undefined;
        this.roundMaskDivider = undefined;
      }
    }
  }

  protected render(): TemplateResult {
    return html`
      <svg
        id="inner-gauge"
        viewBox="-50 -50 100 50"
        style=${styleMap({
          filter: this.data.unavailable ? "grayscale(1)" : undefined,
        })}
      >
        <defs>
          <clipPath id="inner-rounding" x="-50" y="-50" width="100" height="50">
            <path d="${this.roundMask}" />
          </clipPath>
          <clipPath
            id="inner-divider-rounding"
            x="-50"
            y="-50"
            width="100"
            height="50"
          >
            <path d="${this.roundMaskDivider}" />
          </clipPath>
          <clipPath
            id="inner-conic-gradient"
            x="-50"
            y="-50"
            width="100"
            height="50"
          >
            <path d="${this.roundMask ?? INNER_GAUGE.masks.gauge.flat}" />
          </clipPath>
          <clipPath
            id="inner-severity-gradient-value"
            x="-50"
            y="-50"
            width="100"
            height="50"
          >
            <path d="${this.severityGradientValueClippath}" />
          </clipPath>
          <clipPath
            id="inner-severity-rounding"
            x="-50"
            y="-50"
            width="100"
            height="50"
          >
            <path
              d="${this.roundMask}"
              transform="rotate(${this.severityRoundAngle} 0 0)"
            />
          </clipPath>
          <clipPath
            id="inner-severity-divider-rounding"
            x="-50"
            y="-50"
            width="100"
            height="50"
          >
            <path
              d="${this.roundMaskDivider}"
              transform="rotate(${this.severityRoundAngle} 0 0)"
            />
          </clipPath>
        </defs>

        ${
          // static divider
          ["flat-arc", "gradient-arc"].includes(this.config.mode) ||
          this.config.severity?.withGradientBackground
            ? svg`
            <path
                class="inner-gauge-divider"
                d="M -32.5 0 A 32.5 32.5 0 0 1 32.5 0"
                clip-path=${ifDefined(this.isRounded ? "url(#inner-divider-rounding)" : undefined)}
            ></path>`
            : nothing
        }
        ${
          // solid white layer for opaque gradient bg
          this.config.severity?.withGradientBackground
            ? svg`
                <path
                  class="inner-gradient-bg-bg"
                  d="M -32 0 A 32 32 0 1 1 32 0"
                  clip-path=${ifDefined(this.isRounded ? "url(#inner-rounding)" : undefined)}
                ></path>`
            : nothing
        }
        ${(this.config.mode === "severity" &&
          this.config.severity?.withGradientBackground) ||
        this.config.mode === "gradient-arc"
          ? // static gradient background
            svg`
              <foreignObject
                x="-50"
                y="-50"
                width="100"
                height="100"
                clip-path="url(#inner-conic-gradient)"
              >
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style=${styleMap({
                    width: "100%",
                    height: "100%",
                    background: `conic-gradient(from -90deg, ${this.data.gradientBackground})`,
                  })}
                ></div>
              </foreignObject>`
          : nothing}
        ${
          // inner severity divider
          this.config.mode == "severity" &&
          this.data.severity &&
          this.data.severity.angle
            ? svg`
            <g clip-path=${ifDefined(this.isRounded ? "url(#inner-divider-rounding)" : undefined)}>
              <g clip-path=${ifDefined(this.isRounded ? "url(#inner-severity-divider-rounding)" : undefined)}>
                ${
                  this.config.severity!.fromCenter
                    ? this.data.severity.angle != 90
                      ? svg`
                        <g transform="rotate(-90)" >
                          <circle 
                            class=${classMap({
                              "inner-gauge-divider": true,
                              "normal-transition":
                                this.config.severity!.mode !== "gradient",
                            })}
                            r="32.5" 
                            pathLength="360" 
                            stroke-dasharray="${this.severityDividerCenteredDashArray}" 
                            stroke-dashoffset="${this.severityDividerCenteredDashOffset}"></circle>
                        </g>`
                      : nothing
                    : this.data.severity.angle > 0
                      ? svg`
                        <g 
                          style=${styleMap({
                            transform: `rotate(${Math.min(this.data.severity.angle + 1.5, 180)}deg)`,
                            transformOrigin: "0px 0px",
                          })}
                          >
                          <path
                            class=${classMap({
                              "inner-gauge-divider": true,
                              "normal-transition":
                                this.config.severity!.mode !== "gradient",
                            })}
                            d="M -32.5 0 A 32.5 32.5 0 1 0 32.5 0"
                          ></path>
                        </g>`
                      : nothing
                }
              </g>
            </g>`
            : nothing
        }
        ${this.config.mode === "severity" &&
        ["basic", "interpolation"].includes(this.config.severity!.mode)
          ? // severity solid value
            svg`
            <g clip-path=${ifDefined(this.isRounded ? "url(#inner-rounding)" : undefined)}>
              <g clip-path=${ifDefined(this.isRounded ? "url(#inner-severity-rounding)" : undefined)}>
                ${
                  this.config.severity?.fromCenter
                    ? svg`
                      <g transform="rotate(-90)" class="normal-transition" >
                        <circle 
                          class="inner-severity-gauge normal-transition" 
                          r="32" 
                          stroke="${this.data.severity!.color}" 
                          pathLength="360" 
                          stroke-dasharray="${this.severityCenteredDashArray!}" 
                          stroke-dashoffset="${this.severityCenteredDashOffset!}"></circle>
                      </g>`
                    : this.data.severity!.angle > 0
                      ? svg`
                        <g
                          class="normal-transition" 
                          style=${styleMap({ transform: `rotate(${this.data.severity!.angle}deg)`, transformOrigin: "0px 0px" })}>
                          <path
                            class="inner-severity-gauge"
                            style=${styleMap({ stroke: this.data.severity?.color })}
                            d="M -32 0 A 32 32 0 1 0 32 0"
                          ></path>
                        </g>`
                      : nothing
                }
              </g>
            </g>`
          : nothing}
        ${this.config.mode === "severity" &&
        this.config.severity!.mode === "gradient"
          ? // severity gradient value
            svg`
          <g clip-path="url(#inner-conic-gradient)">
            <g clip-path="url(#inner-severity-gradient-value)">
              <g clip-path=${ifDefined(this.isRounded ? "url(#inner-severity-rounding)" : undefined)}>
                <foreignObject
                  x="-50"
                  y="-50"
                  width="100"
                  height="100"
                >
                  <div
                    style="width: 100%; height: 100%"
                    >

                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      style=${styleMap({
                        width: "100%",
                        height: "100%",
                        background: `conic-gradient(from -90deg, ${this.data.severity!.color})`,
                      })}
                    ></div>
                  </div>
                </foreignObject>
              </g>
            </g>
          </g>`
          : nothing}
        ${this.config.mode === "flat-arc"
          ? // static non-gradient background
            svg`
              <g clip-path=${ifDefined(this.isRounded ? "url(#inner-rounding)" : undefined)}>
              <g>
              ${this.data.flatSegments!.segments.map((segment) => {
                const angle = getAngle(
                  segment.pos,
                  this.data.data.min,
                  this.data.data.max
                );
                return svg`
                    <g clip-path=${ifDefined(this.isRounded ? "url(#inner-rounding)" : undefined)}>
                      <g>
                        <path
                          class="segment"
                          d="M
                            ${0 - 32 * Math.cos((angle * Math.PI) / 180)}
                            ${0 - 32 * Math.sin((angle * Math.PI) / 180)}
                            A 32 32 0 0 1 32 0"
                          style=${styleMap({ stroke: segment.color })}
                        ></path>
                      `;
              })}
                </g>
                    </g>
            `
          : nothing}
        ${this.data.min_indicator
          ? renderMinMaxIndicator("min", "main", this.data.min_indicator)
          : nothing}
        ${this.data.max_indicator
          ? renderMinMaxIndicator("max", "main", this.data.max_indicator)
          : nothing}
      </svg>
    `;
  }

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation (todo) to work
    afterNextRender(() => {
      this._updated = true;
      this._calculate_severity_data();
    });
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._updated || !changedProperties) return;

    this._calculate_severity_data();
  }

  static get styles(): CSSResultGroup {
    return [
      transitionsCSS,

      css`
        :host {
          display: block;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .inner-gauge {
          position: relative;
          top: 0;
        }

        .inner-gradient-bg-bg {
          fill: none;
          stroke-width: 5;
          stroke: #ffffff;
        }

        .inner-severity-gauge {
          fill: none;
          stroke-width: 5;
        }

        .inner-gauge-divider {
          fill: none;
          stroke-width: 6;
          stroke: var(--card-background-color);
        }

        .segment {
          fill: none;
          stroke-width: 5;
        }
      `,
    ];
  }
}
