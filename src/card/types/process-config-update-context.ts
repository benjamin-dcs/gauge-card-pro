import type { GaugeCardProCardConfig } from "../config";
import type {
  Feature,
  Gauge,
  IconConfig,
  InnerGaugeConfig,
  InnerGaugeMode,
  MainGaugeConfig,
  SeverityColorMode,
  ValueElementsConfig,
} from "./types";

export interface ProcessConfigUpdateContext {
  readonly _config: GaugeCardProCardConfig;

  usesGradientBackground(gauge: Gauge): boolean;

  header?: string;
  featureEntity?: string;
  enabledFeaturePages?: Feature[];
  hasSeparatedOverviewControls?: boolean;
  scrollableFeaturePages?: Feature[];
  _activeFeaturePage?: Feature;

  hideBackground: boolean;

  hasMainNeedle: boolean;
  mainSeverityColorMode?: SeverityColorMode;
  mainSeverityCentered?: boolean;
  hasMainGradient?: boolean;
  hasMainGradientBackground?: boolean;
  mainGradientResolution?: string | number;

  hasInnerGauge: boolean;
  innerMode?: InnerGaugeMode;
  innerSeverityColorMode?: SeverityColorMode;
  innerSeverityCentered?: boolean;
  hasInnerGradient?: boolean;
  hasInnerGradientBackground?: boolean;
  innerGradientResolution?: string | number;

  hasCardAction: boolean;

  mainGaugeConfig?: MainGaugeConfig;
  innerGaugeConfig?: InnerGaugeConfig;
  leftIconConfig?: IconConfig;
  rightIconConfig?: IconConfig;
  valueElementsConfig?: ValueElementsConfig;
}
