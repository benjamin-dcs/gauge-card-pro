import type {
  Layout,
  MainGaugeMarkersLayoutDefinition,
} from "../../../card/types/types";

import { MAIN_GAUGE_MARKERS_DEFAULT } from "./default";
import { MAIN_GAUGE_MARKERS_THIN } from "./thin";

export const MAIN_GAUGE_MARKERS: Record<
  Layout,
  MainGaugeMarkersLayoutDefinition
> = {
  default: MAIN_GAUGE_MARKERS_DEFAULT,
  thin: MAIN_GAUGE_MARKERS_THIN,
};
