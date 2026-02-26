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
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import {
  ClimateEntity,
  HomeAssistant,
  HvacMode,
  isAvailable,
  UNIT_C,
  UNIT_F,
} from "../../dependencies/ha";

import { localize } from "../../utils/localize";
import {
  getFanModeIcon,
  getHvacModeColor,
  getHvacModeIcon,
  getSwingModeIcon,
} from "../utils";
import "./icon-button";

import { Feature } from "../types";

@customElement("gcp-climate-overview")
export class GCPClimateOverview extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: ClimateEntity;

  @property({ attribute: false }) public hasAdjustTemperatureFeature?: boolean;

  @property({ attribute: false }) public hasClimateHvacModesFeature?: boolean;

  @property({ attribute: false }) public hasClimateFanModesFeature?: boolean;

  @property({ attribute: false }) public hasClimateSwingModesFeature?: boolean;

  @state() _currentTemperature?: number;

  @state() _currentHvacMode?: HvacMode;

  @state() _currentFanMode?: string;

  @state() _currentSwingMode?: string;

  @property({ attribute: false })
  public setPage!: (ev: CustomEvent, page: Feature) => any;

  protected willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("hass") && this.entity) {
      const oldHass = _changedProperties.get("hass") as
        | HomeAssistant
        | undefined;
      const oldStateObj = oldHass?.states[this.entity!.entity_id!];
      if (oldStateObj !== this.entity) {
        this._currentTemperature = this.entity.attributes.temperature;
        this._currentHvacMode = this.entity.state as HvacMode;
        this._currentFanMode = this.entity.attributes.fan_mode;
        this._currentSwingMode = this.entity.attributes.swing_mode;
      }
    }
  }

  protected render(): TemplateResult {
    let tempTitle;
    let hvacModeTitle;
    let hvacModeIconStyle = {};
    let fanModeTitle;
    let swingModeTitle;

    if (this.hasAdjustTemperatureFeature && this._currentTemperature) {
      const unit = this.hass!.config.unit_system.temperature;
      tempTitle = `${this._currentTemperature} ${unit}`;
    }

    if (this.hasClimateHvacModesFeature && this._currentHvacMode) {
      const translationKey = `features.hvac_modes.${this._currentHvacMode.toLowerCase()}`;
      hvacModeTitle = localize(this.hass, translationKey);
      if (hvacModeTitle === translationKey)
        hvacModeTitle = this._currentHvacMode;

      if (this._currentHvacMode !== "off") {
        const color = getHvacModeColor(this._currentHvacMode);
        hvacModeIconStyle["--icon-color"] = color;
        hvacModeIconStyle["--bg-color"] =
          `color-mix(in srgb, ${color} 20%, transparent)`;
      }
    }

    if (this.hasClimateFanModesFeature && this._currentFanMode) {
      const translationKey = `features.fan_modes.${this._currentFanMode.toLowerCase()}`;
      fanModeTitle = localize(this.hass, translationKey);
      if (fanModeTitle === translationKey) fanModeTitle = this._currentFanMode;
    }

    if (this.hasClimateSwingModesFeature && this._currentSwingMode) {
      const translationKey = `features.swing_modes.${this._currentSwingMode.toLowerCase()}`;
      swingModeTitle = localize(this.hass, translationKey);
      if (swingModeTitle === translationKey)
        swingModeTitle = this._currentSwingMode;
    }

    return html`
      <div class="button-group">
        ${this.hasAdjustTemperatureFeature
          ? html`<gcp-icon-button
              appearance="circular"
              .disabled=${!isAvailable(this.entity)}
              .title=${tempTitle}
              @click=${(ev: CustomEvent) =>
                this.setPage(ev, "adjust-temperature")}
            >
              <ha-icon icon="mdi:thermometer"></ha-icon>
            </gcp-icon-button>`
          : nothing}
        ${this.hasClimateHvacModesFeature && this._currentHvacMode
          ? html` <gcp-icon-button
              style=${styleMap(hvacModeIconStyle)}
              appearance="circular"
              .disabled=${!isAvailable(this.entity)}
              .title=${hvacModeTitle}
              @click=${(ev: CustomEvent) =>
                this.setPage(ev, "climate-hvac-modes")}
            >
              <ha-icon
                .icon=${getHvacModeIcon(this._currentHvacMode)}
              ></ha-icon>
            </gcp-icon-button>`
          : nothing}
        ${this.hasClimateFanModesFeature && this._currentFanMode
          ? html` <gcp-icon-button
              appearance="circular"
              .disabled=${!isAvailable(this.entity)}
              .title=${fanModeTitle}
              @click=${(ev: CustomEvent) =>
                this.setPage(ev, "climate-fan-modes")}
            >
              <ha-icon .icon=${getFanModeIcon(this._currentFanMode)}></ha-icon>
            </gcp-icon-button>`
          : nothing}
        ${this.hasClimateSwingModesFeature && this._currentSwingMode
          ? html` <gcp-icon-button
              appearance="circular"
              .disabled=${!isAvailable(this.entity)}
              .title=${swingModeTitle}
              @click=${(ev: CustomEvent) =>
                this.setPage(ev, "climate-swing-modes")}
            >
              <ha-icon
                .icon=${getSwingModeIcon(this._currentSwingMode)}
              ></ha-icon>
            </gcp-icon-button>`
          : nothing}
      </div>
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
