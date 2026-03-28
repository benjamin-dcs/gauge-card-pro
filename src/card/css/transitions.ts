import { css } from "lit";

export const transitionsCSS = css`
  .fast-transition {
    transition: all 0.5s ease 0s;
  }

  .normal-transition {
    transition: all 1s ease 0s;
  }

  .slow-transition {
    transition: all 1.5s ease 0s;
  }
`;
