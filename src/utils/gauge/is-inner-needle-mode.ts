import type { InnerGaugeMode } from "../../card/types/types";

/** The inner gauge draws a needle in these modes; in `severity` / `static` it
 *  is a colored band instead. */
export function isInnerNeedleMode(mode: InnerGaugeMode | undefined): boolean {
  return mode === "needle" || mode === "on_main";
}
