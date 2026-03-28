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

// Core HA helpers
import { actionConfigStruct, baseLovelaceCardConfig } from "../dependencies/ha";

const gradientResolutionStruct = enums(["auto"]);
const SeverityColor = enums(["basic", "interpolation", "gradient"]);
const roundStructMain = enums(["off", "full", "medium", "small"]);
const roundStructInner = enums(["off", "full", "small"]);
const innerGaugeModes = enums(["severity", "static", "needle", "on_main"]);
const iconTypes = enums([
  "battery",
  "fan-mode",
  "hvac-mode",
  "preset-mode",
  "swing-mode",
  "template",
]);
const setpointTypes = enums(["attribute", "entity", "number", "template"]);
const animationTypes = enums(["normal", "fast", "off"]);

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
  attribute: optional(string()),
  opacity: optional(number()),
  label: optional(boolean()),
  label_color: optional(union([string(), lightDarkModeColorStruct])),
  precision: optional(number()),
});

const innerMinMaxIndicatorStruct = object({
  color: optional(union([string(), lightDarkModeColorStruct])),
  type: setpointTypes,
  value: optional(union([number(), string()])),
  attribute: optional(string()),
  opacity: optional(number()),
});

const iconStruct = object({
  type: iconTypes,
  value: optional(string()),
  state: optional(string()),
  threshold: optional(number()),
  hide_label: optional(boolean()),
  tap_action: optional(actionConfigStruct),
  hold_action: optional(actionConfigStruct),
  double_tap_action: optional(actionConfigStruct),
});

const iconsStruct = object({
  left: optional(iconStruct),
  right: optional(iconStruct),
});

const mainSetpointStruct = object({
  color: optional(union([string(), lightDarkModeColorStruct])),
  type: setpointTypes,
  value: optional(union([number(), string()])),
  attribute: optional(string()),
  label: optional(boolean()),
  precision: optional(number()),
});

const innerSetpointStruct = object({
  color: optional(union([string(), lightDarkModeColorStruct])),
  type: setpointTypes,
  value: optional(union([number(), string()])),
  attribute: optional(string()),
});

const titleStruct = object({
  value: optional(string()),
  color: optional(string()),
  font_size: optional(string()),
});

const titlesStruct = object({
  primary: optional(titleStruct),
  secondary: optional(titleStruct),
});

const valueTextStruct = object({
  value: optional(string()),
  color: optional(string()),
  unit_of_measurement: optional(string()),
  unit_before_value: optional(boolean()),
  font_size_reduction: optional(union([number(), string()])),
  tap_action: optional(actionConfigStruct),
  hold_action: optional(actionConfigStruct),
  double_tap_action: optional(actionConfigStruct),
});

const valueTextsStruct = object({
  primary: optional(valueTextStruct),
  secondary: optional(valueTextStruct),
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
  attribute: optional(string()),
  gradient: optional(boolean()),
  gradient_background: optional(boolean()),
  gradient_background_opacity: optional(number()),
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
  severity_centered: optional(boolean()),
  severity_color_mode: optional(SeverityColor),
  value: optional(string()),
  round: optional(roundStructInner),
});

export const gaugeCardProConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    header: optional(string()),
    entity: optional(string()),
    attribute: optional(string()),
    entity2: optional(string()),
    gradient: optional(boolean()),
    gradient_background: optional(boolean()),
    gradient_background_opacity: optional(number()),
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
    severity_centered: optional(boolean()),
    severity_color_mode: optional(SeverityColor),
    round: optional(roundStructMain),
    titles: optional(titlesStruct),
    icons: optional(iconsStruct),
    value: optional(string()),
    value_texts: optional(valueTextsStruct),
    shapes: optional(shapesStruct),

    entity_id: optional(union([string(), array(string())])),

    tap_action: optional(actionConfigStruct),
    hold_action: optional(actionConfigStruct),
    double_tap_action: optional(actionConfigStruct),

    feature_entity: optional(string()),
    features: optional(array(any())),

    log_debug: optional(boolean()),

    animation_speed: optional(animationTypes),

    card_mod: optional(any()),
  })
);
