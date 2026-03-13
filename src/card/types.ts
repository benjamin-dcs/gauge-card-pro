// External dependencies
import { z } from "zod";
import { ActionConfig } from "../dependencies/ha";
import { TemplateResult } from "lit";

export type Gauge = "main" | "inner";
export type SeverityColorMode = "basic" | "interpolation" | "gradient";
export type GradientResolution = "auto" | number;
export type MainRoundStyle = "off" | "full" | "medium" | "small";
export type InnerRoundStyle = "off" | "full" | "small";
export type InnerGaugeMode = "severity" | "static" | "needle" | "on_main";
export type FeatureStyle = "icons" | "dropdown";

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
  ? { label: TLabel }
  : { label?: never });

export type MainMinMaxIndicator = MinMaxIndicator<MinMaxIndicatorLabel>;
export type InnerMinMaxIndicator = MinMaxIndicator<undefined>;

//=============================================================================
// SETPOINT
//=============================================================================

type SetpointLabel = { text: string };
type Setpoint<TLabel extends SetpointLabel | undefined = SetpointLabel> = {
  angle: number;
  customColor?: string;
  opacity?: number;
  customShape?: string;
} & (TLabel extends SetpointLabel ? { label: TLabel } : { label?: never });

export type MainSetpoint = Setpoint<SetpointLabel>;
export type InnerSetpoint = Setpoint<undefined>;

//=============================================================================
// VALUE-ELEMENTS
//=============================================================================

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
// CARD FEATURES
//=============================================================================

export type Feature =
  | "adjust-temperature"
  | "climate-fan-modes"
  | "climate-hvac-modes"
  | "climate-swing-modes"
  | "climate-overview"
  | "climate-preset-modes";

//=============================================================================
// EDITOR
//=============================================================================

export type FormFunctions = {
  createHAForm: (
    config: any,
    schema: any,
    large_margin?: boolean,
    gauge?: "inner" | "none" | "main"
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
  addFeature: (ev) => void;
  deleteFeature: (feature: Feature) => void;
};
