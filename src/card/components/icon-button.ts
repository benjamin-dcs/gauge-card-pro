// External dependencies
import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { property, customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("gcp-icon-button")
export class GCPIconButton extends LitElement {
  @property({ type: String }) public appearance:
    | "circular"
    | "plain"
    | "square" = "circular";

  @property({ type: Boolean }) public actionable: boolean = true;

  @property({ type: Boolean }) public disabled: boolean = false;

  @property({ type: Boolean }) public pending: boolean = false;

  protected render(): TemplateResult {
    return html`
      <button
        type="button"
        class=${classMap({
          button: true,
          actionable: this.actionable,
          circular: this.appearance === "circular",
          plain: this.appearance === "plain",
          square: this.appearance === "square",
          "bg-border": ["circular", "square"].includes(this.appearance),
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
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
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

      .actionable {
        cursor: pointer;
        transition: background-color 280ms ease-in-out;
      }

      .bg-border {
        border: 1px solid var(--divider-color);
        background-color: var(--bg-color);
      }
      .bg-border:disabled {
        background-color: color-mix(
          in srgb,
          var(--disabled-color) 20%,
          transparent
        );
      }
      .bg-border ::slotted(*) {
        --mdc-icon-size: var(--control-icon-size);
        color: var(--icon-color);
      }
      .bg-border:disabled ::slotted(*) {
        color: var(--disabled-color);
      }

      .circular {
        border-radius: 100%;
      }

      .plain {
        background-color: transparent;
      }

      .square {
        border-radius: 25%;
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
