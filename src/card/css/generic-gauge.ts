import { css } from "lit";

export const genericGaugeCSS = css`
  .elements-group {
    display: block;
  }

  .normal-transition {
    transition: all 1s ease 0s;
  }

  .slow-transition {
    transition: all 1.5s ease 0s;
  }

  .needles {
    position: absolute;
    top: 0;
  }

  .segment {
    fill: none;
    stroke-width: 15;
  }

  .value-text {
    font-size: 50px;
    text-anchor: middle;
    direction: ltr;
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
    height: 100%;
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
`;
