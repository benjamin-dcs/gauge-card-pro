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
import {
  actionConfigStruct,
  baseLovelaceCardConfig,
} from "../../dependencies/ha";

const gradientResolutionStruct = enums(["auto", "very_low", "low", "medium"]);
const roundStructMain = enums(["off", "full", "medium", "small"]);
const roundStructInner = enums(["off", "full", "small"]);
const innerGaugeModes = enums(["severity", "static", "needle", "on_main"]);
const iconTypes = enums([
  "battery",
  "fan-mode",
  "hvac-mode",
  "swing-mode",
  "template",
]);
const setpointTypes = enums(["entity", "number", "template"]);

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
  hide_label: optional(boolean()),
});

const iconsStruct = object({
  left: optional(iconStruct),
  right: optional(iconStruct),
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
  gradient_background_opacity: optional(number()),
  gradient_resolution: optional(union([gradientResolutionStruct, number()])),
  marker: optional(boolean()),
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
  round: optional(roundStructInner),
});

export const gaugeCardProConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    header: optional(string()),
    entity: optional(string()),
    entity2: optional(string()),
    gradient: optional(boolean()),
    gradient_background: optional(boolean()),
    gradient_background_opacity: optional(number()),
    gradient_resolution: optional(union([gradientResolutionStruct, number()])),
    hide_background: optional(boolean()),
    inner: optional(innerGaugeStruct),
    marker: optional(boolean()),
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
    round: optional(roundStructMain),
    titles: optional(titlesStruct),
    icons: optional(iconsStruct),
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

    icon_left_tap_action: optional(actionConfigStruct),
    icon_left_hold_action: optional(actionConfigStruct),
    icon_left_double_tap_action: optional(actionConfigStruct),

    icon_right_tap_action: optional(actionConfigStruct),
    icon_right_hold_action: optional(actionConfigStruct),
    icon_right_double_tap_action: optional(actionConfigStruct),

    feature_entity: optional(string()),
    features: optional(array(any())),

    log_debug: optional(boolean()),

    card_mod: optional(any()),
  })
);
