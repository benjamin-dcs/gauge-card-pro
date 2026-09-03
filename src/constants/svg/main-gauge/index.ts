import type {
  Layout,
  MainGaugeLayoutDefinition,
} from "../../../card/types/types";

import { MAIN_GAUGE_DEFAULT } from "./default";
import { MAIN_GAUGE_THIN } from "./thin";

export const MAIN_GAUGE: Record<Layout, MainGaugeLayoutDefinition> = {
  default: MAIN_GAUGE_DEFAULT,
  thin: MAIN_GAUGE_THIN,
};
