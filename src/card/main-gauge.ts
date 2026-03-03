// External dependencies (Lit)
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import { afterNextRender } from "../dependencies/ha";

// Local constants
import { MAIN_GAUGE } from "../constants/svg/gauge-main";
import { MAIN_MARKERS } from "../constants/svg/markers";

// Local utilities
import { getSeverityGradientValueClippath } from "./utils";

// Local types / render helpers / css
import type { SeverityColorModes, mainRoundStyles } from "./config";
import type { MainSeverityGaugeMarker, MinMaxIndicator } from "./types";
import { renderGradientBackground } from "./helpers/gradient-background";
import { renderSeverityGradient } from "./helpers/severity-gradient";
import { renderMinMaxIndicator } from "./helpers/min-max-indicator";
import { transitionsCSS } from "./css/transitions";

type GaugeData = {
  min: number;
  max: number;
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
  severity?: SeverityData;
  background?: string;
  round?: mainRoundStyles;
  min_indicator?: MinMaxIndicator;
  max_indicator?: MinMaxIndicator;
  unavailable: boolean;
};

@customElement("gauge-card-pro-main-gauge")
export class GaugeCardProMainGauge extends LitElement {
  @property({ attribute: false }) public config!: MainGaugeConfigModel;
  @property({ attribute: false }) public data!: MainGaugeDataModel;

  private isRounded = false;
  private roundMask: string = MAIN_GAUGE.masks.flat;
  private markerShape?: MainSeverityGaugeMarker;

  @state() private severityRoundAngle = 0;
  @state() private severityGradientValueClippath = "";
  @state() private severityCenteredDashArray = "";
  @state() private severityCenteredDashOffset = 0;
  @state() private _updated = false;

  protected override willUpdate(changed: PropertyValues) {
    super.willUpdate(changed);
    if (changed.has("config")) {
      this.updateConfig();
    }
  }

  protected override render(): TemplateResult {
    const isSeverity = this.config.mode === "severity";
    const severityConfig = this.config.severity;
    const severityData = this.data.severity;

    const roundingClip = this.isRounded ? "url(#main-rounding)" : undefined;
    const severityRoundingClip = this.isRounded
      ? "url(#main-severity-rounding)"
      : undefined;

    const shouldRenderGradientBg =
      (isSeverity && severityConfig?.withGradientBackground) ||
      this.config.mode === "gradient-arc" ||
      this.config.mode === "flat-arc";

    const isSeveritySolidValue =
      isSeverity &&
      !!severityData &&
      ["basic", "interpolation"].includes(severityConfig?.mode ?? "");

    const isSeverityGradientValue =
      isSeverity && !!severityData && severityConfig?.mode === "gradient";

    return html`
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        id="main-gauge"
        viewBox="-50 -50 100 50"
        style=${styleMap({
          filter: this.data.unavailable ? "grayscale(1)" : undefined,
        })}
      >
        <defs>
          <clipPath id="main-rounding" x="-50" y="-50" width="100" height="50">
            <path d=${this.roundMask} />
          </clipPath>

          <clipPath
            id="main-conic-gradient"
            x="-50"
            y="-50"
            width="100"
            height="50"
          >
            <path d=${this.roundMask ?? MAIN_GAUGE.masks.flat} />
          </clipPath>

          <clipPath
            id="main-severity-gradient-value"
            x="-50"
            y="-50"
            width="100"
            height="50"
          >
            <path d=${this.severityGradientValueClippath} />
          </clipPath>

          <clipPath
            id="main-severity-rounding"
            x="-50"
            y="-50"
            width="100"
            height="50"
          >
            <path
              d=${this.roundMask}
              transform="rotate(${this.severityRoundAngle} 0 0)"
            />
          </clipPath>
        </defs>

        ${isSeverity
          ? svg`
              <path
                class="main-background"
                style=${styleMap({
                  stroke: !severityConfig?.withGradientBackground
                    ? "var(--primary-background-color)"
                    : "#ffffff",
                })}
                d="M -40 0 A 40 40 0 0 1 40 0"
                clip-path=${ifDefined(roundingClip)}
              ></path>
            `
          : nothing}
        ${shouldRenderGradientBg && this.data.background
          ? renderGradientBackground("main", this.data.background)
          : nothing}
        ${isSeveritySolidValue && severityData
          ? svg`
              <g clip-path=${ifDefined(roundingClip)}>
                <g clip-path=${ifDefined(severityRoundingClip)}>
                  ${
                    severityConfig?.fromCenter
                      ? svg`
                        <g transform="rotate(-90)" class="normal-transition">
                          <circle
                            class="main-severity-gauge normal-transition"
                            r="40"
                            stroke=${severityData.color}
                            pathLength="360"
                            stroke-dasharray=${this.severityCenteredDashArray}
                            stroke-dashoffset=${this.severityCenteredDashOffset}
                          ></circle>
                        </g>
                      `
                      : severityData.angle > 0
                        ? svg`
                          <g
                            class="normal-transition"
                            style=${styleMap({
                              transform: `rotate(${severityData.angle}deg)`,
                              transformOrigin: "0px 0px",
                            })}
                          >
                            <path
                              class="main-severity-gauge"
                              style=${styleMap({ stroke: severityData.color })}
                              d="M -40 0 A 40 40 0 1 0 40 0"
                            ></path>
                          </g>
                        `
                        : nothing
                  }
                </g>
              </g>
            `
          : nothing}
        ${isSeverityGradientValue
          ? renderSeverityGradient(
              "main",
              severityRoundingClip,
              severityData.color
            )
          : nothing}
        ${isSeverity &&
        severityConfig?.withGradientBackground &&
        severityData &&
        !(severityConfig.fromCenter && severityData.angle === 90)
          ? svg`
              <g
                id="main-marker"
                class=${classMap({
                  "normal-transition": severityConfig.mode !== "gradient",
                })}
                style=${styleMap({
                  transform: `rotate(${severityData.angle}deg)`,
                  transformOrigin: "0px 0px",
                })}
              >
                <path
                  class="main-marker"
                  d=${
                    severityConfig.fromCenter && severityData.angle < 90
                      ? this.markerShape?.negative
                      : this.markerShape?.positive
                  }
                ></path>
              </g>
            `
          : nothing}
        ${this.data.min_indicator
          ? renderMinMaxIndicator("main", "min", this.data.min_indicator)
          : nothing}
        ${this.data.max_indicator
          ? renderMinMaxIndicator("main", "max", this.data.max_indicator)
          : nothing}
      </svg>
    `;
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    // Wait for the first render for the initial animation (todo) to work
    afterNextRender(() => {
      this._updated = true;
      this.updateData();
    });
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._updated) return;

    if (changedProperties.has("config") || changedProperties.has("data")) {
      this.updateData();
    }
  }

  private updateConfig() {
    const roundStyle = this.config.round;
    this.isRounded = roundStyle != null && roundStyle !== "off";

    // Mask
    if (!this.isRounded) {
      this.roundMask = MAIN_GAUGE.masks.flat;
    } else if (roundStyle === "full") {
      this.roundMask = MAIN_GAUGE.masks.full;
    } else if (roundStyle === "medium") {
      this.roundMask = MAIN_GAUGE.masks.medium;
    } else {
      this.roundMask = MAIN_GAUGE.masks.small;
    }

    // Marker (only for severity)
    if (this.config.mode !== "severity") {
      this.markerShape = undefined;
      return;
    }

    if (!this.isRounded) {
      this.markerShape = {
        negative: MAIN_MARKERS.negative.flat,
        positive: MAIN_MARKERS.positive.flat,
      };
      return;
    }

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
  }

  private updateData() {
    if (this.config.mode !== "severity") return;

    const severityCfg = this.config.severity;
    const severity = this.data.severity;
    if (!severity || !severityCfg) return;

    const angle = severity.angle;

    this.severityRoundAngle =
      severityCfg.fromCenter && angle < 90 ? angle : -180 + angle;

    if (severityCfg.mode === "gradient") {
      this.severityGradientValueClippath = getSeverityGradientValueClippath(
        angle,
        severityCfg.fromCenter
      );
    } else {
      // keep it tidy to avoid stale paths if you switch modes
      this.severityGradientValueClippath = "";
    }

    if (severityCfg.fromCenter) {
      // somehow the +0.01 fixes some rendering glitches
      if (angle < 90) {
        const d = 90 - angle;
        this.severityCenteredDashArray = `${d} ${360 - d + 0.01}`;
        this.severityCenteredDashOffset = d;
      } else {
        const d = angle - 90;
        this.severityCenteredDashArray = `${d} ${360 - d + 0.01}`;
        this.severityCenteredDashOffset = 0;
      }
    } else {
      // keep tidy to avoid stale values if you toggle fromCenter
      this.severityCenteredDashArray = "";
      this.severityCenteredDashOffset = 0;
    }
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
      `,
    ];
  }
}
