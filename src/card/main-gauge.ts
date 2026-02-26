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

import { MAIN_GAUGE } from "../constants/svg/gauge-main";
import { MAIN_MARKERS } from "../constants/svg/markers";
import { MinMaxIndicator } from "./types";
import {
  GaugeSegment,
  mainRoundStyles,
  MainSeverityGaugeMarker,
  SeverityColorModes,
} from "./config";

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
  color: string;
};

export type MainGaugeConfigModel = {
  mode: "flat-arc" | "gradient-arc" | "severity";
  round?: mainRoundStyles;
  severity?: SeverityConfig;
};

export type MainGaugeDataModel = {
  data: GaugeData;
  flatSegments?: FlatSegments;
  severity?: SeverityData;
  gradientBackground?: string;
  round?: mainRoundStyles;
  min_indicator?: MinMaxIndicator;
  max_indicator?: MinMaxIndicator;
  unavailable: boolean;
};

@customElement("gauge-card-pro-main-gauge")
export class GaugeCardProMainGauge extends LitElement {
  @property({ attribute: false }) public config!: MainGaugeConfigModel;
  @property({ attribute: false }) public data!: MainGaugeDataModel;

  private isRounded: boolean = false;
  private roundMask: string = MAIN_GAUGE.masks.flat;
  private markerShape?: MainSeverityGaugeMarker | undefined;

  @state() private severityRoundAngle = 0;
  @state() private severityGradientValueClippath = "";

  @state() private severityCenteredDashArray = "";
  @state() private severityCenteredDashOffset = 0;
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
        } else {
          this.severityCenteredDashArray = `${angle - 90} ${360 - (angle - 90) + 0.01}`;
          this.severityCenteredDashOffset = 0;
        }
      }
    }
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("config")) {
      this.isRounded = this.config.round != null && this.config.round !== "off";

      if (this.isRounded) {
        const roundStyle = this.config.round;
        if (roundStyle === "full") {
          this.roundMask = MAIN_GAUGE.masks.full;
        } else if (roundStyle === "medium") {
          this.roundMask = MAIN_GAUGE.masks.medium;
        } else {
          this.roundMask = MAIN_GAUGE.masks.small;
        }

        if (this.config.mode === "severity") {
          if (roundStyle === "full") {
            this.markerShape = {
              negative: MAIN_MARKERS.negative.full,
              positive: MAIN_MARKERS.positive.full,
            };
          } else if (roundStyle === "medium") {
            this.markerShape = {
              negative: MAIN_MARKERS.negative.medium,
              positive: MAIN_MARKERS.positive.medium,
            };
          } else {
            this.markerShape = {
              negative: MAIN_MARKERS.negative.small,
              positive: MAIN_MARKERS.positive.small,
            };
          }
        } else {
          this.markerShape = undefined
        }
      } else {
        this.roundMask = MAIN_GAUGE.masks.flat;

        if (this.config.mode === "severity") {
          this.markerShape = {
            negative: MAIN_MARKERS.negative.flat,
            positive: MAIN_MARKERS.positive.flat,
          };
        }
      }
    }
  }

  protected render(): TemplateResult {
    return html`
      <svg
        id="main-gauge"
        viewBox="-50 -50 100 50"
        style=${styleMap({
          filter: this.data.unavailable ? "grayscale(1)" : undefined,
        })}
      >
        <defs>
          <clipPath id="main-rounding" x="-50" y="-50" width="100" height="50">
            <path d="${this.roundMask}" />
          </clipPath>
          <clipPath
            id="main-conic-gradient"
            x="-50"
            y="-50"
            width="100"
            height="50"
          >
            <path d="${this.roundMask ?? MAIN_GAUGE.masks.flat}" />
          </clipPath>
          <clipPath
            id="main-severity-gradient-value"
            x="-50"
            y="-50"
            width="100"
            height="50"
          >
            <path d="${this.severityGradientValueClippath!}" />
          </clipPath>
          <clipPath
            id="main-severity-rounding"
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
        </defs>

        ${this.config.mode === "severity"
          ? // static solid severity background
            svg`
                <path
                  class="main-background"
                  style=${styleMap({ stroke: !this.config.severity?.withGradientBackground ? "var(--primary-background-color)" : "#ffffff" })}
                  d="M -40 0 A 40 40 0 0 1 40 0"
                  clip-path=${ifDefined(this.isRounded ? "url(#main-rounding)" : undefined)}
                ></path>`
          : nothing}
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
                    clip-path="url(#main-conic-gradient)"
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
        ${this.config.mode === "severity" &&
        this.data.severity &&
        ["basic", "interpolation"].includes(this.config.severity!.mode)
          ? // severity solid value
            svg`
                <g clip-path=${ifDefined(this.isRounded ? "url(#main-rounding)" : undefined)}>
                  <g clip-path=${ifDefined(this.isRounded ? "url(#main-severity-rounding)" : undefined)}>
                    ${
                      this.config.severity!.fromCenter
                        ? svg`
                          <g transform="rotate(-90)" class="normal-transition" >
                            <circle 
                              class="main-severity-gauge normal-transition" 
                              r="40" 
                              stroke="${this.data.severity.color}" 
                              pathLength="360" 
                              stroke-dasharray="${this.severityCenteredDashArray!}" 
                              stroke-dashoffset="${this.severityCenteredDashOffset!}"></circle>
                          </g>`
                        : this.data.severity.angle > 0
                          ? svg`
                            <g
                              class="normal-transition" 
                              style=${styleMap({ transform: `rotate(${this.data.severity.angle}deg)`, transformOrigin: "0px 0px" })}>
                              <path
                                class="main-severity-gauge"
                                style=${styleMap({ stroke: this.data.severity.color })}
                                d="M -40 0 A 40 40 0 1 0 40 0"
                              ></path>
                            </g>`
                          : nothing
                    }
                  </g>
                </g>`
          : nothing}
        ${this.config.mode === "severity" &&
        this.data.severity &&
        this.config.severity!.mode === "gradient"
          ? // severity gradient value
            svg`
              <g clip-path="url(#main-conic-gradient)">
                <g clip-path="url(#main-severity-gradient-value)">
                  <g clip-path=${ifDefined(this.isRounded ? "url(#main-severity-rounding)" : undefined)}>
                    <foreignObject
                      x="-50"
                      y="-50"
                      width="100"
                      height="100"
                    >
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        style=${styleMap({
                          width: "100%",
                          height: "100%",
                          background: `conic-gradient(from -90deg, ${this.data.severity.color})`,
                        })}
                      ></div>
                    </foreignObject>
                  </g>
                </g>
              </g>`
          : nothing}
        ${this.config.mode === "severity" &&
        this.config.severity?.withGradientBackground &&
        !(this.config.severity.fromCenter && this.data.severity!.angle == 90)
          ? svg`
              <g 
                id="main-marker"
                class=${classMap({
                  "normal-transition": this.config.severity.mode !== "gradient",
                })}
                style=${styleMap({ transform: `rotate(${this.data.severity!.angle}deg)`, transformOrigin: "0px 0px" })}>
                <path
                  class="main-marker"
                  d="${
                    this.config.severity.fromCenter &&
                    this.data.severity!.angle < 90
                      ? this.markerShape?.negative
                      : this.markerShape?.positive
                  }"
                ></path>
              </g>`
          : nothing}
        ${this.config.mode === "flat-arc"
          ? // static non-gradient background
            svg`
                  <g clip-path=${ifDefined(this.isRounded ? "url(#main-rounding)" : undefined)} >
                    <g>
                      ${this.data.flatSegments!.segments.map((segment) => {
                        const angle = getAngle(
                          segment.pos,
                          this.data.data.min,
                          this.data.data.max
                        );
                        return svg`
                          <path
                            class="segment"
                            d="M
                              ${0 - 40 * Math.cos((angle * Math.PI) / 180)}
                              ${0 - 40 * Math.sin((angle * Math.PI) / 180)}
                              A 40 40 0 0 1 40 0"
                            style=${styleMap({ stroke: segment.color })}
                          ></path>
                        `;
                      })}
                    </g>
                  </g>`
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
        }

        .main-background {
          fill: none;
          stroke-width: 15;
        }

        .main-severity-gauge {
          fill: none;
          stroke-width: 15;
        }

        .main-marker {
          fill: var(--main-severity-marker, var(--card-background-color));
        }

        .segment {
          fill: none;
          stroke-width: 15;
        }

        .label-text {
          font-size: 5px;
          font-weight: 600;
          direction: ltr;
          dominant-baseline: middle;
        }
    `];
  }
}
