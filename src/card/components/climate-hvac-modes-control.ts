// External dependencies
import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import {
  ClimateEntity,
  HomeAssistant,
  HvacMode,
  isAvailable,
} from "../../dependencies/ha";

import { localize } from "../../utils/localize";
import { getHvacModeColor, getHvacModeIcon } from "../utils";
import "./icon-button";

@customElement("gcp-climate-hvac-modes-control")
export class GCPClimateHvacModesControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: ClimateEntity;

  @property({ attribute: false }) public modes!: HvacMode[];

  @state() _currentHvacMode?: HvacMode;

  protected willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("hass") && this.entity) {
      const oldHass = _changedProperties.get("hass") as
        | HomeAssistant
        | undefined;
      const oldStateObj = oldHass?.states[this.entity!.entity_id!];
      if (oldStateObj !== this.entity) {
        this._currentHvacMode = this.entity.state as HvacMode;
      }
    }
  }

  private async _valueChanged(ev: CustomEvent) {
    const hvacMode = (ev.target! as any).mode as HvacMode;

    const oldHvacMode = this.entity!.state as HvacMode;

    if (hvacMode === oldHvacMode) return;

    this._currentHvacMode = hvacMode;

    try {
      await this._setHvacMode(hvacMode);
    } catch (_err) {
      this._currentHvacMode = oldHvacMode;
    }
  }

  private async _setHvacMode(hvacMode: HvacMode) {
    await this.hass.callService("climate", "set_hvac_mode", {
      entity_id: this.entity.entity_id,
      hvac_mode: hvacMode,
    });
  }

  protected render(): TemplateResult {
    return html`
      <div class="button-group">
        ${this.modes.map((mode) => this.renderModeButton(mode))}
      </div>
    `;
  }

  private renderModeButton(mode: HvacMode) {
    const iconStyle = {};
    const color = mode === "off" ? "var(--grey-color)" : getHvacModeColor(mode);
    const isPending =
      this._currentHvacMode === mode &&
      this._currentHvacMode !== this.entity.state;
    if (mode === this.entity.state || isPending) {
      iconStyle["--icon-color"] = color;
      iconStyle["--bg-color"] = `color-mix(in srgb, ${color} 20%, transparent)`;
    }
    return html`
      <gcp-icon-button
        style=${styleMap(iconStyle)}
        appearance="circular"
        .mode=${mode}
        .disabled=${!isAvailable(this.entity)}
        .pending=${isPending}
        .title=${localize(
          this.hass,
          `features.hvac_modes.${mode.toLowerCase()}`
        )}
        @click=${this._valueChanged}
      >
        <ha-icon .icon=${getHvacModeIcon(mode)}></ha-icon>
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
