import { css } from "lit";

export const dropdownCSS = css`
  ha-control-select-menu {
    --feature-height: 30px;
    --control-select-menu-background-color: rgba(
      var(--rgb-primary-text-color),
      0.05
    );
    --control-select-menu-background-opacity: 1;
    --control-select-menu-height: var(--feature-height);
    --control-select-menu-border-radius: var(
      --ha-card-features-border-radius,
      var(--ha-border-radius-lg)
    );
    --control-select-menu-focus-color: var(--feature-color);
    --ha-ripple-color: rgba(var(--rgb-primary-text-color), 0.05);
    box-sizing: border-box;
    border: 1px solid var(--divider-color);
    border-radius: var(
      --ha-card-features-border-radius,
      var(--ha-border-radius-lg)
    );
    line-height: var(--ha-line-height-condensed);
    display: block;
    width: 100%;
  }
`;
