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
} from 'superstruct';
import { LovelaceCardConfig } from '../ha';
import { baseLovelaceCardConfig } from '../ha';
import { ActionConfig, actionConfigStruct } from '../ha';

export interface SeverityConfig {
  green?: number;
  yellow?: number;
  red?: number;
}

export interface GaugeSegment {
  from: number;
  color: string;
}

export interface LightDarkModeColor {
  light_mode: string;
  dark_mode: string;
}

const severityStruct = object({
  green: number(),
  yellow: number(),
  red: number(),
});

const gaugeSegmentStruct = object({
  from: number(),
  color: string(),
});

const lightDarkModeColorStruct = object({
  light_ode: string(),
  dark_mode: string(),
});

export const gradientResolutionStruct = enums(['low', 'medium', 'high']);

export type GaugeCardProCardConfig = LovelaceCardConfig & {
  entity?: string;
  value: string;
  value_text?: string;
  value_text_color?: string | LightDarkModeColor;
  name?: string;
  name_color?: string | LightDarkModeColor;
  min?: number | string;
  max?: number | string;
  needle?: boolean;
  needle_color?: string | LightDarkModeColor;
  severity?: string | SeverityConfig;
  segments?: string | GaugeSegment[];
  gradient?: boolean;
  gradient_resolution?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  entity_id?: string | string[];
};

export const guageCardProConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entity: optional(string()),
    value: optional(string()),
    value_text: optional(string()),
    value_text_color: optional(union([string(), lightDarkModeColorStruct])),
    name: optional(string()),
    name_color: optional(union([string(), lightDarkModeColorStruct])),
    min: optional(union([number(), string()])),
    max: optional(union([number(), string()])),
    needle: optional(boolean()),
    needle_color: optional(union([string(), lightDarkModeColorStruct])),
    severity: optional(union([string(), severityStruct])),
    segments: optional(union([string(), array(gaugeSegmentStruct)])),
    gradient: optional(boolean()),
    gradient_resolution: optional(gradientResolutionStruct),
    tap_action: optional(actionConfigStruct),
    hold_action: optional(actionConfigStruct),
    double_tap_action: optional(actionConfigStruct),
    entity_id: optional(union([string(), array(string())])),
  })
);
