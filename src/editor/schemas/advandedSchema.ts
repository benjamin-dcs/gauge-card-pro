// External dependencies
import memoizeOne from "memoize-one";
import { mdiChartDonut, mdiCircleSlice4, mdiShapeOutline } from "@mdi/js";

// Internalized external dependencies
import { HomeAssistant } from "../../dependencies/ha";

// Editor utilities
import { localize } from "../../utils/localize";
import { DEFAULTS } from "../../constants/defaults";

type gradientResolutionModes = "auto" | "numerical";

export const advancedSchema = memoizeOne(
  (
    lang: string,
    enableMainGradientResolution: boolean,
    mainGradientResolutionMode: gradientResolutionModes,
    hasInner: boolean,
    enableInnerGradientResolution: boolean,
    innerGradientResolutionMode: gradientResolutionModes
  ) =>
    [
      {
        name: "main_gauge",
        iconPath: mdiChartDonut,
        type: "expandable",
        flatten: true,
        expanded: true,
        schema: [
          {
            name: "gradient_resolution_mode",
            disabled: !enableMainGradientResolution,
            selector: {
              select: {
                multiple: false,
                mode: "list",
                options: ["auto", "numerical"].map((mode) => ({
                  value: mode,
                  label: localize(lang, mode),
                })),
              },
            },
          },
          ...(mainGradientResolutionMode === "numerical"
            ? [
                {
                  name: "gradient_resolution",
                  disabled: !enableMainGradientResolution,
                  selector: {
                    number: {
                      mode: "box",
                      step: 1,
                      min: DEFAULTS.gradient.numericalResolutionMin,
                      max: DEFAULTS.gradient.numericalResolutionMax,
                    },
                  },
                },
              ]
            : []),
        ],
      },
      ...(hasInner
        ? [
            {
              name: "inner",
              iconPath: mdiCircleSlice4,
              type: "expandable",
              flatten: false,
              expanded: true,
              schema: [
                {
                  name: "gradient_resolution_mode",
                  disabled: !enableInnerGradientResolution,
                  selector: {
                    select: {
                      multiple: false,
                      mode: "list",
                      options: ["auto", "numerical"].map((mode) => ({
                        value: mode,
                        label: localize(lang, mode),
                      })),
                    },
                  },
                },
                ...(innerGradientResolutionMode === "numerical"
                  ? [
                      {
                        name: "gradient_resolution",
                        disabled: !enableMainGradientResolution,
                        selector: {
                          number: {
                            mode: "box",
                            step: 1,
                            min: DEFAULTS.gradient.numericalResolutionMin,
                            max: DEFAULTS.gradient.numericalResolutionMax,
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),

      {
        name: "shapes",
        iconPath: mdiShapeOutline,
        type: "expandable",
        flatten: false,
        schema: [
          {
            name: "main_needle",
            selector: { template: {} },
          },
          {
            name: "main_min_indicator",
            selector: { template: {} },
          },
          {
            name: "main_max_indicator",
            selector: { template: {} },
          },
          {
            name: "main_setpoint_needle",
            selector: { template: {} },
          },
          {
            name: "inner_needle",
            selector: { template: {} },
          },
          {
            name: "inner_min_indicator",
            selector: { template: {} },
          },
          {
            name: "inner_max_indicator",
            selector: { template: {} },
          },
          {
            name: "inner_setpoint_needle",
            selector: { template: {} },
          },
        ],
      },
    ] as const
);
