// External dependencies
import { z } from "zod";

// Core HA helpers
import { ActionConfig, LovelaceCardConfig } from "../dependencies/ha";

export type Gauge = "main" | "inner";

export type ConicGradientSegment = {
  angle: number;
  color?: string;
};

export type GradientSegment = {
  pos: number;
  color?: string;
};

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
const percentage_regex = new RegExp(String.raw`^-?\d+(?:\.\d+)?%$`, "g");
export const GaugeSegmentSchemaFrom = z.object({
  from: z.union([z.coerce.number(), z.string().regex(percentage_regex)]),
  color: z.coerce.string(),
});
export const GaugeSegmentSchemaPos = z.object({
  pos: z.union([z.coerce.number(), z.string().regex(percentage_regex)]),
  color: z.coerce.string(),
});

//-----------------------------------------------------------------------------
// CONFIGS
//-----------------------------------------------------------------------------

type LightDarkModeColor = {
  light_mode: string;
  dark_mode: string;
};

type MinMaxIndicatorConfig = {
  type: string;
  color?: string | LightDarkModeColor;
  value: number | string;
  opacity?: number;
  label?: boolean;
  label_color?: string | LightDarkModeColor;
  precision?: number;
};

type IconConfig = {
  type: string;
  value: string;
  state?: string;
  threshold?: string;
  left?: boolean;
  hide_label?: boolean;
};

type SetpointConfig = {
  type: string;
  color?: string | LightDarkModeColor;
  value: number | string;
  label?: boolean;
  precision?: number;
};

type TitlesConfig = {
  primary?: string;
  primary_color?: string;
  primary_font_size?: string;
  secondary?: string;
  secondary_color?: string;
  secondary_font_size?: string;
};

type ValueTextsConfig = {
  primary?: string;
  primary_color?: string;
  primary_unit?: string;
  primary_unit_before_value?: boolean;
  primary_font_size_reduction?: number | string;
  secondary?: string;
  secondary_color?: string;
  secondary_unit?: string;
  secondary_unit_before_value?: boolean;
};

type ShapesConfig = {
  main_needle?: string;
  main_min_indicator?: string;
  main_max_indicator?: string;
  main_setpoint_needle?: string;
  inner_needle?: string;
  inner_min_indicator?: string;
  inner_max_indicator?: string;
  inner_setpoint_needle?: string;
};

type InnerGaugeConfig = {
  gradient?: boolean;
  gradient_background?: boolean;
  gradient_background_opacity?: number;
  gradient_resolution?: string | number;
  marker?: boolean;
  min?: number | string;
  max?: number | string;
  min_indicator?: MinMaxIndicatorConfig;
  max_indicator?: MinMaxIndicatorConfig;
  mode?: string;
  needle_color?: string | LightDarkModeColor;
  segments?: string | GaugeSegmentFrom[] | GaugeSegment[];
  setpoint?: SetpointConfig;
  value?: string;
  round?: string;
};

export type GaugeCardProCardConfig = LovelaceCardConfig & {
  header?: string;
  entity?: string;
  entity2?: string;
  gradient?: boolean;
  gradient_background?: boolean;
  gradient_background_opacity?: number;
  gradient_resolution?: string | number;
  hide_background?: boolean;
  inner?: InnerGaugeConfig;
  marker?: boolean;
  min?: number | string;
  max?: number | string;
  min_indicator?: MinMaxIndicatorConfig;
  max_indicator?: MinMaxIndicatorConfig;
  needle?: boolean;
  needle_color?: string | LightDarkModeColor;
  segments?: string | GaugeSegmentFrom[] | GaugeSegment[];
  setpoint?: SetpointConfig;
  round?: string;
  titles?: TitlesConfig;
  icon?: IconConfig;
  value?: string;
  value_texts?: ValueTextsConfig;
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

  icon_tap_action?: ActionConfig;
  icon_hold_action?: ActionConfig;
  icon_double_tap_action?: ActionConfig;
};
