// Internalized external dependencies
import { HomeAssistant } from "../dependencies/ha";

import * as en from "../translations/en.json";
import * as en_GB from "../translations/en-GB.json";

import { GaugeCardProCardConfig } from "../card/config";

const languages: Record<string, unknown> = {
  en,
  "en-GB": en_GB,
};

const DEFAULT_LANG = "en";

export function localize(
  hass: HomeAssistant,
  value: string,
  gauge: "main" | "inner" | "none" = "none"
): string {
  // https://github.com/home-assistant/frontend/blob/dev/src/translations/en.json
  // Paste in https://play.jqlang.org/
  // Search for value in pasted windows (JSON)
  // Top of window shows the path
  if (value === undefined) {
    return value;
  }
  const customLocalize = setupCustomlocalize(hass!);
  const domain = value.substring(0, value.indexOf("."));
  if (["card", "features", "migration"].includes(domain)) {
    return customLocalize(`${value}`);
  }

  switch (value) {
    case "attribute":
      if (gauge === "main") {
        return customLocalize("editor.attribute_main");
      } else if (gauge === "inner") {
        return customLocalize("editor.attribute_inner");
      }
      return customLocalize(`editor.${value}`);
    case "primary_color":
    case "secondary_color":
      return customLocalize("editor.color");
    case "primary_unit":
    case "secondary_unit":
      return customLocalize("editor.unit_of_measurement");
    case "fan_style":
    case "hvac_style":
    case "swing_style":
      return customLocalize("editor.style");
    default:
      return customLocalize(`editor.${value}`);
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
