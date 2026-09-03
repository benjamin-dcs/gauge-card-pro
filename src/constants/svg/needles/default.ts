import type { NeedleStyleDefinition } from "../../../card/types/types";

export const NEEDLES_DEFAULT: NeedleStyleDefinition = {
  default: {
    main: {
      normal: `
        M -28 0
        L -27.5 -2
        L -47.5 0
        L -27.5 2.25
        z`,
      withInner: `
        M -49 -2
        L -40 0
        L -49 2
        z`,
      setpoint: `
        M -49 -1.25
        L -42 0
        L -49 1.25
        z`,
      setpointWithLabel: `
        M -38.5 0
        A 1 1 0 1 0 -41.5 0
        A 1 1 0 1 0 -38.5 0
        z`,
    },
    inner: {
      normal: `
        M -27.5 -2
        L -32 0
        L -27.5 2
        z`,
      onMain: `
        M -30 -2
        L -34.5 0
        L -30 2
        z`,
      setpoint: `
        M -27.5 -1.25
        L -31 0
        L -27.5 1.25
        z`,
      setpointOnMain: `
        M -30 -1.25
        L -33.5 0
        L -30 1.25
        z`,
    },
  },
  thin: {
    main: {
      normal: `
        M -34.5 0
        L -34 -2
        L -47.5 0
        L -34 2.25
        z`,
      withInner: `
        M -49 -2
        L -43.25 0
        L -49 2
        z`,
      setpoint: `
        M -49 -1.25
        L -44.75 0
        L -49 1.25
        z`,
      setpointWithLabel: `
        M -38.5 0
        A 1 1 0 1 0 -41.5 0
        A 1 1 0 1 0 -38.5 0
        z`,
    },
    inner: {
      normal: `
        M -28 -2
        L -33.75 0
        L -28 2
        z`,
      onMain: `
        M -37.5 -2
        L -43.25 0
        L -37.5 2
        z`,
      setpoint: `
        M -28 -1.25
        L -32.25 0
        L -28 1.25
        z`,
      setpointOnMain: `
        M -37.5 -1.25
        L -41.75 0
        L -37.5 1.25
        z`,
    },
  },
};
