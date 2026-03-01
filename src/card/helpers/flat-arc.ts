import type { SVGTemplateResult } from "lit";
import { svg } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

// Local utilities
import { getAngle } from "../../utils/number/get-angle";

import type { Gauge } from "../types";
import type { GaugeSegment } from "../config";

export function renderFlatArc(
  gauge: Gauge,
  min: number,
  max: number,
  segments: GaugeSegment[],
  roundClip: string | undefined
): SVGTemplateResult {
  const r = gauge === "main" ? 40 : 32;
  return svg`
    <g clip-path=${ifDefined(roundClip)}>
    <g>
        ${segments.map((segment) => {
          const angle = getAngle(segment.pos, min, max);
          return svg`
            <path
            class="segment"
            d="M
                ${0 - r * Math.cos((angle * Math.PI) / 180)}
                ${0 - r * Math.sin((angle * Math.PI) / 180)}
                A ${r} ${r} 0 0 1 ${r} 0"
            style=${styleMap({ stroke: segment.color })}
            ></path>
        `;
        })}
    </g>
    </g>`;
}
