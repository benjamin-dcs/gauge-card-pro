import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  ClimateEntity,
  compareClimateHvacModes,
  HomeAssistant,
  HvacMode,
  isAvailable,
} from "../../dependencies/ha";
import { getHvacModeColor, getHvacModeIcon } from "../utils/utils";
import { localize } from "../utils/localize";
import "./icon-button";

@customElement("gcp-climate-hvac-modes-control")
export class GCPClimateHvacModesControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: ClimateEntity;

  @property({ attribute: false }) public modes!: HvacMode[];

  private callService(e: CustomEvent) {
    e.stopPropagation();
    const mode = (e.target! as any).mode as HvacMode;
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
    if (mode === this.entity.state) {
      iconStyle["--icon-color"] = color;
      iconStyle["--bg-color"] = `color-mix(in srgb, ${color} 20%, transparent)`;
    }

    return html`
      <gcp-icon-button
        style=${styleMap(iconStyle)}
        appearance="circular"
        .mode=${mode}
        .disabled=${!isAvailable(this.entity)}
        .title=${localize(this.hass, `hvac_mode_titles.${mode}`)}
        @click=${this.callService}
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
        justify-self: center;
        justify-content: space-between;
      }
    `;
  }
}
