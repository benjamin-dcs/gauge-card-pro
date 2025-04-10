export const CARD_NAME = "gauge-card-pro";
// export const CARD_NAME = "template-gauge-card";
export const EDITOR_NAME = `${CARD_NAME}-editor`;

export const DEFAULT_MIN = 0;
export const DEFAULT_MAX = 100;
export const DEFAULT_GRADIENT_RESOLUTION = "medium";
export const GRADIENT_RESOLUTION_MAP = {
  low: {
    segments: 25,
    samples: 2,
  },
  medium: {
    segments: 50,
    samples: 5,
  },
  high: {
    segments: 100,
    samples: 10,
  },
};

export const ERROR_COLOR =
  window.getComputedStyle(document.body).getPropertyValue("--error-color") ||
  "#db4437";
export const SUCCESS_COLOR =
  window.getComputedStyle(document.body).getPropertyValue("--success-color") ||
  "#43a047";
export const WARNING_COLOR =
  window.getComputedStyle(document.body).getPropertyValue("--warning-color") ||
  "#ffa600";
export const INFO_COLOR =
  window.getComputedStyle(document.body).getPropertyValue("--info-color") ||
  "#039be5";

export const SEVERITY_MAP = {
  red: ERROR_COLOR,
  green: SUCCESS_COLOR,
  yellow: WARNING_COLOR,
  normal: INFO_COLOR,
};
