import type { HomeAssistant } from "../../dependencies/ha";
import type { GaugeCardProCardConfig } from "../config";
import type { GetLightDarkModeColorFn, GetValueFn, TemplateKey } from "./template";
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

  readonly hasMainNeedle: boolean;
  readonly mainSeverityColorMode?: SeverityColorMode;
  readonly hasMainGradient?: boolean;
  readonly hasMainGradientBackground?: boolean;
  readonly mainGradientResolution?: string | number;

  readonly hasInnerGauge: boolean;
  readonly innerMode?: InnerGaugeMode;
  readonly innerSeverityColorMode?: SeverityColorMode;
  readonly hasInnerGradient?: boolean;
  readonly hasInnerGradientBackground?: boolean;
  readonly innerGradientResolution?: string | number;

  mainMin: number;
  mainMax: number;
  mainValue: number;
  mainMinIndicator?: DraftMainMinMaxIndicator;
  mainMaxIndicator?: DraftMainMinMaxIndicator;
  mainSetpoint?: DraftMainSetpoint;

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
