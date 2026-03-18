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
    case "fan-mode":
    case "hvac-mode":
    case "preset-mode":
    case "swing-mode": {
      const value = getValue<string | undefined>(`icons.${side}.value`);
      const entity = value ?? config.feature_entity ?? config.entity;
      if (!entity || computeDomain(entity) !== "climate") return;

      const stateObj = hass?.states[entity] as ClimateEntity;
      if (!stateObj) return;

      const typeDataSource = {
        "fan-mode": {
          mode: stateObj.attributes.fan_mode,
          icon: getFanModeIcon,
          color: undefined,
        },
        "hvac-mode": {
          mode: stateObj.state,
          icon: (m: string) => getHvacModeIcon(m as HvacMode),
          color: (m: string) => getHvacModeColor(m as HvacMode),
        },
        "preset-mode": {
          mode: stateObj.attributes.preset_mode,
          icon: getPresetModeIcon,
          color: undefined,
        },
        "swing-mode": {
          mode: stateObj.attributes.swing_mode,
          icon: getSwingModeIcon,
          color: undefined,
        },
      } as const satisfies Record<
        string,
        {
          mode: string | undefined;
          icon: (m: string) => string;
          color: undefined | ((m: string) => string);
        }
      >;

      const data = typeDataSource[type];
      const mode = data.mode;
      if (!mode) return;

      const icon = data.icon(mode);
      const color = data.color?.(mode);

      let label = "";
      const hide_label = config.icons[side].hide_label;
      if (hide_label !== true) {
        const translationType = `${type.replace("-", "_")}s`;
        const translationKey = `features.${translationType}.${mode}`;
        label = localize(lang, translationKey);
        if (label === translationKey) label = mode;
      }

      return { icon, color: color, label };
    }
    case "template": {
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
    default:
      return;
  }
}
