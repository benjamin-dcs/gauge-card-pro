import { html as staticHtml, unsafeStatic } from "lit/static-html.js";
import { TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";

import { ClimateEntity, HomeAssistant, HvacMode } from "../../dependencies/ha";
import { Feature, FeatureStyle } from "../types";

export function renderClimateFeatureModesPage(
  hass: HomeAssistant,
  type: "hvac" | "fan" | "swing" | "preset",
  entity: ClimateEntity,
  modes: HvacMode[] | string[] | undefined,
  style: FeatureStyle | undefined,
  activeFeaturePage: Feature | undefined
): TemplateResult {
  const feature: Feature = `climate-${type}-modes`;
  const tag = unsafeStatic(`gcp-${feature}-control`);

  return staticHtml` <${tag}
        style=${styleMap({
          display: activeFeaturePage !== feature ? "none" : undefined,
        })}
        .lang=${hass.language}
        .callService=${hass.callService}
        .version=${hass.connection.haVersion}
        .entity=${entity}
        .modes=${modes}
        .featureStyle=${style}
      >
      </${tag}>`;
}
