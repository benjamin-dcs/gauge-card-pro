import { DEFAULTS } from "../../constants/defaults";
import { trySetValue } from "../../utils/object/set-value";
import { GaugeCardProCardConfig } from "../config";

export function setConfigDefaults(_config: GaugeCardProCardConfig) {
  let config = trySetValue(
    _config,
    "tap_action.action",
    "more-info",
    true,
    false
  ).result;

  config = trySetValue(
    config,
    "value_texts.primary.tap_action.action",
    "none",
    true,
    false
  ).result;

  config = trySetValue(
    config,
    "value_texts.secondary.tap_action.action",
    "none",
    true,
    false
  ).result;

  config = trySetValue(
    config,
    "inner.mode",
    DEFAULTS.inner.mode,
    false,
    false
  ).result;

  return config;
}
