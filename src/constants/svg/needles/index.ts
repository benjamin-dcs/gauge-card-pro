import type {
  NeedleStyle,
  NeedleStyleDefinition,
} from "../../../card/types/types";

import { NEEDLES_DEFAULT } from "./default";
import { NEEDLES_HA } from "./ha";

export const NEEDLES: Record<NeedleStyle, NeedleStyleDefinition> = {
  default: NEEDLES_DEFAULT,
  ha: NEEDLES_HA,
};
