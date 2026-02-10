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

  .card-header,
  :host ::slotted(.card-header) {
    color: var(--ha-card-header-color, var(--primary-text-color));
    font-family: var(--ha-card-header-font-family, inherit);
    font-size: var(--ha-card-header-font-size, var(--ha-font-size-2xl));
    letter-spacing: -0.012em;
    line-height: var(--ha-line-height-expanded);
    display: block;
    margin-block-start: 0;
    margin-block-end: 0;
    font-weight: var(--ha-font-weight-normal);
    margin: 0;
    padding: 0;
    width: 100%;
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

  .controls-row {
    display: grid;
    align-items: center;
    margin-top: 8px;
    width: 100%;
    min-width: 0;
    max-width: 250px;
  }
`;
