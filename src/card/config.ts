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

export interface SeverityConfig {
  green?: number;
  yellow?: number;
  red?: number;
}

export interface GaugeSegment {
  from: number;
  color: string;
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

export const gradientResolutionStruct = enums(["low", "medium", "high"]);

export type GaugeCardProCardConfig = LovelaceCardConfig & {
  entity?: string;
  value: string;
  valueText?: string;
  name?: string;
  min?: number | string;
  max?: number | string;
  needle?: boolean;
  severity?: SeverityConfig;
  severityTemplate?: string;
  segments?: GaugeSegment[];
  segmentsTemplate?: string;
  gradient?: boolean;
  gradientResolution?: string;
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
    valueText: optional(string()),
    name: optional(string()),
    min: optional(union([number(), string()])),
    max: optional(union([number(), string()])),
    needle: optional(boolean()),
    severity: optional(severityStruct),
    severityTemplate: optional(string()),
    segments: optional(array(gaugeSegmentStruct)),
    segmentsTemplate: optional(string()),
    gradient: optional(boolean()),
    gradientResolution: optional(gradientResolutionStruct),
    tap_action: optional(actionConfigStruct),
    hold_action: optional(actionConfigStruct),
    double_tap_action: optional(actionConfigStruct),
    entity_id: optional(union([string(), array(string())])),
  })
);
