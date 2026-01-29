// External dependencies
import { mdiArrowOscillating } from "@mdi/js";
import { css, CSSResultGroup, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

// Core HA helpers
import { ClimateEntity, HomeAssistant, UNAVAILABLE } from "../../dependencies/ha";

import { localize } from "../../utils/localize";

import { getSwingModeDropdownIcon } from "../utils";


@customElement("gcp-climate-hvac-swing-control")
export class GCPClimateHvacSwingControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: ClimateEntity;

  @property({ attribute: false }) public modes!: string[];

  @state() _currentSwingMode?: string;

  protected willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("hass") && this.entity) {
      const oldHass = _changedProperties.get("hass") as HomeAssistant | undefined;
      const oldStateObj = oldHass?.states[this.entity!.entity_id!];
      if (oldStateObj !== this.entity) {
        this._currentSwingMode = this.entity.attributes.swing_mode;
      }
    }
  }

  private async _valueChanged(ev: CustomEvent) {
    const swingMode =
      (ev.detail as any).value ?? ((ev.target as any).value as string);
    
      const oldSwingMode = this.entity!.attributes.swing_mode;

    if (swingMode === oldSwingMode) return;

    this._currentSwingMode = swingMode;

    try {
      await this._setMode(swingMode);
    } catch (_err) {
      this._currentSwingMode = oldSwingMode;
    }
  }

  private async _setMode(mode: string) {
    await this.hass!.callService("climate", "set_swing_mode", {
      entity_id: this.entity!.entity_id,
      swing_mode: mode,
    });
  }

  protected render(): TemplateResult {
    return html`
      <div class="swing-modes-menu">
        <ha-control-select-menu
          .value=${this.entity.attributes.swing_mode}
          .disabled=${this.entity.state === UNAVAILABLE}
          show-arrow
          hide-label
          fixedMenuPosition
          naturalMenuWidth
          @selected=${this._valueChanged}
          @closed=${(ev) => ev.stopPropagation()}
        >
          ${false
            ? html`<ha-attribute-icon
                slot="icon"
                .hass=${this.hass}
                .stateObj=${this.entity}
                attribute="swing_mode"
                .attributeValue=${"H"}
              ></ha-attribute-icon>`
            : html` <ha-svg-icon
                slot="icon"
                .path=${mdiArrowOscillating}
              ></ha-svg-icon>`}
          ${this.modes.map(
            (mode) => {
              const translationKey = `card.swing_modes.${mode.toLowerCase()}`
              let label = localize(this.hass, translationKey)
              if (label === translationKey) label = mode
              
              return html`
                <ha-list-item .value=${mode} graphic="icon">
                  <ha-svg-icon
                    slot="graphic"
                    .path=${getSwingModeDropdownIcon(mode)}
                  >
                  </ha-svg-icon>
                  ${label}
                </ha-list-item>
            `
          })}
        </ha-control-select-menu>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --feature-height: 30px;
      }
      .swing-modes-menu {
        display: flex;
        width: 100%;
        justify-content: center;
      }
      ha-control-select-menu {
        --control-select-menu-background-color: rgba(
          var(--rgb-primary-text-color),
          0.05
        );
        --control-select-menu-background-opacity: 1;
        --control-select-menu-height: var(--feature-height);
        --control-select-menu-border-radius: var(
            --ha-card-features-border-radius,
            var(--ha-border-radius-lg)
          );
        --control-select-menu-focus-color: var(--feature-color);
        --ha-ripple-color: rgba(var(--rgb-primary-text-color), 0.05);
        box-sizing: border-box;
        border: 1px solid var(--divider-color);
        border-radius: var(
          --ha-card-features-border-radius,
          var(--ha-border-radius-lg)
        );
        line-height: var(--ha-line-height-condensed);
        display: block;
        width: 75%;
      }
    `;
  }
}
