// External dependencies
import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  nothing,
  PropertyValues,
  TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import {
  ClimateEntity,
  HomeAssistant,
  HvacMode,
  isAvailable,
  UNAVAILABLE,
} from "../../dependencies/ha";

import { localize } from "../../utils/localize";
import { FeatureStyle } from "../config";
import {
  FEATURE_PAGE_ICON,
  getHvacModeIcon,
  getHvacModeDropdownIcon,
  getHvacModeColor,
} from "../utils";
import "./icon-button";
import { dropdownCSS } from "../css/dropdown";

@customElement("gcp-climate-hvac-modes-control")
export class GCPClimateHvacModesControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: ClimateEntity;

  @property({ attribute: false }) public modes!: HvacMode[];

  @property({ attribute: false }) public featureStyle:
    | FeatureStyle
    | undefined = "icons";

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
    const hvacMode =
      (ev.detail as any).value ?? ((ev.target as any).value as HvacMode);
    const oldHvacMode = this.entity!.state as HvacMode;

    if (!hvacMode || !oldHvacMode || hvacMode === oldHvacMode) return;

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
    const shouldRenderAsDropdown =
      this.featureStyle === "dropdown" || this.modes.length > 4;

    return html`
      <div
        class=${classMap({
          content: true,
          icons: !shouldRenderAsDropdown,
        })}
      >
        ${shouldRenderAsDropdown
          ? html` <ha-control-select-menu
              .value=${this.entity.state}
              .disabled=${this.entity.state === UNAVAILABLE}
              show-arrow
              hide-label
              fixedMenuPosition
              naturalMenuWidth
              @selected=${this._valueChanged}
              @closed=${(ev) => ev.stopPropagation()}
            >
              ${!this._currentHvacMode
                ? html` <ha-svg-icon
                    slot="icon"
                    .path=${FEATURE_PAGE_ICON["climate-hvac-modes"]}
                  ></ha-svg-icon>`
                : nothing}
              ${this.modes.map((mode) => {
                const translationKey = `features.hvac_modes.${mode.toLowerCase()}`;
                let label = localize(this.hass, translationKey);
                if (label === translationKey) label = mode;

                return html`
                  <ha-list-item .value=${mode} graphic="icon">
                    <ha-svg-icon
                      slot="graphic"
                      .path=${getHvacModeDropdownIcon(mode)}
                    >
                    </ha-svg-icon>
                    ${label}
                  </ha-list-item>
                `;
              })}
            </ha-control-select-menu>`
          : html`${this.modes.map((mode) => this.renderModeButton(mode))}`}
      </div>
    `;
  }

  private renderModeButton(mode: HvacMode) {
    const iconStyle = {};
    const color = mode === "off" ? "var(--grey-color)" : getHvacModeColor(mode);
    const isPending =
      this._currentHvacMode === mode &&
      this._currentHvacMode !== this.entity.state;

    const translationKey = `features.hvac_modes.${mode.toLowerCase()}`;
    let title = localize(this.hass, translationKey);
    if (title === translationKey) title = mode;

    if (mode === this.entity.state || isPending) {
      iconStyle["--icon-color"] = color;
      iconStyle["--bg-color"] = `color-mix(in srgb, ${color} 20%, transparent)`;
    }
    return html`
      <gcp-icon-button
        style=${styleMap(iconStyle)}
        appearance="circular"
        .value=${mode}
        .disabled=${!isAvailable(this.entity)}
        .pending=${isPending}
        .title=${title}
        @click=${this._valueChanged}
      >
        <ha-icon .icon=${getHvacModeIcon(mode)}></ha-icon>
      </gcp-icon-button>
    `;
  }

  static get styles(): CSSResultGroup {
    return [
      css`
        .content {
          display: flex;
          width: 100%;
          justify-content: center;
        }
        .icons {
          gap: clamp(4px, 12px, 16px);
        }
      `,
      dropdownCSS,
    ];
  }
}
