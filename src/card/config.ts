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

export interface InnerGaugeConfig {
  value?: string;
  value_text?: string;
  value_text_color?: string | LightDarkModeColor;
  min?: number | string;
  max?: number | string;
  severity?: string | SeverityConfig;
  segments?: string | GaugeSegment[];
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

const innerGaugeStruct = object({
  value: string(),
  value_text: optional(string()),
  value_text_color: optional(union([string(), lightDarkModeColorStruct])),
  min: optional(union([number(), string()])),
  max: optional(union([number(), string()])),
  severity: optional(union([string(), severityStruct])),
  segments: optional(union([string(), array(gaugeSegmentStruct)])),
});

export const gradientResolutionStruct = enums(['low', 'medium', 'high']);

export type GaugeCardProCardConfig = LovelaceCardConfig & {
  entity?: string;
  entity2?: string;
  value?: string;
  severity?: string | SeverityConfig;
  segments?: string | GaugeSegment[];
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
  gradient?: boolean;
  gradient_resolution?: string;
  hide_background?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  entity_id?: string | string[];
};

export const guageCardProConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entity: optional(string()),
    entity2: optional(string()),
    value: optional(string()),
    severity: optional(union([string(), severityStruct])),
    segments: optional(union([string(), array(gaugeSegmentStruct)])),
    inner: optional(innerGaugeStruct),
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
    const _keys = Object.keys(config);

    if (_keys.includes('gradientResolution')) {
      config = {
        gradient_resolution: config.gradientResolution,
        ...config,
      };
    }
    delete config.gradientResolution;

    if (_keys.includes('name')) {
      config = {
        primary: config.name,
        ...config,
      };
    }
    delete config.name;

    if (_keys.includes('segmentsTemplate')) {
      config = {
        segments: config.segmentsTemplate,
        ...config,
      };
    }
    delete config.segmentsTemplate;

    if (_keys.includes('severityTemplate')) {
      config = {
        severity: config.severityTemplate,
        ...config,
      };
    }
    delete config.severityTemplate;

    if (_keys.includes('valueText')) {
      config = {
        value_text: config.valueText,
        ...config,
      };
    }
    delete config.valueText;
  }
  return config;
}
