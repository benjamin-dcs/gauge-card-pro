import {
  formatNumber,
  getNumberFormatOptions,
  HomeAssistant,
} from "../../dependencies/ha";

export const formatEntityToLocal = (
  hass: HomeAssistant,
  entity: string | any
) => {
  if (!hass || !entity) return undefined;

  const stateObj = hass.states[entity];
  if (
    !stateObj ||
    stateObj.state === "unavailable" ||
    isNaN(Number(stateObj.state))
  )
    return "";

  const locale = hass!.locale;
  const formatOptions = getNumberFormatOptions(
    stateObj,
    hass.entities[stateObj.entity_id]
  );
  return formatNumber(stateObj.state, locale, formatOptions);
};

export const formatNumberToLocal = (
  hass: HomeAssistant,
  value: number | any
) => {
  if (!hass) return undefined;
  if (isNaN(Number(value))) return undefined;

  const locale = hass!.locale;
  const formatOptions = undefined;

  return formatNumber(Number(value), locale, formatOptions);
};
