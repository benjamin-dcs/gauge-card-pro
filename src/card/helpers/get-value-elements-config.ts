import { GaugeCardProCardConfig } from "../config";
import { ValueElementsConfig } from "../types";

export function getValueElementsConfig(
  config: GaugeCardProCardConfig
): ValueElementsConfig | undefined {
  return {
    primaryValueText: {
      actionEntity: config.entity,
      tapAction: config.value_texts?.primary?.tap_action,
      holdAction: config.value_texts?.primary?.hold_action,
      doubleTapAction: config.value_texts?.primary?.double_tap_action,
    },
    secondaryValueText: {
      actionEntity: config.entity2,
      tapAction: config.value_texts?.secondary?.tap_action,
      holdAction: config.value_texts?.secondary?.hold_action,
      doubleTapAction: config.value_texts?.secondary?.double_tap_action,
    },
  };
}
