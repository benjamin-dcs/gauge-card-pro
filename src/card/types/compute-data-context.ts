import type { HomeAssistant } from "../../dependencies/ha";
import type { GaugeCardProCardConfig } from "../config";
import { GetLightDarkModeColorFn, GetValueFn, TemplateKey } from "./template";
import type {
  AnimatedElements,
  DraftInnerMinMaxIndicator,
  DraftInnerSetpoint,
  DraftMainMinMaxIndicator,
  DraftMainSetpoint,
  Gauge,
  GradientResolution,
  IconData,
  InnerGaugeData,
  InnerGaugeMode,
  MainGaugeData,
  SeverityColorMode,
  ValueAndValueText,
  ValueElementsData,
} from "./types";

export interface ComputeDataContext {
  // Read
  readonly hass: HomeAssistant;
  readonly _config: GaugeCardProCardConfig;

  getValueBound: GetValueFn;
  getValue<T = unknown>(key: TemplateKey): T | undefined;

  getLightDarkModeColorBound: GetLightDarkModeColorFn;
  getLightDarkModeColor(key: TemplateKey): string | undefined;

  getValidatedSvgPath(key: TemplateKey): string | undefined;

  usesGradientBackground(gauge: Gauge): boolean;

  computeSeverity(
    gauge: Gauge,
    min: number,
    max: number,
    value: number
  ): string | undefined;
  getConicGradientString(
    gauge: Gauge,
    min: number,
    max: number,
    resolution: GradientResolution,
    opacity?: number
  ): string;
  getFlatArcConicGradientString(gauge: Gauge, min: number, max: number): string;

  requestUpdate(): void;

  mainMin: number;
  mainMax: number;
  mainValue: number;

  hasMainNeedle: boolean;
  mainSeverityColorMode?: SeverityColorMode;
  hasMainGradient?: boolean;
  hasMainGradientBackground?: boolean;
  mainGradientResolution?: string | number;

  mainMinIndicator?: DraftMainMinMaxIndicator;
  mainMaxIndicator?: DraftMainMinMaxIndicator;
  mainSetpoint?: DraftMainSetpoint;

  hasInnerGauge: boolean;
  innerMode?: InnerGaugeMode;
  innerSeverityColorMode?: SeverityColorMode;
  hasInnerGradient?: boolean;
  hasInnerGradientBackground?: boolean;
  innerGradientResolution?: string | number;

  innerMin?: number;
  innerMax?: number;
  innerValue?: number;

  innerMinIndicator?: DraftInnerMinMaxIndicator;
  innerMaxIndicator?: DraftInnerMinMaxIndicator;
  innerSetpoint?: DraftInnerSetpoint;

  primaryValueAndValueText?: ValueAndValueText;
  secondaryValueAndValueText?: ValueAndValueText;

  mainAngle: number;
  mainMinIndicatorAngle: number;
  mainMaxIndicatorAngle: number;
  mainSetpointAngle: number;
  innerAngle: number;
  innerMinIndicatorAngle: number;
  innerMaxIndicatorAngle: number;
  innerSetpointAngle: number;

  _initializedAnimatedElements: Set<AnimatedElements>;

  mainGaugeData?: MainGaugeData;
  innerGaugeData?: InnerGaugeData;
  valueElementsData?: ValueElementsData;
  leftIconData?: IconData;
  rightIconData?: IconData;
}
