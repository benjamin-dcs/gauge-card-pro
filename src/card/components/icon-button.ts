// External dependencies
import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { property, customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("gcp-icon-button")
export class GCPIconButton extends LitElement {
  @property({ type: String }) public appearance: "circular" | "plain" =
    "circular";

  @property({ type: Boolean }) public disabled: boolean = false;

  @property({ type: Boolean }) public pending: boolean = false;

  protected render(): TemplateResult {
    return html`
      <button
        type="button"
        class=${classMap({
          button: true,
          circular: this.appearance === "circular",
          plain: this.appearance === "plain",
          pending: this.pending,
        })}
        .disabled=${this.disabled}
      >
        <slot> </slot>
      </button>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`


      :host {
        --icon-color: var(--primary-text-color);
        --icon-color-disabled: var(--disabled-color);
        --bg-color: rgba(var(--rgb-primary-text-color), 0.05);
        --bg-color-disabled: rgba(var(--disabled-color), 0.2);
        height: var(--control-height);
        width: calc(var(--control-height) * var(--control-button-ratio));
        flex: none;
      }
      .button {
        border: 0;
        padding: 0.25em;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        transition: background-color 280ms ease-in-out;
        font-size: var(--control-height);
        margin: 0;
        box-sizing: border-box;
        line-height: 0;
      }
      .button ::slotted(*) {
        pointer-events: none;
      }
      .button:disabled {
        cursor: not-allowed;
      }
      .button:disabled ::slotted(*) {
        color: var(--disabled-color);
      }

      .circular {
        border: 1px solid var(--divider-color);
        border-radius: 100%;
        background-color: var(--bg-color);
      }
      .circular:disabled {
        background-color: color-mix(
          in srgb,
          var(--disabled-color) 20%,
          transparent
        );
      }
      .circular ::slotted(*) {
        --mdc-icon-size: var(--control-icon-size);
        color: var(--icon-color);
      }
      .circular:disabled ::slotted(*) {
        color: var(--disabled-color);
      }

      .plain {
        background-color: transparent;
      }

      .pending {
        animation: flash 1s linear infinite;
      }

      @keyframes flash {
        50% {
          opacity: 0;
        }
      }
      
    `;
  }
}
