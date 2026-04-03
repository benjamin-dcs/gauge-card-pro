import { hasAction } from "../../dependencies/ha";

import { getIconConfig } from "./get-icon-config";
import { getValueElementsConfig } from "./get-value-elements-config";
import { DEFAULTS } from "../../constants/defaults";
import type { ProcessConfigUpdateContext } from "../types/process-config-update-context";
import { getFeature } from "../../utils/object/features";
import { FEATURE, FEATURE_PAGE_ORDER } from "../../constants/features";
import { GaugeCardProCardConfig } from "../config";

export function processConfigUpdate(
  card: ProcessConfigUpdateContext,
  config: GaugeCardProCardConfig
) {
  configureGeneral(card, config);
  configureMainGauge(card, config);
  configureInnerGauge(card, config);
  configureCardActions(card, config);

  setMainGaugeConfig(card, config);
  setInnerGaugeConfig(card, config);
  setValueElementsConfig(card, config);
  setIconsConfigs(card, config);
}

function configureGeneral(
  card: ProcessConfigUpdateContext,
  config: GaugeCardProCardConfig
) {
  card.header = config.header ?? undefined;

  // Features
  card.featureEntity =
    config.feature_entity ??
    (config?.entity?.startsWith("climate") ? config.entity : undefined);

  if (card.featureEntity !== undefined) {
    const overviewFeature = getFeature(config, FEATURE.CLIMATE_OVERVIEW);
    if (overviewFeature !== undefined) {
      card.hasSeparatedOverviewControls = overviewFeature.separate ?? false;
    }

    const _enabledFeatures = new Set(config.features?.map((f) => f.type));
    card.enabledFeaturePages = FEATURE_PAGE_ORDER.filter((p) =>
      _enabledFeatures.has(p)
    );

    card.scrollableFeaturePages = card.enabledFeaturePages.filter(
      (p) =>
        !(card.hasSeparatedOverviewControls && p === FEATURE.CLIMATE_OVERVIEW)
    );

    if (card.scrollableFeaturePages.length >= 1) {
      card._activeFeaturePage = card.scrollableFeaturePages[0];
    }
  }

  // Background
  card.hideBackground = config.hide_background ?? false;
}

function configureMainGauge(
  card: ProcessConfigUpdateContext,
  config: GaugeCardProCardConfig
) {
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

function configureInnerGauge(
  card: ProcessConfigUpdateContext,
  config: GaugeCardProCardConfig
) {
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

function configureCardActions(
  card: ProcessConfigUpdateContext,
  config: GaugeCardProCardConfig
) {
  card.hasCardAction = hasAction(config.tap_action);
}

function setMainGaugeConfig(
  card: ProcessConfigUpdateContext,
  config: GaugeCardProCardConfig
) {
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

function setInnerGaugeConfig(
  card: ProcessConfigUpdateContext,
  config: GaugeCardProCardConfig
) {
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

function setValueElementsConfig(
  card: ProcessConfigUpdateContext,
  config: GaugeCardProCardConfig
) {
  card.valueElementsConfig = getValueElementsConfig(config);
}

function setIconsConfigs(
  card: ProcessConfigUpdateContext,
  config: GaugeCardProCardConfig
) {
  card.leftIconConfig = getIconConfig("left", config);
  card.rightIconConfig = getIconConfig("right", config);
}
