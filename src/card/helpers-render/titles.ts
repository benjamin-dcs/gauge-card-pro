import { html, HTMLTemplateResult, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import { DEFAULTS } from "../../constants/defaults";
import { isValidFontSize } from "../../utils/css/valid-font-size";
import { GetLightDarkModeColorFn, GetValueFn } from "../types-template";

export function renderTitle(
  type: "primary" | "secondary",
  getValue: GetValueFn,
  getLightDarkModeColor: GetLightDarkModeColorFn
): HTMLTemplateResult | typeof nothing {
  const title = getValue(`titles.${type}.value`);
  if (!title) return nothing;

  const color =
    getLightDarkModeColor(`titles.${type}.color`) ?? DEFAULTS.ui.titleColor;
  let fontSize = getValue<string>(`titles.${type}.font_size`);
  if (!fontSize || !isValidFontSize(fontSize))
    fontSize =
      type === "primary"
        ? DEFAULTS.ui.titleFontSizePrimary
        : DEFAULTS.ui.titleFontSizeSecondary;

  return html` <div
    class=${classMap({
      title: true,
      "primary-title": type === "primary",
    })}
    style=${styleMap({
      color: color,
      "font-size": fontSize,
    })}
    .title=${title}
  >
    ${title}
  </div>`;
}
