import { css } from "lit";

export const gaugeMainCSS = css`
  .main-background {
    fill: none;
    stroke-width: 15;
  }

  .main-severity-gauge {
    fill: none;
    stroke-width: 15;
  }

  .main-marker {
    fill: var(--main-severity-marker, var(--card-background-color));
  }

  /* Labels are only implemented for main-gauge */
  .label-group {
    transition: all 1s ease 0s;
  }

  .label-pill {
    fill: color-mix(in srgb, var(--card-background-color) 85%, transparent);
    stroke: var(--divider-color);
    stroke-width: 0.5px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
  }

  .label-text {
    font-size: 5px;
    font-weight: 600;
    direction: ltr;
    dominant-baseline: middle;
  }
`;
