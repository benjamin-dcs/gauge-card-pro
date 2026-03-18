// External dependencies (Lit)
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { CSSResult, LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import type { ClimateEntity, HomeAssistant } from "../../dependencies/ha";
import { isAvailable, UNAVAILABLE } from "../../dependencies/ha";

// Utils
import { localize } from "../../utils/localize";
import { atLeastHaVersion } from "../../utils/ha/atLeastHaVersion";
import { getFanModeDropdownIcon, getFanModeIcon } from "../utils";

// Types and constants
import type { FeatureStyle } from "../types";
import {
  FEATURE,
  FEATURE_PAGE_ICON,
  FEATURE_PAGE_ICON_COLOR,
} from "../../constants/features";

// Local components and styles
import { dropdownCSS, oldDropdownCSS } from "../css/dropdown";
import "./icon-button";

@customElement("gcp-climate-fan-modes-control")
export class GCPClimateFanModesControl extends LitElement {
  @property({ attribute: false }) public lang!: string;

  @property({ attribute: false })
  public callService!: HomeAssistant["callService"];

  @property({ attribute: false }) public entity!: ClimateEntity;

  @property({ attribute: false }) public version!: string;

  @property({ attribute: false }) public modes!: string[];

  @property({ attribute: false }) public featureStyle:
    | FeatureStyle
    | undefined = "icons";

  @state() _currentFanMode?: string;

  public override connectedCallback(): void {
    super.connectedCallback();
    this._applyDropdownStyles();
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);
    if (changedProperties.has("hass") && this.entity) {
      const oldHass = changedProperties.get("hass") as
        | HomeAssistant
        | undefined;
      const oldStateObj = oldHass?.states[this.entity.entity_id];
      if (oldStateObj !== this.entity) {
        this._currentFanMode = this.entity.attributes.fan_mode;
      }
    }
  }

  private async _valueChanged(ev: CustomEvent) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const fanMode =
      ev.detail.item?.value ??
      ev.detail.value ??
      ((ev.target as any).value as string);
    const oldFanMode = this.entity.attributes.fan_mode;

    if (!fanMode || !oldFanMode || fanMode === oldFanMode) return;

    this._currentFanMode = fanMode;

    try {
      await this._setFanMode(fanMode);
    } catch {
      this._currentFanMode = oldFanMode;
    }
  }

  private async _setFanMode(fanMode: string) {
    await this.callService("climate", "set_fan_mode", {
      entity_id: this.entity.entity_id,
      fan_mode: fanMode,
    });
  }

  protected render(): TemplateResult {
    const shouldRenderAsDropdown =
      this.featureStyle === "dropdown" || this.modes.length > 5;

    return html`
      <div
        class=${classMap({
          content: true,
          icons: !shouldRenderAsDropdown,
        })}
      >
        ${shouldRenderAsDropdown
          ? atLeastHaVersion(this.version, 2026, 3)
            ? html` <ha-control-select-menu
                show-arrow
                hide-label
                fixedMenuPosition
                naturalMenuWidth
                .value=${this.entity.attributes.fan_mode}
                .disabled=${this.entity.state === UNAVAILABLE}
                .options=${this.modes.map((mode) => {
                  const translationKey = `features.fan_modes.${mode.toLowerCase()}`;
                  let label = localize(this.lang, translationKey);
                  if (label === translationKey) label = mode;
                  const icon = getFanModeIcon(mode);
                  return { label: label, value: mode, icon: icon };
                })}
                @wa-select=${this._valueChanged}
              >
              </ha-control-select-menu>`
            : html` <ha-control-select-menu
                .value=${this.entity.attributes.fan_mode}
                .disabled=${this.entity.state === UNAVAILABLE}
                show-arrow
                hide-label
                fixedMenuPosition
                naturalMenuWidth
                @selected=${this._valueChanged}
                @closed=${(ev) => ev.stopPropagation()}
              >
                ${this._currentFanMode
                  ? html` <ha-svg-icon
                      slot="icon"
                      .path=${FEATURE_PAGE_ICON[FEATURE.CLIMATE_FAN_MODES]}
                    ></ha-svg-icon>`
                  : nothing}
                ${this.modes.map((mode) => {
                  const translationKey = `features.fan_modes.${mode.toLowerCase()}`;
                  let label = localize(this.lang, translationKey);
                  if (label === translationKey) label = mode;

                  return html`
                    <ha-list-item .value=${mode} graphic="icon">
                      <ha-svg-icon
                        slot="graphic"
                        .path=${getFanModeDropdownIcon(mode)}
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

  private renderModeButton(mode: string) {
    const iconStyle = {};
    const color =
      mode === "off"
        ? "var(--grey-color)"
        : FEATURE_PAGE_ICON_COLOR[FEATURE_PAGE_ICON[FEATURE.CLIMATE_FAN_MODES]];
    const isPending =
      this._currentFanMode === mode &&
      this._currentFanMode !== this.entity.attributes.fan_mode;

    const translationKey = `features.fan_modes.${mode.toLowerCase()}`;
    let title = localize(this.lang, translationKey);
    if (title === translationKey) title = mode;

    if (mode === this.entity.attributes.fan_mode || isPending) {
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
        <ha-icon .icon=${getFanModeIcon(mode)}></ha-icon>
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
    ];
  }

  private _applyDropdownStyles(): void {
    const sheet = atLeastHaVersion(this.version, 2026, 3)
      ? dropdownCSS
      : oldDropdownCSS;

    // LitElement compiles CSSResultGroup into adoptedStyleSheets
    // We can append our conditional sheet to the existing ones
    if (this.shadowRoot) {
      const styleSheet = sheet instanceof CSSResult ? sheet.styleSheet! : sheet;
      this.shadowRoot.adoptedStyleSheets = [
        ...this.shadowRoot.adoptedStyleSheets,
        styleSheet,
      ];
    }
  }
}
