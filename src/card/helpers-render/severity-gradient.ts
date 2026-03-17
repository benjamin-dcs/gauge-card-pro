import type { SVGTemplateResult } from "lit";
import { svg } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

import type { Gauge } from "../types";

export function renderSeverityGradient(
  gauge: Gauge,
  isRounded: boolean,
  gradient: string
): SVGTemplateResult {
  return svg`
    <g clip-path="url(#${gauge}-conic-gradient)">
      <g clip-path="url(#${gauge}-severity-gradient-value)">
        <g clip-path=${ifDefined(isRounded ? `url(#${gauge}-severity-rounding)` : undefined)}>
          <foreignObject x="-50" y="-50" width="100" height="100">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style=${styleMap({
                width: "100%",
                height: "100%",
                background: `conic-gradient(from -90deg, ${gradient})`,
              })}
            ></div>
          </foreignObject>
        </g>
      </g>
    </g>`;
}
