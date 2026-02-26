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

import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import {
  ActionConfig,
  actionHandler,
  afterNextRender,
  handleAction,
  hasAction,
  HomeAssistant,
} from "../dependencies/ha";

import { isIcon, getIcon } from "../utils/string/icon";

import { DEFAULTS } from "../constants/defaults";
import { MAIN_GAUGE } from "../constants/svg/gauge-main";
import { INNER_GAUGE } from "../constants/svg/gauge-inner";

import { innerGaugeModes } from "./config";
import { transitionsCSS } from "./css/transitions";

type Needle = {
  angle: number;
  color?: string;
  customShape?: string;
};

type Setpoint = {
  angle: number;
  color?: string;
  customShape?: string;
};

type ValueText = {
  text: string;
  color?: string;
  actionEntity?: string;
  tapAction?: ActionConfig;
  holdAction?: ActionConfig;
  doubleTapAction?: ActionConfig;
};

export type ValueElementsViewModel = {
  mainNeedle?: Needle & { hasInner: boolean };
  mainSetpoint?: Setpoint & {
    label?: { text: string; color?: string; hasInner: boolean };
  };
  innerNeedle?: Needle & { mode: innerGaugeModes };
  innerSetpoint?: Setpoint & { mode: innerGaugeModes };
  primaryValueText?: ValueText & { fontSizeReduction?: number };
  secondaryValueText?: ValueText;
};

@customElement("gauge-card-pro-gauge-value-elements")
export class GaugeCardProGaugeValueElements extends LitElement {
  @property({ attribute: false }) public data!: ValueElementsViewModel;

  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private primaryValueText: string | undefined = "";
  @state() private secondaryValueText: string | undefined = "";

  @state() private _setpoint_angle: number | undefined;

  @state() private _updated = false;

  private _handlePrimaryValueTextAction(ev: CustomEvent) {
    ev.stopPropagation();
    const config = {
      entity: this.data.primaryValueText?.actionEntity,
      tap_action: this.data.primaryValueText?.tapAction,
      hold_action: this.data.primaryValueText?.holdAction,
      double_tap_action: this.data.primaryValueText?.doubleTapAction,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
  }

  private _handleSecondaryValueTextAction(ev: CustomEvent) {
    ev.stopPropagation();
    const config = {
      entity: this.data.secondaryValueText?.actionEntity,
      tap_action: this.data.secondaryValueText?.tapAction,
      hold_action: this.data.secondaryValueText?.holdAction,
      double_tap_action: this.data.secondaryValueText?.doubleTapAction,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
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

    const hasPrimaryValueTextAction = hasAction(
      this.data.primaryValueText?.tapAction
    );
    const hasSecondaryValueTextAction = hasAction(
      this.data.secondaryValueText?.tapAction
    );

    return html`
      <svg id="pointers" style="position: absolute;" viewBox="-50 -50 100 50">
        ${this.data.mainNeedle
          ? svg`
                <path
                  class="normal-transition"
                  d=${(this.data.mainNeedle.customShape ?? this.data.mainNeedle.hasInner) ? MAIN_GAUGE.needles.withInner : MAIN_GAUGE.needles.normal}
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
                          style=${styleMap({ fill: this.data.mainSetpoint.label.color ?? DEFAULTS.ui.setpointNeedleColor, "text-anchor": "middle" })}
                          dominant-baseline="middle"
                        >
                          ${this.data.mainSetpoint.label.text}
                        </text>
                      </g>`
                    : nothing
                }
                <path
                  class="normal-transition"
                  d=${(this.data.mainSetpoint.customShape ?? this.data.mainSetpoint.label) ? MAIN_GAUGE.needles.setpointWithLabel : MAIN_GAUGE.needles.setpoint}
                  style=${styleMap({
                    transform: `rotate(${this.data.mainSetpoint.angle}deg)`,
                    fill:
                      this.data.mainSetpoint.color ??
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
                  d=${(this.data.innerNeedle.customShape ?? this.data.innerNeedle.mode === "on_main") ? INNER_GAUGE.needles.onMain : INNER_GAUGE.needles.normal}
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
                  d=${(this.data.innerSetpoint.customShape ?? this.data.innerSetpoint.mode === "on_main") ? INNER_GAUGE.needles.setpointOnMain : INNER_GAUGE.needles.setpoint}
                  style=${styleMap({
                    transform: `rotate(${this.data.innerSetpoint.angle}deg)`,
                    fill:
                      this.data.innerSetpoint.color ??
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
                role=${ifDefined(hasPrimaryValueTextAction ? "button" : undefined)}
                tabindex=${ifDefined(hasPrimaryValueTextAction ? "0" : undefined)}
                @action=${(ev: CustomEvent) =>
                  hasPrimaryValueTextAction
                    ? this._handlePrimaryValueTextAction(ev)
                    : nothing}
                .actionHandler=${actionHandler({
                  hasHold: hasAction(this.data.primaryValueText.holdAction),
                  hasDoubleClick: hasAction(
                    this.data.primaryValueText.doubleTapAction
                  ),
                })}
                @click=${(ev: CustomEvent) =>
                  hasPrimaryValueTextAction ? ev.stopPropagation() : nothing}
                @touchend=${(ev: CustomEvent) =>
                  hasPrimaryValueTextAction ? ev.stopPropagation() : nothing}
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
                  role=${ifDefined(hasSecondaryValueTextAction ? "button" : undefined)}
                  tabindex=${ifDefined(hasSecondaryValueTextAction ? "0" : undefined)}
                  @action=${(ev: CustomEvent) =>
                    hasSecondaryValueTextAction
                      ? this._handleSecondaryValueTextAction(ev)
                      : nothing}
                  .actionHandler=${actionHandler({
                    hasHold: hasAction(this.data.secondaryValueText.holdAction),
                    hasDoubleClick: hasAction(
                      this.data.secondaryValueText.doubleTapAction
                    ),
                  })}
                  @click=${(ev: CustomEvent) =>
                    hasSecondaryValueTextAction
                      ? ev.stopPropagation()
                      : nothing}
                  @touchend=${(ev: CustomEvent) =>
                    hasSecondaryValueTextAction
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

  //-----------------------------------------------------------------------------
  // SVG TEXT SCALING
  //
  // Set the viewbox of the SVG containing the value to perfectly fit the text.
  // That way it will auto-scale correctly.
  //-----------------------------------------------------------------------------

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

    const group = this.shadowRoot?.querySelector<SVGGElement>(
      "#main-setpoint-group"
    );
    const pill = this.shadowRoot?.querySelector<SVGRectElement>(
      "#main-setpoint-pill"
    );
    const text = this.shadowRoot?.querySelector<SVGTextElement>(
      "#main-setpoint-label"
    );
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

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation (todo) to work
    afterNextRender(() => {
      this._updated = true;
      this._rescaleSvgText();
      this._updateMainSetpointLabel();
    });
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._updated || !changedProperties) return;

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

  static get styles(): CSSResultGroup {
    return [
      transitionsCSS,

      css`
        :host {
          display: block;
          width: 100%;
          height: 100%;
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
          bottom: 0;
          transform: translate(-50%, 0%);
        }

        .primary-value-text {
          font-size: 50px;
          text-anchor: middle;
          direction: ltr;
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
          bottom: 34%;
          transform: translate(-50%, 0%);
        }

        .secondary-value-text {
          font-size: 50px;
          text-anchor: middle;
          direction: ltr;
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
          fill: color-mix(
            in srgb,
            var(--card-background-color) 85%,
            transparent
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
