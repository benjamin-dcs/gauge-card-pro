import {
  mdiCircleMedium,
  mdiCircleSmall,
  mdiFan,
  mdiThermostat,
} from "@mdi/js";

import type { HvacMode } from "../../../dependencies/ha";
import {
  CLIMATE_FAN_MODE_ICON_MAP,
  CLIMATE_HVAC_MODE_COLORS,
  CLIMATE_HVAC_MODE_ICON_MAP,
  CLIMATE_PRESET_MODE_ICON_MAP,
  CLIMATE_SWING_MODE_ICON_MAP,
} from "../../../constants/features";

export function getFanModeIcon(swingMode: string): string {
  return (
    CLIMATE_FAN_MODE_ICON_MAP[swingMode.toLowerCase()]?.icon ??
    "mdi:circle-medium"
  );
}

export function getFanModeDropdownIcon(swingMode: string): string {
  return CLIMATE_FAN_MODE_ICON_MAP[swingMode.toLowerCase()]?.path ?? mdiFan;
}

export function getHvacModeColor(hvacMode: HvacMode): string {
  return CLIMATE_HVAC_MODE_COLORS[hvacMode] ?? CLIMATE_HVAC_MODE_COLORS.off;
}

export function getHvacModeIcon(hvacMode: HvacMode): string {
  return CLIMATE_HVAC_MODE_ICON_MAP[hvacMode]?.icon ?? "mdi:circle-medium";
}

export function getHvacModeDropdownIcon(hvacMode: HvacMode): string {
  return CLIMATE_HVAC_MODE_ICON_MAP[hvacMode]?.path ?? mdiThermostat;
}

export function getPresetModeIcon(presetMode: string): string {
  return (
    CLIMATE_PRESET_MODE_ICON_MAP[presetMode.toLowerCase()]?.icon ??
    "mdi:circle-medium"
  );
}

export function getPresetModeDropdownIcon(presetMode: string): string {
  return (
    CLIMATE_PRESET_MODE_ICON_MAP[presetMode.toLowerCase()]?.path ??
    mdiCircleMedium
  );
}

export function getSwingModeIcon(swingMode: string): string {
  return (
    CLIMATE_SWING_MODE_ICON_MAP[swingMode.toLowerCase()]?.icon ??
    "mdi:circle-medium"
  );
}

export function getSwingModeDropdownIcon(swingMode: string): string {
  return (
    CLIMATE_SWING_MODE_ICON_MAP[swingMode.toLowerCase()]?.path ?? mdiCircleSmall
  );
}
