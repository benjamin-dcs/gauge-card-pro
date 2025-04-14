import { HomeAssistant } from "../../ha";

export function computeDarkMode(hass?: HomeAssistant): boolean {
  if (!hass) return false;
  return (hass.themes as any).darkMode as boolean;
}
