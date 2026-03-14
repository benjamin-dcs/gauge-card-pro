import { html } from "lit";
import type { EditorRenderContext } from "../../card/types";
import { DEFAULTS } from "../../constants/defaults";
import { NumberUtils } from "../../utils/number/numberUtils";
import { advancedSchema as _advancedSchema } from "./advancedSchema";

export function renderAdvancedTab(ctx: EditorRenderContext, config) {
  const hass = ctx.hass;
  const lang = hass.locale.language;

  const _mainSegments = config.segments;
  const enableMainGradientResolution =
    (_mainSegments != null &&
      ((config.needle && config.gradient) || config.gradient_background)) ??
    false;
  const mainGradientResolutionMode = NumberUtils.isNumeric(
    config.gradient_resolution
  )
    ? "numerical"
    : "auto";

  const hasInner = config.inner !== undefined;
  let enableInnerGradientResolution;
  let innerGradientResolutionMode;
  if (hasInner) {
    const _innerSegments = config.inner!.segments;
    const inner_mode = config.inner!.mode ?? DEFAULTS.inner.mode;
    enableInnerGradientResolution =
      (_innerSegments != null &&
        ((["static", "needle"].includes(inner_mode) &&
          config.inner!.gradient) ||
          config.inner!.gradient_background)) ??
      false;
    innerGradientResolutionMode = NumberUtils.isNumeric(
      config.inner!.gradient_resolution
    )
      ? "numerical"
      : "auto";
  }

  const advancedSchema = _advancedSchema(
    lang,
    enableMainGradientResolution,
    mainGradientResolutionMode,
    hasInner,
    enableInnerGradientResolution,
    innerGradientResolutionMode
  );

  return html` ${ctx.createHAForm(config, advancedSchema, true)}`;
}
