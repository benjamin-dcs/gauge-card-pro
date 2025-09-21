import { getComputedColor } from "../utils/color/computed-color";
import { version } from "../../package.json";

export const VERSION = version;

export const LOGGING = {
  /**
   * Current log level
   * 0 = ERROR, 1 = WARN, 2 = INFO, 3 = DEBUG
   */
  CURRENT_LOG_LEVEL: 3,

  /** Standard prefix for log messages */
  PREFIX: "🌈 Gauge Card Pro",
};

export const ERROR_COLOR = getComputedColor("var(--error-color)") || "#db4437";
export const SUCCESS_COLOR =
  getComputedColor("var(--success-color") || "#43a047";
export const WARNING_COLOR =
  getComputedColor("var(--warning-color") || "#ffa600";
export const INFO_COLOR = getComputedColor("var(--info-color)") || "#039be5";

// config defaults
export const DEFAULT_GRADIENT_RESOLUTION = "medium";
export const DEFUALT_ICON_COLOR = "var(--primary-text-color)";
export const DEFAULT_INNER_MODE = "severity";
export const DEFAULT_INNER_VALUE = "{{ states(entity2) | float(0) }}";
export const DEFAULT_MIN = 0;
export const DEFAULT_MIN_INDICATOR_COLOR = "rgb(255, 255, 255)";
export const DEFAULT_MIN_MAX_INDICATOR_OPACITY = 0.8;
export const DEFAULT_MAX = 100;
export const DEFAULT_MAX_INDICATOR_COLOR = "rgb(255, 255, 255)";
export const DEFAULT_NEEDLE_COLOR = "var(--primary-text-color)";
export const DEFAULT_SETPOINT_NEELDLE_COLOR = "var(--error-color)";
export const DEFAULT_SEVERITY_COLOR = INFO_COLOR;
export const DEFAULT_TITLE_COLOR = "var(--primary-text-color)";
export const DEFAULT_TITLE_FONT_SIZE_PRIMARY = "15px";
export const DEFAULT_TITLE_FONT_SIZE_SECONDARY = "14px";
export const DEFUALT_VALUE = "{{ states(entity) | float(0) }}";
export const DEFAULT_VALUE_TEXT_COLOR = "var(--primary-text-color)";
export const DEFAULT_VALUE_TEXT_PRIMARY =
  "{{ states(entity) | float(0) | round(1) }}";

export const GRADIENT_RESOLUTION_MAP = {
  very_low: {
    segments: 25,
    samples: 1,
  },
  low: {
    segments: 50,
    samples: 1,
  },
  medium: {
    segments: 100,
    samples: 1,
  },
  high: {
    segments: 200,
    samples: 1,
  },
};

export const MAIN_GAUGE_NEEDLE = "M -28 0 L -27.5 -2 L -47.5 0 L -27.5 2.25 z";
export const MAIN_GAUGE_NEEDLE_WITH_INNER = "M -49 -2 L -40 0 L -49 2 z";
export const MAIN_GAUGE_MIN_MAX_INDICATOR =
  "M-32.5 0A32.5 32.5 0 0 0 32.5 0L47.5 0A-47.5-47.5 0 01-47.5 0L-47.5 0 z";
export const MAIN_GAUGE_SETPOINT_NEEDLE = "M -49 -2 L -40 0 L -49 0 z";

export const INNER_GAUGE_NEEDLE = "M -27.5 -1.5 L -32 0 L -27.5 1.5 z";
export const INNER_GAUGE_MIN_MAX_INDICATOR =
  "M-29.5 0A29.5 29.5 0 0 0 29.5 0L34.5 0A-34.5-34.5 0 01-34.5 0L-34.5 0 z";
export const INNER_GAUGE_SETPOINT_NEEDLE = "M -27.5 -1.5 L -32 0 L -27.5 0 z";
export const INNER_GAUGE_ON_MAIN_NEEDLE = "M -30 -1.5 L -34.5 0 L -30 1.5 z";
export const INNER_GAUGE_SETPOINT_ON_MAIN_NEEDLE =
  "M -30 -1.5 L -34.5 0 L -30 0 z";
