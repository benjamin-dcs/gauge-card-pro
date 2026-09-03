import type { HomeAssistant } from "../dependencies/ha";
import type { CustomCardSuggestion } from "../dependencies/mushroom";
import type { GaugeCardProCardConfig } from "../card/config";

import { NumberUtils } from "../utils/number/numberUtils";

export function getEntitySuggestion(
  hass: HomeAssistant,
  entityId: string
): CustomCardSuggestion<GaugeCardProCardConfig> | null {
  if (!hass.states[entityId]) return null;
  if (!NumberUtils.isNumeric(hass.states[entityId].state)) return null;

  return {
    config: {
      type: `custom:gauge-card-pro`,
      entity: entityId,
      segments: [
        { pos: 0, color: "red" },
        { pos: 25, color: "#FFA500" },
        { pos: 50, color: "rgb(255, 255, 0)" },
        { pos: 100, color: "var(--green-color)" },
      ],
      needle: true,
      gradient: true,
      titles: {
        primary: {
          value: "{{ state_attr(entity, 'friendly_name') }}",
        },
      },
      round: "small",
    },
  };
  
}
