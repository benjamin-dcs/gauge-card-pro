import type { NeedleStrokeStyleDefinition } from "../../../card/types/types";

const COLOR = "var(--card-background-color)";

export const NEEDLE_STROKES_HA: NeedleStrokeStyleDefinition = {
  default: {
    main: {
      normal: { color: COLOR, width: "0.8" },
      withInner: { color: COLOR, width: "0.8" },
      setpoint: undefined,
      setpointWithLabel: undefined,
    },
    inner: {
      normal: { color: COLOR, width: "0.8" },
      onMain: { color: COLOR, width: "0.8" },
      setpoint: undefined,
      setpointOnMain: undefined,
    },
  },
  equal: {
    main: {
      normal: { color: COLOR, width: "0.8" },
      withInner: { color: COLOR, width: "0.8" },
      setpoint: undefined,
      setpointWithLabel: undefined,
    },
    inner: {
      normal: { color: COLOR, width: "0.8" },
      onMain: { color: COLOR, width: "0.8" },
      setpoint: undefined,
      setpointOnMain: undefined,
    },
  },
};
