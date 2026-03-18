// External dependencies (Lit)
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { CSSResult, LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import type { ClimateEntity, HomeAssistant } from "../../dependencies/ha";
import { isAvailable, UNAVAILABLE } from "../../dependencies/ha";

import { localize } from "../../utils/localize";
import type { FeatureStyle } from "../types";
import { getPresetModeDropdownIcon, getPresetModeIcon } from "../utils";
import {
  FEATURE_PAGE_ICON,
  FEATURE_PAGE_ICON_COLOR,
} from "../../constants/features";
import "./icon-button";
import { dropdownCSS, oldDropdownCSS } from "../css/dropdown";
import { atLeastHaVersion } from "../../utils/ha/atLeastHaVersion";
import { FEATURE } from "../../constants/features";

@customElement("gcp-climate-preset-modes-control")
export class GCPClimatePresetModesControl extends LitElement {
  @property({ attribute: false }) public lang!: string;

  @property({ attribute: false })
  public callService!: HomeAssistant["callService"];

  @property({ attribute: false }) public entity!: ClimateEntity;

  @property({ attribute: false }) public version!: string;

  @property({ attribute: false }) public modes!: string[];

  @property({ attribute: false }) public featureStyle:
    | FeatureStyle
    | undefined = "icons";

  @state() _currentPresetMode?: string;

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
        this._currentPresetMode = this.entity.attributes.preset_mode;
      }
    }
  }

  private async _valueChanged(ev: CustomEvent) {
    console.log(ev);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const presetMode =
      ev.detail.item?.value ??
      ev.detail.value ??
      ((ev.target as any).value as string);
    console.log(presetMode);
    const oldPresetMode = this.entity.attributes.preset_mode;

    if (!presetMode || !oldPresetMode || presetMode === oldPresetMode) return;

    this._currentPresetMode = presetMode;

    try {
      await this._setPresetMode(presetMode);
    } catch {
      this._currentPresetMode = oldPresetMode;
    }
  }

  private async _setPresetMode(presetMode: string) {
    await this.callService("climate", "set_preset_mode", {
      entity_id: this.entity.entity_id,
      preset_mode: presetMode,
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
                .value=${this.entity.attributes.preset_mode}
                .disabled=${this.entity.state === UNAVAILABLE}
                .options=${this.modes.map((mode) => {
                  const translationKey = `features.preset_modes.${mode.toLowerCase()}`;
                  let label = localize(this.lang, translationKey);
                  if (label === translationKey) label = mode;
                  const icon = getPresetModeIcon(mode);
                  return { label: label, value: mode, icon: icon };
                })}
                @wa-select=${this._valueChanged}
              >
              </ha-control-select-menu>`
            : html` <ha-control-select-menu
                .value=${this.entity.attributes.preset_mode}
                .disabled=${this.entity.state === UNAVAILABLE}
                show-arrow
                hide-label
                fixedMenuPosition
                naturalMenuWidth
                @selected=${this._valueChanged}
                @closed=${(ev) => ev.stopPropagation()}
              >
                ${this._currentPresetMode
                  ? html` <ha-svg-icon
                      slot="icon"
                      .path=${FEATURE_PAGE_ICON[FEATURE.CLIMATE_PRESET_MODES]}
                    ></ha-svg-icon>`
                  : nothing}
                ${this.modes.map((mode) => {
                  const translationKey = `features.preset_modes.${mode.toLowerCase()}`;
                  let label = localize(this.lang, translationKey);
                  if (label === translationKey) label = mode;

                  return html`
                    <ha-list-item .value=${mode} graphic="icon">
                      <ha-svg-icon
                        slot="graphic"
                        .path=${getPresetModeDropdownIcon(mode)}
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
        : FEATURE_PAGE_ICON_COLOR[FEATURE.CLIMATE_PRESET_MODES];
    const isPending =
      this._currentPresetMode === mode &&
      this._currentPresetMode !== this.entity.attributes.preset_mode;

    const translationKey = `features.preset_modes.${mode.toLowerCase()}`;
    let title = localize(this.lang, translationKey);
    if (title === translationKey) title = mode;

    if (mode === this.entity.attributes.preset_mode || isPending) {
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
        <ha-icon .icon=${getPresetModeIcon(mode)}></ha-icon>
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
