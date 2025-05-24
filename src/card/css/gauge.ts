import { css } from "lit";

export const gaugeCSS = css`
  :host {
    position: relative;
  }
  .gauge {
    display: block;
  }
  .dial {
    fill: none;
    stroke: var(--primary-background-color);
    stroke-width: 15;
  }
  .inner-gauge {
    position: absolute;
    top: 0;
  }
  .value {
    fill: none;
    stroke-width: 15;
    stroke: var(--gauge-color);
    transition: all 1s ease 0s;
  }
  .inner-value {
    fill: none;
    stroke-width: 5;
    stroke: var(--inner-gauge-color);
    transition: all 1.5s ease 0s;
  }
  .inner-value-stroke {
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
    max-height: 40%;
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
    max-width: 35%;
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
  .value-state-icon {
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
    margin-left: auto;
    margin-right: 0%;
  }

  .icon-label {
    position: absolute;
    top: 105%;
  }
`;
