// General utilities
import { deleteKey } from "./object/delete-key";
import { moveKey } from "./object/move-key";
import { trySetValue } from "./object/set-value";

import type { GaugeCardProCardConfig } from "../card/config";

export function migrate_parameters(_config: unknown) {
  if (!_config) return;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let config = _config as Record<string, any>;

  // 1.2.0 - May 27 '25
  if (config.setpoint !== null && config.setpoint?.type === undefined) {
    if (typeof config.setpoint?.value === "number") {
      config = trySetValue(
        config,
        "setpoint.type",
        "number",
        true,
        false
      ).result;
    } else if (typeof config.setpoint?.value === "string") {
      config = trySetValue(
        config,
        "setpoint.type",
        "template",
        true,
        false
      ).result;
    }
  }

  // 1.5.1 - Jul 10 '25
  if (config.icon?.battery !== undefined) {
    config = moveKey(config, "icon.battery", "icon.value");
    config = trySetValue(config, "icon.type", "battery", true, false).result;
  }

  if (config.icon?.template !== undefined) {
    config = moveKey(config, "icon.template", "icon.value");
    config = trySetValue(config, "icon.type", "template", true, false).result;
  }

  // 1.8.0 - Nov 22 '25
  if (config.shapes?.main_needle_with_inner !== undefined) {
    config = moveKey(
      config,
      "shapes.main_needle_with_inner",
      "shapes.main_needle"
    );
  }

  if (config.shapes?.main_min_indicator_with_inner !== undefined) {
    config = moveKey(
      config,
      "shapes.main_min_indicator_with_inner",
      "shapes.main_min_indicator"
    );
  }

  if (config.shapes?.main_max_indicator_with_inner !== undefined) {
    config = moveKey(
      config,
      "shapes.main_max_indicator_with_inner",
      "shapes.main_max_indicator"
    );
  }

  if (config.shapes?.inner_needle_on_main !== undefined) {
    config = moveKey(
      config,
      "shapes.inner_needle_on_main",
      "shapes.inner_needle"
    );
  }

  if (config.shapes?.inner_setpoint_needle_on_main) {
    config = moveKey(
      config,
      "shapes.inner_setpoint_needle_on_main",
      "shapes.inner_setpoint_needle"
    );
  }

  // 2.0.0 - Jan 13 '26
  config = deleteKey(config, "use_new_from_segments_style").result;

  if (config.gradient_resolution === "high") {
    config = trySetValue(
      config,
      "gradient_resolution",
      "auto",
      false,
      true
    ).result;
  }

  if (config.inner?.gradient_resolution === "high") {
    config = trySetValue(
      config,
      "inner.gradient_resolution",
      "auto",
      false,
      true
    ).result;
  }

  // 2.1.0
  if (config.icon_tap_action !== undefined) {
    const side = config.icon?.left !== true ? "right" : "left";
    config = moveKey(config, "icon_tap_action", `icon_${side}_tap_action`);
    config = deleteKey(config, "icon_tap_action").result;
  }

  if (config.icon_hold_action !== undefined) {
    const side = config.icon?.left !== true ? "right" : "left";
    config = moveKey(config, "icon_hold_action", `icon_${side}_hold_action`);
    config = deleteKey(config, "icon_hold_action").result;
  }

  if (config.icon_double_tap_action !== undefined) {
    const side = config.icon?.left !== true ? "right" : "left";
    config = moveKey(
      config,
      "icon_double_tap_action",
      `icon_${side}_double_tap_action`
    );
    config = deleteKey(config, "icon_double_tap_action").result;
  }

  if (config.icon?.type !== undefined) {
    const side = config.icon.left !== true ? "right" : "left";
    config = deleteKey(config, "icon.left").result;
    config = moveKey(config, "icon", `icons.${side}`);
    config = deleteKey(config, "icon").result;
  }

  // 2.2.0
  config = deleteKey(config, "inner.marker").result;

  // 2.3.0
  if (config.gradient_resolution === "very_low") {
    config = trySetValue(config, "gradient_resolution", 25, false, true).result;
  }
  if (config.gradient_resolution === "low") {
    config = trySetValue(config, "gradient_resolution", 50, false, true).result;
  }
  if (config.gradient_resolution === "medium") {
    config = trySetValue(
      config,
      "gradient_resolution",
      100,
      false,
      true
    ).result;
  }
  if (config.inner?.gradient_resolution === "very_low") {
    config = trySetValue(
      config,
      "inner.gradient_resolution",
      25,
      false,
      true
    ).result;
  }
  if (config.inner?.gradient_resolution === "low") {
    config = trySetValue(
      config,
      "inner.gradient_resolution",
      50,
      false,
      true
    ).result;
  }
  if (config.inner?.gradient_resolution === "medium") {
    config = trySetValue(
      config,
      "inner.gradient_resolution",
      100,
      false,
      true
    ).result;
  }

  // 2.4.8

  // titles
  if (
    config.titles?.primary !== undefined &&
    typeof config.titles.primary === "string"
  ) {
    config = moveKey(config, "titles.primary", "titles.primary.value", true);
    console.log(config);
  }
  if (config.titles?.primary_color !== undefined) {
    config = moveKey(config, "titles.primary_color", "titles.primary.color");
  }
  if (config.titles?.primary_font_size !== undefined) {
    config = moveKey(
      config,
      "titles.primary_font_size",
      "titles.primary.font_size"
    );
  }

  if (
    config.titles?.secondary !== undefined &&
    typeof config.titles.secondary === "string"
  ) {
    config = moveKey(
      config,
      "titles.secondary",
      "titles.secondary.value",
      true
    );
  }
  if (config.titles?.secondary_color !== undefined) {
    config = moveKey(
      config,
      "titles.secondary_color",
      "titles.secondary.color"
    );
  }
  if (config.titles?.secondary_font_size !== undefined) {
    config = moveKey(
      config,
      "titles.secondary_font_size",
      "titles.secondary.font_size"
    );
  }

  // value texts
  if (
    config.value_texts?.primary !== undefined &&
    typeof config.titles.primary === "string"
  ) {
    config = moveKey(
      config,
      "value_texts.primary",
      "value_texts.primary.value",
      true
    );
  }
  if (config.value_texts?.primary_color !== undefined) {
    config = moveKey(
      config,
      "value_texts.primary_color",
      "value_texts.primary.color"
    );
  }
  if (config.value_texts?.primary_unit !== undefined) {
    config = moveKey(
      config,
      "value_texts.primary_unit",
      "value_texts.primary.unit_of_measurement"
    );
  }
  if (config.value_texts?.primary_unit_before_value !== undefined) {
    config = moveKey(
      config,
      "value_texts.primary_unit_before_value",
      "value_texts.primary.unit_before_value"
    );
  }
  if (config.value_texts?.primary_font_size_reduction !== undefined) {
    config = moveKey(
      config,
      "value_texts.primary_font_size_reduction",
      "value_texts.primary.font_size_reduction"
    );
  }

  if (
    config.value_texts?.secondary !== undefined &&
    typeof config.titles.secondary === "string"
  ) {
    config = moveKey(
      config,
      "value_texts.secondary",
      "value_texts.secondary.value",
      true
    );
  }
  if (config.value_texts?.secondary_color !== undefined) {
    config = moveKey(
      config,
      "value_texts.secondary_color",
      "value_texts.secondary.color"
    );
  }
  if (config.value_texts?.secondary_unit !== undefined) {
    config = moveKey(
      config,
      "value_texts.secondary_unit",
      "value_texts.secondary.unit_of_measurement"
    );
  }
  if (config.value_texts?.secondary_unit_before_value !== undefined) {
    config = moveKey(
      config,
      "value_texts.secondary_unit_before_value",
      "value_texts.secondary.unit_before_value"
    );
  }

  // actions
  if (config.primary_value_text_tap_action !== undefined) {
    config = moveKey(
      config,
      "primary_value_text_tap_action",
      "value_texts.primary.tap_action"
    );
  }
  if (config.primary_value_text_hold_action !== undefined) {
    config = moveKey(
      config,
      "primary_value_text_hold_action",
      "value_texts.primary.hold_action"
    );
  }
  if (config.primary_value_text_double_tap_action !== undefined) {
    config = moveKey(
      config,
      "primary_value_text_double_tap_action",
      "value_texts.primary.double_tap_action"
    );
  }

  if (config.secondary_value_text_tap_action !== undefined) {
    config = moveKey(
      config,
      "secondary_value_text_tap_action",
      "value_texts.secondary.tap_action"
    );
  }
  if (config.secondary_value_text_hold_action !== undefined) {
    config = moveKey(
      config,
      "secondary_value_text_hold_action",
      "value_texts.secondary.hold_action"
    );
  }
  if (config.secondary_value_text_double_tap_action !== undefined) {
    config = moveKey(
      config,
      "secondary_value_text_double_tap_action",
      "value_texts.secondary.double_tap_action"
    );
  }

  if (config.icon_left_tap_action !== undefined) {
    config = moveKey(config, "icon_left_tap_action", "icons.left.tap_action");
    console.log(config);
  }
  if (config.icon_left_hold_action !== undefined) {
    config = moveKey(config, "icon_left_hold_action", "icons.left.hold_action");
  }
  if (config.icon_left_double_tap_action !== undefined) {
    config = moveKey(
      config,
      "icon_left_double_tap_action",
      "icons.left.double_tap_action"
    );
  }

  if (config.icon_right_tap_action !== undefined) {
    config = moveKey(config, "icon_right_tap_action", "icons.right.tap_action");
  }
  if (config.icon_right_hold_action !== undefined) {
    config = moveKey(
      config,
      "icon_right_hold_action",
      "icons.right.hold_action"
    );
  }
  if (config.icon_right_double_tap_action !== undefined) {
    config = moveKey(
      config,
      "icon_right_double_tap_action",
      "icons.right.double_tap_action"
    );
  }

  config = deleteKey(config, "marker").result;

  return config as GaugeCardProCardConfig;
}
