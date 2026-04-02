import { afterNextRender, UNAVAILABLE } from "../../dependencies/ha";

import { INVALID_ENTITY } from "../../constants/constants";
import { DEFAULTS } from "../../constants/defaults";

import { getAngle } from "../../utils/number/get-angle";
import { NumberUtils } from "../../utils/number/numberUtils";
import { deepEqual } from "../../utils/object/deep-equal";

import { getIconData } from "./get-icon-data";
import { getMinMaxIndicator, getSetpoint } from "./get-indicators";
import { getValueAndValueText } from "./get-value-and-valueText";

import type { ComputeDataContext } from "../types/compute-data-context";
import type {
  AnimatedElements,
  DraftInnerMinMaxIndicator,
  DraftInnerSetpoint,
  DraftMainMinMaxIndicator,
  DraftMainSetpoint,
  GradientResolution,
  InnerGaugeData,
  InnerMinMaxIndicator,
  InnerSetpoint,
  MainGaugeData,
  MainMinMaxIndicator,
  MainSetpoint,
  Needle,
  PrimaryValueTextData,
  ValueElementsData,
  ValueTextData,
} from "../types/types";

export function computeData(card: ComputeDataContext) {
  computeExtremes(card);
  computeValues(card);
  computeAngles(card);

  computeMainGaugeData(card);
  computeInnerGaugeData(card);
  computeValueElementsData(card);
  computeIconData(card);
}

function computeExtremes(card: ComputeDataContext) {
  card.mainMin = NumberUtils.toNumberOrDefault(
    card.getValue("min"),
    DEFAULTS.values.min
  );
  card.mainMax = NumberUtils.toNumberOrDefault(
    card.getValue("max"),
    DEFAULTS.values.max
  );

  if (card.hasInnerGauge) {
    card.innerMin = NumberUtils.toNumberOrDefault(
      card.getValue("inner.min"),
      card.mainMin
    );

    card.innerMax = NumberUtils.toNumberOrDefault(
      card.getValue("inner.max"),
      card.mainMax
    );
  }
}

function computeValues(card: ComputeDataContext) {
  card.primaryValueAndValueText = getValueAndValueText(
    "main",
    card._config,
    card.hass,
    card.getValueBound
  );
  card.secondaryValueAndValueText = getValueAndValueText(
    "inner",
    card._config,
    card.hass,
    card.getValueBound
  );

  card.mainValue = card.primaryValueAndValueText?.value ?? card.mainMin;

  card.mainMinIndicator = getMinMaxIndicator(
    "main",
    "min",
    card._config,
    card.hass,
    card.getValueBound,
    card.getLightDarkModeColorBound,
    card.hasInnerGauge
  ) as DraftMainMinMaxIndicator;
  card.mainMaxIndicator = getMinMaxIndicator(
    "main",
    "max",
    card._config,
    card.hass,
    card.getValueBound,
    card.getLightDarkModeColorBound,
    card.hasInnerGauge
  ) as DraftMainMinMaxIndicator;
  card.mainSetpoint = getSetpoint(
    "main",
    card._config,
    card.hass,
    card.getValueBound,
    card.getLightDarkModeColorBound
  ) as DraftMainSetpoint;

  if (card.hasInnerGauge) {
    card.innerValue = card.secondaryValueAndValueText?.value ?? card.innerMin;

    card.innerMinIndicator = getMinMaxIndicator(
      "inner",
      "min",
      card._config,
      card.hass,
      card.getValueBound,
      card.getLightDarkModeColorBound,
      card.hasInnerGauge
    ) as DraftInnerMinMaxIndicator;
    card.innerMaxIndicator = getMinMaxIndicator(
      "inner",
      "max",
      card._config,
      card.hass,
      card.getValueBound,
      card.getLightDarkModeColorBound,
      card.hasInnerGauge
    ) as DraftInnerMinMaxIndicator;
    card.innerSetpoint = getSetpoint(
      "inner",
      card._config,
      card.hass,
      card.getValueBound,
      card.getLightDarkModeColorBound
    ) as DraftInnerSetpoint;
  }
}

function setAnimatedAngle(
  card: ComputeDataContext,
  key: AnimatedElements,
  getValue: () => number,
  setAngle: (angle: number) => void
): void {
  if (
    !card._initializedAnimatedElements.has(key) &&
    card._config?.animation_speed !== "off"
  ) {
    card._initializedAnimatedElements.add(key);
    // Start rendering at 0 deg
    setAngle(0);
    // Set animation to <angle>deg after next render
    afterNextRender(() => {
      setAngle(getValue());
      card.requestUpdate();
    });
  } else {
    setAngle(getValue());
  }
}

function computeAngles(card: ComputeDataContext) {
  // Delay angle animations here
  // Properly waits for templated values to allow animations

  setAnimatedAngle(
    card,
    "mainNeedle",
    () => getAngle(card.mainValue, card.mainMin, card.mainMax),
    (a) => {
      card.mainAngle = a;
    }
  );

  if (card.mainMinIndicator) {
    const mainMinIndicator = card.mainMinIndicator;
    setAnimatedAngle(
      card,
      "mainMinIndicator",
      () => getAngle(mainMinIndicator.value, card.mainMin, card.mainMax),
      (a) => {
        card.mainMinIndicatorAngle = a;
      }
    );
  }

  if (card.mainMaxIndicator) {
    const mainMaxIndicator = card.mainMaxIndicator;
    setAnimatedAngle(
      card,
      "mainMaxIndicator",
      () => 180 - getAngle(mainMaxIndicator.value, card.mainMin, card.mainMax),
      (a) => {
        card.mainMaxIndicatorAngle = a;
      }
    );
  }

  if (card.mainSetpoint) {
    const mainSetpoint = card.mainSetpoint;
    setAnimatedAngle(
      card,
      "mainSetpoint",
      () => getAngle(mainSetpoint.value, card.mainMin, card.mainMax),
      (a) => {
        card.mainSetpointAngle = a;
      }
    );
  }

  if (card.hasInnerGauge) {
    setAnimatedAngle(
      card,
      "innerNeedle",
      () => getAngle(card.innerValue!, card.innerMin!, card.innerMax!),
      (a) => {
        card.innerAngle = a;
      }
    );
  }

  if (card.innerMinIndicator) {
    setAnimatedAngle(
      card,
      "innerMinIndicator",
      () => getAngle(card.innerMinIndicator!.value, card.mainMin, card.mainMax),
      (a) => {
        card.innerMinIndicatorAngle = a;
      }
    );
  }

  if (card.innerMaxIndicator) {
    setAnimatedAngle(
      card,
      "innerMaxIndicator",
      () =>
        180 -
        getAngle(card.innerMaxIndicator!.value, card.mainMin, card.mainMax),
      (a) => {
        card.innerMaxIndicatorAngle = a;
      }
    );
  }

  if (card.innerSetpoint) {
    setAnimatedAngle(
      card,
      "innerSetpoint",
      () => getAngle(card.innerSetpoint!.value, card.mainMin, card.mainMax),
      (a) => {
        card.innerSetpointAngle = a;
      }
    );
  }
}

function computeMainGaugeData(card: ComputeDataContext) {
  const mainGradientResolution = NumberUtils.isNumeric(
    card.mainGradientResolution
  )
    ? card.mainGradientResolution
    : DEFAULTS.gradient.resolution;

  const mainGradientBackgroundOpacity =
    !card.hasMainNeedle && card.hasMainGradientBackground
      ? (card._config.gradient_background_opacity ??
        DEFAULTS.gradient.backgroundOpacity)
      : undefined;

  const min_indicator = card.mainMinIndicator?.opts as MainMinMaxIndicator;
  if (min_indicator) {
    min_indicator.angle = card.mainMinIndicatorAngle;
  }

  const max_indicator = card.mainMaxIndicator?.opts as MainMinMaxIndicator;
  if (max_indicator) {
    max_indicator.angle = card.mainMaxIndicatorAngle;
  }

  const candidate: MainGaugeData = {
    data: {
      min: card.mainMin,
      max: card.mainMax,
    },
    background: "",
    min_indicator: min_indicator,
    max_indicator: max_indicator,
    unavailable: [UNAVAILABLE, INVALID_ENTITY].includes(
      card.primaryValueAndValueText?.valueText ?? ""
    ),
  };

  if (card.usesGradientBackground("main")) {
    candidate.background = card.getConicGradientString(
      "main",
      card.mainMin,
      card.mainMax,
      mainGradientResolution,
      mainGradientBackgroundOpacity
    );
  }

  if (card.hasMainNeedle && !card.hasMainGradient) {
    candidate.background = card.getFlatArcConicGradientString(
      "main",
      card.mainMin,
      card.mainMax
    );
  }

  if (!card.hasMainNeedle) {
    const color =
      card.mainSeverityColorMode === "gradient"
        ? card.getConicGradientString(
            "main",
            card.mainMin,
            card.mainMax,
            mainGradientResolution
          )
        : card.computeSeverity(
            "main",
            card.mainMin,
            card.mainMax,
            card.mainValue
          );

    candidate.severity = {
      angle: card.mainAngle,
      color: color!,
    };
  }

  if (!deepEqual(card.mainGaugeData, candidate)) {
    card.mainGaugeData = candidate;
  }
}

function computeInnerGaugeData(card: ComputeDataContext) {
  if (!card.hasInnerGauge) return;
  if (card.innerMin === undefined || card.innerMax === undefined) return;

  let innerGradientResolution: GradientResolution | undefined;
  let innerGradientBackgroundOpacity: number | undefined;

  if (card.innerMode !== "on_main") {
    innerGradientResolution = NumberUtils.isNumeric(
      card.innerGradientResolution
    )
      ? card.innerGradientResolution
      : DEFAULTS.gradient.resolution;

    innerGradientBackgroundOpacity =
      card.innerMode === "severity" && card.hasInnerGradientBackground
        ? (card._config.inner?.gradient_background_opacity ??
          DEFAULTS.gradient.backgroundOpacity)
        : undefined;
  }

  const min_indicator = card.innerMinIndicator?.opts as InnerMinMaxIndicator;
  if (min_indicator) {
    min_indicator.angle = card.innerMinIndicatorAngle;
  }

  const max_indicator = card.innerMaxIndicator?.opts as InnerMinMaxIndicator;
  if (max_indicator) {
    max_indicator.angle = card.innerMaxIndicatorAngle;
  }

  const candidate: InnerGaugeData = {
    data: {
      min: card.innerMin,
      max: card.innerMax,
    },
    background: "",
    min_indicator: min_indicator,
    max_indicator: max_indicator,
    unavailable: [UNAVAILABLE, INVALID_ENTITY].includes(
      card.secondaryValueAndValueText?.valueText ?? ""
    ),
  };

  if (card.usesGradientBackground("inner")) {
    candidate.background = card.getConicGradientString(
      "inner",
      card.innerMin,
      card.innerMax,
      innerGradientResolution!,
      innerGradientBackgroundOpacity
    );
  }

  if (card.innerMode !== "severity" && !card.hasInnerGradient) {
    candidate.background = card.getFlatArcConicGradientString(
      "inner",
      card.innerMin,
      card.innerMax
    );
  }

  if (card.innerMode === "severity") {
    const color =
      card.innerSeverityColorMode === "gradient"
        ? card.getConicGradientString(
            "inner",
            card.innerMin,
            card.innerMax,
            innerGradientResolution!
          )
        : card.computeSeverity(
            "inner",
            card.innerMin,
            card.innerMax,
            card.innerValue ?? card.innerMin
          );
    candidate.severity = {
      angle: card.innerAngle,
      color: color!,
    };
  }

  if (!deepEqual(card.innerGaugeData, candidate)) {
    card.innerGaugeData = candidate;
  }
}

function computeValueElementsData(card: ComputeDataContext) {
  const primaryValueText = card.primaryValueAndValueText?.valueText;
  const secondaryValueText = card.secondaryValueAndValueText?.valueText;

  const mainNeedleValueElement: Needle | undefined = card.hasMainNeedle
    ? {
        angle: card.mainAngle,
        color: card.getLightDarkModeColor("needle_color"),
        customShape: card.getValidatedSvgPath("shapes.main_needle"),
      }
    : undefined;

  const mainSetpoint = card.mainSetpoint?.opts as MainSetpoint;
  if (mainSetpoint) {
    mainSetpoint.angle = card.mainSetpointAngle;
  }

  const innerNeedleValueElement: Needle | undefined =
    card.hasInnerGauge &&
    card.innerMode &&
    ["needle", "on_main"].includes(card.innerMode)
      ? {
          angle: card.innerAngle,
          color: card.getLightDarkModeColor("inner.needle_color"),
          customShape: card.getValidatedSvgPath("shapes.inner_needle"),
        }
      : undefined;

  const innerSetpoint = card.innerSetpoint?.opts as InnerSetpoint;
  if (innerSetpoint) {
    innerSetpoint.angle = card.innerSetpointAngle;
  }

  const primaryValueTextValueElement: PrimaryValueTextData | undefined =
    primaryValueText
      ? {
          text: primaryValueText,
          color: card.getLightDarkModeColor("value_texts.primary.color"),
          fontSizeReduction: card.getValue(
            "value_texts.primary.font_size_reduction"
          ),
        }
      : undefined;

  const secondaryValueTextValueElement: ValueTextData | undefined =
    secondaryValueText
      ? {
          text: secondaryValueText,
          color: card.getLightDarkModeColor("value_texts.secondary.color"),
        }
      : undefined;

  const candidate: ValueElementsData = {
    mainNeedle: mainNeedleValueElement,
    mainSetpoint: mainSetpoint,
    innerNeedle: innerNeedleValueElement,
    innerSetpoint: innerSetpoint,
    primaryValueText: primaryValueTextValueElement,
    secondaryValueText: secondaryValueTextValueElement,
    innerGaugeMode: card.innerMode,
  };

  if (!deepEqual(card.valueElementsData, candidate)) {
    card.valueElementsData = candidate;
  }
}

function computeIconData(card: ComputeDataContext) {
  card.leftIconData = getIconData(
    "left",
    card._config,
    card.hass,
    card.getValueBound
  );
  card.rightIconData = getIconData(
    "right",
    card._config,
    card.hass,
    card.getValueBound
  );
}
