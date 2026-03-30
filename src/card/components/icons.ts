// External dependencies
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import type { HomeAssistant } from "../../dependencies/ha";
import {
  actionHandler,
  afterNextRender,
  handleAction,
  hasAction,
} from "../../dependencies/ha";
import type { IconConfig, IconData } from "../types";

@customElement("gauge-card-pro-gauge-icons")
export class GaugeCardProGaugeIcons extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public leftConfig?: IconConfig;
  @property({ attribute: false }) public rightConfig?: IconConfig;

  @property({ attribute: false }) public leftData?: IconData;
  @property({ attribute: false }) public rightData?: IconData;

  @state() private _leftLabel: string | undefined = "";
  @state() private _rightLabel: string | undefined = "";

  private leftIconHasTapAction = false;
  private isLeftIconInteractive = false;
  private rightIconHasTapAction = false;
  private isRightIconInteractive = false;

  @state() private _updated = false;

  protected override willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);

    if (changedProperties.has("leftConfig")) {
      this.leftIconHasTapAction = hasAction(this.leftConfig?.tapAction);
      this.isLeftIconInteractive =
        this.leftIconHasTapAction ||
        hasAction(this.leftConfig?.holdAction) ||
        hasAction(this.leftConfig?.doubleTapAction);
    }
    if (changedProperties.has("rightConfig")) {
      this.rightIconHasTapAction = hasAction(this.rightConfig?.tapAction);
      this.isRightIconInteractive =
        this.rightIconHasTapAction ||
        hasAction(this.rightConfig?.holdAction) ||
        hasAction(this.rightConfig?.doubleTapAction);
    }
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.leftData && !this.rightData) return nothing;

    const leftIcon = this.leftData
      ? this._renderIcon(
          "left",
          this.leftData,
          this.leftConfig,
          this.leftIconHasTapAction,
          this.isLeftIconInteractive
        )
      : nothing;

    const rightIcon = this.rightData
      ? this._renderIcon(
          "right",
          this.rightData,
          this.rightConfig,
          this.rightIconHasTapAction,
          this.isRightIconInteractive
        )
      : nothing;

    return html`
      <div class="icons-container">
        ${leftIcon}
        ${rightIcon}
      </div>
    `;
  }

  private _renderIcon(
    side: "left" | "right",
    data: IconData,
    config: IconConfig | undefined,
    hasTapAction: boolean,
    isInteractive: boolean
  ): TemplateResult {
    return html`
      <div class="icon-inner-container icon-${side}">
        <ha-state-icon
          class="icon icon-${side}"
          .hass=${this.hass}
          .icon=${data.icon}
          role=${ifDefined(hasTapAction ? "button" : undefined)}
          tabindex=${ifDefined(hasTapAction ? "0" : undefined)}
          style=${styleMap({ color: data.color })}
          @action=${(ev: CustomEvent) =>
            isInteractive ? this._handleIconAction(side, ev) : nothing}
          .actionHandler=${isInteractive
            ? actionHandler({
                hasHold: hasAction(config?.holdAction),
                hasDoubleClick: hasAction(config?.doubleTapAction),
              })
            : nothing}
          @click=${(ev: MouseEvent) =>
            isInteractive ? ev.stopPropagation() : nothing}
          @touchend=${(ev: Event) =>
            isInteractive ? ev.stopPropagation() : nothing}
        ></ha-state-icon>

        <svg class="icon-label-text" id="icon-${side}-label">
          <text
            class="value-text"
            style=${styleMap({ fill: "var(--primary-text-color)" })}
          >
            ${data.label}
          </text>
        </svg>
      </div>
    `;
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;
      this._rescaleSvgText();
    });
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this.hass || !this._updated || !changedProperties) return;
    if (changedProperties.has("leftData")) {
      if (this.leftData?.label !== this._leftLabel) {
        this._leftLabel = this.leftData?.label;
        this._rescaleSvgText("icon-left-label");
      }
    }
    if (changedProperties.has("rightData")) {
      if (this.rightData?.label !== this._rightLabel) {
        this._rightLabel = this.rightData?.label;
        this._rescaleSvgText("icon-right-label");
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

    if (shouldHandle("icon-left-label") && this._leftLabel) {
      setViewBox("#icon-left-label");
    }
    if (shouldHandle("icon-right-label") && this._rightLabel) {
      setViewBox("#icon-right-label");
    }
  }

  private _handleIconAction(side: "left" | "right", ev: CustomEvent) {
    ev.stopPropagation();
    const configSource = side === "left" ? this.leftConfig : this.rightConfig;
    const config = {
      entity: configSource?.actionEntity,
      tap_action: configSource?.tapAction,
      hold_action: configSource?.holdAction,
      double_tap_action: configSource?.doubleTapAction,
    };
    handleAction(this, this.hass, config, ev.detail.action);
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      svg {
        position: absolute;
        pointer-events: none;
      }

      .icon {
        position: absolute;
        bottom: 0%;
        text-align: center;
        line-height: 0;
        height: 100%;
        pointer-events: auto;
      }

      .icons-container {
        position: absolute;
        height: 17%;
        width: 100%;
        top: 0%;
        pointer-events: none;
      }

      .icon-inner-container {
        display: flex;
        height: 100%;
        width: 10%;
        justify-content: center;
        --mdc-icon-size: 100%;
        pointer-events: none;
      }

      .icon-left {
        margin-left: 0%;
        margin-right: auto;
        width: 10%;
        pointer-events: auto;
      }

      .icon-right {
        margin-left: auto;
        margin-right: 0%;
        width: 10%;
        pointer-events: auto;
      }

      .icon-label-text {
        position: absolute;
        max-height: 65%;
        width: 100%;
        top: 100%;
        min-height: 10px;
        pointer-events: none;
      }

      .value-text {
        font-size: 50px;
        text-anchor: middle;
        direction: ltr;
        pointer-events: auto;
      }
    `;
  }
}
