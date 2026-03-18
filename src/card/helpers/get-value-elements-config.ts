import { GaugeCardProCardConfig } from "../config";
import { ValueElementsConfig } from "../types";

export function getValueElementsConfig(
  config: GaugeCardProCardConfig
): ValueElementsConfig | undefined {
  return {
    primaryValueText: {
      actionEntity: config.entity,
      tapAction: config.primary_value_text_tap_action,
      holdAction: config.primary_value_text_hold_action,
      doubleTapAction: config.primary_value_text_double_tap_action,
    },
    secondaryValueText: {
      actionEntity: config.entity2,
      tapAction: config.secondary_value_text_tap_action,
      holdAction: config.secondary_value_text_hold_action,
      doubleTapAction: config.secondary_value_text_double_tap_action,
    },
  };
}
