export const CARD_NAME = 'gauge-card-pro';
// export const CARD_NAME = "template-gauge-card";
export const EDITOR_NAME = `${CARD_NAME}-editor`;

export const DEFAULT_VALUE_TEXT_COLOR = 'var(--primary-text-color)';
export const DEFAULT_NAME_COLOR = 'var(--primary-text-color)';
export const DEFAULT_MIN = 0;
export const DEFAULT_MAX = 100;
export const DEFAULT_NEEDLE_COLOR = 'var(--primary-text-color)';
export const DEFAULT_GRADIENT_RESOLUTION = 'medium';
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

export const MAIN_GAUGE_RADIUS = 40;
export const MAIN_GAUGE_RADIUS_WITH_INNER = 40;

export const INNER_GAUGE_RADIUS = 32;

export const MAIN_GAUGE_STROKE_WIDTH = 15;
export const MAIN_GAUGE_STROKE_WIDTH_WITH_INNER = 15;

export const GRADIENT_WIDTH = 13;
export const GRADIENT_WIDTH_WITH_INNER = 13;

export const ERROR_COLOR =
  window.getComputedStyle(document.body).getPropertyValue('--error-color') ||
  '#db4437';
export const SUCCESS_COLOR =
  window.getComputedStyle(document.body).getPropertyValue('--success-color') ||
  '#43a047';
export const WARNING_COLOR =
  window.getComputedStyle(document.body).getPropertyValue('--warning-color') ||
  '#ffa600';
export const INFO_COLOR =
  window.getComputedStyle(document.body).getPropertyValue('--info-color') ||
  '#039be5';

export const SEVERITY_MAP = {
  red: ERROR_COLOR,
  green: SUCCESS_COLOR,
  yellow: WARNING_COLOR,
  normal: INFO_COLOR,
};
