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
import { moveKey } from '../utils/moveKey';
import { ERROR_COLOR, WARNING_COLOR, SUCCESS_COLOR } from './_const';

const gradientResolutionStruct = enums(['low', 'medium', 'high']);
const innerGaugeModes = enums(['severity', 'static', 'needle']);

// Configs

interface GaugeSegment {
  from: number;
  color: string;
}

interface LightDarkModeColor {
  light_mode: string;
  dark_mode: string;
}

interface SetpointNeedle {
  color?: string | LightDarkModeColor;
  value: number | string;
}

interface TextConfig {
  primary?: string;
  primary_color?: string;
  secondary?: string;
  secondary_color?: string;
}

interface InnerGaugeConfig {
  color_interpolation?: boolean;
  gradient?: boolean;
  gradient_resolution?: string;
  min?: number | string;
  max?: number | string;
  mode?: string;
  needle_color?: string | LightDarkModeColor;
  segments?: string | GaugeSegment[];
  value?: string;
}

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
  setpoint_needle?: SetpointNeedle;
  titles?: TextConfig;
  value?: string;
  value_texts?: TextConfig;

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

const setpointNeedleStruct = object({
  color: optional(union([string(), lightDarkModeColorStruct])),
  value: union([number(), string()]),
});

const textStruct = object({
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
    setpoint_needle: optional(setpointNeedleStruct),
    titles: optional(textStruct),
    value: optional(string()),
    value_texts: optional(textStruct),

    entity_id: optional(union([string(), array(string())])),

    // actions
    tap_action: optional(actionConfigStruct),
    hold_action: optional(actionConfigStruct),
    double_tap_action: optional(actionConfigStruct),
  })
);

export function migrate_parameters(config: any) {
  if (config) {
    // v0.4.0

    config = moveKey(config, 'gradientResolution', 'gradient_resolution');
    config = moveKey(config, 'name', 'titles.primary');
    config = moveKey(config, 'segmentsTemplate', 'segments');
    config = moveKey(config, 'severityTemplate', 'severity');
    config = moveKey(config, 'valueText', 'value_text');

    // v0.8.0

    config = moveKey(config, 'primary', 'titles.primary');
    config = moveKey(config, 'primary_color', 'titles.primary_color');

    config = moveKey(config, 'secondary', 'titles.secondary');
    config = moveKey(config, 'secondary_color', 'titles.secondary_color');

    config = moveKey(config, 'value_text', 'value_texts.primary');
    config = moveKey(config, 'value_text_color', 'value_texts.primary_color');

    config = moveKey(config, 'inner.value_text', 'value_texts.secondary');
    config = moveKey(
      config,
      'inner.value_text_color',
      'value_texts.secondary_color'
    );

    config = _moveSeverityToSegments(config);
  }
  console.log(config);

  return config;
}

function _moveSeverityToSegments(config: any) {
  const clone = structuredClone(config); // deep clone so we don't mutate

  if (config.severity === undefined) {
    return clone;
  }

  if (config.segments !== undefined) {
    return clone;
  }

  const green = config.severity.green;
  const yellow = config.severity.yellow;
  const red = config.severity.red;

  let segments: any = [];
  if (green !== undefined) {
    segments.push({ from: green, color: 'var(--success-color)' });
  }

  if (yellow !== undefined) {
    segments.push({ from: yellow, color: 'var(--warning-color)' });
  }

  if (red !== undefined) {
    segments.push({ from: red, color: 'var(--error-color)' });
  }

  segments.sort((a, b) => a.from - b.from);

  clone['segments'] = segments;
  delete clone.severity;
  return clone;
}
