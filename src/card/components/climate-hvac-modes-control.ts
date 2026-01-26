// External dependencies
import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
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

  private wantedMode?: HvacMode;

  private _setHvacMode(e: CustomEvent) {
    e.stopPropagation();
    const mode = (e.target! as any).mode as HvacMode;
    this.wantedMode = mode;
    this.hass.callService("climate", "set_hvac_mode", {
      entity_id: this.entity.entity_id,
      hvac_mode: mode,
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
    const isPending = this.wantedMode === mode && this.wantedMode !== this.entity.state
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
        .title=${localize(this.hass, `hvac_mode_titles.${mode}`)}
        @click=${this._setHvacMode}
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
        gap: clamp(4px, 16px, 16px);
      }
    `;
  }
}
