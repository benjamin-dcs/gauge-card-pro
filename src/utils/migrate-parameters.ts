// External dependencies
import { z } from "zod";

// General utilities
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

  // 1.8.0
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

  return config;
}
