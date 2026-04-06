import type { HomeAssistant } from "../../dependencies/ha";
import { formatNumberToLocal } from "../../utils/number/format-to-locale";
import { NumberUtils } from "../../utils/number/numberUtils";
import { getValueFromPath } from "../../utils/object/get-value";
import type { GaugeCardProCardConfig } from "../config";
import type {
  GetLightDarkModeColorFn,
  GetValueFn,
  TemplateKey,
} from "../types/template";
import type {
  DraftInnerMinMaxIndicator,
  DraftMainMinMaxIndicator,
  Gauge,
  InnerSetpoint,
  MainMinMaxIndicator,
  MainSetpoint,
} from "../types/types";
import { isValidSvgPath } from "../../dependencies/is-svg-path/valid-svg-path";

function getValidatedSvgPath(
  key: TemplateKey,
  getValue: GetValueFn
): string | undefined {
  const path = getValue<string>(key);
  return path === "" || isValidSvgPath(path) ? path : undefined;
}

function getMinMaxIndicatorSetpointBase(
  gauge: Gauge,
  element: "min_indicator" | "max_indicator" | "setpoint",
  config: GaugeCardProCardConfig,
  hass: HomeAssistant,
  getValue: GetValueFn,
  getLightDarkModeColor: GetLightDarkModeColorFn
):
  | undefined
  | {
      value: number;
      customColor: string | undefined;
      customShape: string | undefined;
    } {
  const isMain = gauge === "main";
  const prefixPath = `${isMain ? "" : "inner."}${element}`;

  const type = getValueFromPath(config, `${prefixPath}.type`);
  if (type === undefined) return undefined;

  const customColorKey: TemplateKey = `${prefixPath}.color` as TemplateKey;
  const customColor = getLightDarkModeColor(customColorKey);

  let value: number | undefined;
  if (type === "attribute") {
    const entity = isMain ? config?.entity : config?.entity2;
    if (!entity) return undefined;

    const configValue = getValueFromPath(config, `${prefixPath}.value`);
    if (typeof configValue !== "string") return undefined;

    const stateObj = hass?.states[entity];
    if (!stateObj) return undefined;

    value = NumberUtils.tryToNumber(stateObj.attributes[configValue]);
  } else if (type === "entity") {
    const configValue = getValueFromPath(config, `${prefixPath}.value`);
    if (typeof configValue !== "string") return undefined;

    const stateObj = hass?.states[configValue];
    if (!stateObj) return undefined;

    value = NumberUtils.tryToNumber(stateObj.state);
  } else if (type === "number") {
    const configValue = getValueFromPath(config, `${prefixPath}.value`);
    value = NumberUtils.tryToNumber(configValue);
  } else if (type === "template") {
    value = NumberUtils.tryToNumber(
      isMain
        ? getValue(`${element}.value` as TemplateKey)
        : getValue(`inner.${element}.value` as TemplateKey)
    );
  }

  if (value === undefined || value === null) return;

  const shapeElement = element === "setpoint" ? "setpoint_needle" : element;
  const customShape = getValidatedSvgPath(
    `shapes.${gauge}_${shapeElement}` as TemplateKey,
    getValue
  );

  return { value, customColor, customShape };
}

export function getMinMaxIndicator(
  gauge: Gauge,
  element: "min" | "max",
  config: GaugeCardProCardConfig,
  hass: HomeAssistant,
  getValue: GetValueFn,
  getLightDarkModeColor: GetLightDarkModeColorFn,
  hasInnerGauge: boolean
): DraftMainMinMaxIndicator | DraftInnerMinMaxIndicator | undefined {
  const indicator = `${element}_indicator` as const;
  const base = getMinMaxIndicatorSetpointBase(
    gauge,
    indicator,
    config,
    hass,
    getValue,
    getLightDarkModeColor
  );
  if (!base) return;

  const isMain = gauge === "main";
  const prefixPath = `${isMain ? "" : "inner."}${indicator}` as const;
  const opts = {
    customColor: base.customColor,
    customShape: base.customShape,
  } as {
    customColor: string | undefined;
    customShape: string | undefined;
    opacity: number | undefined;
  };

  const opacity = getValueFromPath(config, `${prefixPath}.opacity`) as
    | number
    | undefined;
  opts.opacity = opacity;

  if (isMain) {
    const hasLabel = config?.[prefixPath]?.label ?? false;
    if (hasLabel) {
      let value = base.value;
      const precision = getValueFromPath(config, `${prefixPath}.precision`) as
        | number
        | undefined;
      if (precision !== undefined) {
        const factor = 10 ** precision;
        value = Math.round(value * factor) / factor;
      }
      const text = formatNumberToLocal(hass, value);

      const mainOpts = opts as Omit<MainMinMaxIndicator, "angle">;
      mainOpts.label = {
        text: text!,
        customColor: getLightDarkModeColor(
          `${indicator}.label_color` as TemplateKey
        ),
        hasInner: hasInnerGauge,
      };
    }
  }

  return { value: base.value, opts };
}

export function getSetpoint(
  gauge: Gauge,
  config: GaugeCardProCardConfig,
  hass: HomeAssistant,
  getValue: GetValueFn,
  getLightDarkModeColor: GetLightDarkModeColorFn
):
  | {
      value: number;
      opts: Omit<MainSetpoint, "angle"> | Omit<InnerSetpoint, "angle">;
    }
  | undefined {
  const base = getMinMaxIndicatorSetpointBase(
    gauge,
    "setpoint",
    config,
    hass,
    getValue,
    getLightDarkModeColor
  );
  if (!base) return;

  const opts = { customColor: base.customColor, customShape: base.customShape };

  if (gauge === "main") {
    const hasLabel = config?.setpoint?.label ?? false;
    if (hasLabel) {
      let value = base.value;
      const precision = getValueFromPath(config, "setpoint.precision") as
        | number
        | undefined;
      if (precision !== undefined) {
        const factor = 10 ** precision;
        value = Math.round(value * factor) / factor;
      }
      const text = formatNumberToLocal(hass, value);

      const mainOpts = opts as Omit<MainSetpoint, "angle">;
      mainOpts.label = { text: text! };
    }
  }

  return { value: base.value, opts };
}
