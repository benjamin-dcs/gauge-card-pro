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

const gradientResolutionStruct = enums(["very_low", "low", "medium", "high"]);
const innerGaugeModes = enums(["severity", "static", "needle", "on_main"]);
const iconTypes = enums(["battery", "template"]);
const setpointTypes = enums(["entity", "number", "template"])

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
export const GaugeSegmentSchemaFrom = z.object({
  from: z.coerce.number(),
  color: z.coerce.string(),
});
export const GaugeSegmentSchemaPos = z.object({
  pos: z.coerce.number(),
  color: z.coerce.string(),
});

//-----------------------------------------------------------------------------
// CONFIGS
//-----------------------------------------------------------------------------

type LightDarkModeColor = {
  light_mode: string;
  dark_mode: string;
};

type IconConfig = {
  type: string;
  value: string;
  state?: string;
  threshold?: string;
  hide_label?: boolean;
};

type Setpoint = {
  type: string;
  color?: string | LightDarkModeColor;
  value: number | string;
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

type NeedleShapesConfig = {
  main?: string;
  main_with_inner?: string;
  main_setpoint?: string;
  inner?: string;
  inner_on_main?: string;
  inner_setpoint?: string;
  inner_setpoint_on_main?: string;
}

type InnerGaugeConfig = {
  gradient?: boolean;
  gradient_resolution?: string | number;
  min?: number | string;
  max?: number | string;
  mode?: string;
  needle_color?: string | LightDarkModeColor;
  segments?: string | GaugeSegmentFrom[] | GaugeSegment[];
  setpoint?: Setpoint;
  value?: string;
};

export type GaugeCardProCardConfig = LovelaceCardConfig & {
  entity?: string;
  entity2?: string;
  gradient?: boolean;
  gradient_resolution?: string | number;
  hide_background?: boolean;
  inner?: InnerGaugeConfig;
  min?: number | string;
  max?: number | string;
  needle?: boolean;
  needle_color?: string | LightDarkModeColor;
  segments?: string | GaugeSegmentFrom[] | GaugeSegment[];
  setpoint?: Setpoint;
  titles?: TitlesConfig;
  icon?: IconConfig;
  value?: string;
  value_texts?: ValueTextsConfig;
  needle_shapes?: NeedleShapesConfig;

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

const gaugeSegmentFromStruct = object({
  from: number(),
  color: string(),
});

const gaugeSegmentPosStruct = object({
  pos: number(),
  color: string(),
});

const lightDarkModeColorStruct = object({
  light_mode: string(),
  dark_mode: string(),
});

const iconStruct = object({
  type: iconTypes,
  value: optional(string()),
  state: optional(string()),
  threshold: optional(number()),
  hide_label: optional(boolean()),
});

const setpointStruct = object({
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

const needleShapesStruct = object({
  main: optional(string()),
  main_with_inner: optional(string()),
  main_setpoint: optional(string()),
  inner: optional(string()),
  inner_on_main: optional(string()),
  inner_setpoint: optional(string()),
  inner_setpoint_on_main: optional(string()),
});

const innerGaugeStruct = object({
  gradient: optional(boolean()),
  gradient_resolution: optional(union([gradientResolutionStruct, number()])),
  min: optional(union([number(), string()])),
  max: optional(union([number(), string()])),
  mode: optional(innerGaugeModes),
  needle_color: optional(union([string(), lightDarkModeColorStruct])),
  segments: optional(
    union([
      string(),
      array(gaugeSegmentFromStruct),
      array(gaugeSegmentPosStruct),
    ])
  ),
  setpoint: optional(setpointStruct),
  value: optional(string()),
});

export const gaugeCardProConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entity: optional(string()),
    entity2: optional(string()),
    gradient: optional(boolean()),
    gradient_resolution: optional(union([gradientResolutionStruct, number()])),
    hide_background: optional(boolean()),
    inner: optional(innerGaugeStruct),
    min: optional(union([number(), string()])),
    max: optional(union([number(), string()])),
    needle: optional(boolean()),
    needle_color: optional(union([string(), lightDarkModeColorStruct])),
    segments: optional(
      union([
        string(),
        array(gaugeSegmentFromStruct),
        array(gaugeSegmentPosStruct),
      ])
    ),
    setpoint: optional(setpointStruct),
    titles: optional(titlesStruct),
    icon: optional(iconStruct),
    value: optional(string()),
    value_texts: optional(valueTextsStruct),
    needle_shapes: optional(needleShapesStruct),

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
