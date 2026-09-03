import type {
  NeedleStyle,
  NeedleStrokeStyleDefinition,
} from "../../../card/types/types";

import { NEEDLE_STROKES_DEFAULT } from "./default";
import { NEEDLE_STROKES_HA } from "./ha";

export const NEEDLE_STROKES: Record<NeedleStyle, NeedleStrokeStyleDefinition> =
  {
    default: NEEDLE_STROKES_DEFAULT,
    ha: NEEDLE_STROKES_HA,
  };
