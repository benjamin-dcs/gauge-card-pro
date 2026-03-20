// External dependencies (Lit)
import type { CSSResultGroup, TemplateResult } from "lit";
import { css, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

import { GaugeBase } from "./gauge-base";

// Local constants
import { MAIN_GAUGE } from "../constants/svg/main-gauge";
import { MAIN_MARKERS } from "../constants/svg/markers";

// Local types / render helpers / css
import type {
  MainGaugeConfig,
  MainGaugeData,
  MainSeverityGaugeMarker,
} from "./types";
import { renderGradientBackground } from "./helpers-render/gradient-background";
import { renderSeverityGradient } from "./helpers-render/severity-gradient";
import { renderMinMaxIndicator } from "./helpers-render/min-max-indicator";
import { transitionsCSS } from "./css/transitions";
import { renderSeveritySolid } from "./helpers-render/severity-solid";

@customElement("gauge-card-pro-main-gauge")
export class GaugeCardProMainGauge extends GaugeBase {
  @property({ attribute: false }) public config!: MainGaugeConfig;
  @property({ attribute: false }) public data!: MainGaugeData;

  // Main-gauge-only derived config state
  private markerShape?: MainSeverityGaugeMarker;

  protected get gaugeConfig() {
    return this.config;
  }
  protected get gaugeData() {
    return this.data;
  }

  protected override render(): TemplateResult {
    const isSeverity = this.config.mode === "severity";
    const severityConfig = this.config.severity;
    const severityData = this.data.severity;
    const hasSeverity = isSeverity && severityConfig && severityData;

    const shouldRenderGradientBg =
      ((isSeverity && severityConfig?.withGradientBackground) ||
        this.config.mode === "gradient-arc" ||
        this.config.mode === "flat-arc") &&
      this.data.background;

    const shouldRenderSeveritySolid =
      hasSeverity &&
      ["basic", "interpolation"].includes(severityConfig?.mode ?? "");

    const shouldRenderSeverityGradient =
      hasSeverity && severityConfig.mode === "gradient";

    const shouldRenderSeverityMarker =
      hasSeverity &&
      severityConfig.withGradientBackground &&
      !(severityConfig.fromCenter && severityData.angle === 90);

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
                  stroke: severityConfig!.withGradientBackground
                    ? "var(--main-severity-bg-bg, #ffffff)"
                    : "var(--primary-background-color)",
                })}
                d="M -40 0 A 40 40 0 0 1 40 0"
                clip-path=${ifDefined(this.isRounded ? "url(#main-rounding)" : undefined)}
              ></path>`
          : nothing}
        ${shouldRenderGradientBg
          ? renderGradientBackground("main", this.data.background!)
          : nothing}
        ${shouldRenderSeveritySolid
          ? renderSeveritySolid(
              "main",
              severityData,
              severityConfig,
              this.isRounded,
              this.severityCenteredDashArray,
              this.severityCenteredDashOffset
            )
          : nothing}
        ${shouldRenderSeverityGradient
          ? renderSeverityGradient("main", this.isRounded, severityData.color)
          : nothing}
        ${shouldRenderSeverityMarker
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
              </g>`
          : nothing}
        ${this.data.min_indicator
          ? renderMinMaxIndicator(
              "main",
              "min",
              this.isRounded,
              this.data.min_indicator
            )
          : nothing}
        ${this.data.max_indicator
          ? renderMinMaxIndicator(
              "main",
              "max",
              this.isRounded,
              this.data.max_indicator
            )
          : nothing}
      </svg>
    `;
  }

  protected override updateConfig(): void {
    const roundStyle = this.config.round;
    this.isRounded = roundStyle != null && roundStyle !== "off";

    if (!this.isRounded) {
      this.roundMask = undefined;
      this.markerShape = {
        negative: MAIN_MARKERS.negative.flat,
        positive: MAIN_MARKERS.positive.flat,
      };
      return;
    }

    // For readability marker shape is set even for non-severity gauges
    if (roundStyle === "full") {
      this.roundMask = MAIN_GAUGE.masks.full;
      this.markerShape = {
        negative: MAIN_MARKERS.negative.full,
        positive: MAIN_MARKERS.positive.full,
      };
    } else if (roundStyle === "medium") {
      this.roundMask = MAIN_GAUGE.masks.medium;
      this.markerShape = {
        negative: MAIN_MARKERS.negative.medium,
        positive: MAIN_MARKERS.positive.medium,
      };
    } else {
      this.roundMask = MAIN_GAUGE.masks.small;
      this.markerShape = {
        negative: MAIN_MARKERS.negative.small,
        positive: MAIN_MARKERS.positive.small,
      };
    }
  }

  static override get styles(): CSSResultGroup {
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
