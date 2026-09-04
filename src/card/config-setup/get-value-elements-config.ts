import type { GaugeCardProCardConfig } from "../config";
import type { InnerNeedleSet, MainNeedleSet, ValueElementsConfig, ValueElementsConfigNeedle } from "../types/types";

import { DEFAULTS } from "../../constants/defaults";
import { ProcessConfigUpdateContext } from "../types/contexts";
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
  card: ProcessConfigUpdateContext,
): ValueElementsConfigNeedle | undefined {
  if (!card.hasMainNeedle) {
    return undefined;
  }

  const needles = NEEDLES[card.needleStyle][card.layout];
  const needleKey: keyof MainNeedleSet = ["needle", "on_main"].includes(
    card.innerMode ?? ""
  )
    ? "withInner"
    : needles.main.keyForInnerSeverityGauge as keyof MainNeedleSet;
  const needle = needles.main[needleKey];

  const strokes =
        NEEDLE_STROKES[card.needleStyle][card.layout];
  const stroke = strokes?.main?.[needleKey];

  return {
    svg: needle,
    stroke: stroke
  }
}

function getInnerNeedleConfig(
  card: ProcessConfigUpdateContext,
): ValueElementsConfigNeedle | undefined {
  if (!["needle", "on_main"].includes(card.innerMode ?? "")) {
    return undefined;
  }

  const needles = NEEDLES[card.needleStyle][card.layout];
  const needleKey: keyof InnerNeedleSet =
      card.innerMode === "on_main" ? "onMain" : "normal";
  const needle = needles.inner[needleKey];

  const strokes =
        NEEDLE_STROKES[card.needleStyle][card.layout];
  const stroke = strokes?.inner?.[needleKey];

  return {
    svg: needle,
    stroke: stroke
  }
}
