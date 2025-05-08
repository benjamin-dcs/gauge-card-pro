import { z } from "zod";

import {
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
import { LovelaceCardConfig } from "../ha";
import { baseLovelaceCardConfig } from "../ha";
import { ActionConfig, actionConfigStruct } from "../ha";

const gradientResolutionStruct = enums(["low", "medium", "high"]);
const innerGaugeModes = enums(["severity", "static", "needle"]);

export type Gauge = "main" | "inner";

export type GradientSegment = {
  pos: number;
  color?: string;
};

export type GaugeSegment = {
  from: number;
  color: string;
};

export const GaugeSegmentSchema = z.object({
  from: z.number(),
  color: z.string(),
});

// Configs

type LightDarkModeColor = {
  light_mode: string;
  dark_mode: string;
};

type Setpoint = {
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
  secondary?: string;
  secondary_color?: string;
};

type InnerGaugeConfig = {
  color_interpolation?: boolean;
  gradient?: boolean;
  gradient_resolution?: string;
  min?: number | string;
  max?: number | string;
  mode?: string;
  needle_color?: string | LightDarkModeColor;
  segments?: string | GaugeSegment[];
  value?: string;
};

export type GaugeCardProCardConfig = LovelaceCardConfig & {
  color_interpolation?: boolean;
  entity?: string;
  entity2?: string;
  gradient?: boolean;
  gradient_resolution?: string;
  hide_background?: boolean;
  inner?: InnerGaugeConfig;
  min?: number | string;
  max?: number | string;
  needle?: boolean;
  needle_color?: string | LightDarkModeColor;
  segments?: string | GaugeSegment[];
  setpoint?: Setpoint;
  titles?: TitlesConfig;
  value?: string;
  value_texts?: ValueTextsConfig;

  entity_id?: string | string[];

  // actions
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
};

// Structs

const gaugeSegmentStruct = object({
  from: number(),
  color: string(),
});

const lightDarkModeColorStruct = object({
  light_mode: string(),
  dark_mode: string(),
});

const setpointStruct = object({
  color: optional(union([string(), lightDarkModeColorStruct])),
  value: union([number(), string()]),
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
  secondary: optional(string()),
  secondary_color: optional(string()),
});

const innerGaugeStruct = object({
  color_interpolation: optional(boolean()),
  gradient: optional(boolean()),
  gradient_resolution: optional(gradientResolutionStruct),
  min: optional(union([number(), string()])),
  max: optional(union([number(), string()])),
  mode: optional(innerGaugeModes),
  needle_color: optional(union([string(), lightDarkModeColorStruct])),
  segments: optional(union([string(), array(gaugeSegmentStruct)])),
  value: optional(string()),
});

export const gaugeCardProConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    color_interpolation: optional(boolean()),
    entity: optional(string()),
    entity2: optional(string()),
    gradient: optional(boolean()),
    gradient_resolution: optional(gradientResolutionStruct),
    hide_background: optional(boolean()),
    inner: optional(innerGaugeStruct),
    min: optional(union([number(), string()])),
    max: optional(union([number(), string()])),
    needle: optional(boolean()),
    needle_color: optional(union([string(), lightDarkModeColorStruct])),
    segments: optional(union([string(), array(gaugeSegmentStruct)])),
    setpoint: optional(setpointStruct),
    titles: optional(titlesStruct),
    value: optional(string()),
    value_texts: optional(valueTextsStruct),

    entity_id: optional(union([string(), array(string())])),

    // actions
    tap_action: optional(actionConfigStruct),
    hold_action: optional(actionConfigStruct),
    double_tap_action: optional(actionConfigStruct),
  })
);
