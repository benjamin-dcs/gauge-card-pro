import { INVALID_ENTITY } from "../../constants/constants";
import type { HomeAssistant } from "../../dependencies/ha";
import {
  blankBeforePercent,
  isAvailable,
  UNAVAILABLE,
} from "../../dependencies/ha";
import {
  formatEntityToLocal,
  formatNumberToLocal,
} from "../../utils/number/format-to-locale";
import { NumberUtils } from "../../utils/number/numberUtils";
import type { GetValueFn, TemplateKey } from "../types-template";
import type { GaugeCardProCardConfig } from "../config";
import type { Gauge } from "../types";

export function getValueAndValueText(
  gauge: Gauge,
  config: GaugeCardProCardConfig,
  hass: HomeAssistant,
  getValue: GetValueFn
): {
  value: number | undefined;
  valueText: string;
} {
  const cfg = getConfig(gauge, config);
  const entity = cfg.entity;
  const attribute = cfg.attribute;

  const templateValue = getValue(cfg.valueKey);
  const templateValueText = getValue(cfg.valueTextKey);

  let valueText: string | undefined;
  let stateObj;
  if (entity !== undefined) stateObj = hass.states[entity];

  let value =
    NumberUtils.tryToNumber(templateValue) ??
    (attribute !== undefined
      ? NumberUtils.tryToNumber(stateObj?.attributes[attribute])
      : NumberUtils.tryToNumber(stateObj?.state));

  if (value === undefined) {
    if (entity && !stateObj) {
      return { value: undefined, valueText: INVALID_ENTITY };
    } else if (stateObj && !isAvailable(stateObj)) {
      return { value: undefined, valueText: UNAVAILABLE };
    } else {
      value = undefined;
    }
  }

  // Allow empty string to overwrite value_text
  if (templateValueText === "") {
    return { value: value, valueText: "" };
  } else if (templateValueText !== undefined) {
    if (NumberUtils.isNumeric(templateValueText)) {
      valueText = formatNumberToLocal(hass, templateValueText) ?? "";
    } else {
      return { value: value, valueText: templateValueText as string };
    }
  } else if (attribute) {
    valueText = formatNumberToLocal(hass, value) ?? "";
  } else {
    valueText = formatEntityToLocal(hass, entity!) ?? "";
  }

  const _unit = getValue(cfg.unitKey);
  let unit =
    _unit === ""
      ? ""
      : _unit ||
        (attribute ? "" : stateObj?.attributes?.unit_of_measurement) ||
        "";

  if (cfg.unitBeforeValue) {
    // For now always a space between unit and value
    valueText = unit !== "" ? `${unit} ${valueText}` : valueText;
  } else {
    if (unit === "%") {
      unit = `${blankBeforePercent(hass.locale)}%`;
    } else if (unit !== "") {
      unit = ` ${unit}`;
    }
    valueText = valueText + unit;
  }

  return { value, valueText };
}

function getConfig(
  gauge: Gauge,
  config: GaugeCardProCardConfig
): {
  valueKey: TemplateKey;
  valueTextKey: TemplateKey;
  unitKey: TemplateKey;
  unitBeforeValue: boolean;
  entity: string | undefined;
  attribute: string | undefined;
} {
  const isMain = gauge === "main";
  return {
    valueKey: isMain ? "value" : "inner.value",
    valueTextKey: isMain ? "value_texts.primary" : "value_texts.secondary",
    unitKey: isMain ? "value_texts.primary_unit" : "value_texts.secondary_unit",
    unitBeforeValue: isMain
      ? (config?.value_texts?.primary_unit_before_value ?? false)
      : (config?.value_texts?.secondary_unit_before_value ?? false),
    entity: isMain ? config?.entity : config?.entity2,
    attribute: isMain ? config?.attribute : config?.inner?.attribute,
  };
}
