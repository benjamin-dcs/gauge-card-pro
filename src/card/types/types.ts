// External dependencies
import { z } from "zod";
import type { ActionConfig, ClimateEntity } from "../../dependencies/ha";
import type { InnerMinMaxIndicator, MainMinMaxIndicator } from "./indicators";
import { FEATURE } from "../../constants/features";
import { ANIMATION_SPEEDS } from "../../constants/constants";

export type Gauge = "main" | "inner";
export type Layout = "default" | "equal";
export type NeedleStyle = "default" | "ha";
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

export type MainNeedlePathKey =
  "normal" | "withInner" | "setpoint" | "setpointWithLabel";

export type MainNeedleSet = Record<MainNeedlePathKey, string> & {
  /** Main needle to use when the inner gauge renders as a band, not a needle. */
  keyForInnerSeverityGauge: MainNeedlePathKey;
};

export type InnerNeedleSet = {
  normal: string;
  onMain: string;
  setpoint: string;
  setpointOnMain: string;
};

export type NeedleSet = {
  main: MainNeedleSet;
  inner: InnerNeedleSet;
};

export type NeedleStyleDefinition = Record<Layout, NeedleSet>;

export type NeedleStroke = {
  color: string;
  width: string;
  linejoin?: "round" | "bevel" | "miter";
};

/** Mirrors `NeedleSet`. Every level is optional so a style can define a stroke
 *  for only some needles, or opt out entirely with `{}`. */
export type NeedleStrokeSet = {
  main?: Partial<Record<MainNeedlePathKey, NeedleStroke>>;
  inner?: Partial<Record<keyof InnerNeedleSet, NeedleStroke>>;
};

export type NeedleStrokeStyleDefinition = Partial<
  Record<Layout, NeedleStrokeSet>
>;

export type MainGaugeLayoutDefinition = {
  minMax: {
    indicator: string;
    labelTextPath: string;
    labelTextPathWithInner: string;
  };
  masks: {
    flat: string;
    full: string;
    medium: string;
    small: string;
  };
  severitySolid: {
    path: string;
    radius: number;
  };
};

export type MainGaugeMarkersLayoutDefinition = {
  positive: {
    flat: string;
    full: string;
    medium: string;
    small: string;
  };
  negative: {
    flat: string;
    full: string;
    medium: string;
    small: string;
  };
};

export type InnerGaugeLayoutDefinition = {
  minMax: {
    indicator: string;
  };
  basePath: string;
  masks: {
    divider: {
      severity: { full: string; small: string };
      static: { full: string; small: string };
    };
    gauge: {
      flat: string;
      full: string;
      small: string;
    };
  };
  staticDividerPath: string | undefined;
  severity: {
    path: string;
    radius: number;
    dividerPath: string;
    dividerRadius: number;
  };
};

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
  layout: Layout;
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
  layout: Layout;
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
  labelColor: string | undefined;
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
