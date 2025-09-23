// Internalized external dependencies
import { HomeAssistant } from "custom-card-helpers";

import * as en from "./translations/en.json";
import * as en_GB from "./translations/en-GB.json";

const languages: Record<string, unknown> = {
  en,
  "en-GB": en_GB,
};

const DEFAULT_LANG = "en";

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

export default function setupCustomlocalize(hass?: HomeAssistant) {
  return function (key: string) {
    const lang = hass?.locale.language ?? DEFAULT_LANG;

    let translated = getTranslatedString(key, lang);
    if (!translated) translated = getTranslatedString(key, DEFAULT_LANG);
    return translated ?? key;
  };
}
