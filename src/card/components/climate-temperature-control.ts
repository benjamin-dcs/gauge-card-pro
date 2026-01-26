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
import { mdiMinus, mdiPlus } from "@mdi/js";

// Core HA helpers
import {
  ClimateEntity,
  conditionalClamp,
  HomeAssistant,
  isAvailable,
  UNIT_F,
  round,
} from "../../dependencies/ha";

import "./icon-button";

@customElement("gcp-climate-temperature-control")
export class ClimateTemperatureControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: ClimateEntity;

  @state() private target?: number;
  @state() private targetMin?: number;
  @state() private targetMax?: number;

  private min?: number;
  private max?: number;

  protected willUpdate(_changedProperties: PropertyValues): void {
    if (this.entity !== undefined) {
      if (
        this.entity.attributes.temperature !== null &&
        this.target === undefined
      ) {
        this.target = this.entity.attributes.temperature;
        this.min = this.entity.attributes.min_temp;
        this.max = this.entity.attributes.max_temp;
      }

      if (
        this.entity.attributes.target_temp_low != null &&
        this.entity.attributes.target_temp_high != null &&
        this.targetMin === undefined &&
        this.targetMax === undefined
      ) {
        this.targetMin = this.entity.attributes.min_temp;
        this.targetMax = this.entity.attributes.max_temp;
        this.min = this.entity.attributes.min_temp;
        this.max = this.entity.attributes.max_temp;
      }
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

  private _changeTarget(
    e: MouseEvent,
    type: "single" | "low" | "high",
    dir: "+" | "-"
  ) {
    e.stopPropagation();

    let current: number | null | undefined;
    switch (type) {
      case "single":
        current = this.target;
        break;
      case "low":
        current = this.targetMin;
        break;
      case "high":
        current = this.targetMax;
        break;
    }
    if (current == null) return;
    const dirFactor = dir === "+" ? 1 : -1;
    const raw = round(current + dirFactor * this._stepSize, this._precision);
    const newTarget = conditionalClamp(raw, this.min, this.max);

    switch (type) {
      case "single":
        if (this.target !== newTarget) this.target = newTarget;
        this.hass!.callService("climate", "set_temperature", {
          entity_id: this.entity.entity_id,
          temperature: newTarget,
        });
        break;

      case "low":
        if (this.targetMin !== newTarget) this.targetMin = newTarget;
        this.hass!.callService("climate", "set_temperature", {
          entity_id: this.entity.entity_id,
          target_temp_low: newTarget,
          target_temp_high: this.entity.attributes.target_temp_high,
        });
        break;

      case "high":
        if (this.targetMax !== newTarget) this.targetMax = newTarget;
        this.hass!.callService("climate", "set_temperature", {
          entity_id: this.entity.entity_id,
          target_temp_low: this.entity.attributes.target_temp_low,
          target_temp_high: newTarget,
        });
        break;
    }
  }

  private _decrementValue = (e: MouseEvent) =>
    this._changeTarget(e, "single", "-");
  private _incrementValue = (e: MouseEvent) =>
    this._changeTarget(e, "single", "+");
  private _decrementLowValue = (e: MouseEvent) =>
    this._changeTarget(e, "low", "-");
  private _incrementLowValue = (e: MouseEvent) =>
    this._changeTarget(e, "low", "+");
  private _decrementHighValue = (e: MouseEvent) =>
    this._changeTarget(e, "high", "-");
  private _incrementHighValue = (e: MouseEvent) =>
    this._changeTarget(e, "high", "+");

  protected render(): TemplateResult {
    const isavailable = isAvailable(this.entity);

    return html`
      <div class="button-group">
        ${this.entity.attributes.temperature != null
          ? html`
              <gcp-icon-button
                appearance="circular"
                .disabled=${!isavailable}
                @click=${this._decrementValue}
              >
                <ha-svg-icon .path=${mdiMinus}></ha-svg-icon>
              </gcp-icon-button>
              <div
                class="temp-target single-temp-target"
                class=${classMap({
                  "temp-target": true,
                  pending:
                    this.entity.attributes.temperature !== this.target &&
                    isavailable,
                })}
              >
                ${this.target}
              </div>
              <gcp-icon-button
                appearance="circular"
                .disabled=${!isavailable}
                @click=${this._incrementValue}
              >
                <ha-svg-icon .path=${mdiPlus}></ha-svg-icon>
              </gcp-icon-button>
            `
          : nothing}
        ${this.entity.attributes.target_temp_low != null &&
        this.entity.attributes.target_temp_high != null
          ? html`
              <div class="dubble-temp-group">
                <gcp-icon-button
                  appearance="circular"
                  .disabled=${!isavailable}
                  @click=${this._decrementLowValue}
                >
                  <ha-svg-icon .path=${mdiMinus}></ha-svg-icon>
                </gcp-icon-button>
                <div
                  class="temp-target dubble-temp-target"
                  class=${classMap({
                    "temp-target": true,
                    pending: this.entity.attributes.temperature !== this.target,
                  })}
                >
                  ${this.target}
                </div>
                <gcp-icon-button
                  appearance="circular"
                  .disabled=${!isavailable}
                  @click=${this._incrementLowValue}
                >
                  <ha-svg-icon .path=${mdiPlus}></ha-svg-icon>
                </gcp-icon-button>
              </div>
              <div class="dubble-temp-group">
                <gcp-icon-button
                  appearance="circular"
                  @click=${this._decrementHighValue}
                >
                  <ha-svg-icon .path=${mdiMinus}></ha-svg-icon>
                </gcp-icon-button>
                <div
                  class="temp-target dubble-temp-target"
                  class=${classMap({
                    "temp-target": true,
                    pending: this.entity.attributes.temperature !== this.target,
                  })}
                >
                  ${this.target}
                </div>
                <gcp-icon-button
                  appearance="circular"
                  @click=${this._incrementHighValue}
                >
                  <ha-svg-icon .path=${mdiPlus}></ha-svg-icon>
                </gcp-icon-button>
              </div>
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
        gap: 24px;
      }

      .dubble-temp-group {
        display: flex;
        width: 100%;
        justify-content: space-between;
        gap: 8px;
      }

      .temp-target {
        text-align: center;
        align-content: center;
        color: var(--disabled-color);
      }

      .single-temp-target {
        width: 36px;
      }

      .dubble-temp-target {
        width: 32px;
      }

      .pending {
        color: var(--primary-text-color);
      }
    `;
  }
}
