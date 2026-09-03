import type { GaugeCardProCardConfig } from "../config";
import type { ValueElementsConfig } from "../types/types";

import { DEFAULTS } from "../../constants/defaults";
import { ProcessConfigUpdateContext } from "../types/contexts";

export function getValueElementsConfig(
  card: ProcessConfigUpdateContext,
  config: GaugeCardProCardConfig
): ValueElementsConfig | undefined {
  return {
    layout: card.layout,
    needle_style: card.needleStyle,
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
    animation_speed: config.animation_speed ?? DEFAULTS.ui.animationSpeed,
  };
}
