// External dependencies (Lit)
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import type { HassEntity } from "home-assistant-js-websocket";
import type { HomeAssistant } from "../../dependencies/ha";
import { isAvailable } from "../../dependencies/ha";

// Types and constants
import type { CustomControlConfig } from "../config";
import { FEATURE, FEATURE_PAGE_ICON_COLOR } from "../../constants/features";

// Local components and styles
import "./icons/icon-button";

@customElement("gcp-custom-control")
export class GCPCustomControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public controls: CustomControlConfig[] = [];

  // Entity used by controls without their own entity
  @property({ attribute: false }) public defaultEntity?: string;

  @state() private _pending: Set<number> = new Set();

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (!changedProperties.has("hass") || this._pending.size === 0) return;

    // Clear the pending state of every control whose entity received a new state
    const oldHass = changedProperties.get("hass") as HomeAssistant | undefined;
    if (!oldHass) return;

    const stillPending = new Set(
      [...this._pending].filter((index) => {
        const entityId = this._entityId(this.controls[index]);
        if (!entityId) return false;
        return oldHass.states[entityId] === this.hass.states[entityId];
      })
    );

    if (stillPending.size !== this._pending.size) this._pending = stillPending;
  }

  private _entityId(control: CustomControlConfig | undefined) {
    return control?.entity ?? this.defaultEntity;
  }

  // Only "<domain>.<service>" can be called
  private _serviceParts(control: CustomControlConfig) {
    const parts = control.service?.split(".") ?? [];
    if (parts.length !== 2 || !parts[0] || !parts[1]) return undefined;
    return { domain: parts[0], service: parts[1] };
  }

  private async _callService(ev: CustomEvent, index: number) {
    ev.stopPropagation();

    const control = this.controls[index];
    const parts = this._serviceParts(control);
    if (!parts) return;

    const entityId = this._entityId(control);
    const data = { ...(control.data ?? {}) };
    if (entityId && control.target === undefined && !data.entity_id) {
      data.entity_id = entityId;
    }

    if (control.active_state !== undefined) {
      this._pending = new Set(this._pending).add(index);
    }

    try {
      await this.hass.callService(
        parts.domain,
        parts.service,
        data,
        control.target
      );
    } catch {
      this._removePending(index);
    }
  }

  // Compares `active_state` against the attribute of the entity when configured,
  // otherwise against the state of the entity
  private _isActive(
    control: CustomControlConfig,
    stateObj: HassEntity | undefined
  ): boolean {
    if (control.active_state === undefined || stateObj === undefined)
      return false;

    const value =
      control.attribute !== undefined
        ? stateObj.attributes[control.attribute]
        : stateObj.state;

    if (value === undefined || value === null) return false;

    return String(value) === String(control.active_state);
  }

  private _removePending(index: number) {
    if (!this._pending.has(index)) return;
    const pending = new Set(this._pending);
    pending.delete(index);
    this._pending = pending;
  }

  protected render(): TemplateResult {
    return html`
      <div class="button-group">
        ${this.controls.map((control, index) =>
          this.renderControlButton(control, index)
        )}
      </div>
    `;
  }

  private renderControlButton(control: CustomControlConfig, index: number) {
    const entityId = this._entityId(control);
    const stateObj = entityId ? this.hass.states[entityId] : undefined;

    const isActionable = this._serviceParts(control) !== undefined;
    const isPending = this._pending.has(index);
    const isActive = this._isActive(control, stateObj);

    const iconStyle = {};
    if (isActive || isPending) {
      const color =
        control.icon_color ?? FEATURE_PAGE_ICON_COLOR[FEATURE.CUSTOM];
      iconStyle["--icon-color"] = color;
      iconStyle["--bg-color"] = `color-mix(in srgb, ${color} 20%, transparent)`;
    }

    return html`
      <gcp-icon-button
        style=${styleMap(iconStyle)}
        appearance="circular"
        .actionable=${isActionable}
        .disabled=${stateObj !== undefined && !isAvailable(stateObj)}
        .pending=${isPending}
        @click=${
          isActionable
            ? (ev: CustomEvent) => this._callService(ev, index)
            : undefined
        }
      >
        <ha-icon .icon=${control.icon}></ha-icon>
      </gcp-icon-button>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      .button-group {
        display: flex;
        width: 100%;
        justify-content: center;
        gap: clamp(4px, 12px, 16px);
      }
    `;
  }
}
