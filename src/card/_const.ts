import { getComputedColor } from "../utils/color/computed-color";

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
export const INNER_GAUGE_NEEDLE = "M -27.5 -1.5 L -32 0 L -27.5 1.5 z";

export function console_info(...data: any[]) {
  console.info(
    `%c{{%c 🌈 Gauge Card Pro 🛠️ %c}}%c`,
    "color:rgb(255, 0, 0); font-weight: bold;",
    "color:rgb(75, 75, 255); font-weight: 700;",
    "color:rgb(255, 0, 0); font-weight: bold;",
    "color:rgb(0, 0, 0); font-weight: 700;",
    "-",
    ...data
  );
}
export function console_error(...data: any[]) {
  console.error(
    `%c{{%c 🌈 Gauge Card Pro 🛠️ %c}}%c`,
    "color:rgb(255, 0, 0); font-weight: bold;",
    "color:rgb(75, 75, 255); font-weight: 700;",
    "color:rgb(255, 0, 0); font-weight: bold;",
    "color:rgb(0, 0, 0); font-weight: 700;",
    "[Error] -",
    ...data
  );
}
