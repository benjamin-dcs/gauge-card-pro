// External dependencies
import memoizeOne from "memoize-one";
import { mdiBullseyeArrow, mdiGaugeEmpty, mdiGaugeFull } from "@mdi/js";

// Internalized external dependencies
import { HomeAssistant } from "../../../dependencies/ha";

// Editor utilities
import { localize } from "../../../utils/localize";

export const innerGaugeSchema = memoizeOne(
  (
    hass: HomeAssistant,
    showGradient: boolean,
    showColorInterpolationNote: "none" | "off" | "on",
    showGradientResolution: boolean,
    showGradientBackgroundOptions: boolean,
    showGradientBackgroundResolution: boolean,
    showMinMaxIndicatorOptions: boolean,
    minIndicatorType: string | undefined,
    maxIndicatorType: string | undefined,
    setpointType: string | undefined
  ) =>
    [
      {
        type: "grid",
        name: "inner",
        flatten: false,
        column_min_width: "100%",
        schema: [
          {
            type: "grid",
            column_min_width: "100px",
            schema: [
              {
                name: "min",
                selector: { number: { mode: "box", step: "any" } },
              },
              {
                name: "max",
                selector: { number: { mode: "box", step: "any" } },
              },
            ],
          },
          {
            name: "mode",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  {
                    value: "severity",
                    label: localize(hass, "inner_mode_options.severity"),
                  },
                  {
                    value: "static",
                    label: localize(hass, "inner_mode_options.static"),
                  },
                  {
                    value: "needle",
                    label: localize(hass, "inner_mode_options.needle"),
                  },
                  {
                    value: "on_main",
                    label: localize(hass, "inner_mode_options.on_main"),
                  },
                ],
              },
            },
          },
          ...(showGradient
            ? [
                {
                  type: "grid",
                  column_min_width: "100px",
                  schema: [
                    { name: "gradient", selector: { boolean: {} } },

                    ...(showGradientResolution
                      ? [
                          {
                            name: "gradient_resolution",
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
                            type: "constant",
                            name: "spacer",
                          },
                        ]),
                  ],
                },
                ...(showColorInterpolationNote === "off"
                  ? [
                      {
                        type: "constant",
                        name: "color_interpolation_note_off",
                      },
                    ]
                  : []),
                ...(showColorInterpolationNote === "on"
                  ? [
                      {
                        type: "constant",
                        name: "color_interpolation_note_on",
                      },
                    ]
                  : []),
              ]
            : [{ type: "constant", name: "configure_inner_segments" }]),
          ...(showGradientBackgroundOptions
            ? [
                {
                  type: "grid",
                  column_min_width: "100px",
                  schema: [
                    {
                      name: "gradient_background",
                      selector: { boolean: {} },
                    },

                    ...(showGradientBackgroundResolution
                      ? [
                          {
                            name: "gradient_resolution",
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
                            type: "constant",
                            name: "spacer",
                          },
                        ]),
                  ],
                },
                ...(showGradientBackgroundResolution
                  ? [
                      {
                        name: "gradient_background_opacity",
                        selector: {
                          number: {
                            mode: "slider",
                            min: 0,
                            max: 1,
                            step: 0.01,
                          },
                        },
                      },
                      {
                        type: "grid",
                        schema: [
                          {
                            name: "marker",
                            selector: { boolean: {} },
                          },
                          {
                            type: "constant",
                            name: "spacer",
                          },
                        ],
                      },
                    ]
                  : []),
              ]
            : []),
          {
            name: "round",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  {
                    value: "off",
                    label: localize(hass, "round_off"),
                  },
                  {
                    value: "full",
                    label: localize(hass, "round_full"),
                  },
                  {
                    value: "small",
                    label: localize(hass, "round_small"),
                  },
                ],
              },
            },
          },
          ...(showMinMaxIndicatorOptions
            ? [
                {
                  name: "min_indicator",
                  iconPath: mdiGaugeEmpty,
                  type: "expandable",
                  flatten: false,
                  schema: [
                    {
                      name: "type",
                      selector: {
                        select: {
                          mode: "dropdown",
                          options: [
                            {
                              value: "entity",
                              label: localize(hass, "setpoint_entity"),
                            },
                            {
                              value: "number",
                              label: localize(hass, "number"),
                            },
                            {
                              value: "template",
                              label: localize(hass, "template"),
                            },
                          ],
                        },
                      },
                    },
                    ...(minIndicatorType === "entity"
                      ? [
                          {
                            name: "value",
                            selector: {
                              entity: {
                                domain: [
                                  "counter",
                                  "input_number",
                                  "number",
                                  "sensor",
                                ],
                              },
                            },
                          },
                        ]
                      : []),
                    ...(minIndicatorType === "number"
                      ? [
                          {
                            name: "value",
                            selector: {
                              number: { mode: "box", step: "any" },
                            },
                          },
                        ]
                      : []),
                    ...(minIndicatorType === "template"
                      ? [
                          {
                            name: "value",
                            selector: { template: {} },
                          },
                        ]
                      : []),
                    {
                      name: "color",
                      selector: { template: {} },
                    },
                    {
                      name: "opacity",
                      selector: {
                        number: {
                          mode: "slider",
                          min: 0,
                          max: 1,
                          step: 0.01,
                        },
                      },
                    },
                  ],
                },
                {
                  name: "max_indicator",
                  iconPath: mdiGaugeFull,
                  type: "expandable",
                  flatten: false,
                  schema: [
                    {
                      name: "type",
                      selector: {
                        select: {
                          mode: "dropdown",
                          options: [
                            {
                              value: "entity",
                              label: localize(hass, "setpoint_entity"),
                            },
                            {
                              value: "number",
                              label: localize(hass, "number"),
                            },
                            {
                              value: "template",
                              label: localize(hass, "template"),
                            },
                          ],
                        },
                      },
                    },
                    ...(maxIndicatorType === "entity"
                      ? [
                          {
                            name: "value",
                            selector: {
                              entity: {
                                domain: [
                                  "counter",
                                  "input_number",
                                  "number",
                                  "sensor",
                                ],
                              },
                            },
                          },
                        ]
                      : []),
                    ...(maxIndicatorType === "number"
                      ? [
                          {
                            name: "value",
                            selector: {
                              number: { mode: "box", step: "any" },
                            },
                          },
                        ]
                      : []),
                    ...(maxIndicatorType === "template"
                      ? [
                          {
                            name: "value",
                            selector: { template: {} },
                          },
                        ]
                      : []),
                    {
                      name: "color",
                      selector: { template: {} },
                    },
                    {
                      name: "opacity",
                      selector: {
                        number: {
                          mode: "slider",
                          min: 0,
                          max: 1,
                          step: 0.01,
                        },
                      },
                    },
                  ],
                },
              ]
            : []),
          {
            name: "setpoint",
            iconPath: mdiBullseyeArrow,
            type: "expandable",
            flatten: false,
            schema: [
              {
                name: "type",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: [
                      {
                        value: "entity",
                        label: localize(hass, "setpoint_entity"),
                      },
                      {
                        value: "number",
                        label: localize(hass, "number"),
                      },
                      {
                        value: "template",
                        label: localize(hass, "template"),
                      },
                    ],
                  },
                },
              },
              ...(setpointType === "entity"
                ? [
                    {
                      name: "value",
                      selector: {
                        entity: {
                          domain: [
                            "counter",
                            "input_number",
                            "number",
                            "sensor",
                          ],
                        },
                      },
                    },
                  ]
                : []),
              ...(setpointType === "number"
                ? [
                    {
                      name: "value",
                      selector: {
                        number: { mode: "box", step: "any" },
                      },
                    },
                  ]
                : []),
              ...(setpointType === "template"
                ? [
                    {
                      name: "value",
                      selector: { template: {} },
                    },
                  ]
                : []),
              {
                name: "color",
                selector: { template: {} },
              },
            ],
          },
        ],
      },
    ] as const
);
