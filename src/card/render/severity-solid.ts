import type { SVGTemplateResult, TemplateResult } from "lit";
import { svg } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

import type {
  AnimationSpeed,
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
  animationSpeed: AnimationSpeed,
  severityCentered: { dashArray: string; dashOffset: number }
): TemplateResult {
  // Gradient severity animates through a clip-path `d`, which CSS cannot transition
  const transitionClasses = {
    "fast-transition":
      severityConfig.mode !== "gradient" && animationSpeed === "fast",
    "normal-transition":
      severityConfig.mode !== "gradient" && animationSpeed === "normal",
  };

  let severityGauge: SVGTemplateResult;
  if (severityConfig.fromCenter) {
    severityGauge = svg`
      <g transform="rotate(-90)" class=${classMap(transitionClasses)}>
        <circle
          class=${classMap({
            [`${gauge}-severity-gauge-${layout}`]: true,
            ...transitionClasses,
          })}
          r="${gaugeData[gauge][layout].radius}"
          stroke=${severityData.color}
          pathLength="360"
          stroke-dasharray=${severityCentered.dashArray}
          stroke-dashoffset=${severityCentered.dashOffset}
        ></circle>
      </g>`;
  } else {
    // Rendered even at 0deg (where the arc sits outside the viewBox) so the
    // transform can transition from 0deg into the value on the first render
    severityGauge = svg`
        <g
          class=${classMap(transitionClasses)}
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
  }

  return svg`
    <g clip-path=${ifDefined(isRounded ? `url(#${gauge}-rounding)` : undefined)}>
      <g clip-path=${ifDefined(isRounded ? `url(#${gauge}-severity-rounding)` : undefined)}>
        ${severityGauge}
      </g>
    </g>`;
}
