import {
  mdiArrowAll,
  mdiArrowExpandAll,
  mdiArrowLeftRight,
  mdiArrowOscillating,
  mdiArrowOscillatingOff,
  mdiArrowUpDown,
  mdiCircleSmall,
  mdiFan,
  mdiGlasses,
  mdiHvac,
  mdiThermometer,
} from "@mdi/js";

import { HvacMode } from "../dependencies/ha";

export type FeaturePage =
  | "adjust-temperature"
  | "climate-fan-modes"
  | "climate-hvac-modes"
  | "climate-swing-modes"
  | "climate-overview";

export const FEATURE_PAGE_ORDER: readonly FeaturePage[] = [
  "climate-overview",
  "adjust-temperature",
  "climate-hvac-modes",
  "climate-fan-modes",
  "climate-swing-modes",
] as const;

export const FEATURE_PAGE_ICON: Record<FeaturePage, string> = {
  "adjust-temperature": mdiThermometer,
  "climate-fan-modes": mdiFan,
  "climate-hvac-modes": mdiHvac,
  "climate-overview": mdiGlasses,
  "climate-swing-modes": mdiArrowOscillating,
};

export const FEATURE_PAGE_ICON_COLOR: Record<FeaturePage, string> = {
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
  return CLIMATE_FAN_MODE_ICONS[swingMode.toLowerCase()] ?? "mdi:thermostat";
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

const CLIMATE_HVAC_MODE_ICONS: Record<HvacMode, string> = {
  auto: "mdi:thermostat-auto",
  cool: "mdi:snowflake",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan",
  heat: "mdi:fire",
  heat_cool: "mdi:sun-snowflake-variant",
  off: "mdi:power",
};

export function getHvacModeColor(hvacMode: HvacMode): string {
  return CLIMATE_HVAC_MODE_COLORS[hvacMode] ?? CLIMATE_HVAC_MODE_COLORS.off;
}

export function getHvacModeIcon(hvacMode: HvacMode): string {
  return CLIMATE_HVAC_MODE_ICONS[hvacMode] ?? "mdi:thermostat";
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
