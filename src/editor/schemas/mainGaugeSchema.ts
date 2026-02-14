// External dependencies
import memoizeOne from "memoize-one";
import { mdiBullseyeArrow, mdiGaugeEmpty, mdiGaugeFull } from "@mdi/js";

// Internalized external dependencies
import { HomeAssistant } from "../../dependencies/ha";

// Editor utilities
import { localize } from "../../utils/localize";

export const mainGaugeSchema = memoizeOne(
  (
    hass: HomeAssistant,
    entity: string | undefined,
    showGradientOptions: boolean,
    showSeverityGaugeOptions: boolean,
    showGradientBackgroundOptions: boolean,
    showMinMaxIndicatorOptions: boolean,
    minIndicatorType: string | undefined,
    hasMinIndicatorLabel: boolean,
    maxIndicatorType: string | undefined,
    hasMaxIndicatorLabel: boolean,
    setpointType: string | undefined,
    hasSetpointLabel: boolean
  ) => [
    {
      name: "attribute",
      selector: { attribute: { entity_id: entity } },
    },
    {
      type: "grid",
      name: "",
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
      schema: [
        {
          name: "needle",
          selector: { boolean: {} },
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
      : [{ type: "constant", name: "configure_segments" }]),
    ...(showGradientBackgroundOptions
      ? [
          {
            type: "grid",
            name: "",
            schema: [
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
                name: "",
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
            ],
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
              value: "medium",
              label: localize(hass, "round_medium"),
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
            expanded: minIndicatorType !== undefined,
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
                              label: localize(hass, "attribute_main"),
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
                      selector: { number: { mode: "box" } },
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
              ...(minIndicatorType !== undefined
                ? [
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
                    {
                      name: "label",
                      selector: { boolean: {} },
                    },
                    ...(hasMinIndicatorLabel
                      ? [
                          {
                            name: "label_color",
                            selector: { template: {} },
                          },
                          {
                            name: "precision",
                            selector: {
                              number: {
                                mode: "slider",
                                step: 1,
                                min: 0,
                                max: 3,
                              },
                            },
                          },
                        ]
                      : []),
                  ]
                : []),
            ],
          },
          {
            name: "max_indicator",
            iconPath: mdiGaugeFull,
            type: "expandable",
            expanded: maxIndicatorType !== undefined,
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
                              label: localize(hass, "attribute_main"),
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
                      selector: { number: { mode: "box" } },
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
              ...(maxIndicatorType !== undefined
                ? [
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
                    {
                      name: "label",
                      selector: { boolean: {} },
                    },

                    ...(hasMaxIndicatorLabel
                      ? [
                          {
                            name: "label_color",
                            selector: { template: {} },
                          },
                          {
                            name: "precision",
                            selector: {
                              number: {
                                mode: "slider",
                                step: 1,
                                min: 0,
                                max: 3,
                              },
                            },
                          },
                        ]
                      : []),
                  ]
                : []),
            ],
          },
        ]
      : []),
    {
      name: "setpoint",
      iconPath: mdiBullseyeArrow,
      type: "expandable",
      expanded: setpointType !== undefined,
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
                        label: localize(hass, "attribute_main"),
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
                    domain: ["counter", "input_number", "number", "sensor"],
                  },
                },
              },
            ]
          : []),
        ...(setpointType === "number"
          ? [
              {
                name: "value",
                selector: { number: { mode: "box" } },
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
        {
          name: "label",
          selector: { boolean: {} },
        },
        ...(hasSetpointLabel
          ? [
              {
                name: "precision",
                selector: {
                  number: { mode: "slider", step: 1, min: 0, max: 3 },
                },
              },
            ]
          : []),
      ],
    },
  ]
);
