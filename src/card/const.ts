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

export const CARD_NAME = "gauge-card-pro";
export const EDITOR_NAME = `${CARD_NAME}-editor`;

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
export const DEFAULT_MAX = 100;
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
export const MAIN_GAUGE_SETPOINT_NEEDLE = "M -49 -1 L -42 0 L -49 1 z";
export const INNER_GAUGE_NEEDLE = "M -27.5 -2.5 L -33 0 L -27.5 2.5 z";
export const INNER_GAUGE_ON_MAIN_NEEDLE = "M -30 -1.5 L -34.5 0 L -30 1.5 z";
export const INNER_GAUGE_SETPOINT_NEEDLE = "M -27.5 -1.5 L -32 0 L -27.5 1.5 z";
export const INNER_GAUGE_SETPOINT_ON_MAIN_NEEDLE =
  "M -30 -0.5 L -32.5 0 L -30 0.5 z";
