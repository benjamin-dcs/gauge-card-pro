// External dependencies
import memoizeOne from "memoize-one";
import { mdiBullseyeArrow, mdiGaugeEmpty, mdiGaugeFull } from "@mdi/js";

// Internalized external dependencies
import { HaFormSchema } from "../../dependencies/mushroom";
import { HomeAssistant } from "../../dependencies/ha";

// Editor utilities
import { localize } from "../../utils/localize";

export const enableInnerSchema = [
  { name: "enable_inner", selector: { boolean: {} } },
] as const satisfies readonly HaFormSchema[];

export const innerGaugeSchema = memoizeOne(
  (
    hass: HomeAssistant,
    entity: string | undefined,
    showGradientOptions: boolean,
    showSeverityGaugeOptions: boolean,
    showGradientBackgroundOptions: boolean,
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
            name: "attribute",
            selector: { attribute: { entity_id: entity } },
          },
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
            type: "grid",
            name: "",
            column_min_width: "100px",
            schema: [
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
              ...(showSeverityGaugeOptions
                ? [
                    {
                      name: "severity_centered",
                      selector: { boolean: {} },
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
          ...(showGradientOptions
            ? [
                {
                  type: "grid",
                  name: "",
                  column_min_width: "100px",
                  schema: [
                    {
                      name: "gradient",
                      selector: { boolean: {} },
                    },
                    ...(showSeverityGaugeOptions
                      ? [
                          {
                            name: "gradient_background",
                            selector: { boolean: {} },
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
              ]
            : [{ type: "constant", name: "configure_inner_segments" }]),
          ...(showGradientBackgroundOptions
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
                            ...(entity !== undefined
                              ? [
                                  {
                                    value: "attribute",
                                    label: localize(hass, "attribute_inner"),
                                  },
                                ]
                              : [{}]),
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
                    ...(minIndicatorType === "attribute"
                      ? [
                          {
                            name: "value",
                            selector: { attribute: { entity_id: entity } },
                          },
                        ]
                      : []),
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
                            ...(entity !== undefined
                              ? [
                                  {
                                    value: "attribute",
                                    label: localize(hass, "attribute_inner"),
                                  },
                                ]
                              : [{}]),
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
                    ...(maxIndicatorType === "attribute"
                      ? [
                          {
                            name: "value",
                            selector: { attribute: { entity_id: entity } },
                          },
                        ]
                      : []),
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
                      ...(entity !== undefined
                        ? [
                            {
                              value: "attribute",
                              label: localize(hass, "attribute_inner"),
                            },
                          ]
                        : [{}]),
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
              ...(setpointType === "attribute"
                ? [
                    {
                      name: "value",
                      selector: { attribute: { entity_id: entity } },
                    },
                  ]
                : []),
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
