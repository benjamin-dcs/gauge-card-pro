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
`;
