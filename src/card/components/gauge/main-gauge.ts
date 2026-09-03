// External dependencies (Lit)
import type { CSSResultGroup, TemplateResult } from "lit";
import { css, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

// Local constants
import { MAIN_GAUGE } from "../../../constants/svg/main-gauge";
import { MAIN_GAUGE_MARKERS } from "../../../constants/svg/main-gauge-markers";

// Local types / render helpers / css
import type {
  MainGaugeConfig,
  MainGaugeData,
  MainSeverityGaugeMarker,
} from "../../types/types";
import { renderGradientBackground } from "../../render/gradient-background";
import { renderSeverityGradient } from "../../render/severity-gradient";
import { renderMinMaxIndicator } from "../../render/min-max-indicator";
import { transitionsCSS } from "../../css/transitions";
import { renderSeveritySolid } from "../../render/severity-solid";

import { GaugeBase } from "./gauge-base";
import { MAIN_GAUGE_DEFAULT } from "../../../constants/svg/main-gauge/default";
import { MAIN_GAUGE_EQUAL } from "../../../constants/svg/main-gauge/equal";

const gaugeData = {
  default: MAIN_GAUGE_DEFAULT.severitySolid,
  equal: MAIN_GAUGE_EQUAL.severitySolid,
};

@customElement("gauge-card-pro-main-gauge")
export class GaugeCardProMainGauge extends GaugeBase {
  @property({ attribute: false }) public config!: MainGaugeConfig;
  @property({ attribute: false }) public data!: MainGaugeData;

  // Main-gauge-only derived config state
  private markerShape?: MainSeverityGaugeMarker;

  protected override get gaugeConfig() {
    return this.config;
  }
  protected get gaugeData() {
    return this.data;
  }

  protected override render(): TemplateResult {
    const layout = this.config.layout;

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
            <path d=${this.roundMask ?? MAIN_GAUGE[layout].masks.flat} />
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

        ${
          isSeverity
            ? svg`
              <path
                class=${`main-background-${layout}`}
                style=${styleMap({
                  stroke: severityConfig!.withGradientBackground
                    ? "var(--main-base-color, #ffffff)"
                    : "var(--main-base-color, var(--primary-background-color))",
                })}
                d=${gaugeData[layout].path}
                clip-path=${ifDefined(this.isRounded ? "url(#main-rounding)" : undefined)}
              ></path>`
            : nothing
        }
        ${
          shouldRenderGradientBg
            ? renderGradientBackground("main", this.data.background!)
            : nothing
        }
        ${
          shouldRenderSeveritySolid
            ? renderSeveritySolid(
                "main",
                severityData,
                severityConfig,
                layout,
                this.isRounded,
                this.severityCenteredDashArray,
                this.severityCenteredDashOffset
              )
            : nothing
        }
        ${
          shouldRenderSeverityGradient
            ? renderSeverityGradient("main", this.isRounded, severityData.color)
            : nothing
        }
        ${
          shouldRenderSeverityMarker
            ? svg`
              <g
                id="main-marker"
                class=${classMap({
                  "fast-transition":
                    severityConfig.mode !== "gradient" &&
                    this.config.animation_speed === "fast",
                  "normal-transition":
                    severityConfig.mode !== "gradient" &&
                    this.config.animation_speed === "normal",
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
            : nothing
        }
        ${
          this.data.min_indicator
            ? renderMinMaxIndicator(
                "main",
                layout,
                "min",
                this.isRounded,
                this.config.animation_speed,
                this.data.min_indicator
              )
            : nothing
        }
        ${
          this.data.max_indicator
            ? renderMinMaxIndicator(
                "main",
                layout,
                "max",
                this.isRounded,
                this.config.animation_speed,
                this.data.max_indicator
              )
            : nothing
        }
      </svg>
    `;
  }

  protected override updateConfig(): void {
    const layout = this.config.layout;
    const roundStyle = this.config.round;
    this.isRounded = roundStyle != null && roundStyle !== "off";

    if (!this.isRounded) {
      this.roundMask = undefined;
      this.markerShape = {
        negative: MAIN_GAUGE_MARKERS[layout].negative.flat,
        positive: MAIN_GAUGE_MARKERS[layout].positive.flat,
      };
      return;
    }

    const gauge = MAIN_GAUGE[layout];

    // For readability marker shape is set even for non-severity gauges
    if (roundStyle === "full") {
      this.roundMask = gauge.masks.full;
      this.markerShape = {
        negative: MAIN_GAUGE_MARKERS[layout].negative.full,
        positive: MAIN_GAUGE_MARKERS[layout].positive.full,
      };
    } else if (roundStyle === "medium") {
      this.roundMask = gauge.masks.medium;
      this.markerShape = {
        negative: MAIN_GAUGE_MARKERS[layout].negative.medium,
        positive: MAIN_GAUGE_MARKERS[layout].positive.medium,
      };
    } else {
      this.roundMask = gauge.masks.small;
      this.markerShape = {
        negative: MAIN_GAUGE_MARKERS[layout].negative.small,
        positive: MAIN_GAUGE_MARKERS[layout].positive.small,
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

        .main-background-default {
          fill: none;
          stroke-width: 15;
        }

        .main-background-equal {
          fill: none;
          stroke-width: 8.5;
        }

        .main-severity-gauge-default {
          fill: none;
          stroke-width: 15;
        }

        .main-severity-gauge-equal {
          fill: none;
          stroke-width: 8.5;
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
