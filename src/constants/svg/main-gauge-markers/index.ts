import type {
  Layout,
  MainGaugeMarkersLayoutDefinition,
} from "../../../card/types/types";

import { MAIN_GAUGE_MARKERS_DEFAULT } from "./default";
import { MAIN_GAUGE_MARKERS_EQUAL } from "./equal";

export const MAIN_GAUGE_MARKERS: Record<
  Layout,
  MainGaugeMarkersLayoutDefinition
> = {
  default: MAIN_GAUGE_MARKERS_DEFAULT,
  equal: MAIN_GAUGE_MARKERS_EQUAL,
};
