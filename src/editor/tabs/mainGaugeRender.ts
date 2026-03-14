import { html, nothing } from "lit";
import {
  EditorRenderContext,
  GaugeSegmentSchemaFrom,
  GaugeSegmentSchemaPos,
} from "../../card/types";
import { isArraySorted } from "../utils";
import { mainGaugeSchema as _mainGaugeSchema } from "./mainGaugeSchema";
import { localize } from "../../utils/localize";
import z from "zod";

export function renderMainGaugeTab(ctx: EditorRenderContext, config) {
  const hass = ctx.hass;
  const lang = hass.locale.language;

  const isSeverity = config.needle !== true;

  const _segments = config.segments;
  const hasSegments = _segments != null;
  const fromSegments = z.array(GaugeSegmentSchemaFrom).safeParse(_segments);
  const posSegments = z.array(GaugeSegmentSchemaPos).safeParse(_segments);
  const segmentType = fromSegments.success
    ? "from"
    : posSegments.success
      ? "pos"
      : hasSegments && typeof _segments === "string"
        ? "template"
        : "none";

  const showSegmentsPanel = segmentType !== "template";
  const showSortSegmentsButton =
    Array.isArray(_segments) &&
    _segments.length > 1 &&
    !isArraySorted(_segments, segmentType);

  const _hasGradient =
    config.gradient || (config.needle !== true && config.gradient_background);
  const showConvertAlert =
    (segmentType === "from" || segmentType === "pos") && _hasGradient;

  const showSeverityGaugeOptions = config.needle !== true;
  const showGradientBackgroundOptions =
    (config.needle !== true && config.gradient_background) ?? false;

  const showGradientOptions = config.needle === true;

  const showMinMaxIndicatorOptions = config.needle === true;
  const minIndicatorType = config.min_indicator?.type ?? undefined;
  const hasMinIndicatorLabel = config.min_indicator?.label ?? false;
  const maxIndicatorType = config.max_indicator?.type ?? undefined;
  const hasMaxIndicatorLabel = config.max_indicator?.label ?? false;

  const setpointType = config.setpoint?.type ?? undefined;
  const hasSetpointLabel = config.setpoint?.label ?? false;

  const mainGaugeSchema = _mainGaugeSchema(
    lang,
    config.entity,
    hasSegments,
    showSeverityGaugeOptions,
    showGradientBackgroundOptions,
    showGradientOptions,
    showMinMaxIndicatorOptions,
    minIndicatorType,
    hasMinIndicatorLabel,
    maxIndicatorType,
    hasMaxIndicatorLabel,
    setpointType,
    hasSetpointLabel
  );

  return html` <div class="content">
    ${showSegmentsPanel
      ? html`<ha-expansion-panel
          class="expansion-panel"
          outlined
          expanded
          .header="${localize(lang, "segments")}"
        >
          <ha-icon slot="leading-icon" icon="mdi:segment"></ha-icon>
          <div class="content">
            ${showConvertAlert
              ? ctx.createConvertSegmentsAlert("main", isSeverity, segmentType)
              : nothing}
            ${segmentType === "from"
              ? fromSegments.data!.map((segment, index) => {
                  return ctx.createSegmentPanel("main", "from", segment, index);
                })
              : segmentType === "pos"
                ? posSegments.data!.map((segment, index) => {
                    return ctx.createSegmentPanel(
                      "main",
                      "pos",
                      segment,
                      index
                    );
                  })
                : nothing}
            ${ctx.createButton(
              localize(lang, "add_segment"),
              () => ctx.addSegment("main"),
              "mdi:plus",
              "small",
              "brand",
              "filled"
            )}
            ${showSortSegmentsButton
              ? ctx.createButton(
                  localize(lang, "sort"),
                  () => ctx.sortSegments("main"),
                  "mdi:sort",
                  "small",
                  "neutral",
                  "plain"
                )
              : nothing}
          </div>
        </ha-expansion-panel>`
      : nothing}
    ${ctx.createHAForm(config, mainGaugeSchema, true, "main")}
  </div>`;
}
