// External dependencies
import memoizeOne from "memoize-one";
import { mdiChartDonut, mdiCircleSlice4, mdiShapeOutline } from "@mdi/js";

// Internalized external dependencies
import { HomeAssistant } from "../../../dependencies/ha";

// Editor utilities
import { localize } from "../../../utils/localize";

type gradientResolutionModes = "presets" | "numerical";

export const advancedSchema = memoizeOne(
  (
    hass: HomeAssistant,
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
                options: ["presets", "numerical"].map((mode) => ({
                  value: mode,
                  label: localize(hass, mode),
                })),
              },
            },
          },
          ...(mainGradientResolutionMode === "presets"
            ? [
                {
                  name: "gradient_resolution",
                  disabled: !enableMainGradientResolution,
                  selector: {
                    select: {
                      mode: "dropdown",
                      options: [
                        {
                          value: "auto",
                          label: localize(
                            hass,
                            "gradient_resolution_options.auto"
                          ),
                        },
                        {
                          value: "very_low",
                          label: localize(
                            hass,
                            "gradient_resolution_options.very_low"
                          ),
                        },
                        {
                          value: "low",
                          label: localize(
                            hass,
                            "gradient_resolution_options.low"
                          ),
                        },
                        {
                          value: "medium",
                          label: localize(
                            hass,
                            "gradient_resolution_options.medium"
                          ),
                        },
                      ],
                    },
                  },
                },
              ]
            : [
                {
                  name: "gradient_resolution",
                  disabled: !enableMainGradientResolution,
                  selector: {
                    number: {
                      mode: "box",
                      step: 1,
                    },
                  },
                },
              ]),
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
                      options: ["presets", "numerical"].map((mode) => ({
                        value: mode,
                        label: localize(hass, mode),
                      })),
                    },
                  },
                },
                ...(innerGradientResolutionMode === "presets"
                  ? [
                      {
                        name: "gradient_resolution",
                        disabled: !enableInnerGradientResolution,
                        selector: {
                          select: {
                            mode: "dropdown",
                            options: [
                              {
                                value: "auto",
                                label: localize(
                                  hass,
                                  "gradient_resolution_options.auto"
                                ),
                              },
                              {
                                value: "very_low",
                                label: localize(
                                  hass,
                                  "gradient_resolution_options.very_low"
                                ),
                              },
                              {
                                value: "low",
                                label: localize(
                                  hass,
                                  "gradient_resolution_options.low"
                                ),
                              },
                              {
                                value: "medium",
                                label: localize(
                                  hass,
                                  "gradient_resolution_options.medium"
                                ),
                              },
                            ],
                          },
                        },
                      },
                    ]
                  : [
                      {
                        name: "gradient_resolution",
                        disabled: !enableMainGradientResolution,
                        selector: {
                          number: {
                            mode: "box",
                            step: 1,
                          },
                        },
                      },
                    ]),
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
