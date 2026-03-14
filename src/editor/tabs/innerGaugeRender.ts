import z from "zod";
import {
  GaugeSegmentSchemaFrom,
  GaugeSegmentSchemaPos,
  type EditorRenderContext,
} from "../../card/types";
import {
  enableInnerSchema,
  innerGaugeSchema as _innerGaugeSchema,
} from "./innerGaugeSchemas";
import { DEFAULTS } from "../../constants/defaults";
import { html, nothing } from "lit";
import { localize } from "../../utils/localize";
import { isArraySorted } from "../utils";

export function renderInnerGaugeTab(ctx: EditorRenderContext, config) {
  const hass = ctx.hass;
  const lang = hass.locale.language;

  const enabelInner = config.inner !== undefined;

  let isSeverity: boolean;
  let fromSegments;
  let posSegments;
  let segmentsType: "from" | "pos" | "template" | "none";
  let showSegmentsPanel: boolean;
  let showSortSegmentsButton: boolean;
  let _hasGradient: boolean | undefined;
  let showConvertAlert: boolean;
  let innerGaugeSchema;

  if (enabelInner) {
    const _segments = config.inner!.segments;
    const hasSegments = _segments != null;
    fromSegments = z.array(GaugeSegmentSchemaFrom).safeParse(_segments);
    posSegments = z.array(GaugeSegmentSchemaPos).safeParse(_segments);
    segmentsType = fromSegments.success
      ? "from"
      : posSegments.success
        ? "pos"
        : hasSegments && typeof _segments === "string"
          ? "template"
          : "none";

    showSegmentsPanel = segmentsType !== "template";
    showSortSegmentsButton =
      Array.isArray(_segments) &&
      _segments.length > 1 &&
      !isArraySorted(_segments, segmentsType);

    _hasGradient =
      config.inner!.gradient ||
      (config.inner?.mode === "severity" && config.inner?.gradient_background);
    showConvertAlert = segmentsType !== "none" && _hasGradient === true;

    const inner_mode = config.inner?.mode ?? DEFAULTS.inner.mode;
    isSeverity = inner_mode === "severity";

    const showSeverityGaugeOptions = isSeverity;
    const showGradientBackgroundOptions =
      (isSeverity && config.inner?.gradient_background) ?? false;

    const showGradientOptions = ["static", "needle"].includes(inner_mode);

    const showMinMaxIndicatorOptions = inner_mode !== "severity";
    const minIndicatorType = config.inner?.min_indicator?.type ?? undefined;
    const maxIndicatorType = config.inner?.max_indicator?.type ?? undefined;
    const setpointType = config.inner?.setpoint?.type ?? undefined;

    innerGaugeSchema = _innerGaugeSchema(
      lang,
      config.entity2,
      hasSegments,
      showSeverityGaugeOptions,
      showGradientBackgroundOptions,
      showGradientOptions,
      showMinMaxIndicatorOptions,
      minIndicatorType,
      maxIndicatorType,
      setpointType
    );
  }

  return html`
    ${ctx.createHAForm(config, enableInnerSchema)}
    ${enabelInner
      ? html` <div class="content">
          ${showSegmentsPanel!
            ? html` <ha-expansion-panel
                class="expansion-panel"
                outlined
                expanded
                .header="${localize(lang, "segments")}"
              >
                <ha-icon slot="leading-icon" icon="mdi:segment"></ha-icon>
                <div class="content">
                  ${showConvertAlert!
                    ? ctx.createConvertSegmentsAlert(
                        "inner",
                        isSeverity!,
                        segmentsType!
                      )
                    : nothing}
                  ${segmentsType! === "from"
                    ? html`${fromSegments!.data!.map((segment, index) => {
                        return ctx.createSegmentPanel(
                          "inner",
                          "from",
                          segment,
                          index
                        );
                      })}`
                    : segmentsType! === "pos"
                      ? html`${posSegments.data!.map((segment, index) => {
                          return ctx.createSegmentPanel(
                            "inner",
                            "pos",
                            segment,
                            index
                          );
                        })}`
                      : nothing}
                  ${ctx.createButton(
                    localize(lang, "add_segment"),
                    () => ctx.addSegment("inner"),
                    "mdi:plus",
                    "small",
                    "brand",
                    "filled"
                  )}
                  ${showSortSegmentsButton!
                    ? ctx.createButton(
                        localize(lang, "sort"),
                        () => ctx.sortSegments("inner"),
                        "mdi:sort",
                        "small",
                        "neutral",
                        "plain"
                      )
                    : nothing}
                </div>
              </ha-expansion-panel>`
            : nothing}
          ${ctx.createHAForm(config, innerGaugeSchema, true, "inner")}
        </div>`
      : nothing}
  `;
}
