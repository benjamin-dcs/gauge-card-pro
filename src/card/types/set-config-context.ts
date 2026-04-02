import type { GaugeCardProCardConfig } from "../config";
import type {
  Gauge,
  IconConfig,
  InnerGaugeConfig,
  InnerGaugeMode,
  MainGaugeConfig,
  SeverityColorMode,
  ValueElementsConfig,
} from "./types";

export interface ConfigUpdateContext {
  // Read
  readonly _config: GaugeCardProCardConfig;

  // Method dependency
  usesGradientBackground(gauge: Gauge): boolean;

  // Writeable fields — no `readonly`
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
