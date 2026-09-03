import type { NeedleStyleDefinition } from "../../../card/types/types";

/**
 * Home Assistant style needles: an elongated isoceles triangle with its base
 * towards the centre and its apex on the gauge edge, mirroring the needle of
 * the core `ha-gauge` card.
 *
 * Apex radii are kept identical to `NEEDLES_DEFAULT` so a style switch never
 * moves the tip off the arc; only the body shape differs.
 */
export const NEEDLES_HA: NeedleStyleDefinition = {
  default: {
    main: {
      normal: `
        M -25 -2.5
        L -47.5 0
        L -25 2.5
        z`,
      withInner: `
        M -35.5 -2.5
        L -47.5 0
        L -35.5 2.5
        z`,
      setpoint: `
        M -35.5 -1.5
        L -47.5 0
        L -35.5 1.5
        z`,
      setpointWithLabel: `
        M -38.5 0
        A 1 1 0 1 0 -41.5 0
        A 1 1 0 1 0 -38.5 0
        z`,
    },
    inner: {
      normal: `
        M -20 -2
        L -32 0
        L -20 2
        z`,
      onMain: `
        M -22 -2
        L -34.5 0
        L -22 2
        z`,
      setpoint: `
        M -22 -1.25
        L -31 0
        L -22 1.25
        z`,
      setpointOnMain: `
        M -24 -1.25
        L -33.5 0
        L -24 1.25
        z`,
    },
  },
  thin: {
    main: {
      normal: `
        M -30 -2.5
        L -47.5 0
        L -30 2.5
        z`,
      withInner: `
        M -39 -2.5
        L -47.5 0
        L -39 2.5
        z`,
      setpoint: `
        M -39 -1.5
        L -47.5 0
        L -39 1.5
        z`,
      setpointWithLabel: `
        M -38.5 0
        A 1 1 0 1 0 -41.5 0
        A 1 1 0 1 0 -38.5 0
        z`,
    },
    inner: {
      normal: `
        M -22 -2
        L -33.75 0
        L -22 2
        z`,
      onMain: `
        M -31 -2
        L -43.25 0
        L -31 2
        z`,
      setpoint: `
        M -23 -1.25
        L -32.25 0
        L -23 1.25
        z`,
      setpointOnMain: `
        M -33 -1.25
        L -41.75 0
        L -33 1.25
        z`,
    },
  },
};
