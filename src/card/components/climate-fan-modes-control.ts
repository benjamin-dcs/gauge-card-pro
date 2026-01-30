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
  isAvailable,
} from "../../dependencies/ha";

import { localize } from "../../utils/localize";
import { getFanModeIcon } from "../utils";
import "./icon-button";

@customElement("gcp-climate-fan-modes-control")
export class GCPClimateFanModesControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: ClimateEntity;

  @property({ attribute: false }) public modes!: string[];

  @state() _currentFanMode?: string;

  protected willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("hass") && this.entity) {
      const oldHass = _changedProperties.get("hass") as
        | HomeAssistant
        | undefined;
      const oldStateObj = oldHass?.states[this.entity!.entity_id!];
      if (oldStateObj !== this.entity) {
        this._currentFanMode = this.entity.attributes.fan_mode;
      }
    }
  }

  private async _valueChanged(ev: CustomEvent) {
    const fanMode = (ev.target! as any).mode;
    const oldFanMode = this.entity!.attributes.fan_mode;

    if (fanMode === oldFanMode) return;

    this._currentFanMode = fanMode;

    try {
      await this._setFanMode(fanMode);
    } catch (_err) {
      this._currentFanMode = oldFanMode;
    }
  }

  private async _setFanMode(fanMode: string) {
    await this.hass.callService("climate", "set_fan_mode", {
      entity_id: this.entity.entity_id,
      fan_mode: fanMode,
    });
  }

  protected render(): TemplateResult {
    return html`
      <div class="button-group">
        ${this.modes.map((mode) => this.renderModeButton(mode))}
      </div>
    `;
  }

  private renderModeButton(mode: string) {
    const iconStyle = {};
    const color = mode === "off" ? "var(--grey-color)" : "var(--amber-color)";
    const isPending =
      this._currentFanMode === mode &&
      this._currentFanMode !== this.entity.attributes.fan_mode;

    const translationKey = `features.fan_modes.${mode.toLowerCase()}`;
    let title = localize(this.hass, translationKey);
    if (title === translationKey) title = mode;

    if (mode === this.entity.attributes.fan_mode || isPending) {
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
        .title=${title}
        @click=${this._valueChanged}
      >
        <ha-icon .icon=${getFanModeIcon(mode)}></ha-icon>
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
