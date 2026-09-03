import type {
  InnerGaugeLayoutDefinition,
  Layout,
} from "../../../card/types/types";

import { INNER_GAUGE_DEFAULT } from "./default";
import { INNER_GAUGE_EQUAL } from "./equal";

export const INNER_GAUGE: Record<Layout, InnerGaugeLayoutDefinition> = {
  default: INNER_GAUGE_DEFAULT,
  equal: INNER_GAUGE_EQUAL,
};
