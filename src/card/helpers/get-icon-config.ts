import { GaugeCardProCardConfig } from "../config";
import { IconConfig } from "../types";

export function getIconConfig(
  side: "left" | "right",
  config: GaugeCardProCardConfig
): IconConfig | undefined {
  const iconConfig = config.icons?.[side];
  if (!iconConfig) return undefined;

  const defaultActionEntity = config.entity;
  const actionEntity = (() => {
    switch (iconConfig.type) {
      case "battery":
        return iconConfig.value ?? defaultActionEntity;
      case "fan-mode":
      case "hvac-mode":
      case "preset-mode":
      case "swing-mode":
        return config.feature_entity ?? defaultActionEntity;
      case "template":
        return defaultActionEntity;
      default:
        return undefined;
    }
  })();

  if (actionEntity === undefined) return undefined;

  const tapAction = config[`icon_${side}_tap_action`];
  const holdAction = config[`icon_${side}_hold_action`];
  const doubleTapAction = config[`icon_${side}_double_tap_action`];

  return { actionEntity, tapAction, holdAction, doubleTapAction };
}
