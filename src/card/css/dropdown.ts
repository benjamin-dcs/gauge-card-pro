import { css } from "lit";

export const dropdownCSS = css`
  ha-control-select-menu {
    display: block;
    width: 100%;
    line-height: var(--ha-line-height-condensed);
    --feature-height: 30px;
    --control-select-menu-height: var(--feature-height);
    --control-select-menu-border-radius: 7.5px;
    border-radius: 7.5px;
    box-sizing: border-box;
    border: 1px solid var(--divider-color);
  }
`;
