import type { TemplateResult } from "lit";
import { nothing, svg } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";

import type { Gauge, SeverityConfig, SeverityData } from "../types";

export function renderSeveritySolid(
  gauge: Gauge,
  severityData: SeverityData,
  severityConfig: SeverityConfig,
  isRounded: boolean,
  severityCenteredDashArray: string,
  severityCenteredDashOffset: number
): TemplateResult | typeof nothing {
  return svg`
    <g clip-path=${ifDefined(isRounded ? `url(#${gauge}-rounding)` : undefined)}>
      <g clip-path=${ifDefined(isRounded ? `url(#${gauge}-severity-rounding)` : undefined)}>
        ${
          severityConfig.fromCenter
            ? svg`
            <g transform="rotate(-90)" class="normal-transition">
              <circle
                class="${gauge}-severity-gauge normal-transition"
                r="${gauge === "main" ? 40 : 32}"
                stroke=${severityData.color}
                pathLength="360"
                stroke-dasharray=${severityCenteredDashArray}
                stroke-dashoffset=${severityCenteredDashOffset}
              ></circle>
            </g>`
            : severityData.angle > 0
              ? svg`
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
                    d="${gauge === "main" ? "M -40 0 A 40 40 0 1 0 40 0" : "M -32 0 A 32 32 0 1 0 32 0"}"
                  ></path>
                </g>`
              : nothing
        }
      </g>
    </g>`;
}
