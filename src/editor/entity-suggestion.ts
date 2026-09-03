import type { HomeAssistant } from "../dependencies/ha";
import type { CustomCardSuggestion } from "../dependencies/mushroom";
import type { GaugeCardProCardConfig } from "../card/config";

import { getDefaultConfig } from "../card/config-setup/get-default-config";
import { NumberUtils } from "../utils/number/numberUtils";

export function getEntitySuggestion(
  hass: HomeAssistant,
  entityId: string
): CustomCardSuggestion<GaugeCardProCardConfig> | null {
  if (!hass.states[entityId]) return null;
  if (!NumberUtils.isNumeric(hass.states[entityId].state)) return null;

  return {
    config: getDefaultConfig(entityId),
  };
}
