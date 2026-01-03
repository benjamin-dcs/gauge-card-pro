import { css } from "lit";

export const gaugeCSS = css`
  .elements-group {
    display: block;
  }
  .main-background {
    fill: none;
    stroke-width: 15;
  }
  .min-max-indicator {
    transition: all 1s ease 0s;
    stroke: none;
  }
  .inner-gauge {
    position: absolute;
    top: 0;
  }
  .value {
    fill: none;
    stroke-width: 15;
    transition: all 1s ease 0s;
  }
  .inner-gradient-bg-bg {
    fill: none;
    stroke-width: 5;
    stroke: #ffffff;
  }
  .inner-value {
    fill: none;
    stroke-width: 5;
  }
  .inner-value-stroke {
    fill: none;
    stroke-width: 6;
    stroke: var(--card-background-color);
  }
  .inner-transition {
    fill: none;
    stroke-width: 6;
    stroke: var(--card-background-color);
    transition: all 1.5s ease 0s;
  }
  .needles {
    position: absolute;
    top: 0;
  }
  .needle {
    transition: all 1s ease 0s;
  }
  .segment {
    fill: none;
    stroke-width: 15;
  }
  .inner-segment {
    fill: none;
    stroke-width: 5;
  }
  .primary-value-text {
    position: absolute;

    max-width: 55%;
    left: 50%;
    bottom: -6%;
    transform: translate(-50%, 0%);
  }
  .primary-value-icon {
    position: absolute;
    height: 40%;
    width: 100%;
    bottom: -3%;
  }
  .primary-value-state-icon {
    --mdc-icon-size: 19%;
  }
  .secondary-value-text {
    position: absolute;
    max-height: 22%;
    max-width: 30%;
    left: 50%;
    bottom: 28%;
    transform: translate(-50%, 0%);
  }
  .secondary-value-icon {
    position: absolute;
    height: 22%;
    width: 100%;
    bottom: 32%;
  }
  .secondary-value-state-icon {
    --mdc-icon-size: 10%;
  }
  .value-text {
    font-size: 50px;
    text-anchor: middle;
    direction: ltr;
  }

  .icon {
    position: absolute;
    bottom: 0%;
    text-align: center;
    line-height: 0;
  }

  .icon-container {
    position: absolute;
    height: 17%;
    width: 100%;
    top: 0%;
  }

  .icon-inner-container {
    display: flex;
    height: 100%;
    width: 10%;
    justify-content: center;
    --mdc-icon-size: 100%;
  }

  .icon-label-text {
    position: absolute;
    max-height: 65%;
    width: 200%;
    top: 100%;
    min-height: 10px;
  }

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
