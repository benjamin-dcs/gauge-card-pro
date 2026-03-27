import type { RenderTemplateResult } from "../dependencies/ha";
import { CacheManager } from "../dependencies/mushroom";

export const TEMPLATE_KEYS = [
  "icons.left.value",
  "icons.right.value",
  "inner.max",
  "inner.max_indicator.value",
  "inner.max_indicator.label_color",
  "inner.min",
  "inner.min_indicator.value",
  "inner.min_indicator.label_color",
  "inner.needle_color",
  "inner.segments",
  "inner.setpoint.color",
  "inner.setpoint.value",
  "inner.value",
  "max",
  "max_indicator.value",
  "max_indicator.label_color",
  "min",
  "min_indicator.value",
  "min_indicator.label_color",
  "needle_color",
  "segments",
  "setpoint.color",
  "setpoint.value",
  "shapes.main_needle",
  "shapes.main_min_indicator",
  "shapes.main_max_indicator",
  "shapes.main_setpoint_needle",
  "shapes.inner_needle",
  "shapes.inner_min_indicator",
  "shapes.inner_max_indicator",
  "shapes.inner_setpoint_needle",
  "titles.primary.value",
  "titles.primary.color",
  "titles.primary.font_size",
  "titles.secondary.value",
  "titles.secondary.color",
  "titles.secondary.font_size",
  "value",
  "value_texts.primary.value",
  "value_texts.primary.color",
  "value_texts.primary.unit_of_measurement",
  "value_texts.primary.font_size_reduction",
  "value_texts.secondary.value",
  "value_texts.secondary.color",
  "value_texts.secondary.unit_of_measurement",
] as const;

export type TemplateKey = (typeof TEMPLATE_KEYS)[number];
export type TemplateResults = Partial<
  Record<TemplateKey, RenderTemplateResult | undefined>
>;

export const templateCache = new CacheManager<TemplateResults>(1000);
export type GetValueFn = <T = unknown>(key: TemplateKey) => T;
export type GetLightDarkModeColorFn = (key: TemplateKey) => string | undefined;
