// External dependencies
import { z } from "zod";
import {
  ActionConfig,
  ClimateEntity,
  HomeAssistant,
} from "../../dependencies/ha";
import { GaugeCardProCardConfig } from "../config";
import { TemplateResult } from "lit";
import { FEATURE } from "../../constants/features";
import { ANIMATION_SPEEDS } from "../../constants/constants";

export type Gauge = "main" | "inner";
export type SeverityColorMode = "basic" | "interpolation" | "gradient";
export type GradientResolution = "auto" | number;
export type MainRoundStyle = "off" | "full" | "medium" | "small";
export type InnerRoundStyle = "off" | "full" | "small";
export type InnerGaugeMode = "severity" | "static" | "needle" | "on_main";
export type FeatureStyle = "icons" | "dropdown";
export type AnimationSpeed = (typeof ANIMATION_SPEEDS)[number];

// Pos is considered the standard in the code. From is only used to transform to pos
export type GaugeSegment = {
  pos: number;
  color: string;
};
export type GaugeSegmentFrom = {
  from: number;
  color: string;
};

// Used to validate config `segments`
const percentage_regex = /^-?\d+(?:\.\d+)?%$/g;
export const GaugeSegmentSchemaFrom = z.object({
  from: z.union([z.coerce.number(), z.string().regex(percentage_regex)]),
  color: z.coerce.string(),
});
export const GaugeSegmentSchemaPos = z.object({
  pos: z.union([z.coerce.number(), z.string().regex(percentage_regex)]),
  color: z.coerce.string(),
});

export type LightDarkModeColor = {
  light_mode: string;
  dark_mode: string;
};

//=============================================================================
// GAUGE
//=============================================================================

export type MainSeverityGaugeMarker = { negative: string; positive: string };

export type GaugeData = {
  min: number;
  max: number;
};

export type SeverityConfig = {
  mode: SeverityColorMode;
  withGradientBackground: boolean;
  fromCenter: boolean;
};

export type SeverityData = {
  angle: number;
  color: string;
};

export type ConicGradientSegment = {
  angle: number;
  color?: string;
};

export type GradientSegment = {
  pos: number;
  color?: string;
};

export type MainGaugeConfig = {
  mode: "flat-arc" | "gradient-arc" | "severity";
  round?: MainRoundStyle;
  severity?: SeverityConfig;
  animation_speed: AnimationSpeed;
};

export type MainGaugeData = {
  data: GaugeData;
  severity?: SeverityData;
  background?: string;
  round?: MainRoundStyle;
  min_indicator?: MainMinMaxIndicator;
  max_indicator?: MainMinMaxIndicator;
  unavailable: boolean;
};

export type InnerGaugeConfig = {
  mode: "flat-arc" | "gradient-arc" | "severity";
  round?: InnerRoundStyle;
  severity?: SeverityConfig;
  animation_speed: AnimationSpeed;
};

export type InnerGaugeData = {
  data: GaugeData;
  severity?: SeverityData;
  background?: string;
  min_indicator?: InnerMinMaxIndicator;
  max_indicator?: InnerMinMaxIndicator;
  unavailable: boolean;
};

//=============================================================================
// MIN/MAX INDICATORS
//=============================================================================

type MinMaxIndicatorLabel = {
  text: string;
  customColor?: string;
  hasInner: boolean;
};
type MinMaxIndicator<
  TLabel extends MinMaxIndicatorLabel | undefined = MinMaxIndicatorLabel,
> = {
  angle: number;
  customColor?: string;
  opacity?: number;
  customShape?: string;
} & (TLabel extends MinMaxIndicatorLabel
  ? { label?: TLabel }
  : { label?: never });

export type MainMinMaxIndicator = MinMaxIndicator<MinMaxIndicatorLabel>;
export type InnerMinMaxIndicator = MinMaxIndicator<undefined>;

export type DraftMainMinMaxIndicator = {
  value: number;
  opts: Omit<MainMinMaxIndicator, "angle">;
};
export type DraftInnerMinMaxIndicator = {
  value: number;
  opts: Omit<InnerMinMaxIndicator, "angle">;
};

//=============================================================================
// SETPOINT
//=============================================================================

type SetpointLabel = { text: string };
type Setpoint<TLabel extends SetpointLabel | undefined = SetpointLabel> = {
  angle: number;
  customColor?: string;
  opacity?: number;
  customShape?: string;
} & (TLabel extends SetpointLabel ? { label?: TLabel } : { label?: never });

export type MainSetpoint = Setpoint<SetpointLabel>;
export type InnerSetpoint = Setpoint<undefined>;

export type DraftMainSetpoint = {
  value: number;
  opts: Omit<MainSetpoint, "angle">;
};
export type DraftInnerSetpoint = {
  value: number;
  opts: Omit<InnerSetpoint, "angle">;
};

//=============================================================================
// VALUE-ELEMENTS
//=============================================================================

export type AnimatedElements =
  | "mainNeedle"
  | "mainMinIndicator"
  | "mainMaxIndicator"
  | "mainSetpoint"
  | "innerNeedle"
  | "innerMinIndicator"
  | "innerMaxIndicator"
  | "innerSetpoint";

export type ValueAndValueText = {
  value: number | undefined;
  valueText: string;
};

export type Needle = {
  angle: number;
  color?: string;
  customShape?: string;
};

export type ValueTextData = {
  text: string;
  color?: string;
};
export type PrimaryValueTextData = ValueTextData & {
  fontSizeReduction?: number;
};

type ValueTextConfig = {
  actionEntity?: string;
  tapAction?: ActionConfig;
  holdAction?: ActionConfig;
  doubleTapAction?: ActionConfig;
};

export type ValueElementsConfig = {
  primaryValueText: ValueTextConfig;
  secondaryValueText: ValueTextConfig;
  animation_speed: AnimationSpeed;
};

export type ValueElementsData = {
  mainNeedle?: Needle;
  mainSetpoint?: MainSetpoint;
  innerNeedle?: Needle;
  innerSetpoint?: InnerSetpoint;
  primaryValueText?: PrimaryValueTextData;
  secondaryValueText?: ValueTextData;
  innerGaugeMode: InnerGaugeMode | undefined;
};

//=============================================================================
// ICONS
//=============================================================================

export type IconConfig = {
  actionEntity?: string;
  tapAction?: ActionConfig;
  holdAction?: ActionConfig;
  doubleTapAction?: ActionConfig;
};

export type IconData = {
  icon: string;
  color: string | undefined;
  label: string | undefined;
};

//=============================================================================
// FEATURES
//=============================================================================

export type Feature = (typeof FEATURE)[keyof typeof FEATURE];

export type ClimateModeFeatureState =
  | { enabled: false; modes: undefined; style: undefined }
  | { enabled: true; modes: string[]; style: FeatureStyle | undefined };

export type ClimateFeatureState = {
  featureEntityObj: ClimateEntity | undefined;
  hasClimateOverviewFeature: boolean;
  hasAdjustTemperatureFeature: boolean;
  hvac: ClimateModeFeatureState;
  fan: ClimateModeFeatureState;
  swing: ClimateModeFeatureState;
  preset: ClimateModeFeatureState;
  hasMoreThanOnePage: boolean;
  hasFiveOrMoreIcons: boolean;
};

//=============================================================================
// EDITOR
//=============================================================================

export interface EditorRenderContext {
  hass: HomeAssistant;
  createHAForm: (
    config: GaugeCardProCardConfig,
    schema: any,
    large_margin?: boolean,
    gauge?: Gauge | "none"
  ) => TemplateResult<1>;
  createButton: (
    text: string,
    clickFunction: () => void,
    icon?: string,
    size?: "medium" | "small" | undefined,
    variant?:
      | "success"
      | "brand"
      | "neutral"
      | "danger"
      | "warning"
      | undefined,
    appearance?: "accent" | "filled" | "plain" | undefined
  ) => TemplateResult<1>;
  createConvertSegmentsAlert: (
    gauge: "main" | "inner",
    isSeverity: boolean,
    segmentsType: "from" | "pos" | "template" | "none"
  ) => TemplateResult<1>;
  createSegmentPanel: (
    gauge: Gauge,
    type: "from" | "pos",
    segment: object,
    index: number
  ) => TemplateResult<1>;
  addSegment: (gauge: "main" | "inner") => void;
  sortSegments: (gauge: "main" | "inner") => void;
  addFeature: (ev: CustomEvent) => void;
  deleteFeature: (feature: Feature) => void;
}
