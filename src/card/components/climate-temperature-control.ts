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
import { mdiMinus, mdiPlus } from "@mdi/js";

import {
  ClimateEntity,
  computeRTL,
  conditionalClamp,
  HomeAssistant,
  isAvailable,
  UNIT_F,
  round,
} from "../../dependencies/ha";

import { NumberUtils } from "../../utils/number/numberUtils";

import "./icon-button";

@customElement("gcp-climate-temperature-control")
export class ClimateTemperatureControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: ClimateEntity;

  @state() private target?: number;

  private min?: number;

  private max?: number;

  protected willUpdate(_changedProperties: PropertyValues): void {
    if (this.entity !== undefined && this.target === undefined) {
      const _temp = this.entity.attributes.temperature;
      console.log(_temp);
      if (NumberUtils.isNumeric(_temp)) this.target = _temp;

      this.min = this.entity.attributes.min_temp;
      this.max = this.entity.attributes.max_temp;
    }
  }

  private get _stepSize(): number {
    if (this.entity.attributes.target_temp_step) {
      return this.entity.attributes.target_temp_step;
    }
    return this.hass!.config.unit_system.temperature === UNIT_F ? 1 : 0.5;
  }

  private get _precision() {
    const _step = this._stepSize;
    return Math.ceil(Math.log10(1 / _step));
  }

  private _decrementValue(e: MouseEvent) {
    e.stopPropagation();
    if (this.target == null) return;
    const value = round(this.target - this._stepSize, this._precision);
    this._processNewValue(value);
  }

  private _incrementValue(e: MouseEvent) {
    e.stopPropagation();
    if (this.target == null) return;
    const value = round(this.target + this._stepSize, this._precision);
    this._processNewValue(value);
  }

  private _processNewValue(value) {
    const newTarget = conditionalClamp(value, this.min, this.max);
    if (this.target !== newTarget) {
      this.target = newTarget;
    }

    this.hass!.callService("climate", "set_temperature", {
      entity_id: this.entity.entity_id,
      temperature: value,
    });
  }

  onValueChange(e: CustomEvent<{ value: number }>): void {
    const value = e.detail.value;
    this.hass!.callService("climate", "set_temperature", {
      entity_id: this.entity.entity_id,
      temperature: value,
    });
  }

  onLowValueChange(e: CustomEvent<{ value: number }>): void {
    const value = e.detail.value;
    this.hass!.callService("climate", "set_temperature", {
      entity_id: this.entity.entity_id,
      target_temp_low: value,
      target_temp_high: this.entity.attributes.target_temp_high,
    });
  }

  onHighValueChange(e: CustomEvent<{ value: number }>): void {
    const value = e.detail.value;
    this.hass!.callService("climate", "set_temperature", {
      entity_id: this.entity.entity_id,
      target_temp_low: this.entity.attributes.target_temp_low,
      target_temp_high: value,
    });
  }

  protected render(): TemplateResult {
    const rtl = computeRTL(this.hass);

    const available = isAvailable(this.entity);

    const formatOptions: Intl.NumberFormatOptions =
      this._stepSize === 1
        ? {
            maximumFractionDigits: 0,
          }
        : {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          };

    const modeStyle = (mode: "heat" | "cool") => ({
      "--bg-color": `rgba(var(--rgb-state-climate-${mode}), 0.05)`,
      "--icon-color": `rgb(var(--rgb-state-climate-${mode}))`,
      "--text-color": `rgb(var(--rgb-state-climate-${mode}))`,
    });

    return html`
      <div class="button-group">
        ${this.entity.attributes.temperature != null
          ? html`
              <gcp-icon-button
                appearance="circular"
                @click=${this._decrementValue}
              >
                <ha-svg-icon .path=${mdiMinus}></ha-svg-icon>
              </gcp-icon-button>
              <div
                class="temp-target"
                class=${classMap({
                  "temp-target": true,
                  pending: this.entity.attributes.temperature !== this.target,
                })}
              >
                ${this.target}
              </div>
              <gcp-icon-button
                appearance="circular"
                @click=${this._incrementValue}
              >
                <ha-svg-icon .path=${mdiPlus}></ha-svg-icon>
              </gcp-icon-button>
            `
          : nothing}
        ${this.entity.attributes.target_temp_low != null &&
        this.entity.attributes.target_temp_high != null
          ? html`
              <mushroom-input-number
                style=${styleMap(modeStyle("heat"))}
                .locale=${this.hass.locale}
                .value=${this.entity.attributes.target_temp_low}
                .step=${this._stepSize}
                .min=${this.entity.attributes.min_temp}
                .max=${this.entity.attributes.max_temp}
                .disabled=${!available}
                .formatOptions=${formatOptions}
                @change=${this.onLowValueChange}
              ></mushroom-input-number
              ><mushroom-input-number
                style=${styleMap(modeStyle("cool"))}
                .locale=${this.hass.locale}
                .value=${this.entity.attributes.target_temp_high}
                .step=${this._stepSize}
                .min=${this.entity.attributes.min_temp}
                .max=${this.entity.attributes.max_temp}
                .disabled=${!available}
                .formatOptions=${formatOptions}
                @change=${this.onHighValueChange}
              ></mushroom-input-number>
            `
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
        gap: 16px;
      }

      .temp-target {
        width: 36px;
        text-align: center;
        align-content: center;
        color: var(--disabled-color);
      }

      .pending {
        color: var(--primary-text-color);
      }
    `;
  }
}
