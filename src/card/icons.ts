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

export type IconConfig = {
  actionEntity?: string;
  tapAction?: ActionConfig;
  holdAction?: ActionConfig;
  doubleTapAction?: ActionConfig;
};

export type IconData = {
  icon: string;
  color: string | undefined;
  label: string | undefined;
};

@customElement("gauge-card-pro-gauge-icons")
export class GaugeCardProGaugeIcons extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public leftConfig?: IconConfig;
  @property({ attribute: false }) public rightConfig?: IconConfig;

  @property({ attribute: false }) public leftData?: IconData;
  @property({ attribute: false }) public rightData?: IconData;

  @state() private leftLabel: string | undefined = "";
  @state() private rightLabel: string | undefined = "";

  private hasIconLeftAction = false;
  private hasIconRightAction = false;

  @state() private _updated = false;

  private _handleIconAction(side: "left" | "right", ev: CustomEvent) {
    ev.stopPropagation();
    const config = {
      entity: this[side]?.actionEntity,
      tap_action: this[side]?.tapAction,
      hold_action: this[side]?.holdAction,
      double_tap_action: this[side]?.doubleTapAction,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("config")) {
      this.hasIconLeftAction = hasAction(this.leftConfig?.tapAction);
      this.hasIconRightAction = hasAction(this.rightConfig?.tapAction);
    }
  }

  protected render(): TemplateResult {
    return html`
        ${this.leftData || this.rightData
          ? html`
              <div class="icon-container">
                <div class="icon-inner-container icon-left">
                  ${this.leftData && this.leftConfig
                    ? html` <ha-state-icon
                          class="icon icon-left"
                          .hass=${this.hass}
                          .icon=${this.leftData.icon}
                          role=${ifDefined(
                            this.hasIconLeftAction ? "button" : undefined
                          )}
                          tabindex=${ifDefined(
                            this.hasIconLeftAction ? "0" : undefined
                          )}
                          style=${styleMap({ color: this.leftData.color })}
                          @action=${(ev: CustomEvent) =>
                            this.hasIconLeftAction
                              ? this._handleIconAction("left", ev)
                              : nothing}
                          .actionHandler=${actionHandler({
                            hasHold: hasAction(this.leftConfig.holdAction),
                            hasDoubleClick: hasAction(
                              this.leftConfig.doubleTapAction
                            ),
                          })}
                          @click=${(ev: CustomEvent) =>
                            this.hasIconLeftAction
                              ? ev.stopPropagation()
                              : nothing}
                          @touchend=${(ev: CustomEvent) =>
                            this.hasIconLeftAction
                              ? ev.stopPropagation()
                              : nothing}
                        ></ha-state-icon>

                        <svg class="icon-label-text" id="icon-left-label">
                          <text
                            class="value-text"
                            style=${styleMap({
                              fill: "var(--primary-text-color)",
                            })}
                          >
                            ${this.leftData.label}
                          </text>
                        </svg>`
                    : nothing}
                </div>
                <div class="icon-inner-container icon-right">
                  ${this.rightData && this.rightConfig
                    ? html` <ha-state-icon
                          class="icon icon-right"
                          .hass=${this.hass}
                          .icon=${this.rightData.icon}
                          role=${ifDefined(
                            this.hasIconRightAction ? "button" : undefined
                          )}
                          tabindex=${ifDefined(
                            this.hasIconRightAction ? "0" : undefined
                          )}
                          style=${styleMap({ color: this.rightData.color })}
                          @action=${(ev: CustomEvent) =>
                            this.hasIconRightAction
                              ? this._handleIconAction("right", ev)
                              : nothing}
                          .actionHandler=${actionHandler({
                            hasHold: hasAction(this.rightConfig.holdAction),
                            hasDoubleClick: hasAction(
                              this.rightConfig.doubleTapAction
                            ),
                          })}
                          @click=${(ev: CustomEvent) =>
                            this.hasIconRightAction
                              ? ev.stopPropagation()
                              : nothing}
                          @touchend=${(ev: CustomEvent) =>
                            this.hasIconRightAction
                              ? ev.stopPropagation()
                              : nothing}
                        ></ha-state-icon>

                        <svg class="icon-label-text" id="icon-right-label">
                          <text
                            class="value-text"
                            style=${styleMap({
                              fill: "var(--primary-text-color)",
                            })}
                          >
                            ${this.rightData.label}
                          </text>
                        </svg>`
                    : nothing}
                </div>
              </div>
            `
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
    element: "all" | "icon-left-label" | "icon-right-label" = "all"
  ) {
    const shouldHandle = (key: string) => element === "all" || element === key;

    const setViewBox = (selector: string) => {
      const svgRoot = this.shadowRoot!.querySelector(selector)!;
      const box = svgRoot.querySelector("text")!.getBBox();
      svgRoot.setAttribute(
        "viewBox",
        `${box.x} ${box.y} ${box.width} ${box.height}`
      );
    };

    if (shouldHandle("icon-left-label") && this.leftLabel) {
      setViewBox("#icon-left-label");
    }
    if (shouldHandle("icon-right-label") && this.rightLabel) {
      setViewBox("#icon-right-label");
    }
  }

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;

      this._rescaleSvgText();
    });
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this.hass || !this._updated || !changedProperties) return;
    if (changedProperties.has("leftData")) {
      if (this.leftData?.label !== this.leftLabel) {
        this.leftLabel = this.leftData?.label
        this._rescaleSvgText("icon-left-label");
      }
    }
    if (changedProperties.has("rightData")) {
      if (this.rightData?.label !== this.rightLabel) {
        this.rightLabel = this.rightData?.label
        this._rescaleSvgText("icon-right-label");
      }
    }
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      svg {
        position: absolute;
      }

      .icon {
        position: absolute;
        bottom: 0%;
        text-align: center;
        line-height: 0;
        height: 100%;
      }

      .icon-container {
        position: absolute;
        height: 17%;
        width: 100%;
        top: 0%;
      }

      .icon-inner-container {
        display: flex;
        height: 100%;
        width: 10%;
        justify-content: center;
        --mdc-icon-size: 100%;
      }

      .icon-left {
        margin-left: 0%;
        margin-right: auto;
        width: 10%;
      }

      .icon-right {
        margin-left: auto;
        margin-right: 0%;
        width: 10%;
      }

      .icon-label-text {
        position: absolute;
        max-height: 65%;
        width: 100%;
        top: 100%;
        min-height: 10px;
      }

      .value-text {
        font-size: 50px;
        text-anchor: middle;
        direction: ltr;
      }
    `;
  }
}
