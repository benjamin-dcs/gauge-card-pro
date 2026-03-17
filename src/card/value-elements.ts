// External dependencies
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import type { HomeAssistant } from "../dependencies/ha";
import { actionHandler, handleAction, hasAction } from "../dependencies/ha";

// Local constants
import { DEFAULTS } from "../constants/defaults";
import { MAIN_GAUGE } from "../constants/svg/main-gauge";
import { INNER_GAUGE } from "../constants/svg/inner-gauge";

// Local utilities
import { isIcon, getIcon } from "../utils/string/icon";

// Local types / render helpers / css
import { transitionsCSS } from "./css/transitions";
import { ValueElementsConfig, ValueElementsData } from "./types";

@customElement("gauge-card-pro-gauge-value-elements")
export class GaugeCardProGaugeValueElements extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: ValueElementsConfig;
  @property({ attribute: false }) public data!: ValueElementsData;

  @state() private primaryValueText: string | undefined = "";
  @state() private secondaryValueText: string | undefined = "";

  @state() private _setpoint_angle: number | undefined;

  private primaryValueTextHasTapAction = false;
  private isPrimaryValueTextInteractive = false;
  private secondaryValueTextHasTapAction = false;
  private isSecondaryValueInteractive = false;

  protected override willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has("config")) {
      this.primaryValueTextHasTapAction = hasAction(
        this.config.primaryValueText.tapAction
      );
      this.isPrimaryValueTextInteractive =
        this.primaryValueTextHasTapAction ||
        hasAction(this.config.primaryValueText.holdAction) ||
        hasAction(this.config.primaryValueText.doubleTapAction);

      this.secondaryValueTextHasTapAction = hasAction(
        this.config.secondaryValueText.tapAction
      );
      this.isSecondaryValueInteractive =
        this.secondaryValueTextHasTapAction ||
        hasAction(this.config.secondaryValueText.holdAction) ||
        hasAction(this.config.secondaryValueText.doubleTapAction);
    }
  }

  protected render(): TemplateResult {
    const primaryValueTextFontSizeReduction = `
      ${
        40 -
        Math.min(
          Math.max(this.data.primaryValueText?.fontSizeReduction ?? 0, 0),
          15
        )
      }%`;

    return html`
      <svg id="pointers" viewBox="-50 -50 100 50">
        ${this.data.mainNeedle
          ? svg`
                <path
                  class="normal-transition"
                  d=${this.data.mainNeedle.customShape ?? (["needle", "on_main"].includes(this.data.innerGaugeMode ?? "") ? MAIN_GAUGE.needles.withInner : MAIN_GAUGE.needles.normal)}
                  style=${styleMap({
                    transform: `rotate(${this.data.mainNeedle.angle}deg)`,
                    fill: this.data.mainNeedle.color ?? DEFAULTS.ui.needleColor,
                    stroke: "var(--main-needle-stroke-color)",
                    "stroke-width": "var(--main-needle-stroke-width)",
                  })}
                ></path>`
          : nothing}
        ${this.data.mainSetpoint
          ? svg`
                ${
                  this.data.mainSetpoint.label
                    ? svg`
                      <g 
                        class="label-group"
                        id="main-setpoint-group">
                        <rect 
                          class="label-pill"
                          id="main-setpoint-pill"
                        ></rect>
                        <text
                          class="label-text normal-transition"
                          id="main-setpoint-label"
                          style=${styleMap({ fill: `var(--main-setpoint-text-color, ${this.data.mainSetpoint.customColor ?? DEFAULTS.ui.setpointNeedleColor})`, "text-anchor": "middle" })}
                          dominant-baseline="middle"
                        >
                          ${this.data.mainSetpoint.label.text}
                        </text>
                      </g>`
                    : nothing
                }
                <path
                  class="normal-transition"
                  d=${this.data.mainSetpoint.customShape ?? (this.data.mainSetpoint.label ? MAIN_GAUGE.needles.setpointWithLabel : MAIN_GAUGE.needles.setpoint)}
                  style=${styleMap({
                    transform: `rotate(${this.data.mainSetpoint.angle}deg)`,
                    fill:
                      this.data.mainSetpoint.customColor ??
                      DEFAULTS.ui.setpointNeedleColor,
                    stroke: "var(--main-setpoint-needle-stroke-color)",
                    "stroke-width": "var(--main-setpoint-needle-stroke-width)",
                  })}
                ></path>`
          : nothing}
        ${this.data.innerNeedle
          ? svg`
                <path
                  class="normal-transition"
                  d=${this.data.innerNeedle.customShape ?? (this.data.innerGaugeMode === "on_main" ? INNER_GAUGE.needles.onMain : INNER_GAUGE.needles.normal)}
                  style=${styleMap({
                    transform: `rotate(${this.data.innerNeedle.angle}deg)`,
                    fill:
                      this.data.innerNeedle.color ?? DEFAULTS.ui.needleColor,
                    stroke: "var(--inner-needle-stroke-color)",
                    "stroke-width": "var(--inner-needle-stroke-width)",
                  })}
                ></path>`
          : nothing}
        ${this.data.innerSetpoint
          ? svg`
                <path
                  class="normal-transition"
                  d=${this.data.innerSetpoint.customShape ?? (this.data.innerGaugeMode === "on_main" ? INNER_GAUGE.needles.setpointOnMain : INNER_GAUGE.needles.setpoint)}
                  style=${styleMap({
                    transform: `rotate(${this.data.innerSetpoint.angle}deg)`,
                    fill:
                      this.data.innerSetpoint.customColor ??
                      DEFAULTS.ui.setpointNeedleColor,
                    stroke: "var(--inner-setpoint-needle-stroke-color)",
                    "stroke-width": "var(--inner-setpoint-needle-stroke-width)",
                  })}
                ></path>`
          : nothing}
      </svg>

      ${this.data.primaryValueText
        ? !isIcon(this.data.primaryValueText.text)
          ? svg`
              <svg
                id="primary-value-text-box"
                class="primary-value-text-box"
                style=${styleMap({ "max-height": primaryValueTextFontSizeReduction })}
                role=${ifDefined(this.primaryValueTextHasTapAction ? "button" : undefined)}
                tabindex=${ifDefined(this.primaryValueTextHasTapAction ? "0" : undefined)}
                @action=${(ev: CustomEvent) =>
                  this.isPrimaryValueTextInteractive
                    ? this._handleValueTextAction("primary", ev)
                    : nothing}
                .actionHandler=${
                  this.isPrimaryValueTextInteractive
                    ? actionHandler({
                        hasHold: hasAction(
                          this.config.primaryValueText.holdAction
                        ),
                        hasDoubleClick: hasAction(
                          this.config.primaryValueText.doubleTapAction
                        ),
                      })
                    : nothing
                }
                @click=${(ev: MouseEvent) =>
                  this.isPrimaryValueTextInteractive
                    ? ev.stopPropagation()
                    : nothing}
                @touchend=${(ev: Event) =>
                  this.isPrimaryValueTextInteractive
                    ? ev.stopPropagation()
                    : nothing}
              >
                <text 
                  class="primary-value-text"
                  style=${styleMap({ fill: this.data.primaryValueText.color ?? DEFAULTS.ui.valueTextColor })}>
                  ${this.data.primaryValueText.text}
                </text>
              </svg>`
          : html` <div class="primary-value-icon">
              <ha-state-icon
                .hass=${this.hass}
                .icon=${getIcon(this.data.primaryValueText?.text)}
                class="icon value-state-icon"
                style=${styleMap({
                  color:
                    this.data.primaryValueText.color ??
                    DEFAULTS.ui.valueTextColor,
                })}
              ></ha-state-icon>
            </div>`
        : nothing}
      ${this.data.secondaryValueText
        ? !isIcon(this.data.secondaryValueText.text)
          ? svg`
                <svg 
                  id="secondary-value-text-box"
                  class="secondary-value-text-box"
                  role=${ifDefined(this.secondaryValueTextHasTapAction ? "button" : undefined)}
                  tabindex=${ifDefined(this.secondaryValueTextHasTapAction ? "0" : undefined)}
                  @action=${(ev: CustomEvent) =>
                    this.isSecondaryValueInteractive
                      ? this._handleValueTextAction("secondary", ev)
                      : nothing}
                  .actionHandler=${
                    this.isSecondaryValueInteractive
                      ? actionHandler({
                          hasHold: hasAction(
                            this.config.secondaryValueText.holdAction
                          ),
                          hasDoubleClick: hasAction(
                            this.config.secondaryValueText.doubleTapAction
                          ),
                        })
                      : nothing
                  }
                  @click=${(ev: MouseEvent) =>
                    this.isSecondaryValueInteractive
                      ? ev.stopPropagation()
                      : nothing}
                  @touchend=${(ev: Event) =>
                    this.isSecondaryValueInteractive
                      ? ev.stopPropagation()
                      : nothing}
                  >
                  <text 
                    class="secondary-value-text"
                    style=${styleMap({ fill: this.data.secondaryValueText.color ?? DEFAULTS.ui.valueTextColor })}>
                    ${this.data.secondaryValueText.text}
                  </text>
                </svg>`
          : html` <div class="secondary-value-icon">
              <ha-state-icon
                .hass=${this.hass}
                .icon=${getIcon(this.data.secondaryValueText.text)}
                class="icon value-state-icon"
                style=${styleMap({
                  color:
                    this.data.secondaryValueText.color ??
                    DEFAULTS.ui.valueTextColor,
                })}
              ></ha-state-icon>
            </div>`
        : nothing}
    `;
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!changedProperties) return;

    if (changedProperties.has("data")) {
      if (this.data.primaryValueText?.text !== this.primaryValueText) {
        this.primaryValueText = this.data.primaryValueText?.text;
        this._rescaleSvgText("primary-value-text");
      }

      if (this.data.secondaryValueText?.text !== this.secondaryValueText) {
        this.secondaryValueText = this.data.secondaryValueText?.text;
        this._rescaleSvgText("secondary-value-text");
      }

      if (this.data.mainSetpoint?.angle !== this._setpoint_angle) {
        this._setpoint_angle = this.data.mainSetpoint?.angle;
        this._updateMainSetpointLabel();
      }
    }
  }

  //=============================================================================
  // SVG TEXT SCALING
  //
  // Set the viewbox of the SVG containing the value to perfectly fit the text.
  // That way it will auto-scale correctly.
  //=============================================================================

  private _rescaleSvgText(
    element: "all" | "primary-value-text" | "secondary-value-text" = "all"
  ) {
    const shouldHandle = (key: string) => element === "all" || element === key;

    const setViewBox = (selector: string) => {
      const svgRoot = this.shadowRoot!.querySelector(selector)!;
      if (!svgRoot) return;
      const box = svgRoot.querySelector("text")!.getBBox();
      svgRoot.setAttribute(
        "viewBox",
        `${box.x} ${box.y} ${box.width} ${box.height}`
      );
    };

    if (
      shouldHandle("primary-value-text") &&
      this.data.primaryValueText &&
      !isIcon(this.data.primaryValueText.text)
    ) {
      setViewBox("#primary-value-text-box");
    }
    if (
      shouldHandle("secondary-value-text") &&
      this.data.secondaryValueText &&
      !isIcon(this.data.secondaryValueText.text)
    ) {
      setViewBox("#secondary-value-text-box");
    }
  }

  private _updateMainSetpointLabel() {
    if (!this.data.mainSetpoint) return;

    const group = this.shadowRoot?.querySelector(
      "#main-setpoint-group"
    ) as SVGGElement;
    const pill = this.shadowRoot?.querySelector(
      "#main-setpoint-pill"
    ) as SVGRectElement;
    const text = this.shadowRoot?.querySelector(
      "#main-setpoint-label"
    ) as SVGTextElement;
    if (!group || !pill || !text) return;

    const angle = this.data.mainSetpoint.angle;
    const textBBox = text.getBBox();
    const pillPadX = 2;
    const pillPadY = 1;

    const startY = 44 * Math.sin((angle * Math.PI) / 180);
    const halfWidthPill = textBBox.width / 2 + pillPadX;
    const halfWidthPillLengthY = Math.abs(
      halfWidthPill * Math.cos((angle * Math.PI) / 180)
    );
    const endHeight = startY - halfWidthPillLengthY;

    // Position group
    // Makes the label stick to the bottom in case of overflow
    let labelAngle = angle - 90; // _setpoint_angle is from 0 to 180
    if (endHeight <= 0) {
      if (angle < 90) {
        // Label in left half of gauge
        labelAngle =
          (Math.sinh(halfWidthPillLengthY / 44) / Math.PI) * 180 - 90;
      } else {
        // Label in right half of gauge
        labelAngle =
          90 - (Math.sinh(halfWidthPillLengthY / 44) / Math.PI) * 180;
      }
    }
    group.setAttribute(
      "transform",
      `translate(0 -44) rotate(${labelAngle} 0 44)`
    );

    // Size Pill
    pill.setAttribute("width", String(textBBox.width + pillPadX * 2));
    pill.setAttribute("height", String(textBBox.height + pillPadY * 2));
    pill.setAttribute(
      "transform",
      `translate(-${textBBox.width / 2 + pillPadX} -${textBBox.height / 2 + pillPadY})`
    );

    // Pill radius
    const h = textBBox.height + pillPadY * 2;
    pill.setAttribute("rx", String(h / 2));
    pill.setAttribute("ry", String(h / 2));
  }

  private _handleValueTextAction(
    type: "primary" | "secondary",
    ev: CustomEvent
  ) {
    ev.stopPropagation();
    const configSource =
      type === "primary"
        ? this.config.primaryValueText
        : this.config.secondaryValueText;
    const config = {
      entity: configSource?.actionEntity,
      tap_action: configSource?.tapAction,
      hold_action: configSource?.holdAction,
      double_tap_action: configSource?.doubleTapAction,
    };
    handleAction(this, this.hass, config, ev.detail.action);
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
        svg {
          position: absolute;
        }
        .indicators {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .primary-value-text-box {
          display: block;
          position: absolute;
          max-width: 55%;
          left: 50%;
          bottom: -7%;
          transform: translate(-50%, 0%);
        }

        .primary-value-text {
          font-size: 50px;
          text-anchor: middle;
          direction: ltr;
          pointer-events: auto;
        }

        .primary-value-icon {
          position: absolute;
          height: 40%;
          width: 100%;
          bottom: -3%;
        }

        .secondary-value-text-box {
          display: block;
          position: absolute;
          max-height: 22%;
          max-width: 30%;
          left: 50%;
          bottom: 27%;
          transform: translate(-50%, 0%);
        }

        .secondary-value-text {
          font-size: 50px;
          text-anchor: middle;
          direction: ltr;
          pointer-events: auto;
        }

        .secondary-value-icon {
          position: absolute;
          height: 22%;
          width: 100%;
          bottom: 32%;
        }

        .value-state-icon {
          width: 100%;
          --mdc-icon-size: 100%;
        }

        /* Labels are only implemented for main-gauge */
        .label-group {
          transition: all 1s ease 0s;
        }

        .label-pill {
          fill: var(
            --main-setpoint-bg-color,
            color-mix(in srgb, var(--card-background-color) 85%, transparent)
          );
          stroke: var(--divider-color);
          stroke-width: 0.5px;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
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
