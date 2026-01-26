import { css } from "lit";

export const gaugeIconCSS = css`
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
