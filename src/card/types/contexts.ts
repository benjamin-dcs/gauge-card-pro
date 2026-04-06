import type { ActionHandlerEvent, HomeAssistant } from "../../dependencies/ha";
import type { GaugeCardProCardConfig } from "../config";
import type {
  GetLightDarkModeColorFn,
  GetValueFn,
  TemplateKey,
} from "./template";
import type {
  AnimatedElements,
  DraftInnerMinMaxIndicator,
  DraftInnerSetpoint,
  DraftMainMinMaxIndicator,
  DraftMainSetpoint,
  Feature,
  Gauge,
  GradientResolution,
  IconConfig,
  IconData,
  InnerGaugeConfig,
  InnerGaugeData,
  InnerGaugeMode,
  MainGaugeConfig,
  MainGaugeData,
  SeverityColorMode,
  ValueAndValueText,
  ValueElementsConfig,
  ValueElementsData,
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

export interface RenderGaugeContext {
  readonly hass: HomeAssistant;
  readonly _config: GaugeCardProCardConfig;

  _handleCardAction(ev: ActionHandlerEvent): void;

  readonly primaryValueAndValueText?: ValueAndValueText;
  readonly secondaryValueAndValueText?: ValueAndValueText;

  readonly hasMainNeedle: boolean;
  readonly mainSetpoint?: DraftMainSetpoint;

  readonly mainGaugeConfig?: MainGaugeConfig;
  readonly mainGaugeData?: MainGaugeData;

  readonly hasInnerGauge: boolean;
  readonly innerMode?: InnerGaugeMode;
  readonly innerSetpoint?: DraftInnerSetpoint;

  readonly innerGaugeConfig?: InnerGaugeConfig;
  readonly innerGaugeData?: InnerGaugeData;

  readonly leftIconConfig?: IconConfig;
  readonly leftIconData?: IconData;
  readonly rightIconConfig?: IconConfig;
  readonly rightIconData?: IconData;
  readonly valueElementsConfig?: ValueElementsConfig;
  readonly valueElementsData?: ValueElementsData;

  readonly hasCardAction: boolean;
}

export interface RenderControlsContext {
  readonly hass: HomeAssistant;
  readonly _config: GaugeCardProCardConfig;

  setFirstFeaturePage(ev: CustomEvent): void;
  setFeaturePage(ev: CustomEvent, page: Feature): void;
  nextFeaturePage(ev: CustomEvent): void;

  readonly featureEntity?: string;
  readonly enabledFeaturePages?: Feature[];
  readonly hasSeparatedOverviewControls?: boolean;

  readonly _activeFeaturePage: Feature;
}
