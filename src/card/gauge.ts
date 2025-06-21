// External dependencies
import { html, LitElement, nothing, svg } from "lit";
import type { PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

// Internalized external dependencies
import {
  actionHandler,
  afterNextRender,
  handleAction,
  hasAction,
  HomeAssistant,
} from "../dependencies/ha";

// Local utilities
import { getAngle } from "../utils/number/get-angle";
import { isIcon, getIcon } from "../utils/string/icon";

// Core functionality
import {
  Gauge,
  GaugeCardProCardConfig,
  GaugeSegment,
  GradientSegment,
} from "./config";
import { gaugeCSS } from "./css/gauge";
import { GradientRenderer } from "./_gradient-renderer";

const stopPropagation = (ev) => ev.stopPropagation();

@customElement("gauge-card-pro-gauge")
export class GaugeCardProGauge extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ type: Boolean }) public hasHold = false;
  @property({ type: Boolean }) public hasDoubleClick = false;

  // main gauge
  @property({ type: Boolean }) public gradient = false;
  @property({ type: Number }) public max = 100;
  @property({ type: Number }) public min = 0;
  @property({ type: Boolean }) public needle = false;
  @property({ type: String }) public needleColor = "";
  @property({ type: Array }) public segments?: GaugeSegment[];
  @property({ type: Array }) public gradientSegments?: GradientSegment[];
  @property({ type: String }) public gradientResolution?: string | number;
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
  @property({ type: Boolean }) public innerSetpoint = false;
  @property({ type: String }) public innerSetpointNeedleColor = "";
  @property({ type: Number }) public innerSetpointValue = 0;
  @property({ type: Array }) public innerGradientSegments?: GradientSegment[];
  @property({ type: String }) public innerGradientResolution?: string | number;
  @property({ type: Number }) public innerValue = 0;

  // setpoint
  @property({ type: Boolean }) public setpoint = false;
  @property({ type: String }) public setpointNeedleColor = "";
  @property({ type: Number }) public setpointValue = 0;

  // icons
  @property({ type: String }) public iconIcon?: string;
  @property({ type: String }) public iconColor?: string;
  @property({ type: String }) public iconLabel?: string;

  // needle shapes
  @property({ type: String }) public needleShapeMain?: string;
  @property({ type: String }) public needleShapeMainWithInner?: string;
  @property({ type: String }) public needleShapeMainSetpoint?: string;
  @property({ type: String }) public needleShapeInner?: string;
  @property({ type: String }) public needleShapeInnerOnMain?: string;
  @property({ type: String }) public needleShapeInnerSetpoint?: string;
  @property({ type: String }) public needleShapeInnerSetpointOnMain?: string;

  @state() public _config?: GaugeCardProCardConfig;
  @state() private _angle = 0;
  @state() private _inner_angle = 0;
  @state() private _inner_setpoint_angle = 0;
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
    console.log(this.innerSetpointValue)
    this._inner_setpoint_angle = this.innerSetpoint !== undefined
      ? getAngle(this.innerSetpointValue, this.innerMin, this.innerMax)
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
      this._rescaleIconLabelTextSvg();

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

  private _handlePrimaryValueTextAction(ev: CustomEvent) {
    const config = {
      entity: this._config!.entity,
      tap_action: this._config!.primary_value_text_tap_action,
      hold_action: this._config!.primary_value_text_hold_action,
      double_tap_action: this._config!.primary_value_text_double_tap_action,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
  }

  private _handleSecondaryValueTextAction(ev: CustomEvent) {
    const config = {
      entity: this._config!.entity2,
      tap_action: this._config!.secondary_value_text_tap_action,
      hold_action: this._config!.secondary_value_text_hold_action,
      double_tap_action: this._config!.secondary_value_text_double_tap_action,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
  }

  private _handleIconAction(ev: CustomEvent) {
    const config = {
      entity:
        this._config!.icon?.type === "battery"
          ? this._config!.icon.value
          : undefined,
      tap_action: this._config!.icon_tap_action,
      hold_action: this._config!.icon_hold_action,
      double_tap_action: this._config!.icon_double_tap_action,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
  }

  protected render() {
    const hasPrimaryValueTextAction =
      !this._config?.primary_value_text_tap_action ||
      hasAction(this._config?.primary_value_text_tap_action);
    const hasSecondaryValueTextAction =
      !this._config?.secondary_value_text_tap_action ||
      hasAction(this._config?.secondary_value_text_tap_action);
    const hasIconAction =
      !this._config?.icon_tap_action ||
      hasAction(this._config?.icon_tap_action);

    return svg`
      <svg id="main-gauge" viewBox="-50 -50 100 50" class="gauge">
        ${
          !this.needle
            ? svg`<path
                class="dial"
                d="M -40 0 A 40 40 0 0 1 40 0"
              ></path>`
            : ""
        }

        ${
          !this.needle && this.value > this.min
            ? svg`<path
                class="value"
                d="M -40 0 A 40 40 0 1 0 40 0"
                style=${styleMap({ transform: `rotate(${this._angle}deg)` })}
              > </path>`
            : ""
        }

        ${
          this.needle && !this.gradient
            ? this.segments!.sort((a, b) => a.pos - b.pos).map((segment) => {
                const angle = getAngle(segment.pos, this.min, this.max);
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
                    .sort((a, b) => a.pos - b.pos)
                    .map((segment) => {
                      const angle = getAngle(
                        segment.pos,
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
                      ? this.needleShapeMainWithInner
                      : this.needleShapeMain
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
                  d=${this.needleShapeMainSetpoint}
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
                  d=${this.innerMode === "on_main" ? this.needleShapeInnerOnMain : this.needleShapeInner }
                  style=${styleMap({ transform: `rotate(${this._inner_angle}deg)`, fill: this.innerNeedleColor })}
                ></path>`
              : ""
          } 

          ${
            this.innerSetpoint
              ? svg`
                <path
                  class="needle"
                  d=${this.innerMode === "on_main" ? this.needleShapeInnerSetpointOnMain : this.needleShapeInnerSetpoint}
                  style=${styleMap({ transform: `rotate(${this._inner_setpoint_angle}deg)`, fill: this.innerSetpointNeedleColor })}
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
              style=${styleMap({ "max-height": this.primaryValueTextFontSizeReduction })}
              @action=${(ev: CustomEvent) => {
                ev.stopPropagation();
                this._handlePrimaryValueTextAction(ev);
              }}
              @click=${ifDefined(hasPrimaryValueTextAction ? stopPropagation : nothing)}
              .actionHandler=${actionHandler({
                hasHold: hasAction(
                  this._config!.primary_value_text_hold_action
                ),
                hasDoubleClick: hasAction(
                  this._config!.primary_value_text_double_tap_action
                ),
              })}
              role=${ifDefined(hasPrimaryValueTextAction ? "button" : undefined)}
              tabindex=${ifDefined(hasPrimaryValueTextAction ? "0" : undefined)}
            >
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
                class="icon primary-value-state-icon"
                style=${styleMap({ color: this.primaryValueTextColor })}
              ></ha-state-icon>
            </div>`
      }

      ${
        !isIcon(this.secondaryValueText)
          ? svg`
            <svg 
              class="secondary-value-text"
              @action=${(ev: CustomEvent) => {
                ev.stopPropagation();
                this._handleSecondaryValueTextAction(ev);
              }}
              @click=${ifDefined(hasSecondaryValueTextAction ? stopPropagation : nothing)}
              .actionHandler=${actionHandler({
                hasHold: hasAction(
                  this._config!.secondary_value_text_hold_action
                ),
                hasDoubleClick: hasAction(
                  this._config!.secondary_value_text_double_tap_action
                ),
              })}
              role=${ifDefined(hasSecondaryValueTextAction ? "button" : undefined)}
              tabindex=${ifDefined(hasSecondaryValueTextAction ? "0" : undefined)}
              >
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
                class="icon secondary-value-state-icon"
                style=${styleMap({ color: this.secondaryValueTextColor })}
              ></ha-state-icon>
            </div>`
      }
      ${
        this.iconIcon
          ? html`<div class="icon-container">
              <div
                class="icon-inner-container"
                @action=${(ev: CustomEvent) => {
                  ev.stopPropagation();
                  this._handleIconAction(ev);
                }}
                @click=${ifDefined(hasIconAction ? stopPropagation : nothing)}
                .actionHandler=${actionHandler({
                  hasHold: hasAction(this._config!.icon_hold_action),
                  hasDoubleClick: hasAction(
                    this._config!.icon_double_tap_action
                  ),
                })}
                role=${ifDefined(hasIconAction ? "button" : undefined)}
                tabindex=${ifDefined(hasIconAction ? "0" : undefined)}
              >
                <ha-state-icon
                  .hass=${this.hass}
                  .icon=${this.iconIcon}
                  class="icon"
                  style=${styleMap({ color: this.iconColor })}
                ></ha-state-icon>

                <svg class="icon-label-text">
                  <text
                    class="value-text"
                    style=${styleMap({ fill: "var(--primary-text-color)" })}
                  >
                    ${this.iconLabel}
                  </text>
                </svg>
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

    if (changedProperties.has("iconLabel")) {
      this._rescaleIconLabelTextSvg();
    }

    if (this.shouldRenderGradient("main")) {
      this._mainGaugeGradient.render(
        this.min,
        this.max,
        this.gradientSegments!
      );
    }

    if (this.shouldRenderGradient("inner")) {
      this._innerGaugeGradient.render(
        this.innerMin,
        this.innerMax,
        this.innerGradientSegments!
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

  private _rescaleIconLabelTextSvg() {
    if (!this.iconIcon) return;

    const svgRoot = this.shadowRoot!.querySelector(".icon-label-text")!;
    const box = svgRoot.querySelector("text")!.getBBox()!;
    svgRoot.setAttribute(
      "viewBox",
      `${box.x} ${box!.y} ${box.width} ${box.height}`
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gauge-card-pro-gauge": GaugeCardProGauge;
  }
}
