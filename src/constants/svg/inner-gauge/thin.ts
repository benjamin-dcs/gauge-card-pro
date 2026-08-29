import type { InnerGaugeLayoutDefinition } from "../../../card/types/types";

export const INNER_GAUGE_THIN: InnerGaugeLayoutDefinition = {
  needles: {
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
  minMax: {
    indicator: `
      M-29.5 0
      A 29.5 29.5 0 0 0 29.5 0
      L 38 0
      A 38 38 0 0 1 -38 0
      L-38 0
      z`,
  },
  masks: {
    divider: {
      severity: {
        full: ``,
        small: ``,
      },
      static: {
        full: ``,
        small: ``,
      },
    },
    gauge: {
      flat: `
        M 29.5 -0
        A 29.5 29.5 180 0 0 -29.5 0
        L -38 0
        A -38 -38 180 0 1 38 -0
        L 38 -0
        z`,
      full: `
        M -37.698 -4.785
        A 38 38 0 0 1  37.698 -4.785
        A 4.25 4.25 0 0 1 29.265 -3.715
        A 29.5 29.5 0 0 0 -29.265 -3.715
        A 4.25 4.25 0 0 1 -37.698 -4.785
        z`,
      small: `
        M -35.81 0
        A 2.127 2.127 0 0 1 -37.933 -2.253
        A 38 38 0 0 1 37.933 -2.253
        A 2.127 2.127 0 0 1 35.81 0
        L 31.556 0
        A 2.127 2.127 0 0 1 29.433 -1.984
        A 29.5 29.5 0 0 0 -29.433 -1.984
        A 2.127 2.127 0 0 1 -31.556 0
        L -35.81 0
        z`,
    },
  },
};
