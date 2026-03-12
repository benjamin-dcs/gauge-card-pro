// min-max-indicator.ts
import type { SVGTemplateResult } from "lit";
import { svg, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { MAIN_GAUGE } from "../../constants/svg/main-gauge";
import { INNER_GAUGE } from "../../constants/svg/inner-gauge";

import type {
  Gauge,
  InnerMinMaxIndicator,
  MainMinMaxIndicator,
} from "../types";
import { DEFAULTS } from "../../constants/defaults";

const defaultShape = {
  main: MAIN_GAUGE.minMax.indicator,
  inner: INNER_GAUGE.minMax.indicator,
};

export function renderMinMaxIndicator(
  gauge: Gauge,
  type: "min" | "max",
  isRounded: boolean,
  opts: MainMinMaxIndicator | InnerMinMaxIndicator
): SVGTemplateResult {
  const { angle, color, opacity, customShape, label } = opts;
  const _angle = type === "min" ? angle : angle * -1;

  let labelTextAngle: number;
  let labelTextStartOffset: string;

  if (label) {
    labelTextAngle = type === "min" ? _angle - 5 : _angle + 5;
    labelTextStartOffset = type === "min" ? "100%" : "0%";
  }

  return svg`
    <g clip-path=${ifDefined(isRounded ? `url(#${gauge}-rounding)` : undefined)}>
      <g class="slow-transition"
         style=${styleMap({ transform: `rotate(${_angle}deg)`, transformOrigin: "0px 0px" })}>
        <path
          d=${customShape ?? defaultShape[gauge]}
          style=${styleMap({
            fill: color ?? DEFAULTS.ui.minMaxIndicators.fill,
            "fill-opacity": opacity ?? DEFAULTS.ui.minMaxIndicators.opacity,
            stroke: `var(--${gauge}-${type}-indicator-stroke-color)`,
            "stroke-width": `var(--${gauge}-${type}-indicator-stroke-width)`,
          })}
        ></path>
      </g>

      ${
        label
          ? svg`
          <g
            class="slow-transition"
            id="${gauge}-${type}-indicator-label-group" 
            transform="rotate(${labelTextAngle!} 0 0)"
            >
            <path
              id="${gauge}-${type}-indicator-label-path"
              d="${
                label.hasInner
                  ? MAIN_GAUGE.minMax.labelTextPathWithInner
                  : MAIN_GAUGE.minMax.labelTextPath
              }"
              style=${styleMap({
                fill: "none",
              })}>
          
            > </path>

            <text
              class="label-text"
              id="${gauge}-${type}-indicator-label"
              style=${styleMap({
                fill: label.color,
                "text-anchor": type === "min" ? "end" : undefined,
              })}
              dominant-baseline="middle"
            >
              <textPath
                href=${`#${gauge}-${type}-indicator-label-path`}
                startOffset="${labelTextStartOffset!}"
              >
                ${label.text}
              </textPath>
            </text>
          </g>`
          : nothing
      }
    </g>`;
}
