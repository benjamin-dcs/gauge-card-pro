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

export interface StylesConfig {
  card: string;
  value_text;
  name;
  needle;
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
  primary?: string;
  primary_color?: string | LightDarkModeColor;
  secondary?: string;
  secondary_color?: string | LightDarkModeColor;
  min?: number | string;
  max?: number | string;
  needle?: boolean;
  needle_color?: string | LightDarkModeColor;
  severity?: string | SeverityConfig;
  segments?: string | GaugeSegment[];
  gradient?: boolean;
  gradient_resolution?: string;
  hide_background?: boolean;
  styles?: StylesConfig;
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
    primary: optional(string()),
    primary_color: optional(union([string(), lightDarkModeColorStruct])),
    secondary: optional(string()),
    secondary_color: optional(union([string(), lightDarkModeColorStruct])),
    min: optional(union([number(), string()])),
    max: optional(union([number(), string()])),
    needle: optional(boolean()),
    needle_color: optional(union([string(), lightDarkModeColorStruct])),
    severity: optional(union([string(), severityStruct])),
    segments: optional(union([string(), array(gaugeSegmentStruct)])),
    gradient: optional(boolean()),
    gradient_resolution: optional(gradientResolutionStruct),
    hide_background: optional(boolean()),
    tap_action: optional(actionConfigStruct),
    hold_action: optional(actionConfigStruct),
    double_tap_action: optional(actionConfigStruct),
    entity_id: optional(union([string(), array(string())])),
  })
);

export function migrate_parameters(config: any) {
  if (config) {
    if (Object.keys(config).includes('gradientResolution')) {
      config = {
        ...config,
        gradient_resolution: config.gradientResolution,
      };
      delete config.gradientResolution;
    }

    if (Object.keys(config).includes('name')) {
      config = {
        ...config,
        primary: config.name,
      };
      delete config.name;
    }

    if (Object.keys(config).includes('segmentsTemplate')) {
      config = {
        ...config,
        segments: config.segmentsTemplate,
      };
      delete config.segmentsTemplate;
    }

    if (Object.keys(config).includes('severityTemplate')) {
      config = {
        ...config,
        severity: config.severityTemplate,
      };
      delete config.severityTemplate;
    }

    if (Object.keys(config).includes('valueText')) {
      config = {
        ...config,
        value_text: config.valueText,
      };
      delete config.valueText;
    }
  }
  return config;
}
