import type {
  ClimateEntity,
  HomeAssistant,
  HvacMode,
} from "../../dependencies/ha";
import {
  batteryLevelIcon,
  batteryStateColorProperty,
  blankBeforePercent,
  computeDomain,
} from "../../dependencies/ha";
import { DEFAULTS } from "../../constants/defaults";
import { NumberUtils } from "../../utils/number/numberUtils";
import { localize } from "../../utils/localize";
import type { GaugeCardProCardConfig } from "../config";
import type { IconData } from "../types";
import {
  getFanModeIcon,
  getHvacModeColor,
  getHvacModeIcon,
  getPresetModeIcon,
  getSwingModeIcon,
} from "../utils";
import type { GetValueFn } from "../types-template";

export function getIconData(
  side: "left" | "right",
  config: GaugeCardProCardConfig,
  hass: HomeAssistant,
  getValue: GetValueFn
): IconData | undefined {
  if (!config?.icons?.[side]) return;
  const type = config.icons[side].type;
  const lang = hass.locale.language;

  if (type === "template") {
    const value = getValue(`icons.${side}.value`);

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
      const value = getValue<string | undefined>(`icons.${side}.value`);
      if (!value) return;

      const batteryStateObj = hass?.states[value];
      if (!batteryStateObj) return;

      const level = batteryStateObj.state;
      const threshold = NumberUtils.tryToNumber(config.icons[side].threshold);

      if (
        threshold !== undefined &&
        NumberUtils.isNumeric(level) &&
        Number(level) >= threshold
      )
        return;

      const state_entity = config.icons[side].state;
      const isCharging =
        state_entity != undefined &&
        ["charging", "on"].includes(hass?.states[state_entity]?.state ?? "");
      const icon = batteryLevelIcon(level, isCharging);
      const color = `var(${batteryStateColorProperty(level)})`;

      let label = "";
      const hide_label = config.icons[side].hide_label;

      if (hide_label !== true) {
        label = NumberUtils.isNumeric(level)
          ? `${Math.round(Number(level))}${blankBeforePercent(hass.locale)}%`
          : level;
      }

      return { icon, color, label };
    }
    case "fan-mode": {
      const value = getValue<string | undefined>(`icons.${side}.value`);
      const fanModeEntity = value ?? config.feature_entity ?? config.entity;
      if (!fanModeEntity || computeDomain(fanModeEntity) !== "climate") return;

      const fanModeStateObj = hass?.states[fanModeEntity] as ClimateEntity;
      if (!fanModeStateObj) return;

      const fanMode = fanModeStateObj.attributes.fan_mode;
      if (!fanMode) return;
      const icon = getFanModeIcon(fanMode);

      let label = "";
      const hide_label = config.icons[side].hide_label;
      if (hide_label !== true) {
        const translationKey = `features.fan_modes.${fanMode}`;
        label = localize(lang, translationKey);
        if (label === translationKey) label = fanMode;
      }

      return { icon, color: undefined, label };
    }
    case "hvac-mode": {
      const value = getValue<string | undefined>(`icons.${side}.value`);
      const hvacModeEntity = value ?? config.feature_entity ?? config.entity;
      if (!hvacModeEntity || computeDomain(hvacModeEntity) !== "climate")
        return;

      const hvacModeStateObj = hass?.states[hvacModeEntity] as ClimateEntity;
      if (!hvacModeStateObj) return;

      const hvacMode = hvacModeStateObj.state as HvacMode;
      const icon = getHvacModeIcon(hvacMode);
      const color = getHvacModeColor(hvacMode);

      let label = "";
      const hide_label = config.icons[side].hide_label;
      if (hide_label !== true) {
        const translationKey = `features.hvac_modes.${hvacMode}`;
        label = localize(lang, translationKey);
        if (label === translationKey) label = hvacMode;
      }

      return { icon, color, label };
    }
    case "preset-mode": {
      const value = getValue<string | undefined>(`icons.${side}.value`);
      const presetModeEntity = value ?? config.feature_entity ?? config.entity;
      if (!presetModeEntity || computeDomain(presetModeEntity) !== "climate")
        return;

      const presetModeStateObj = hass?.states[
        presetModeEntity
      ] as ClimateEntity;
      if (!presetModeStateObj) return;

      const presetMode = presetModeStateObj.attributes.preset_mode;
      if (!presetMode) return;
      const icon = getPresetModeIcon(presetMode);

      let label = "";
      const hide_label = config.icons[side].hide_label;
      if (hide_label !== true) {
        const translationKey = `features.preset_modes.${presetMode.toLowerCase()}`;
        label = localize(lang, translationKey);
        if (label === translationKey) label = presetMode;
      }

      return { icon, color: undefined, label };
    }
    case "swing-mode": {
      const value = getValue<string | undefined>(`icons.${side}.value`);
      const swingModeEntity = value ?? config.feature_entity ?? config.entity;
      if (!swingModeEntity || computeDomain(swingModeEntity) !== "climate")
        return;

      const swingModeStateObj = hass?.states[swingModeEntity] as ClimateEntity;
      if (!swingModeStateObj) return;

      const swingMode = swingModeStateObj.attributes.swing_mode;
      if (!swingMode) return;
      const icon = getSwingModeIcon(swingMode);

      let label = "";
      const hide_label = config.icons[side].hide_label;
      if (hide_label !== true) {
        const translationKey = `features.swing_modes.${swingMode.toLowerCase()}`;
        label = localize(lang, translationKey);
        if (label === translationKey) label = swingMode;
      }

      return { icon, color: undefined, label };
    }
    default:
      return;
  }
}
