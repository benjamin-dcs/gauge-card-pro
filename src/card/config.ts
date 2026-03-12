// Core HA helpers
import type {
  ActionConfig,
  LovelaceCardConfig,
  HvacMode,
} from "../dependencies/ha";

import type {
  FeatureStyle,
  GaugeSegment,
  GaugeSegmentFrom,
  GradientResolution,
  InnerGaugeMode,
  InnerRoundStyle,
  LightDarkModeColor,
  MainRoundStyle,
  SeverityColorMode,
} from "./types";

interface MinMaxIndicatorConfig {
  type: string;
  color?: string | LightDarkModeColor;
  value: number | string;
  attribute?: string;
  opacity?: number;
  label?: boolean;
  label_color?: string | LightDarkModeColor;
  precision?: number;
}

interface IconsConfig {
  left?: IconConfig;
  right?: IconConfig;
}

interface IconConfig {
  type:
    | "template"
    | "battery"
    | "fan-mode"
    | "hvac-mode"
    | "preset-mode"
    | "swing-mode";
  value: string;
  state?: string;
  threshold?: number;
  hide_label?: boolean;
}

interface SetpointConfig {
  type: string;
  color?: string | LightDarkModeColor;
  value: number | string;
  attribute?: string;
  label?: boolean;
  precision?: number;
}

interface TitlesConfig {
  primary?: string;
  primary_color?: string;
  primary_font_size?: string;
  secondary?: string;
  secondary_color?: string;
  secondary_font_size?: string;
}

interface ValueTextsConfig {
  primary?: string;
  primary_color?: string;
  primary_unit?: string;
  primary_unit_before_value?: boolean;
  primary_font_size_reduction?: number | string;
  secondary?: string;
  secondary_color?: string;
  secondary_unit?: string;
  secondary_unit_before_value?: boolean;
}

interface ShapesConfig {
  main_needle?: string;
  main_min_indicator?: string;
  main_max_indicator?: string;
  main_setpoint_needle?: string;
  inner_needle?: string;
  inner_min_indicator?: string;
  inner_max_indicator?: string;
  inner_setpoint_needle?: string;
}

export interface AdjustTemperatureFeatureConfig {
  type: "adjust-temperature";
}

export interface ClimateFanModesFeatureConfig {
  type: "climate-fan-modes";
  fan_modes?: string[];
  style: FeatureStyle;
}

export interface ClimateHvacModesFeatureConfig {
  type: "climate-hvac-modes";
  hvac_modes?: HvacMode[];
  style: FeatureStyle;
}

export interface ClimateOverviewFeatureConfig {
  type: "climate-overview";
  separate?: boolean;
}

export interface ClimatePresetModesFeatureConfig {
  type: "climate-preset-modes";
  preset_modes?: string[];
  style: FeatureStyle;
}

export interface ClimateSwingModesFeatureConfig {
  type: "climate-swing-modes";
  swing_modes?: string[];
  style: FeatureStyle;
}

export type FeaturesConfig =
  | AdjustTemperatureFeatureConfig
  | ClimateFanModesFeatureConfig
  | ClimateHvacModesFeatureConfig
  | ClimateOverviewFeatureConfig
  | ClimatePresetModesFeatureConfig
  | ClimateSwingModesFeatureConfig;

type InnerGaugeConfig = {
  attribute?: string;
  gradient?: boolean;
  gradient_background?: boolean;
  gradient_background_opacity?: number;
  gradient_resolution?: GradientResolution;
  min?: number | string;
  max?: number | string;
  min_indicator?: MinMaxIndicatorConfig;
  max_indicator?: MinMaxIndicatorConfig;
  mode?: InnerGaugeMode;
  needle_color?: string | LightDarkModeColor;
  segments?: GaugeSegment[] | GaugeSegmentFrom[] | string;
  severity_centered?: boolean;
  severity_color_mode?: SeverityColorMode;
  setpoint?: SetpointConfig;
  value?: string;
  round?: InnerRoundStyle;
};

export type GaugeCardProCardConfig = LovelaceCardConfig & {
  header?: string;
  entity?: string;
  attribute?: string;
  entity2?: string;
  gradient?: boolean;
  gradient_background?: boolean;
  gradient_background_opacity?: number;
  gradient_resolution?: GradientResolution;
  hide_background?: boolean;
  inner?: InnerGaugeConfig;
  min?: number | string;
  max?: number | string;

  needle?: boolean;
  needle_color?: string | LightDarkModeColor;
  segments?: GaugeSegment[] | GaugeSegmentFrom[] | string;
  severity_centered?: boolean;
  severity_color_mode?: SeverityColorMode;
  round?: MainRoundStyle;
  value?: string;

  min_indicator?: MinMaxIndicatorConfig;
  max_indicator?: MinMaxIndicatorConfig;
  setpoint?: SetpointConfig;

  titles?: TitlesConfig;
  value_texts?: ValueTextsConfig;
  icons?: IconsConfig;
  shapes?: ShapesConfig;

  entity_id?: string | string[];

  // actions
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;

  primary_value_text_tap_action?: ActionConfig;
  primary_value_text_hold_action?: ActionConfig;
  primary_value_text_double_tap_action?: ActionConfig;

  secondary_value_text_tap_action?: ActionConfig;
  secondary_value_text_hold_action?: ActionConfig;
  secondary_value_text_double_tap_action?: ActionConfig;

  icon_left_tap_action?: ActionConfig;
  icon_left_hold_action?: ActionConfig;
  icon_left_double_tap_action?: ActionConfig;

  icon_right_tap_action?: ActionConfig;
  icon_right_hold_action?: ActionConfig;
  icon_right_double_tap_action?: ActionConfig;

  // features
  feature_entity?: string;
  features?: FeaturesConfig[];

  log_debug?: boolean;
};
