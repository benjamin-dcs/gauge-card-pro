import { css } from "lit";

export const gaugeCSS = css`
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
`;
