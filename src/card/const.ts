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
export const DEFAULT_MIN_INDICATOR_LABEL_COLOR = "#111111";
export const DEFAULT_MIN_MAX_INDICATOR_OPACITY = 0.8;
export const DEFAULT_MAX = 100;
export const DEFAULT_MAX_INDICATOR_COLOR = "rgb(255, 255, 255)";
export const DEFAULT_MAX_INDICATOR_LABEL_COLOR = "#111111";
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
export const MAIN_GAUGE_SETPOINT_NEEDLE = "M -49 -1.25 L -42 0 L -49 1.25 z";
export const MAIN_GAUGE_SETPOINT_NEEDLE_WITH_LABEL =
  "M -38.5 0 A 1 1 0 1 0 -41.5 0 A 1 1 0 1 0 -38.5 0 z";

export const INNER_GAUGE_NEEDLE = "M -27.5 -2 L -32 0 L -27.5 2 z";
export const INNER_GAUGE_MIN_MAX_INDICATOR =
  "M-29.5 0A29.5 29.5 0 0 0 29.5 0L34.5 0A-34.5-34.5 0 01-34.5 0L-34.5 0 z";
export const INNER_GAUGE_SETPOINT_NEEDLE =
  "M -27.5 -1.25 L -31 0 L -27.5 1.25 z";
export const INNER_GAUGE_ON_MAIN_NEEDLE = "M -30 -2 L -34.5 0 L -30 2 z";
export const INNER_GAUGE_SETPOINT_ON_MAIN_NEEDLE =
  "M -30 -1.25 L -33.5 0 L -30 1.25 z";

export const MAIN_GAUGE_MASK_FULL_LL =
  "M -47.6 0 L -40 0 A 7.5 7.5 0 0 1 -46.658 -8.906 L -47.6 -8.906 L -47.6 0 z";
export const MAIN_GAUGE_MASK_FULL_LR =
  "M -40 0 L -31.925 0 L -31.925 -6.094 A 7.5 7.5 0 0 1 -40 0 z";
export const MAIN_GAUGE_MASK_FULL_RL =
  "M 40 0 L 31.925 0 L 31.925 -6.094 A 7.5 7.5 0 0 0 40 0 z";
export const MAIN_GAUGE_MASK_FULL_RR =
  "M 47.6 0 L 40 0 A 7.5 7.5 0 0 0 46.658 -8.906 L 47.6 -8.906 L 47.6 0 z";

export const MAIN_GAUGE_MASK_SMALL_LL =
  "M -43.58 0 L -47.6 0 L -47.6 -4.081 L -47.324 -4.081 A 3.758 3.758 0 0 0 -43.58 0 z ";
export const MAIN_GAUGE_MASK_SMALL_LR =
  "M -32.325 0 L -32.325 -3.369 A 3.758 3.758 0 0 1 -36.063 0 L -32.325 0 z ";
export const MAIN_GAUGE_MASK_SMALL_RL =
  "M 32.325 0 L 32.325 -3.369 A 3.758 3.758 0 0 0 36.063 0 L 32.325 0 z ";
export const MAIN_GAUGE_MASK_SMALL_RR =
  "M 43.58 0 L 47.6 0 L 47.6 -4.081 L 47.324 -4.081 A 3.758 3.758 0 0 1 43.58 0 z";

export const INNER_GAUGE_MASK_FULL_LL =
  "M -34.6 0 L -32 0 A 2.5 2.5 0 0 1 -34.402 -2.594 L -34.6 -2.594 L -34.6 0 z";
export const INNER_GAUGE_MASK_FULL_LR =
  "M -32 0 L -29.41 0 L -29.41 -2.305 A 2.5 2.5 0 0 1 -32 0 z";
export const INNER_GAUGE_MASK_FULL_RL =
  "M 32 0 L 29.41 0 L 29.41 -2.305 A 2.5 2.5 0 0 0 32 0 z";
export const INNER_GAUGE_MASK_FULL_RR =
  "M 34.6 0 L 32 0 A 2.5 2.5 0 0 0 34.402 -2.594 L 34.6 -2.594 L 34.6 0 z";

export const INNER_GAUGE_STROKE_MASK_FULL_L =
  "M -35.6 0 L -34.352 0 A 3.5 3.5 0 0 1 -35.391 -2.773 L -35.6 -2.773 L -35.6 0 z";
export const INNER_GAUGE_STROKE_MASK_FULL_R =
  "M 35.6 0 L 34.352 0 A 3.5 3.5 0 0 0 35.391 -2.773 L 35.6 -2.773 L 35.6 0 z";

export const INNER_GAUGE_MASK_SMALL_LL =
  "M -33.226 0 L -34.7 0 L -34.7 -1.298 L -34.476 -1.298 A 1.25 1.25 0 0 0 -33.226 0 z";
export const INNER_GAUGE_MASK_SMALL_LR =
  "M -29.0 0 L -29.476 -1.2 A 1.25 1.25 0 0 1 -30.725 0 L -29.476 0 z";
export const INNER_GAUGE_MASK_SMALL_RL =
  "M 29.0 0 L 29.476 -1.2 A 1.25 1.25 0 0 0 30.725 0 L 29.476 0 z";
export const INNER_GAUGE_MASK_SMALL_RR =
  "M 33.226 0 L 34.7 0 L 34.7 -1.298 L 34.476 -1.298 A 1.25 1.25 0 0 1 33.226 0 z";

export const INNER_GAUGE_STROKE_MASK_SMALL_L =
  "M -35.6 0 L -35.097 0 A 2.25 2.25 0 0 1 -35.475 -1.335 L -35.6 -1.335 L -35.6 0 z";
export const INNER_GAUGE_STROKE_MASK_SMALL_R =
  "M 35.6 0 L 35.097 0 A 2.25 2.25 0 0 0 35.475 -1.335 L 35.6 -1.335 L 35.6 0 z";
