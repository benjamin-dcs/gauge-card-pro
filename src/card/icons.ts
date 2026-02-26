// External dependencies
import {
  CSSResultGroup,
  html,
  LitElement,
  nothing,
  PropertyValues,
  svg,
  TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import {
  actionHandler,
  afterNextRender,
  batteryLevelIcon,
  batteryStateColorProperty,
  blankBeforePercent,
  ClimateEntity,
  computeDomain,
  handleAction,
  hasAction,
  HomeAssistant,
  HvacMode,
} from "../dependencies/ha";

// Local utilities
import { Logger } from "../utils/logger";

import { NumberUtils } from "../utils/number/numberUtils";
import { localize } from "../utils/localize";
import {
  getFanModeIcon,
  getHvacModeColor,
  getHvacModeIcon,
  getSwingModeIcon,
} from "./utils";

import { DEFAULTS } from "../constants/defaults";
import { GaugeCardProCardConfig } from "./config";

import { TemplateKey } from "./card";

// Core functionality
import { gaugeIconCSS } from "./css/gauge-icon";

@customElement("gauge-card-pro-gauge-icons")
export class GaugeCardProGaugeIcons extends LitElement {
  @property({ attribute: false })
  public log!: Logger;

  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public config!: GaugeCardProCardConfig;

  @property({ attribute: false })
  public getValue!: (key: TemplateKey) => any;

  @state() private _updated = false;

  @state() private hasLeftIcon = false;
  @state() private leftIconIcon?;
  @state() private leftIconColor?;
  @state() private leftIconLabel?;

  @state() private hasRightIcon = false;
  @state() private rightIconIcon?;
  @state() private rightIconColor?;
  @state() private rightIconLabel?;

  // actions
  private hasIconLeftAction = false;
  private hasIconRightAction = false;

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("config")) {
      this.hasIconLeftAction = hasAction(this.config?.icon_left_tap_action);
      this.hasIconRightAction = hasAction(this.config?.icon_right_tap_action);

      const leftIcon = this.getIcon("left");
      this.hasLeftIcon = leftIcon !== undefined;

      const rightIcon = this.getIcon("right");
      this.hasRightIcon = rightIcon !== undefined;
    }
  }

  private _handleIconAction(side: "left" | "right", ev: CustomEvent) {
    ev.stopPropagation();
    const config = {
      entity:
        this.config!.icons?.[side]?.type === "battery"
          ? this.config!.icons[side].value
          : undefined,
      tap_action:
        side === "left"
          ? this.config!.icon_left_tap_action
          : this.config!.icon_right_tap_action,
      hold_action:
        side === "left"
          ? this.config!.icon_left_hold_action
          : this.config!.icon_right_hold_action,
      double_tap_action:
        side === "left"
          ? this.config!.icon_left_double_tap_action
          : this.config!.icon_right_double_tap_action,
    };
    handleAction(this, this.hass!, config, ev.detail.action!);
  }

  private getIcon(side: "left" | "right"):
    | undefined
    | {
        icon: string;
        color: string | undefined;
        label: string | undefined;
      } {
    if (!this.config?.icons?.[side]) return;
    const type = this.config.icons[side].type;

    const value = this.getValue(`icons.${side}.value`);
    if (type === "template") {
      if (
        !value ||
        typeof value !== "object" ||
        !Object.keys(value).includes("icon")
      )
        return;

      return {
        icon: value["icon"],
        color: value["color"] ?? DEFAULTS.ui.iconColor,
        label: value["label"] ?? "",
      };
    }

    switch (type) {
      case "battery": {
        const batteryStateObj = this.hass?.states[value];
        if (!batteryStateObj) return;

        const level = batteryStateObj.state;
        const threshold = NumberUtils.tryToNumber(
          this.config.icons[side].threshold
        );

        if (
          threshold !== undefined &&
          NumberUtils.isNumeric(level) &&
          Number(level) >= threshold
        )
          return;

        const state_entity = this.config.icons[side].state;
        const isCharging =
          state_entity != undefined &&
          ["charging", "on"].includes(
            this.hass?.states[state_entity]?.state ?? ""
          );
        const icon = batteryLevelIcon(level, isCharging);
        const color = `var(${batteryStateColorProperty(level)})`;

        let label = "";
        const hide_label = this.config.icons[side].hide_label;

        if (hide_label !== true) {
          label = NumberUtils.isNumeric(level)
            ? `${Math.round(Number(level))}${blankBeforePercent(this.hass!.locale)}%`
            : level;
        }

        return { icon: icon, color: color, label: label };
      }
      case "fan-mode": {
        const fanModeEntity = value ?? this.config.feature_entity;
        if (!fanModeEntity || computeDomain(fanModeEntity) !== "climate")
          return;

        const fanModeStateObj = <ClimateEntity>this.hass?.states[fanModeEntity];
        if (!fanModeStateObj) return;

        const fanMode = fanModeStateObj.attributes.fan_mode;
        if (!fanMode) return;
        const icon = getFanModeIcon(fanMode);

        let label = "";
        const hide_label = this.config.icons[side].hide_label;
        if (hide_label !== true) {
          const translationKey = `features.fan_modes.${fanMode.toLowerCase()}`;
          label = localize(this.hass, translationKey);
          if (label === translationKey) label = fanMode;
        }

        return { icon: icon, color: undefined, label: label };
      }
      case "hvac-mode": {
        const hvacModeEntity = value ?? this.config.feature_entity;
        if (!hvacModeEntity || computeDomain(hvacModeEntity) !== "climate")
          return;

        const hvacModeStateObj = <ClimateEntity>(
          this.hass?.states[hvacModeEntity]
        );
        if (!hvacModeStateObj) return;

        const hvacMode = <HvacMode>hvacModeStateObj.state;
        const icon = getHvacModeIcon(hvacMode);
        const color = getHvacModeColor(hvacMode);

        let label = "";
        const hide_label = this.config.icons[side].hide_label;
        if (hide_label !== true) {
          const translationKey = `features.hvac_modes.${hvacMode.toLowerCase()}`;
          label = localize(this.hass!, translationKey);
          if (label === translationKey) label = hvacMode;
        }

        return { icon: icon, color: color, label: label };
      }
      case "swing-mode": {
        const swingModeEntity = value ?? this.config.feature_entity;
        if (!swingModeEntity || computeDomain(swingModeEntity) !== "climate")
          return;

        const swingModeStateObj = <ClimateEntity>(
          this.hass?.states[swingModeEntity]
        );
        if (!swingModeStateObj) return;

        const swingMode = swingModeStateObj.attributes.swing_mode;
        if (!swingMode) return;
        const icon = getSwingModeIcon(swingMode);

        let label = "";
        const hide_label = this.config.icons[side].hide_label;
        if (hide_label !== true) {
          const translationKey = `features.swing_modes.${swingMode.toLowerCase()}`;
          label = localize(this.hass, translationKey);
          if (label === translationKey) label = swingMode;
        }

        return { icon: icon, color: undefined, label: label };
      }
      default:
        return;
    }
  }

  protected render(): TemplateResult {
    const iconLeft = this.getIcon("left");
    let iconLeftIcon: string | undefined;
    let iconLeftColor: string | undefined;
    if (iconLeft) {
      iconLeftIcon = iconLeft.icon;
      iconLeftColor = iconLeft.color;
      this.leftIconLabel = iconLeft.label ?? "";
    }

    const iconRight = this.getIcon("right");
    let iconRightIcon: string | undefined;
    let iconRightColor: string | undefined;
    if (iconRight) {
      iconRightIcon = iconRight.icon;
      iconRightColor = iconRight.color;
      this.rightIconLabel = iconRight.label ?? "";
    }

    return html`
      <div style="position: relative">
        <svg id="main-gauge" viewBox="-50 -50 100 50" class="elements-group">
          ${iconLeftIcon || iconRightIcon
            ? html`
                <div class="icon-container">
                  <div class="icon-inner-container icon-left">
                    ${iconLeftIcon
                      ? html` <ha-state-icon
                            class="icon icon-left"
                            .hass=${this.hass}
                            .icon=${iconLeftIcon}
                            role=${ifDefined(
                              this.hasIconLeftAction ? "button" : undefined
                            )}
                            tabindex=${ifDefined(
                              this.hasIconLeftAction ? "0" : undefined
                            )}
                            style=${styleMap({ color: iconLeftColor })}
                            @action=${(ev: CustomEvent) =>
                              this.hasIconLeftAction
                                ? this._handleIconAction("left", ev)
                                : nothing}
                            .actionHandler=${actionHandler({
                              hasHold: hasAction(
                                this.config!.icon_left_hold_action
                              ),
                              hasDoubleClick: hasAction(
                                this.config!.icon_left_double_tap_action
                              ),
                            })}
                            @click=${(ev: CustomEvent) =>
                              this.hasIconLeftAction
                                ? ev.stopPropagation()
                                : nothing}
                            @touchend=${(ev: CustomEvent) =>
                              this.hasIconLeftAction
                                ? ev.stopPropagation()
                                : nothing}
                          ></ha-state-icon>

                          <svg class="icon-label-text" id="icon-left-label">
                            <text
                              class="value-text"
                              style=${styleMap({
                                fill: "var(--primary-text-color)",
                              })}
                            >
                              ${this.leftIconLabel}
                            </text>
                          </svg>`
                      : nothing}
                  </div>
                  <div class="icon-inner-container icon-right">
                    ${iconRightIcon
                      ? html` <ha-state-icon
                            class="icon icon-right"
                            .hass=${this.hass}
                            .icon=${iconRightIcon}
                            role=${ifDefined(
                              this.hasIconRightAction ? "button" : undefined
                            )}
                            tabindex=${ifDefined(
                              this.hasIconRightAction ? "0" : undefined
                            )}
                            style=${styleMap({ color: iconRightColor })}
                            @action=${(ev: CustomEvent) =>
                              this.hasIconRightAction
                                ? this._handleIconAction("right", ev)
                                : nothing}
                            .actionHandler=${actionHandler({
                              hasHold: hasAction(
                                this.config!.icon_right_hold_action
                              ),
                              hasDoubleClick: hasAction(
                                this.config!.icon_right_double_tap_action
                              ),
                            })}
                            @click=${(ev: CustomEvent) =>
                              this.hasIconRightAction
                                ? ev.stopPropagation()
                                : nothing}
                            @touchend=${(ev: CustomEvent) =>
                              this.hasIconRightAction
                                ? ev.stopPropagation()
                                : nothing}
                          ></ha-state-icon>

                          <svg class="icon-label-text" id="icon-right-label">
                            >
                            <text
                              class="value-text"
                              style=${styleMap({
                                fill: "var(--primary-text-color)",
                              })}
                            >
                              ${this.rightIconLabel}
                            </text>
                          </svg>`
                      : nothing}
                  </div>
                </div>
              `
            : nothing}
        </svg>
      </div>
    `;
  }

  //-----------------------------------------------------------------------------
  // SVG TEXT SCALING
  //
  // Set the viewbox of the SVG containing the value to perfectly fit the text.
  // That way it will auto-scale correctly.
  //-----------------------------------------------------------------------------

  private _rescaleSvgText(
    element: "all" | "icon-left-label" | "icon-right-label" = "all"
  ) {
    const shouldHandle = (key: string) => element === "all" || element === key;

    const setViewBox = (selector: string) => {
      const svgRoot = this.shadowRoot!.querySelector(selector)!;
      const box = svgRoot.querySelector("text")!.getBBox();
      svgRoot.setAttribute(
        "viewBox",
        `${box.x} ${box.y} ${box.width} ${box.height}`
      );
    };

    if (shouldHandle("icon-left-label") && this.leftIconLabel) {
      setViewBox("#icon-left-label");
    }
    if (shouldHandle("icon-right-label") && this.rightIconLabel) {
      setViewBox("#icon-right-label");
    }
  }

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Wait for the first render for the initial animation to work
    afterNextRender(() => {
      this._updated = true;
      if (this.hasLeftIcon) {
        const leftIcon = this.getIcon("left");
        (this.leftIconIcon,
          this.leftIconColor,
          (this.leftIconLabel = leftIcon?.icon),
          leftIcon?.color,
          leftIcon?.label);
      }
      if (this.hasRightIcon) {
        const rightIcon = this.getIcon("left");
        (this.rightIconIcon,
          this.rightIconColor,
          (this.rightIconLabel = rightIcon?.icon),
          rightIcon?.color,
          rightIcon?.label);
      }
      this._rescaleSvgText();
    });
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this.config || !this.hass || !this._updated || !changedProperties)
      return;

    if (this.hasLeftIcon) {
      const leftIcon = this.getIcon("left");
      (this.leftIconIcon,
        this.leftIconColor,
        (this.leftIconLabel = leftIcon?.icon),
        leftIcon?.color,
        leftIcon?.label);
    }
    if (this.hasRightIcon) {
      const rightIcon = this.getIcon("left");
      (this.rightIconIcon,
        this.rightIconColor,
        (this.rightIconLabel = rightIcon?.icon),
        rightIcon?.color,
        rightIcon?.label);
    }

    if (changedProperties.has("iconLeftLabel")) {
      this._rescaleSvgText("icon-left-label");
    }

    if (changedProperties.has("iconRightLabel")) {
      this._rescaleSvgText("icon-right-label");
    }
  }

  static get styles(): CSSResultGroup {
    return [gaugeIconCSS];
  }
}
