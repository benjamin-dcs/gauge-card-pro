import {
  mdiArrowAll,
  mdiArrowExpandAll,
  mdiArrowLeftRight,
  mdiArrowOscillating,
  mdiArrowOscillatingOff,
  mdiArrowUpDown,
  mdiCircleSmall,
  mdiFan,
  mdiFanAuto,
  mdiFanOff,
  mdiFire,
  mdiGlasses,
  mdiHvac,
  mdiPower,
  mdiSnowflake,
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

import { HvacMode } from "../dependencies/ha";

import { Feature } from "./types";

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
  "climate-overview",
  "adjust-temperature",
  "climate-hvac-modes",
  "climate-fan-modes",
  "climate-swing-modes",
] as const;

export const FEATURE_PAGE_ICON: Record<Feature, string> = {
  "adjust-temperature": mdiThermometer,
  "climate-fan-modes": mdiFan,
  "climate-hvac-modes": mdiHvac,
  "climate-overview": mdiGlasses,
  "climate-swing-modes": mdiArrowOscillating,
};

export const FEATURE_PAGE_ICON_COLOR: Record<Feature, string> = {
  "adjust-temperature": "var(--orange-color)",
  "climate-fan-modes": "var(--cyan-color)",
  "climate-hvac-modes": "var(--amber-color)",
  "climate-overview": "var(--green-color)",
  "climate-swing-modes": "var(--orange-color)",
};

//-----------------------------------------------------------------------------
// FAN MODE
//-----------------------------------------------------------------------------

const CLIMATE_FAN_MODE_ICONS: Record<string, string> = {
  auto: "mdi:fan-auto",
  diffuse: "mdi:weather-windy",
  focus: "mdi:target",
  high: "mdi:speedometer",
  low: "mdi:speedometer-slow",
  medium: "mdi:speedometer-medium",
  middle: "mdi:speedometer-medium",
  night: "mdi:weather-night",
  off: "mdi:fan-off",
  on: "mdi:fan",
};

export function getFanModeIcon(swingMode: string): string {
  return CLIMATE_FAN_MODE_ICONS[swingMode.toLowerCase()] ?? "mdi:fan";
}

const CLIMATE_FAN_MODE_DROPDOWN_ICONS: Record<string, string> = {
  auto: mdiFanAuto,
  diffuse: mdiWeatherWindy,
  focus: mdiTarget,
  mdiSpeedometer,
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

//-----------------------------------------------------------------------------
// HVAC MODE
//-----------------------------------------------------------------------------

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
  return CLIMATE_HVAC_MODE_ICONS[hvacMode] ?? "mdi:thermostat";
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

//-----------------------------------------------------------------------------
// SWING MODE
//-----------------------------------------------------------------------------

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

export function getSwingModeIcon(swingMode: string): string {
  return (
    CLIMATE_SWING_MODE_ICONS[swingMode.toLowerCase()] ?? "mdi:circle-small"
  );
}

export function getSwingModeDropdownIcon(swingMode: string) {
  return (
    CLIMATE_SWING_MODE_DROPDOWN_ICONS[swingMode.toLowerCase()] ?? mdiCircleSmall
  );
}
