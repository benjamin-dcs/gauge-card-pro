// External dependencies
import {
  any,
  array,
  assign,
  boolean,
  enums,
  number,
  object,
  optional,
  string,
  union,
} from "superstruct";
import { z } from "zod";

// Core HA helpers
import {
  ActionConfig,
  actionConfigStruct,
  baseLovelaceCardConfig,
  LovelaceCardConfig,
} from "../dependencies/ha";
import { mdiOpacity } from "@mdi/js";

const gradientResolutionStruct = enums(["very_low", "low", "medium", "high"]);
const roundStruct = enums(["off", "full", "small"]);
const innerGaugeModes = enums(["severity", "static", "needle", "on_main"]);
const iconTypes = enums(["battery", "template"]);
const setpointTypes = enums(["entity", "number", "template"]);

export type Gauge = "main" | "inner";

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
  gradient_resolution?: string | number;
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
  use_new_from_segments_style?: boolean;
  gradient?: boolean;
  gradient_background?: boolean;
  gradient_resolution?: string | number;
  hide_background?: boolean;
  inner?: InnerGaugeConfig;
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

//-----------------------------------------------------------------------------
// STRUCTS
//-----------------------------------------------------------------------------

const lightDarkModeColorStruct = object({
  light_mode: string(),
  dark_mode: string(),
});

const gaugeSegmentFromStruct = object({
  from: union([number(), string()]),
  color: string(),
});

const gaugeSegmentPosStruct = object({
  pos: union([number(), string()]),
  color: string(),
});

const mainMinMaxIndicatorStruct = object({
  color: optional(union([string(), lightDarkModeColorStruct])),
  type: setpointTypes,
  value: optional(union([number(), string()])),
  opacity: optional(number()),
  label: optional(boolean()),
  label_color: optional(union([string(), lightDarkModeColorStruct])),
  precision: optional(number()),
});

const innerMinMaxIndicatorStruct = object({
  color: optional(union([string(), lightDarkModeColorStruct])),
  type: setpointTypes,
  value: optional(union([number(), string()])),
  opacity: optional(number()),
});

const iconStruct = object({
  type: iconTypes,
  value: optional(string()),
  state: optional(string()),
  threshold: optional(number()),
  left: optional(boolean()),
  hide_label: optional(boolean()),
});

const mainSetpointStruct = object({
  color: optional(union([string(), lightDarkModeColorStruct])),
  type: setpointTypes,
  value: optional(union([number(), string()])),
  label: optional(boolean()),
  precision: optional(number()),
});

const innerSetpointStruct = object({
  color: optional(union([string(), lightDarkModeColorStruct])),
  type: setpointTypes,
  value: optional(union([number(), string()])),
});

const titlesStruct = object({
  primary: optional(string()),
  primary_color: optional(string()),
  primary_font_size: optional(string()),
  secondary: optional(string()),
  secondary_color: optional(string()),
  secondary_font_size: optional(string()),
});

const valueTextsStruct = object({
  primary: optional(string()),
  primary_color: optional(string()),
  primary_unit: optional(string()),
  primary_unit_before_value: optional(boolean()),
  primary_font_size_reduction: optional(union([number(), string()])),
  secondary: optional(string()),
  secondary_color: optional(string()),
  secondary_unit: optional(string()),
  secondary_unit_before_value: optional(boolean()),
});

const shapesStruct = object({
  main_needle: optional(string()),
  main_min_indicator: optional(string()),
  main_max_indicator: optional(string()),
  main_setpoint_needle: optional(string()),
  inner_needle: optional(string()),
  inner_min_indicator: optional(string()),
  inner_max_indicator: optional(string()),
  inner_setpoint_needle: optional(string()),
});

const innerGaugeStruct = object({
  gradient: optional(boolean()),
  gradient_background: optional(boolean()),
  gradient_resolution: optional(union([gradientResolutionStruct, number()])),
  min: optional(union([number(), string()])),
  max: optional(union([number(), string()])),
  min_indicator: optional(innerMinMaxIndicatorStruct),
  max_indicator: optional(innerMinMaxIndicatorStruct),
  mode: optional(innerGaugeModes),
  needle_color: optional(union([string(), lightDarkModeColorStruct])),
  segments: optional(
    union([
      string(),
      array(gaugeSegmentFromStruct),
      array(gaugeSegmentPosStruct),
    ])
  ),
  setpoint: optional(innerSetpointStruct),
  value: optional(string()),
  round: optional(roundStruct),
});

export const gaugeCardProConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    header: optional(string()),
    entity: optional(string()),
    entity2: optional(string()),
    use_new_from_segments_style: optional(boolean()),
    gradient: optional(boolean()),
    gradient_background: optional(boolean()),
    gradient_resolution: optional(union([gradientResolutionStruct, number()])),
    hide_background: optional(boolean()),
    inner: optional(innerGaugeStruct),
    min: optional(union([number(), string()])),
    max: optional(union([number(), string()])),
    min_indicator: optional(mainMinMaxIndicatorStruct),
    max_indicator: optional(mainMinMaxIndicatorStruct),
    needle: optional(boolean()),
    needle_color: optional(union([string(), lightDarkModeColorStruct])),
    segments: optional(
      union([
        string(),
        array(gaugeSegmentFromStruct),
        array(gaugeSegmentPosStruct),
      ])
    ),
    setpoint: optional(mainSetpointStruct),
    round: optional(roundStruct),
    titles: optional(titlesStruct),
    icon: optional(iconStruct),
    value: optional(string()),
    value_texts: optional(valueTextsStruct),
    shapes: optional(shapesStruct),

    entity_id: optional(union([string(), array(string())])),

    // actions
    tap_action: optional(actionConfigStruct),
    hold_action: optional(actionConfigStruct),
    double_tap_action: optional(actionConfigStruct),

    primary_value_text_tap_action: optional(actionConfigStruct),
    primary_value_text_hold_action: optional(actionConfigStruct),
    primary_value_text_double_tap_action: optional(actionConfigStruct),

    secondary_value_text_tap_action: optional(actionConfigStruct),
    secondary_value_text_hold_action: optional(actionConfigStruct),
    secondary_value_text_double_tap_action: optional(actionConfigStruct),

    icon_tap_action: optional(actionConfigStruct),
    icon_hold_action: optional(actionConfigStruct),
    icon_double_tap_action: optional(actionConfigStruct),

    card_mod: optional(any()),
  })
);
