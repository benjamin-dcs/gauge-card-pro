import type { SVGTemplateResult } from "lit";
import { svg } from "lit";
import { styleMap } from "lit/directives/style-map.js";

import type { Gauge } from "../types/types";

export function renderGradientBackground(
  gauge: Gauge,
  background: string
): SVGTemplateResult {
  return svg`
    <g clip-path="url(#${gauge}-conic-gradient)">
      <foreignObject
        x="-50"
        y="-50"
        width="100"
        height="100"
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style=${styleMap({
            width: "100%",
            height: "100%",
            background: `conic-gradient(from -90deg, ${background})`,
          })}
        ></div>
      </foreignObject>
    </g>`;
}
