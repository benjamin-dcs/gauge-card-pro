// Internalized external dependencies
import { HomeAssistant } from "../dependencies/ha";

import * as en from "../translations/en.json";
import * as en_GB from "../translations/en-GB.json";

const languages: Record<string, unknown> = {
  en,
  "en-GB": en_GB,
};

const DEFAULT_LANG = "en";

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
      const domain = value.substring(0, value.indexOf("."));

      // The majority of the translation is for the editor
      if (["card", "features", "migration"].includes(domain)) {
        return customLocalize(`${value}`);
      } else {
        return customLocalize(`editor.card.${value}`);
      }
  }
}

export default function setupCustomlocalize(hass?: HomeAssistant) {
  return function (key: string) {
    const lang = hass?.locale.language ?? DEFAULT_LANG;

    let translated = getTranslatedString(key, lang);
    if (!translated) translated = getTranslatedString(key, DEFAULT_LANG);
    return translated ?? key;
  };
}

function getTranslatedString(key: string, lang: string): string | undefined {
  try {
    return key
      .split(".")
      .reduce(
        (o, i) => (o as Record<string, unknown>)[i],
        languages[lang]
      ) as string;
  } catch (_) {
    return undefined;
  }
}
