// General utilities
import { moveKey } from "./object/move-key";
import { trySetValue } from "./object/set-value";

export function migrate_parameters(config: any) {
  if (!config) return;

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
