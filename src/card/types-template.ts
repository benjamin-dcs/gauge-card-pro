import type { RenderTemplateResult } from "../dependencies/ha";
import { CacheManager } from "../dependencies/mushroom";

export const TEMPLATE_KEYS = [
  "icons.left.value",
  "icons.right.value",
  "inner.max",
  "inner.min",
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
  "titles.primary",
  "titles.primary_color",
  "titles.primary_font_size",
  "titles.secondary",
  "titles.secondary_color",
  "titles.secondary_font_size",
  "value",
  "value_texts.primary",
  "value_texts.primary_color",
  "value_texts.primary_unit",
  "value_texts.primary_font_size_reduction",
  "value_texts.secondary",
  "value_texts.secondary_color",
  "value_texts.secondary_unit",
] as const;

export type TemplateKey = (typeof TEMPLATE_KEYS)[number];
export type TemplateResults = Partial<
  Record<TemplateKey, RenderTemplateResult | undefined>
>;

export const templateCache = new CacheManager<TemplateResults>(1000);
export type GetValueFn = <T = unknown>(key: TemplateKey) => T;
