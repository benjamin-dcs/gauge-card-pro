import { html, nothing, TemplateResult } from "lit";
import { RenderGaugeContext } from "../types/render-gauge-context";
import { actionHandler, hasAction } from "../../dependencies/ha";
import { ifDefined } from "lit/directives/if-defined.js";

export function renderGauge(card: RenderGaugeContext): TemplateResult {
  return html` <div
    class="gauge"
    @action=${card._handleCardAction}
    .actionHandler=${actionHandler({
      hasHold: hasAction(card._config.hold_action),
      hasDoubleClick: hasAction(card._config.double_tap_action),
    })}
    role=${ifDefined(card.hasCardAction ? "button" : undefined)}
    tabindex=${ifDefined(card.hasCardAction ? "0" : undefined)}
  >
    <gauge-card-pro-main-gauge
      .config=${card.mainGaugeConfig}
      .data=${card.mainGaugeData}
    >
    </gauge-card-pro-main-gauge>
    ${card.hasInnerGauge && card.innerMode !== "on_main"
      ? html` <gauge-card-pro-inner-gauge
          .config=${card.innerGaugeConfig}
          .data=${card.innerGaugeData}
        >
        </gauge-card-pro-inner-gauge>`
      : nothing}
    ${showValueElements(card)
      ? html`<gauge-card-pro-gauge-value-elements
          .hass=${card.hass}
          .config=${card.valueElementsConfig}
          .data=${card.valueElementsData}
        ></gauge-card-pro-gauge-value-elements>`
      : nothing}
    ${card.leftIconData || card.rightIconData
      ? html`<gauge-card-pro-gauge-icons
          .hass=${card.hass}
          .leftConfig=${card.leftIconConfig}
          .leftData=${card.leftIconData}
          .rightConfig=${card.rightIconConfig}
          .rightData=${card.rightIconData}
        ></gauge-card-pro-gauge-icons>`
      : nothing}
  </div>`;
}

function showValueElements(card: RenderGaugeContext): boolean {
  if (card.hasMainNeedle || card.mainSetpoint) return true;
  if (
    card.primaryValueAndValueText?.valueText ||
    card.secondaryValueAndValueText?.valueText
  ) {
    return true;
  }
  if (
    card.innerSetpoint ||
    (card.innerMode && ["needle", "on_main"].includes(card.innerMode))
  ) {
    return true;
  }
  return false;
}
