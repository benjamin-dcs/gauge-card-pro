import type { SVGTemplateResult, TemplateResult } from "lit";
import { nothing, svg } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

import type { Gauge, SeverityConfig, SeverityData } from "../types";

const gaugeData = {
  main: {
    path: "M -40 0 A 40 40 0 1 0 40 0",
    radius: 40,
  },
  inner: {
    path: "M -32 0 A 32 32 0 1 0 32 0",
    radius: 32,
  },
};

export function renderSeveritySolid(
  gauge: Gauge,
  severityData: SeverityData,
  severityConfig: SeverityConfig,
  isRounded: boolean,
  severityCenteredDashArray: string,
  severityCenteredDashOffset: number
): TemplateResult | typeof nothing {
  let severityGauge: SVGTemplateResult | typeof nothing;
  if (severityConfig.fromCenter) {
    severityGauge = svg`
      <g transform="rotate(-90)" class="normal-transition">
        <circle
          class="${gauge}-severity-gauge normal-transition"
          r="${gaugeData[gauge].radius}"
          stroke=${severityData.color}
          pathLength="360"
          stroke-dasharray=${severityCenteredDashArray}
          stroke-dashoffset=${severityCenteredDashOffset}
        ></circle>
      </g>`;
  } else if (severityData.angle > 0) {
    severityGauge = svg`
        <g
          class="normal-transition"
          style=${styleMap({
            transform: `rotate(${severityData.angle}deg)`,
            transformOrigin: "0px 0px",
          })}
        >
          <path
            class="${gauge}-severity-gauge"
            style=${styleMap({ stroke: severityData.color })}
            d="${gaugeData[gauge].path}"
          ></path>
        </g>`;
  } else {
    severityGauge = nothing;
  }

  return svg`
    <g clip-path=${ifDefined(isRounded ? `url(#${gauge}-rounding)` : undefined)}>
      <g clip-path=${ifDefined(isRounded ? `url(#${gauge}-severity-rounding)` : undefined)}>
        ${severityGauge}
      </g>
    </g>`;
}
