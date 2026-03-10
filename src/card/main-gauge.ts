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
import { MAIN_GAUGE } from "../constants/svg/main-gauge";
import { MAIN_MARKERS } from "../constants/svg/markers";

// Local types / render helpers / css
import type { MainRoundStyle } from "./config";
import type {
  GaugeData,
  MainSeverityGaugeMarker,
  MinMaxIndicator,
  SeverityConfig,
  SeverityData,
} from "./types";
import { renderGradientBackground } from "./helpers/gradient-background";
import { renderSeverityGradient } from "./helpers/severity-gradient";
import { renderMinMaxIndicator } from "./helpers/min-max-indicator";
import { transitionsCSS } from "./css/transitions";
import { updateGaugeData } from "./helpers/update-data";
import { renderSeveritySolid } from "./helpers/severity-solid";

export type MainGaugeConfig = {
  mode: "flat-arc" | "gradient-arc" | "severity";
  round?: MainRoundStyle;
  severity?: SeverityConfig;
};

export type MainGaugeData = {
  data: GaugeData;
  severity?: SeverityData;
  background?: string;
  round?: MainRoundStyle;
  min_indicator?: MinMaxIndicator;
  max_indicator?: MinMaxIndicator;
  unavailable: boolean;
};

@customElement("gauge-card-pro-main-gauge")
export class GaugeCardProMainGauge extends LitElement {
  @property({ attribute: false }) public config!: MainGaugeConfig;
  @property({ attribute: false }) public data!: MainGaugeData;

  // Derived config state (not reactive; recomputed on config changes)
  private isRounded = false;
  private roundMask?: string;
  private markerShape?: MainSeverityGaugeMarker;

  private severityRoundAngle = 0;
  private severityGradientValueClippath = "";
  private severityCenteredDashArray = "";
  private severityCenteredDashOffset = 0;

  @state() private _updated = false;

  protected override willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);
    if (changedProperties.has("config")) {
      this.updateConfig();
    }

    if (changedProperties.has("data")) {
      this.updateData();
    }
  }

  protected override render(): TemplateResult {
    const isSeverity = this.config.mode === "severity";
    const severityConfig = this.config.severity;
    const severityData = this.data.severity;

    const shouldRenderGradientBg =
      ((isSeverity && severityConfig?.withGradientBackground) ||
        this.config.mode === "gradient-arc" ||
        this.config.mode === "flat-arc") &&
      this.data.background;

    const shouldRenderSeveritySolid =
      isSeverity &&
      severityConfig &&
      severityData &&
      ["basic", "interpolation"].includes(severityConfig?.mode ?? "");

    const shouldRenderSeverityGradient =
      isSeverity &&
      severityConfig &&
      severityData &&
      severityConfig?.mode === "gradient";

    const shouldRenderSeverityMarker =
      isSeverity &&
      severityConfig &&
      severityData &&
      severityConfig?.withGradientBackground &&
      !(severityConfig.fromCenter && severityData.angle === 90);

    const min_indicator: MinMaxIndicator | undefined = this.data.min_indicator
      ? { isRounded: this.isRounded, ...this.data.min_indicator }
      : undefined;

    const max_indicator: MinMaxIndicator | undefined = this.data.max_indicator
      ? { isRounded: this.isRounded, ...this.data.max_indicator }
      : undefined;

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
                    ? "#ffffff"
                    : "var(--primary-background-color)",
                })}
                d="M -40 0 A 40 40 0 0 1 40 0"
                clip-path=${ifDefined(this.isRounded ? "url(#main-rounding" : undefined)}
              ></path>
            `
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
        ${min_indicator
          ? renderMinMaxIndicator("main", "min", min_indicator)
          : nothing}
        ${max_indicator
          ? renderMinMaxIndicator("main", "max", max_indicator)
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

  private updateData() {
    // assigns:
    // this.severityRoundAngle
    // this.severityGradientValueClippath
    // this.severityCenteredDashArray
    // this.severityCenteredDashOffset
    Object.assign(this, updateGaugeData(this.config, this.data));
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
