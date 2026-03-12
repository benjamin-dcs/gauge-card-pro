// External dependencies (Lit)
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";

// Lit directives
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import { afterNextRender } from "../dependencies/ha";

// Local constants / types / utils
import { INNER_GAUGE } from "../constants/svg/inner-gauge";
import type { InnerGaugeConfig, InnerGaugeData } from "./types";

// Local render / css
import { renderGradientBackground } from "./helpers/gradient-background";
import { renderSeverityGradient } from "./helpers/severity-gradient";
import { renderMinMaxIndicator } from "./helpers/min-max-indicator";
import { transitionsCSS } from "./css/transitions";
import { updateGaugeData } from "./helpers/update-data";
import { renderSeveritySolid } from "./helpers/severity-solid";

@customElement("gauge-card-pro-inner-gauge")
export class GaugeCardProInnerGauge extends LitElement {
  @property({ attribute: false }) public config!: InnerGaugeConfig;
  @property({ attribute: false }) public data!: InnerGaugeData;

  // Derived config state (not reactive; recomputed on config changes)
  private isRounded = false;
  private roundMask?: string;
  private roundMaskDivider?: string;

  private severityRoundAngle = 0;
  private severityGradientValueClippath = "";
  private severityCenteredDashArray = "";
  private severityCenteredDashOffset = 0;

  private severityDividerCenteredDashArray = "";
  private severityDividerCenteredDashOffset = 0;

  @state() private _updated = false;

  protected override willUpdate(changedProperties: PropertyValues): void {
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

    return html`
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
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
          /* static divider */
          ["flat-arc", "gradient-arc"].includes(this.config.mode) ||
          this.config.severity?.withGradientBackground
            ? svg`
              <path
                class="inner-gauge-divider"
                d="M -32.5 0 A 32.5 32.5 0 0 1 32.5 0"
                clip-path=${ifDefined(
                  this.isRounded ? "url(#inner-divider-rounding)" : undefined
                )}
              ></path>`
            : nothing
        }
        ${
          /* solid white layer for opaque gradient bg */
          severityConfig?.withGradientBackground
            ? svg`
              <path
                class="inner-gradient-bg-bg"
                d="M -32 0 A 32 32 0 1 1 32 0"
                clip-path=${ifDefined(this.isRounded ? "url(#inner-rounding)" : undefined)}
              ></path>`
            : nothing
        }
        ${shouldRenderGradientBg
          ? renderGradientBackground("inner", this.data.background!)
          : nothing}
        ${
          /* severity divider */
          isSeverity && severityData?.angle
            ? svg`
              <g clip-path=${ifDefined(
                this.isRounded ? "url(#inner-divider-rounding)" : undefined
              )}>
                <g clip-path=${ifDefined(
                  this.isRounded && isSeverity
                    ? "url(#inner-severity-divider-rounding)"
                    : undefined
                )}>
                  ${
                    severityConfig?.fromCenter
                      ? severityData.angle !== 90
                        ? svg`
                          <g transform="rotate(-90)">
                            <circle
                              class=${classMap({
                                "inner-gauge-divider": true,
                                "normal-transition":
                                  severityConfig!.mode !== "gradient",
                              })}
                              r="32.5"
                              pathLength="360"
                              stroke-dasharray="${
                                this.severityDividerCenteredDashArray
                              }"
                              stroke-dashoffset="${
                                this.severityDividerCenteredDashOffset
                              }"
                            ></circle>
                          </g>`
                        : nothing
                      : severityData.angle > 0
                        ? svg`
                          <g
                            style=${styleMap({
                              transform: `rotate(${Math.min(severityData.angle + 1.5, 180)}deg)`,
                              transformOrigin: "0px 0px",
                            })}
                          >
                            <path
                              class=${classMap({
                                "inner-gauge-divider": true,
                                "normal-transition":
                                  severityConfig!.mode !== "gradient",
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
        ${shouldRenderSeveritySolid
          ? renderSeveritySolid(
              "inner",
              severityData,
              severityConfig,
              this.isRounded,
              this.severityCenteredDashArray,
              this.severityCenteredDashOffset
            )
          : nothing}
        ${shouldRenderSeverityGradient
          ? renderSeverityGradient("inner", this.isRounded, severityData.color)
          : nothing}
        ${this.data.min_indicator
          ? renderMinMaxIndicator(
              "inner",
              "min",
              this.isRounded,
              this.data.min_indicator
            )
          : nothing}
        ${this.data.max_indicator
          ? renderMinMaxIndicator(
              "inner",
              "max",
              this.isRounded,
              this.data.max_indicator
            )
          : nothing}
      </svg>
    `;
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
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

      // No need to re-check everything that's done in updateData()
      if (this.severityCenteredDashArray) {
        const angle = this.data.severity!.angle;
        this.severityDividerCenteredDashArray =
          angle < 90
            ? `${90 - (angle - 1.5)} ${360 - (90 - (angle - 1.5))}`
            : `${angle + 1.5 - 90} ${360 - (angle + 1.5 - 90)}`;
        this.severityDividerCenteredDashOffset =
          angle < 90 ? 90 - (angle - 1.5) : 0;
      } else {
        this.severityDividerCenteredDashArray = "";
        this.severityDividerCenteredDashOffset = 0;
      }
    }
  }

  private updateConfig(): void {
    const roundStyle = this.config.round;
    this.isRounded = roundStyle != null && roundStyle !== "off";

    if (!this.isRounded) {
      this.roundMask = undefined;
      this.roundMaskDivider = undefined;
      return;
    }

    this.roundMask =
      roundStyle === "full"
        ? INNER_GAUGE.masks.gauge.full
        : INNER_GAUGE.masks.gauge.small;

    const dividerMasks =
      this.config.mode === "severity"
        ? INNER_GAUGE.masks.divider.severity
        : INNER_GAUGE.masks.divider.static;

    this.roundMaskDivider =
      roundStyle === "full" ? dividerMasks.full : dividerMasks.small;
  }

  private updateData() {
    // assigns:
    // this.severityRoundAngle
    // this.severityGradientValueClippath
    // this.severityCenteredDashArray
    // this.severityCenteredDashOffset
    Object.assign(this, updateGaugeData(this.config, this.data));
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

        #inner-gauge {
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
