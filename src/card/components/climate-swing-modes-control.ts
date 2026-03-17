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
import {
  FEATURE_PAGE_ICON,
  FEATURE_PAGE_ICON_COLOR,
  getSwingModeDropdownIcon,
  getSwingModeIcon,
} from "../utils";
import "./icon-button";
import { dropdownCSS, oldDropdownCSS } from "../css/dropdown";
import { atLeastHaVersion } from "../../utils/ha/atLeastHaVersion";

@customElement("gcp-climate-swing-modes-control")
export class GCPClimateSwingModesControl extends LitElement {
  @property({ attribute: false }) public lang!: string;

  @property({ attribute: false })
  public callService!: HomeAssistant["callService"];

  @property({ attribute: false }) public entity!: ClimateEntity;

  @property({ attribute: false }) public version!: string;

  @property({ attribute: false }) public modes!: string[];

  @property({ attribute: false }) public featureStyle:
    | FeatureStyle
    | undefined = "icons";

  @state() _currentSwingMode?: string;

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
      const oldStateObj = oldHass?.states[this.entity!.entity_id!];
      if (oldStateObj !== this.entity) {
        this._currentSwingMode = this.entity.attributes.swing_mode;
      }
    }
  }

  private async _valueChanged(ev: CustomEvent) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const swingMode =
      ev.detail.item?.value ??
      ev.detail.value ??
      ((ev.target as any).value as string);
    const oldSwingMode = this.entity!.attributes.swing_mode;

    if (!swingMode || !oldSwingMode || swingMode === oldSwingMode) return;

    this._currentSwingMode = swingMode;

    try {
      await this._setMode(swingMode);
    } catch {
      this._currentSwingMode = oldSwingMode;
    }
  }

  private async _setMode(mode: string) {
    await this.callService("climate", "set_swing_mode", {
      entity_id: this.entity!.entity_id,
      swing_mode: mode,
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
                .value=${this.entity.attributes.swing_mode}
                .disabled=${this.entity.state === UNAVAILABLE}
                .options=${this.modes.map((mode) => {
                  const translationKey = `features.swing_modes.${mode.toLowerCase()}`;
                  let label = localize(this.lang, translationKey);
                  if (label === translationKey) label = mode;
                  const icon = getSwingModeIcon(mode);
                  return { label: label, value: mode, icon: icon };
                })}
                @wa-select=${this._valueChanged}
              >
              </ha-control-select-menu>`
            : html` <ha-control-select-menu
                .value=${this.entity.attributes.swing_mode}
                .disabled=${this.entity.state === UNAVAILABLE}
                show-arrow
                hide-label
                fixedMenuPosition
                naturalMenuWidth
                @selected=${this._valueChanged}
                @closed=${(ev) => ev.stopPropagation()}
              >
                ${this._currentSwingMode
                  ? html` <ha-svg-icon
                      slot="icon"
                      .path=${FEATURE_PAGE_ICON["climate-swing-modes"]}
                    ></ha-svg-icon>`
                  : nothing}
                ${this.modes.map((mode) => {
                  const translationKey = `features.swing_modes.${mode.toLowerCase()}`;
                  let label = localize(this.lang, translationKey);
                  if (label === translationKey) label = mode;

                  return html`
                    <ha-list-item .value=${mode} graphic="icon">
                      <ha-svg-icon
                        slot="graphic"
                        .path=${getSwingModeDropdownIcon(mode)}
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
        : FEATURE_PAGE_ICON_COLOR["climate-swing-modes"];
    const isPending =
      this._currentSwingMode === mode &&
      this._currentSwingMode !== this.entity.attributes.swing_mode;

    const translationKey = `features.swing_modes.${mode.toLowerCase()}`;
    let title = localize(this.lang, translationKey);
    if (title === translationKey) title = mode;

    if (mode === this.entity.attributes.swing_mode || isPending) {
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
        <ha-icon .icon=${getSwingModeIcon(mode)}></ha-icon>
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
