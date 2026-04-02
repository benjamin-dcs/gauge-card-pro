import {
  mdiThermometer,
  mdiFan,
  mdiHvac,
  mdiGlasses,
  mdiFormatListBulleted,
  mdiArrowOscillating,
  mdiFanAuto,
  mdiFanOff,
  mdiSpeedometer,
  mdiSpeedometerMedium,
  mdiSpeedometerSlow,
  mdiTarget,
  mdiWeatherNight,
  mdiWeatherWindy,
  mdiFire,
  mdiPower,
  mdiSnowflake,
  mdiSunSnowflakeVariant,
  mdiThermostatAuto,
  mdiWaterPercent,
  mdiAccountArrowRight,
  mdiBabyCarriage,
  mdiCircleMedium,
  mdiHome,
  mdiLeaf,
  mdiPowerSleep,
  mdiRefreshAuto,
  mdiRocketLaunch,
  mdiSofa,
  mdiArrowAll,
  mdiArrowExpandAll,
  mdiArrowLeftRight,
  mdiArrowOscillatingOff,
  mdiArrowUpDown,
} from "@mdi/js";
import type { Feature } from "../card/types/types";
import type { HvacMode } from "../dependencies/ha";

interface IconEntry {
  icon: string; // "mdi:icon-name" format for ha-icon
  path: string; // MDI SVG path for ha-svg-icon / dropdown
}

export const FEATURE = {
  ADJUST_TEMPERATURE: "adjust-temperature",
  CLIMATE_FAN_MODES: "climate-fan-modes",
  CLIMATE_HVAC_MODES: "climate-hvac-modes",
  CLIMATE_SWING_MODES: "climate-swing-modes",
  CLIMATE_OVERVIEW: "climate-overview",
  CLIMATE_PRESET_MODES: "climate-preset-modes",
} as const;

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

export const CLIMATE_FAN_MODE_ICON_MAP: Record<string, IconEntry> = {
  auto: { icon: "mdi:fan-auto", path: mdiFanAuto },
  diffuse: { icon: "mdi:weather-windy", path: mdiWeatherWindy },
  focus: { icon: "mdi:target", path: mdiTarget },
  high: { icon: "mdi:speedometer", path: mdiSpeedometer },
  low: { icon: "mdi:speedometer-slow", path: mdiSpeedometerSlow },
  lowmedium: { icon: "mdi:speedometer-slow", path: mdiSpeedometerSlow },
  medium: { icon: "mdi:speedometer-medium", path: mdiSpeedometerMedium },
  mediumhigh: { icon: "mdi:speedometer-medium", path: mdiSpeedometerMedium },
  middle: { icon: "mdi:speedometer-medium", path: mdiSpeedometerMedium },
  night: { icon: "mdi:weather-night", path: mdiWeatherNight },
  off: { icon: "mdi:fan-off", path: mdiFanOff },
  on: { icon: "mdi:fan", path: mdiFan },
};

//=============================================================================
// HVAC MODE
//=============================================================================

export const CLIMATE_HVAC_MODE_COLORS: Record<HvacMode, string> = {
  auto: "var(--green-color)",
  cool: "var(--blue-color)",
  dry: "var(--orange-color)",
  fan_only: "var(--cyan-color)",
  heat: "var(--deep-orange-color)",
  heat_cool: "var(--amber-color)",
  off: "var(--disabled-color)",
};

export const CLIMATE_HVAC_MODE_ICON_MAP: Record<HvacMode, IconEntry> = {
  auto: { icon: "mdi:thermostat-auto", path: mdiThermostatAuto },
  cool: { icon: "mdi:snowflake", path: mdiSnowflake },
  dry: { icon: "mdi:water-percent", path: mdiWaterPercent },
  fan_only: { icon: "mdi:fan", path: mdiFan },
  heat: { icon: "mdi:fire", path: mdiFire },
  heat_cool: {
    icon: "mdi:sun-snowflake-variant",
    path: mdiSunSnowflakeVariant,
  },
  off: { icon: "mdi:power", path: mdiPower },
};

//=============================================================================
// PRESET MODE
//=============================================================================

export const CLIMATE_PRESET_MODE_ICON_MAP: Record<string, IconEntry> = {
  auto: { icon: "mdi:refresh-auto", path: mdiRefreshAuto },
  away: { icon: "mdi:account-arrow-right", path: mdiAccountArrowRight },
  baby: { icon: "mdi:baby-carriage", path: mdiBabyCarriage },
  boost: { icon: "mdi:rocket-launch", path: mdiRocketLaunch },
  comfort: { icon: "mdi:sofa", path: mdiSofa },
  eco: { icon: "mdi:leaf", path: mdiLeaf },
  home: { icon: "mdi:home", path: mdiHome },
  none: { icon: "mdi:circle-medium", path: mdiCircleMedium },
  normal: { icon: "mdi:water-percent", path: mdiWaterPercent },
  sleep: { icon: "mdi:power-sleep", path: mdiPowerSleep },
};

//=============================================================================
// SWING MODE
//=============================================================================

export const CLIMATE_SWING_MODE_ICON_MAP: Record<string, IconEntry> = {
  both: { icon: "mdi:arrow-all", path: mdiArrowAll },
  "h+v": { icon: "mdi:arrow-all", path: mdiArrowAll },
  c: { icon: "mdi:arrow-expand-all", path: mdiArrowExpandAll },
  h: { icon: "mdi:arrow-left-right", path: mdiArrowLeftRight },
  horizontal: { icon: "mdi:arrow-left-right", path: mdiArrowLeftRight },
  v: { icon: "mdi:arrow-up-down", path: mdiArrowUpDown },
  vertical: { icon: "mdi:arrow-up-down", path: mdiArrowUpDown },
  off: { icon: "mdi:arrow-oscillating-off", path: mdiArrowOscillatingOff },
  on: { icon: "mdi:arrow-oscillating", path: mdiArrowOscillating },
};
