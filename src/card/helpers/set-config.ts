import { hasAction } from "../../dependencies/ha";

import { getIconConfig } from "./get-icon-config";
import { getValueElementsConfig } from "./get-value-elements-config";
import { DEFAULTS } from "../../constants/defaults";
import type { ConfigUpdateContext } from "../types/set-config-context";

export function updateConfig(card: ConfigUpdateContext) {
  configureMainGauge(card);
  configureInnerGauge(card);
  configureCardActions(card);
  updateMainGaugeConfig(card);
  updateInnerGaugeConfig(card);
  updateValueElementsConfig(card);
  updateIconsConfigs(card);
}

function configureMainGauge(card: ConfigUpdateContext) {
  const config = card._config;

  card.hasMainNeedle = config.needle ?? false;

  if (card.hasMainNeedle) {
    card.mainSeverityColorMode = undefined;
    card.mainSeverityCentered = undefined;
    card.hasMainGradientBackground = undefined;
    card.hasMainGradient = config.gradient ?? false;
  } else {
    card.hasMainGradient = undefined;
    card.mainSeverityColorMode =
      config.severity_color_mode ?? DEFAULTS.severity.colorMode;
    card.mainSeverityCentered = config.severity_centered ?? false;
    card.hasMainGradientBackground = config.gradient_background ?? false;
  }

  card.mainGradientResolution = card.usesGradientBackground("main")
    ? (config.gradient_resolution ?? DEFAULTS.gradient.resolution)
    : undefined;
}

function configureInnerGauge(card: ConfigUpdateContext) {
  const config = card._config;

  card.hasInnerGauge = config.inner != null && typeof config.inner === "object";

  if (card.hasInnerGauge) {
    card.innerMode = config.inner!.mode ?? "severity";

    if (card.innerMode === "severity") {
      card.hasInnerGradient = undefined;
      card.innerSeverityColorMode =
        config.inner!.severity_color_mode ?? DEFAULTS.severity.colorMode;
      card.innerSeverityCentered = config.inner!.severity_centered ?? false;
      card.hasInnerGradientBackground =
        config.inner!.gradient_background ?? false;
    } else {
      card.innerSeverityColorMode = undefined;
      card.innerSeverityCentered = undefined;
      card.hasInnerGradientBackground = undefined;
      card.hasInnerGradient = config.inner!.gradient ?? false;
    }

    card.innerGradientResolution = card.usesGradientBackground("inner")
      ? (config.inner!.gradient_resolution ?? DEFAULTS.gradient.resolution)
      : undefined;
  } else {
    card.innerMode = undefined;
    card.innerSeverityColorMode = undefined;
    card.innerSeverityCentered = undefined;
    card.hasInnerGradientBackground = undefined;
    card.hasInnerGradient = undefined;
    card.innerGradientResolution = undefined;
  }
}

function configureCardActions(card: ConfigUpdateContext) {
  card.hasCardAction = hasAction(card._config.tap_action);
}

function updateMainGaugeConfig(card: ConfigUpdateContext) {
  const config = card._config;

  card.mainGaugeConfig = {
    mode: card.hasMainNeedle
      ? card.hasMainGradient
        ? "gradient-arc"
        : "flat-arc"
      : "severity",
    round: config.round,
    animation_speed: config.animation_speed ?? DEFAULTS.ui.animationSpeed,
  };

  card.mainGaugeConfig.severity = !card.hasMainNeedle
    ? {
        mode: card.mainSeverityColorMode!,
        fromCenter: card.mainSeverityCentered!,
        withGradientBackground: card.hasMainGradientBackground!,
      }
    : undefined;
}

function updateInnerGaugeConfig(card: ConfigUpdateContext) {
  const config = card._config;

  if (card.hasInnerGauge) {
    card.innerGaugeConfig = {
      mode:
        card.innerMode === "severity"
          ? "severity"
          : card.hasInnerGradient
            ? "gradient-arc"
            : "flat-arc",
      round: config.inner?.round,
      animation_speed: config.animation_speed ?? DEFAULTS.ui.animationSpeed,
    };

    card.innerGaugeConfig.severity =
      card.innerMode === "severity"
        ? {
            mode: card.innerSeverityColorMode!,
            fromCenter: card.innerSeverityCentered!,
            withGradientBackground: card.hasInnerGradientBackground!,
          }
        : undefined;
  } else {
    card.innerGaugeConfig = undefined;
  }
}

function updateValueElementsConfig(card: ConfigUpdateContext) {
  card.valueElementsConfig = getValueElementsConfig(card._config);
}

function updateIconsConfigs(card: ConfigUpdateContext) {
  const config = card._config;
  card.leftIconConfig = getIconConfig("left", config);
  card.rightIconConfig = getIconConfig("right", config);
}
