import type { SVGTemplateResult } from "lit";
import { svg } from "lit";
import { styleMap } from "lit/directives/style-map.js";

export function renderGradientBackground(
  background: string
): SVGTemplateResult {
  return svg`
<foreignObject
x="-50"
y="-50"
width="100"
height="100"
clip-path="url(#main-conic-gradient)"
>
  <div
      xmlns="http://www.w3.org/1999/xhtml"
      style=${styleMap({
        width: "100%",
        height: "100%",
        background: `conic-gradient(from -90deg, ${background})`,
      })}
  ></div>
</foreignObject>`;
}
