import { css } from "lit";

export const cardCSS = css`
  ha-card {
    height: 100%;
    overflow: hidden;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-sizing: border-box;
    --icon-size: 36px;
    --spacing: 10px;
    --control-border-radius: 12px;
    --control-height: 32px;
    --control-button-ratio: 1;
    --control-icon-size: 0.5em;
    --control-spacing: 12px;
  }

  ha-card.action {
    cursor: pointer;
  }

  ha-card:focus {
    outline: none;
  }

  gauge-card-pro-gauge {
    width: 100%;
    max-width: 250px;
  }

  .title {
    text-align: center;
    line-height: initial;
    width: 100%;
  }

  .primary-title {
    margin-top: 8px;
  }

  .action-row {
    display: grid;
    align-items: center;
    margin-top: 8px;
    width: 100%;
  }

  .button {
    display: flex;
  }

  .right-button {
    justify-self: end;
  }
`;
