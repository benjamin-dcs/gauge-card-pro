// External dependencies
import type { TemplateResult } from "lit";
import type { HomeAssistant } from "../dependencies/ha";
import type { GaugeCardProCardConfig } from "../card/config";
import type { Feature, Gauge } from "../card/types/types";

//=============================================================================
// EDITOR
//=============================================================================

export interface EditorRenderContext {
  hass: HomeAssistant;
  createHAForm: (
    config: GaugeCardProCardConfig,
    schema: unknown,
    large_margin?: boolean,
    gauge?: Gauge | "none"
  ) => TemplateResult<1>;
  createButton: (
    text: string,
    clickFunction: () => void,
    icon?: string,
    size?: "medium" | "small" | undefined,
    variant?:
      "success" | "brand" | "neutral" | "danger" | "warning" | undefined,
    appearance?: "accent" | "filled" | "plain" | undefined
  ) => TemplateResult<1>;
  createConvertSegmentsAlert: (
    gauge: "main" | "inner",
    isSeverity: boolean,
    segmentsType: "from" | "pos" | "template" | "none"
  ) => TemplateResult<1>;
  createSegmentPanel: (
    gauge: Gauge,
    type: "from" | "pos",
    segment: object,
    index: number
  ) => TemplateResult<1>;
  addSegment: (gauge: "main" | "inner") => void;
  sortSegments: (gauge: "main" | "inner") => void;
  addFeature: (ev: CustomEvent) => void;
  deleteFeature: (feature: Feature) => void;
}
