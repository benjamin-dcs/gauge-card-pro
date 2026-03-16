import type { HomeAssistant } from "../../dependencies/ha";
import { formatNumberToLocal } from "../../utils/number/format-to-locale";
import { NumberUtils } from "../../utils/number/numberUtils";
import { getValueFromPath } from "../../utils/object/get-value";
import type { GaugeCardProCardConfig } from "../config";
import type { GetValueFn, TemplateKey } from "../types-template";
import type {
  Gauge,
  InnerMinMaxIndicator,
  InnerSetpoint,
  MainMinMaxIndicator,
  MainSetpoint,
} from "../types";
import { isValidSvgPath } from "../../dependencies/is-svg-path/valid-svg-path";

export type Angles = {
  main_angle: number;
  main_min_indicator_angle: number;
  main_max_indicator_angle: number;
  main_setpoint_angle: number;
  inner_angle: number;
  inner_min_indicator_angle: number;
  inner_max_indicator_angle: number;
  inner_setpoint_angle: number;
};

type GetLightDarkModeColorFn = (key: TemplateKey) => string | undefined;

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
  getLightDarkModeColor: GetLightDarkModeColorFn,
  angles: Angles
):
  | undefined
  | {
      value: number;
      opts: {
        angle: number;
        customColor?: string | undefined;
        opacity?: number | undefined;
        customShape?: string | undefined;
      };
    } {
  const isMain = gauge === "main";
  const prefixPath = `${isMain ? "" : "inner."}${element}`;

  const type = getValueFromPath(config, `${prefixPath}.type`);
  if (type === undefined) return undefined;

  const angle = isMain
    ? element === "min_indicator"
      ? angles.main_min_indicator_angle
      : element === "max_indicator"
        ? angles.main_max_indicator_angle
        : angles.main_setpoint_angle
    : element === "min_indicator"
      ? angles.inner_min_indicator_angle
      : element === "max_indicator"
        ? angles.inner_max_indicator_angle
        : angles.inner_setpoint_angle;

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

  return { value, opts: { angle, customColor, customShape } };
}

export function getMinMaxIndicator(
  gauge: Gauge,
  element: "min" | "max",
  config: GaugeCardProCardConfig,
  hass: HomeAssistant,
  getValue: GetValueFn,
  getLightDarkModeColor: GetLightDarkModeColorFn,
  angles: Angles,
  hasInnerGauge: boolean
):
  | {
      value: number;
      opts:
        | Omit<MainMinMaxIndicator, "isRounded">
        | Omit<InnerMinMaxIndicator, "isRounded">;
    }
  | undefined {
  const indicator = `${element}_indicator` as const;
  const base = getMinMaxIndicatorSetpointBase(
    gauge,
    indicator,
    config,
    hass,
    getValue,
    getLightDarkModeColor,
    angles
  );
  if (!base) return;

  const isMain = gauge === "main";
  const prefixPath = `${isMain ? "" : "inner."}${indicator}` as const;
  const opts = base.opts;

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

      const mainOpts = opts as MainMinMaxIndicator;
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
  getLightDarkModeColor: GetLightDarkModeColorFn,
  angles: Angles
): { value: number; opts: MainSetpoint | InnerSetpoint } | undefined {
  const base = getMinMaxIndicatorSetpointBase(
    gauge,
    "setpoint",
    config,
    hass,
    getValue,
    getLightDarkModeColor,
    angles
  );
  if (!base) return;

  const opts = base.opts;

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

      const mainOpts = opts as MainSetpoint;
      mainOpts.label = { text: text! };
    }
  }

  return { value: base.value, opts };
}
