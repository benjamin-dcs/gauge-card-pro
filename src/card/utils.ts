import {
  mdiCircleMedium,
  mdiCircleSmall,
  mdiFan,
  mdiThermostat,
} from "@mdi/js";

import type { HvacMode } from "../dependencies/ha";
import {
  CLIMATE_FAN_MODE_ICON_MAP,
  CLIMATE_HVAC_MODE_COLORS,
  CLIMATE_HVAC_MODE_ICON_MAP,
  CLIMATE_PRESET_MODE_ICON_MAP,
  CLIMATE_SWING_MODE_ICON_MAP,
} from "../constants/features";

export function getSeverityGradientValueClippath(
  angle: number,
  centered: boolean
): string {
  const clamped = Math.max(0, Math.min(180, angle));
  const t = Math.PI - (clamped * Math.PI) / 180;

  const xOut = +(50 * Math.cos(t)).toFixed(3);
  const yOut = +(-50 * Math.sin(t)).toFixed(3);

  if (centered && angle == 90) {
    return "";
  } else if (centered) {
    const sweep = angle <= 90 ? 0 : 1;
    return [
      `M 0 0`,
      `L 0 -50`,
      `A 50 50 0 0 ${sweep} ${xOut} ${yOut}`,
      `L 0 0`,
      `Z`,
    ].join(" ");
  } else {
    return [
      `M 0 0`,
      `L -50 0`,
      `A 50 50 0 0 1 ${xOut} ${yOut}`,
      `L 0 0`,
      `Z`,
    ].join(" ");
  }
}

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
