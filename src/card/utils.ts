import {
  mdiAccountArrowRight,
  mdiArrowAll,
  mdiArrowExpandAll,
  mdiArrowLeftRight,
  mdiArrowOscillating,
  mdiArrowOscillatingOff,
  mdiArrowUpDown,
  mdiBabyCarriage,
  mdiCircleMedium,
  mdiCircleSmall,
  mdiFan,
  mdiFanAuto,
  mdiFanOff,
  mdiFire,
  mdiFormatListBulleted,
  mdiGlasses,
  mdiHome,
  mdiHvac,
  mdiLeaf,
  mdiPower,
  mdiPowerSleep,
  mdiRefreshAuto,
  mdiRocketLaunch,
  mdiSnowflake,
  mdiSofa,
  mdiSpeedometer,
  mdiSpeedometerMedium,
  mdiSpeedometerSlow,
  mdiSunSnowflakeVariant,
  mdiTarget,
  mdiThermometer,
  mdiThermostat,
  mdiThermostatAuto,
  mdiWaterPercent,
  mdiWeatherNight,
  mdiWeatherWindy,
} from "@mdi/js";

import type { HvacMode } from "../dependencies/ha";

import type { Feature } from "./types";
import { FEATURE } from "../constants/constants";

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

export const FEATURE_PAGE_ORDER: readonly Feature[] = [
  FEATURE.CLIMATE_OVERVIEW,
  FEATURE.ADJUST_TEMPERATURE,
  FEATURE.CLIMATE_HVAC_MODES,
  FEATURE.CLIMATE_FAN_MODES,
  FEATURE.CLIMATE_SWING_MODES,
  FEATURE.CLIMATE_PRESET_MODES,
] as const;

export const FEATURE_PAGE_ICON: Record<Feature, string> = {
  [FEATURE.ADJUST_TEMPERATURE]: mdiThermometer,
  [FEATURE.CLIMATE_FAN_MODES]: mdiFan,
  [FEATURE.CLIMATE_HVAC_MODES]: mdiHvac,
  [FEATURE.CLIMATE_OVERVIEW]: mdiGlasses,
  [FEATURE.CLIMATE_PRESET_MODES]: mdiFormatListBulleted,
  [FEATURE.CLIMATE_SWING_MODES]: mdiArrowOscillating,
};

export const FEATURE_PAGE_ICON_COLOR: Record<Feature, string> = {
  [FEATURE.ADJUST_TEMPERATURE]: "var(--orange-color)",
  [FEATURE.CLIMATE_FAN_MODES]: "var(--cyan-color)",
  [FEATURE.CLIMATE_HVAC_MODES]: "var(--amber-color)",
  [FEATURE.CLIMATE_OVERVIEW]: "var(--green-color)",
  [FEATURE.CLIMATE_PRESET_MODES]: "var(--blue-color)",
  [FEATURE.CLIMATE_SWING_MODES]: "var(--orange-color)",
};

//=============================================================================
// FAN MODE
//=============================================================================

const CLIMATE_FAN_MODE_ICONS: Record<string, string> = {
  auto: "mdi:fan-auto",
  diffuse: "mdi:weather-windy",
  focus: "mdi:target",
  high: "mdi:speedometer",
  low: "mdi:speedometer-slow",
  lowmedium: "mdi:speedometer-slow",
  medium: "mdi:speedometer-medium",
  mediumhigh: "mdi:speedometer-medium",
  middle: "mdi:speedometer-medium",
  night: "mdi:weather-night",
  off: "mdi:fan-off",
  on: "mdi:fan",
};

export function getFanModeIcon(swingMode: string): string {
  return CLIMATE_FAN_MODE_ICONS[swingMode.toLowerCase()] ?? "mdi:circle-medium";
}

//=============================================================================
// HVAC MODE
//=============================================================================

const CLIMATE_HVAC_MODE_COLORS: Record<HvacMode, string> = {
  auto: "var(--green-color)",
  cool: "var(--blue-color)",
  dry: "var(--orange-color)",
  fan_only: "var(--cyan-color)",
  heat: "var(--deep-orange-color)",
  heat_cool: "var(--amber-color)",
  off: "var(--disabled-color)",
};

export function getHvacModeColor(hvacMode: HvacMode): string {
  return CLIMATE_HVAC_MODE_COLORS[hvacMode] ?? CLIMATE_HVAC_MODE_COLORS.off;
}

const CLIMATE_HVAC_MODE_ICONS: Record<HvacMode, string> = {
  auto: "mdi:thermostat-auto",
  cool: "mdi:snowflake",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan",
  heat: "mdi:fire",
  heat_cool: "mdi:sun-snowflake-variant",
  off: "mdi:power",
};

export function getHvacModeIcon(hvacMode: HvacMode): string {
  return CLIMATE_HVAC_MODE_ICONS[hvacMode] ?? "mdi:circle-medium";
}

//=============================================================================
// PRESET MODE
//=============================================================================

const CLIMATE_PRESET_MODE_ICONS: Record<string, string> = {
  auto: "mdi:refresh-auto",
  away: "mdi:account-arrow-right",
  baby: "mdi:baby-carriage",
  boost: "mdi:rocket-launch",
  comfort: "mdi:sofa",
  eco: "mdi:leaf",
  home: "mdi:home",
  none: "mdi:circle-medium",
  normal: "mdi:water-percent",
  sleep: "mdi:power-sleep",
};

export function getPresetModeIcon(presetMode: string): string {
  return (
    CLIMATE_PRESET_MODE_ICONS[presetMode.toLowerCase()] ?? "mdi:circle-medium"
  );
}

//=============================================================================
// SWING MODE
//=============================================================================

const CLIMATE_SWING_MODE_ICONS: Record<string, string> = {
  both: "mdi:arrow-all",
  "h+v": "mdi:arrow-all",
  c: "mdi:arrow-expand-all",
  h: "mdi:arrow-left-right",
  horizontal: "mdi:arrow-left-right",
  v: "mdi:arrow-up-down",
  vertical: "mdi:arrow-up-down",
  off: "mdi:arrow-oscillating-off",
  on: "mdi:arrow-oscillating",
};

export function getSwingModeIcon(swingMode: string): string {
  return (
    CLIMATE_SWING_MODE_ICONS[swingMode.toLowerCase()] ?? "mdi:circle-medium"
  );
}

//=============================================================================
// OLD (< 2026.3) DROPDOWN ICONS
//=============================================================================

const CLIMATE_FAN_MODE_DROPDOWN_ICONS: Record<string, string> = {
  auto: mdiFanAuto,
  diffuse: mdiWeatherWindy,
  focus: mdiTarget,
  high: mdiSpeedometer,
  low: mdiSpeedometerSlow,
  medium: mdiSpeedometerMedium,
  middle: mdiSpeedometerMedium,
  night: mdiWeatherNight,
  off: mdiFanOff,
  on: mdiFan,
};

export function getFanModeDropdownIcon(swingMode: string): string {
  return CLIMATE_FAN_MODE_DROPDOWN_ICONS[swingMode.toLowerCase()] ?? mdiFan;
}

const CLIMATE_HVAC_MODE_DROPDOWN_ICONS: Record<HvacMode, string> = {
  auto: mdiThermostatAuto,
  cool: mdiSnowflake,
  dry: mdiWaterPercent,
  fan_only: mdiFan,
  heat: mdiFire,
  heat_cool: mdiSunSnowflakeVariant,
  off: mdiPower,
};

export function getHvacModeDropdownIcon(hvacMode: HvacMode): string {
  return CLIMATE_HVAC_MODE_DROPDOWN_ICONS[hvacMode] ?? mdiThermostat;
}

const CLIMATE_PRESET_MODE_DROPDOWN_ICONS: Record<string, string> = {
  auto: mdiRefreshAuto,
  away: mdiAccountArrowRight,
  baby: mdiBabyCarriage,
  boost: mdiRocketLaunch,
  comfort: mdiSofa,
  eco: mdiLeaf,
  home: mdiHome,
  none: mdiCircleMedium,
  normal: mdiWaterPercent,
  sleep: mdiPowerSleep,
};

export function getPresetModeDropdownIcon(presetMode: string): string {
  return (
    CLIMATE_PRESET_MODE_DROPDOWN_ICONS[presetMode.toLowerCase()] ??
    mdiCircleMedium
  );
}

const CLIMATE_SWING_MODE_DROPDOWN_ICONS = {
  both: mdiArrowAll,
  "h+v": mdiArrowAll,
  c: mdiArrowExpandAll,
  h: mdiArrowLeftRight,
  horizontal: mdiArrowLeftRight,
  v: mdiArrowUpDown,
  vertical: mdiArrowUpDown,
  off: mdiArrowOscillatingOff,
  on: mdiArrowOscillating,
};

export function getSwingModeDropdownIcon(swingMode: string) {
  return (
    CLIMATE_SWING_MODE_DROPDOWN_ICONS[swingMode.toLowerCase()] ?? mdiCircleSmall
  );
}
