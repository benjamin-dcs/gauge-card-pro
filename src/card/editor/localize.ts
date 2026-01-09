// Internalized external dependencies
import { HomeAssistant } from "../../dependencies/ha";

import setupCustomlocalize from "../../localize";

export function localize(hass: HomeAssistant, value: string): string {
  // https://github.com/home-assistant/frontend/blob/dev/src/translations/en.json
  // Paste in https://play.jqlang.org/
  // Search for value in pasted windows (JSON)
  // Top of window shows the path
  if (value === undefined) {
    return value;
  }
  switch (value) {
    case "battery":
      return hass.localize(
        "ui.panel.lovelace.cards.energy.energy_distribution.battery"
      );
    case "color":
    case "primary_color":
    case "secondary_color":
      return hass.localize("ui.panel.lovelace.editor.card.tile.color");
    case "icon":
      return hass.localize("ui.components.selectors.selector.types.icon");
    case "max":
      return hass.localize("ui.panel.lovelace.editor.card.generic.maximum");
    case "min":
      return hass.localize("ui.panel.lovelace.editor.card.generic.minimum");
    case "template":
      return hass.localize("ui.components.selectors.selector.types.template");
    case "primary_unit":
    case "secondary_unit":
      return hass.localize(
        "ui.dialogs.entity_registry.editor.unit_of_measurement"
      );
    case "type":
      return hass.localize("ui.panel.config.helpers.picker.headers.type");
    case "tap_action":
    case "hold_action":
    case "double_tap_action":
      return hass.localize(`ui.panel.lovelace.editor.card.generic.${value}`);
    default:
      const customLocalize = setupCustomlocalize(hass!);
      if (value.toString().startsWith("migration")) {
        return customLocalize(`${value}`);
      } else {
        return customLocalize(`editor.card.${value}`);
      }
  }
}
