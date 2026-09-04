import type { GaugeCardProCardConfig } from "../config";
import type {
  ValueElementsConfig,
  ValueElementsConfigNeedle,
} from "../types/types";

import { DEFAULTS } from "../../constants/defaults";
import { ProcessConfigUpdateContext } from "../types/contexts";
import { isInnerNeedleMode } from "../../utils/gauge/is-inner-needle-mode";
import { NEEDLE_STROKES } from "../../constants/svg/needle-strokes";
import { NEEDLES } from "../../constants/svg/needles";

export function getValueElementsConfig(
  card: ProcessConfigUpdateContext,
  config: GaugeCardProCardConfig
): ValueElementsConfig | undefined {
  return {
    layout: card.layout,
    needle_style: card.needleStyle,
    mainNeedle: getMainNeedleConfig(card),
    innerNeedle: getInnerNeedleConfig(card),
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
    innerGaugeMode: card.innerMode,
  };
}

function getMainNeedleConfig(
  card: ProcessConfigUpdateContext
): ValueElementsConfigNeedle | undefined {
  if (!card.hasMainNeedle) {
    return undefined;
  }

  const needles = NEEDLES[card.needleStyle][card.layout];
  const key = isInnerNeedleMode(card.innerMode)
    ? "withInner"
    : needles.main.keyForInnerSeverityGauge;

  return {
    svg: needles.main[key],
    stroke: NEEDLE_STROKES[card.needleStyle][card.layout]?.main?.[key],
  };
}

function getInnerNeedleConfig(
  card: ProcessConfigUpdateContext
): ValueElementsConfigNeedle | undefined {
  if (!isInnerNeedleMode(card.innerMode)) {
    return undefined;
  }

  const key = card.innerMode === "on_main" ? "onMain" : "normal";

  return {
    svg: NEEDLES[card.needleStyle][card.layout].inner[key],
    stroke: NEEDLE_STROKES[card.needleStyle][card.layout]?.inner?.[key],
  };
}
