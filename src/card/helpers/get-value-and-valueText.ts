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

  // 1 - config.value
  // 2 - config.entity with config.attribute
  // 3 - config.entity state
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

  // 1 - value_texts.<type>.value
  // 2 - value or inner.value
  // 3 - attribute or inner.attribute
  // 4 - entity

  // Allow empty string to overwrite value_text
  if (templateValueText === "") {
    return { value: value, valueText: "" };
  } else if (templateValueText !== undefined) {
    if (NumberUtils.isNumeric(templateValueText)) {
      valueText = formatNumberToLocal(hass, templateValueText) ?? "";
    } else {
      return { value: value, valueText: templateValueText as string };
    }
  } else if (templateValue || attribute) {
    valueText = formatNumberToLocal(hass, value) ?? "";
  } else if (entity) {
    valueText = formatEntityToLocal(hass, entity) ?? "";
  } else {
    valueText = "";
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
  const type = isMain ? "primary" : "secondary";
  return {
    valueKey: isMain ? "value" : "inner.value",
    valueTextKey: `value_texts.${type}.value`,
    unitKey: `value_texts.${type}.unit_of_measurement`,
    unitBeforeValue: config?.value_texts?.[type]?.unit_before_value ?? false,
    entity: isMain ? config?.entity : config?.entity2,
    attribute: isMain ? config?.attribute : config?.inner?.attribute,
  };
}
