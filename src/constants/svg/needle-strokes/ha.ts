import type {
  NeedleStroke,
  NeedleStrokeStyleDefinition,
} from "../../../card/types/types";

// Widths are in the user-unit space of the `#pointers` viewBox ("-50 -50 100 50"),
// so they are unitless and scale with the card.
const COLOR = "var(--card-background-color)";

const SETPOINT: NeedleStroke = {
  color: COLOR,
  width: "0.4",
  linejoin: "round",
};
const SETPOINT_SMALL: NeedleStroke = {
  color: COLOR,
  width: "0.3",
  linejoin: "round",
};

export const NEEDLE_STROKES_HA: NeedleStrokeStyleDefinition = {
  default: {
    main: {
      normal: { color: COLOR, width: "0.8" },
      withInner: { color: COLOR, width: "0.8" },
      setpoint: SETPOINT,
      setpointWithLabel: SETPOINT_SMALL,
    },
    inner: {
      normal: { color: COLOR, width: "0.8" },
      onMain: { color: COLOR, width: "0.8" },
      setpoint: SETPOINT_SMALL,
      setpointOnMain: SETPOINT_SMALL,
    },
  },
  thin: {
    // Thin needles are lighter, so the halo is too
    main: {
      normal: { color: COLOR, width: "0.8" },
      withInner: { color: COLOR, width: "0.8" },
      setpoint: SETPOINT_SMALL,
      setpointWithLabel: SETPOINT_SMALL,
    },
    inner: {
      normal: { color: COLOR, width: "0.8" },
      onMain: { color: COLOR, width: "0.8" },
      setpoint: SETPOINT_SMALL,
      setpointOnMain: SETPOINT_SMALL,
    },
  },
};
