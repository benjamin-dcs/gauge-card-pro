// External dependencies
import { z } from "zod";

// General utilities
import { moveKey } from "./object/move-key";
import { trySetValue } from "./object/set-value";

import { GaugeCardProCardConfig } from "../card/config";

export function migrate_parameters(config: GaugeCardProCardConfig | any) {
  if (!config) return;

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

  if (config.icon?.battery !== undefined) {
    config = moveKey(config, "icon.battery", "icon.value");
    config = trySetValue(config, "icon.type", "battery", true, false).result;
  }

  if (config.icon?.template !== undefined) {
    config = moveKey(config, "icon.template", "icon.value");
    config = trySetValue(config, "icon.type", "template", true, false).result;
  }

  return config;
}
