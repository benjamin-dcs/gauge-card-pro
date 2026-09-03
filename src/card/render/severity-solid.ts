import type { SVGTemplateResult, TemplateResult } from "lit";
import { nothing, svg } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

import type {
  Gauge,
  Layout,
  SeverityConfig,
  SeverityData,
} from "../types/types";

import { MAIN_GAUGE_DEFAULT } from "../../constants/svg/main-gauge/default";
import { MAIN_GAUGE_EQUAL } from "../../constants/svg/main-gauge/equal";
import { INNER_GAUGE_DEFAULT } from "../../constants/svg/inner-gauge/default";
import { INNER_GAUGE_EQUAL } from "../../constants/svg/inner-gauge/equal";

const gaugeData = {
  main: {
    default: MAIN_GAUGE_DEFAULT.severitySolid,
    equal: MAIN_GAUGE_EQUAL.severitySolid,
  },
  inner: {
    default: INNER_GAUGE_DEFAULT.severity,
    equal: INNER_GAUGE_EQUAL.severity,
  },
};

export function renderSeveritySolid(
  gauge: Gauge,
  severityData: SeverityData,
  severityConfig: SeverityConfig,
  layout: Layout,
  isRounded: boolean,
  severityCenteredDashArray: string,
  severityCenteredDashOffset: number
): TemplateResult | typeof nothing {
  let severityGauge: SVGTemplateResult | typeof nothing;
  if (severityConfig.fromCenter) {
    severityGauge = svg`
      <g transform="rotate(-90)" class="normal-transition">
        <circle
          class="${gauge}-severity-gauge-${layout} normal-transition"
          r="${gaugeData[gauge][layout].radius}"
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
            class="${gauge}-severity-gauge-${layout}"
            style=${styleMap({ stroke: severityData.color })}
            d="${gaugeData[gauge][layout].path}"
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
