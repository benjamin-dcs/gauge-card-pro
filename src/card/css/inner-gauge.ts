import { css } from "lit";

export const innerGaugeCSS = css`
  .inner-gauge {
    position: absolute;
    top: 0;
  }

  .inner-gradient-bg-bg {
    fill: none;
    stroke-width: 5;
    stroke: #ffffff;
  }

  .inner-severity-gauge {
    fill: none;
    stroke-width: 5;
  }

  .inner-marker {
    fill: var(--inner-severity-marker, var(--card-background-color));
  }

  .inner-gauge-stroke {
    fill: none;
    stroke-width: 6;
    stroke: var(--card-background-color);
  }

  .inner-segment {
    fill: none;
    stroke-width: 5;
  }
`;
