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

  .background {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: var(--ha-card-border-radius, 12px);
    margin: calc(-1 * var(--ha-card-border-width, 1px));
    overflow: hidden;
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
