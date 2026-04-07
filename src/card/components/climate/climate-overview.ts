// External dependencies (Lit)
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import type {
  ClimateEntity,
  HomeAssistant,
  HvacMode,
} from "../../../dependencies/ha";
import { isAvailable } from "../../../dependencies/ha";

// Utils
import { localize } from "../../../utils/localize";
import {
  getFanModeIcon,
  getHvacModeColor,
  getHvacModeIcon,
  getPresetModeIcon,
  getSwingModeIcon,
} from "./utils";

// Types and constants
import type { Feature } from "../../types/types";
import { FEATURE } from "../../../constants/features";

// Local components and styles
import "../icons/icon-button";

@customElement("gcp-climate-overview")
export class GCPClimateOverview extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: ClimateEntity;

  @property({ attribute: false }) public hasAdjustTemperatureFeature?: boolean;
  @property({ attribute: false }) public hasClimateHvacModesFeature?: boolean;
  @property({ attribute: false }) public hasClimateFanModesFeature?: boolean;
  @property({ attribute: false }) public hasClimateSwingModesFeature?: boolean;
  @property({ attribute: false }) public hasClimatePresetModesFeature?: boolean;

  @property({ attribute: false })
  public setPage!: (ev: CustomEvent, page: Feature) => void;

  @state() _currentTemperature?: number;
  @state() _currentHvacMode?: HvacMode;
  @state() _currentFanMode?: string;
  @state() _currentSwingMode?: string;
  @state() _currentPresetMode?: string;

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);
    if (changedProperties.has("hass") && this.entity) {
      const oldHass = changedProperties.get("hass") as
        | HomeAssistant
        | undefined;
      const oldStateObj = oldHass?.states[this.entity.entity_id];
      if (oldStateObj !== this.entity) {
        this._currentTemperature = this.entity.attributes.temperature;
        this._currentHvacMode = this.entity.state as HvacMode;
        this._currentFanMode = this.entity.attributes.fan_mode;
        this._currentSwingMode = this.entity.attributes.swing_mode;
        this._currentPresetMode = this.entity.attributes.preset_mode;
      }
    }
  }

  protected render(): TemplateResult {
    let tempTitle;
    let hvacModeTitle;
    const hvacModeIconStyle = {};
    let fanModeTitle;
    let swingModeTitle;
    let presetModeTitle;

    const language = this.hass.locale.language;

    if (this.hasAdjustTemperatureFeature && this._currentTemperature) {
      const prefix = localize(language, "features.overview.temperature");
      const unit = this.hass.config.unit_system.temperature;
      tempTitle = `${prefix}: ${this._currentTemperature} ${unit}`;
    }

    if (this.hasClimateHvacModesFeature && this._currentHvacMode) {
      const prefix = localize(language, "features.overview.hvac_mode");
      const translationKey = `features.hvac_modes.${this._currentHvacMode.toLowerCase()}`;
      hvacModeTitle = localize(language, translationKey);
      if (hvacModeTitle === translationKey)
        hvacModeTitle = this._currentHvacMode;
      hvacModeTitle = `${prefix}: ${hvacModeTitle}`;

      if (this._currentHvacMode !== "off") {
        const color = getHvacModeColor(this._currentHvacMode);
        hvacModeIconStyle["--icon-color"] = color;
        hvacModeIconStyle["--bg-color"] =
          `color-mix(in srgb, ${color} 20%, transparent)`;
      }
    }

    if (this.hasClimateFanModesFeature && this._currentFanMode) {
      const prefix = localize(language, "features.overview.fan_mode");
      const translationKey = `features.fan_modes.${this._currentFanMode.toLowerCase()}`;
      fanModeTitle = localize(language, translationKey);
      if (fanModeTitle === translationKey) fanModeTitle = this._currentFanMode;
      fanModeTitle = `${prefix}: ${fanModeTitle}`;
    }

    if (this.hasClimateSwingModesFeature && this._currentSwingMode) {
      const prefix = localize(language, "features.overview.swing_mode");
      const translationKey = `features.swing_modes.${this._currentSwingMode.toLowerCase()}`;
      swingModeTitle = localize(language, translationKey);
      if (swingModeTitle === translationKey)
        swingModeTitle = this._currentSwingMode;
      swingModeTitle = `${prefix}: ${swingModeTitle}`;
    }

    if (this.hasClimatePresetModesFeature && this._currentPresetMode) {
      const prefix = localize(language, "features.overview.preset_mode");
      const translationKey = `features.preset_modes.${this._currentPresetMode.toLowerCase()}`;
      presetModeTitle = localize(language, translationKey);
      if (presetModeTitle === translationKey)
        presetModeTitle = this._currentPresetMode;
      presetModeTitle = `${prefix}: ${presetModeTitle}`;
    }

    return html`
      <div class="button-group">
        ${this.hasAdjustTemperatureFeature
          ? html`<gcp-icon-button
              appearance="circular"
              .disabled=${!isAvailable(this.entity)}
              .title=${tempTitle}
              @click=${(ev: CustomEvent) =>
                this.setPage(ev, FEATURE.ADJUST_TEMPERATURE)}
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
                this.setPage(ev, FEATURE.CLIMATE_HVAC_MODES)}
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
                this.setPage(ev, FEATURE.CLIMATE_FAN_MODES)}
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
                this.setPage(ev, FEATURE.CLIMATE_SWING_MODES)}
            >
              <ha-icon
                .icon=${getSwingModeIcon(this._currentSwingMode)}
              ></ha-icon>
            </gcp-icon-button>`
          : nothing}
        ${this.hasClimatePresetModesFeature && this._currentPresetMode
          ? html` <gcp-icon-button
              appearance="circular"
              .disabled=${!isAvailable(this.entity)}
              .title=${presetModeTitle}
              @click=${(ev: CustomEvent) =>
                this.setPage(ev, FEATURE.CLIMATE_PRESET_MODES)}
            >
              <ha-icon
                .icon=${getPresetModeIcon(this._currentPresetMode)}
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
