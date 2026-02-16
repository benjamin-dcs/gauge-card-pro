// External dependencies
import { z } from "zod";

// General utilities
import { deleteKey } from "./object/delete-key";
import { moveKey } from "./object/move-key";
import { trySetValue } from "./object/set-value";

import { GaugeCardProCardConfig } from "../card/config";

export function migrate_parameters(config: GaugeCardProCardConfig | any) {
  if (!config) return;

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

  if (config.shapes?.main_min_indicator_with_inner !== undefined) {
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
    config = trySetValue(config, "gradient_resolution", 25, false, true).result
  }
  if (config.gradient_resolution === "low") {
    config = trySetValue(config, "gradient_resolution", 50, false, true).result
  }
  if (config.gradient_resolution === "medium") {
    config = trySetValue(config, "gradient_resolution", 100, false, true).result
  }
  if (config.inner?.gradient_resolution === "very_low") {
    config = trySetValue(config, "inner.gradient_resolution", 25, false, true).result
  }
  if (config.inner?.gradient_resolution === "low") {
    config = trySetValue(config, "inner.gradient_resolution", 50, false, true).result
  }
  if (config.inner?.gradient_resolution === "medium") {
    config = trySetValue(config, "inner.gradient_resolution", 100, false, true).result
  }

  return config;
}
