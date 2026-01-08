// External dependencies
import memoizeOne from "memoize-one";
import {
  mdiAlphabeticalVariant,
  mdiBullseyeArrow,
  mdiFormatListNumbered,
  mdiGaugeEmpty,
  mdiGaugeFull,
  mdiGestureTap,
  mdiLayers,
  mdiLayersOutline,
  mdiNumeric,
  mdiSimpleIcons,
} from "@mdi/js";

// Internalized external dependencies
import { HomeAssistant } from "../../dependencies/ha";

import { HaFormSchema } from "../../dependencies/mushroom";

import setupCustomlocalize from "../../localize";

export function localize(hass, value: string): string {
  // https://github.com/home-assistant/frontend/blob/dev/src/translations/en.json
  // Paste in https://play.jqlang.org/
  // Search for value in pasted windows (JSON)
  // Top of window shows the path
  if (value === undefined) {
    return value;
  }
  switch (value) {
    case "battery":
      return hass!.localize(
        "ui.panel.lovelace.cards.energy.energy_distribution.battery"
      );
    case "color":
    case "primary_color":
    case "secondary_color":
      return hass!.localize("ui.panel.lovelace.editor.card.tile.color");
    case "icon":
      return hass!.localize("ui.components.selectors.selector.types.icon");
    case "max":
      return hass!.localize("ui.panel.lovelace.editor.card.generic.maximum");
    case "min":
      return hass!.localize("ui.panel.lovelace.editor.card.generic.minimum");
    case "template":
      return hass!.localize("ui.components.selectors.selector.types.template");
    case "primary_unit":
    case "secondary_unit":
      return hass!.localize(
        "ui.dialogs.entity_registry.editor.unit_of_measurement"
      );
    case "type":
      return hass!.localize("ui.panel.config.helpers.picker.headers.type");
    case "tap_action":
    case "hold_action":
    case "double_tap_action":
      return hass!.localize(`ui.panel.lovelace.editor.card.generic.${value}`);
    default:
      const customLocalize = setupCustomlocalize(hass!);
      if (value.toString().startsWith("migration")) {
        return customLocalize(`${value}`);
      } else {
        return customLocalize(`editor.card.${value}`);
      }
  }
}

export const entitiesSchema = memoizeOne(
  () =>
    [
      {
        name: "header",
        type: "string",
      },
      {
        name: "entities",
        iconPath: mdiFormatListNumbered,
        type: "expandable",
        expanded: true,
        flatten: true,
        schema: [
          {
            name: "entity",
            selector: {
              entity: {
                domain: ["counter", "input_number", "number", "sensor"],
              },
            },
          },
          {
            name: "entity2",
            selector: {
              entity: {
                domain: ["counter", "input_number", "number", "sensor"],
              },
            },
          },
        ],
      },
    ] as const satisfies readonly HaFormSchema[]
);

export const mainGaugeSchema = memoizeOne(
  (
    hass: HomeAssistant,
    showGradientOptions: boolean,
    showColorInterpolationNote: "none" | "off" | "on",
    showGradientResolution: boolean,
    showSeverityGaugeOptions: boolean,
    showGradientBackgroundResolution: boolean,
    showMinMaxIndicatorOptions: boolean,
    minIndicatorType: string | undefined,
    hasMinIndicatorLabel: boolean,
    maxIndicatorType: string | undefined,
    hasMaxIndicatorLabel: boolean,
    setpointType: string | undefined,
    hasSetpointLabel: boolean
  ) =>
    [
      {
        type: "grid",
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
        schema: [{ name: "needle", selector: { boolean: {} } }, {}],
      },
      ...(showGradientOptions
        ? [
            {
              type: "grid",
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
                              {
                                value: "high",
                                label: localize(
                                  hass,
                                  "gradient_resolution_options.high"
                                ),
                              },
                            ],
                          },
                        },
                      },
                    ]
                  : [{}]),
              ],
            },
            ...(showColorInterpolationNote === "off"
              ? [
                  {
                    type: "constant",
                    name: "color_interpolation_note_off",
                  },
                ]
              : [{}]),
            ...(showColorInterpolationNote === "on"
              ? [
                  {
                    type: "constant",
                    name: "color_interpolation_note_on",
                  },
                ]
              : [{}]),
          ]
        : [{ type: "constant", name: "configure_segments" }]),
      ...(showSeverityGaugeOptions
        ? [
            {
              type: "grid",
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
                              {
                                value: "high",
                                label: localize(
                                  hass,
                                  "gradient_resolution_options.high"
                                ),
                              },
                            ],
                          },
                        },
                      },
                    ]
                  : [{}]),
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
                      {},
                    ],
                  },
                ]
              : [{}]),
          ]
        : [{}]),
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
                  : [{}]),
                ...(minIndicatorType === "number"
                  ? [
                      {
                        name: "value",
                        selector: { number: { mode: "box", step: "any" } },
                      },
                    ]
                  : [{}]),
                ...(minIndicatorType === "template"
                  ? [
                      {
                        name: "value",
                        selector: { template: {} },
                      },
                    ]
                  : [{}]),
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
                        : [{}]),
                    ]
                  : [{}]),
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
                  : [{}]),
                ...(maxIndicatorType === "number"
                  ? [
                      {
                        name: "value",
                        selector: { number: { mode: "box", step: "any" } },
                      },
                    ]
                  : [{}]),
                ...(maxIndicatorType === "template"
                  ? [
                      {
                        name: "value",
                        selector: { template: {} },
                      },
                    ]
                  : [{}]),
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
                        : [{}]),
                    ]
                  : [{}]),
              ],
            },
          ]
        : [{}]),
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
                      domain: ["counter", "input_number", "number", "sensor"],
                    },
                  },
                },
              ]
            : [{}]),
          ...(setpointType === "number"
            ? [
                {
                  name: "value",
                  selector: { number: { mode: "box", step: "any" } },
                },
              ]
            : [{}]),
          ...(setpointType === "template"
            ? [
                {
                  name: "value",
                  selector: { template: {} },
                },
              ]
            : [{}]),
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
            : [{}]),
        ],
      },
    ] as const
);

export const enableInnerSchema = memoizeOne(
  () =>
    [
      { name: "enable_inner", selector: { boolean: {} } },
    ] as const satisfies readonly HaFormSchema[]
);

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
            type: "grid",
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
              {},
            ],
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
                                  {
                                    value: "high",
                                    label: localize(
                                      hass,
                                      "gradient_resolution_options.high"
                                    ),
                                  },
                                ],
                              },
                            },
                          },
                        ]
                      : []),
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
                                  {
                                    value: "high",
                                    label: localize(
                                      hass,
                                      "gradient_resolution_options.high"
                                    ),
                                  },
                                ],
                              },
                            },
                          },
                        ]
                      : []),
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
                          {},
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
                      : [{}]),
                    ...(minIndicatorType === "number"
                      ? [
                          {
                            name: "value",
                            selector: {
                              number: { mode: "box", step: "any" },
                            },
                          },
                        ]
                      : [{}]),
                    ...(minIndicatorType === "template"
                      ? [
                          {
                            name: "value",
                            selector: { template: {} },
                          },
                        ]
                      : [{}]),
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
                      : [{}]),
                    ...(maxIndicatorType === "number"
                      ? [
                          {
                            name: "value",
                            selector: {
                              number: { mode: "box", step: "any" },
                            },
                          },
                        ]
                      : [{}]),
                    ...(maxIndicatorType === "template"
                      ? [
                          {
                            name: "value",
                            selector: { template: {} },
                          },
                        ]
                      : [{}]),
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
            : [{}]),
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
                : [{}]),
              ...(setpointType === "number"
                ? [
                    {
                      name: "value",
                      selector: {
                        number: { mode: "box", step: "any" },
                      },
                    },
                  ]
                : [{}]),
              ...(setpointType === "template"
                ? [
                    {
                      name: "value",
                      selector: { template: {} },
                    },
                  ]
                : [{}]),
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

export const cardFeaturesSchema = memoizeOne(
  (hass: HomeAssistant, iconType: string | undefined) =>
    [
      {
        name: "titles",
        iconPath: mdiAlphabeticalVariant,
        type: "expandable",
        flatten: false,
        schema: [
          {
            name: "primary_header",
            iconPath: mdiLayers,
            type: "expandable",
            flatten: true,
            expanded: true,
            schema: [
              {
                name: "primary",
                selector: { template: {} },
              },
              {
                name: "primary_color",
                selector: { template: {} },
              },
              {
                name: "primary_font_size",
                selector: { template: {} },
              },
            ],
          },
          {
            name: "secondary_header",
            iconPath: mdiLayersOutline,
            type: "expandable",
            flatten: true,
            schema: [
              {
                name: "secondary",
                selector: { template: {} },
              },
              {
                name: "secondary_color",
                selector: { template: {} },
              },
              {
                name: "secondary_font_size",
                selector: { template: {} },
              },
            ],
          },
        ],
      },
      {
        name: "value_texts",
        iconPath: mdiNumeric,
        type: "expandable",
        flatten: false,
        schema: [
          { type: "constant", name: "value_texts_note1" },
          {
            type: "constant",
            name: "value_texts_note2",
            value: 'secondary: ""',
          },
          { type: "constant", name: "value_texts_note3" },
          {
            name: "primary_header",
            iconPath: mdiLayers,
            type: "expandable",
            flatten: true,
            expanded: true,
            schema: [
              {
                name: "primary",
                selector: { template: {} },
              },
              {
                name: "primary_color",
                selector: { template: {} },
              },
              {
                name: "primary_unit",
                selector: { template: {} },
              },
              {
                name: "primary_unit_before_value",
                selector: { boolean: {} },
              },
              {
                name: "primary_font_size_reduction",
                selector: {
                  number: {
                    mode: "slider",
                    step: "0.5",
                    max: 15,
                    min: 0,
                  },
                },
              },
            ],
          },
          {
            name: "secondary_header",
            iconPath: mdiLayersOutline,
            type: "expandable",
            flatten: true,
            schema: [
              {
                name: "secondary",
                selector: { template: {} },
              },
              {
                name: "secondary_color",
                selector: { template: {} },
              },
              {
                name: "secondary_unit",
                selector: { template: {} },
              },
              {
                name: "secondary_unit_before_value",
                selector: { boolean: {} },
              },
            ],
          },
        ],
      },
      {
        name: "icon",
        iconPath: mdiSimpleIcons,
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
                    value: "battery",
                    label: localize(hass, "battery"),
                  },
                  {
                    value: "template",
                    label: localize(hass, "template"),
                  },
                ],
              },
            },
          },

          ...(iconType === "battery"
            ? [
                {
                  name: "value",
                  selector: {
                    entity: {
                      domain: ["sensor"],
                    },
                  },
                },
                {
                  name: "state",
                  selector: {
                    entity: {
                      domain: ["sensor"],
                    },
                  },
                },
                {
                  type: "grid",
                  schema: [
                    {
                      name: "threshold",
                      selector: {
                        number: {
                          mode: "box",
                          step: "any",
                          min: 0,
                          max: 100,
                        },
                      },
                    },
                    { name: "hide_label", selector: { boolean: {} } },
                  ],
                },
                {
                  type: "grid",
                  schema: [
                    {
                      name: "left",
                      selector: { boolean: {} },
                    },
                    {},
                  ],
                },
              ]
            : [{}]),
          ...(iconType === "template"
            ? [
                {
                  name: "value",
                  selector: { template: {} },
                },
              ]
            : [{}]),
        ],
      },
      {
        name: "interactions",
        type: "expandable",
        flatten: true,
        iconPath: mdiGestureTap,
        schema: [
          {
            name: "tap_action",
            selector: {
              ui_action: {
                default_action: "more-info",
              },
            },
          },
          {
            name: "primary_value_text_tap_action",
            selector: {
              ui_action: {
                default_action: "none",
              },
            },
          },
          {
            name: "secondary_value_text_tap_action",
            selector: {
              ui_action: {
                default_action: "none",
              },
            },
          },
          {
            name: "icon_tap_action",
            selector: {
              ui_action: {
                default_action: "none",
              },
            },
          },
          {
            name: "",
            type: "optional_actions",
            flatten: true,
            schema: (
              [
                "hold_action",
                "double_tap_action",
                "primary_value_text_hold_action",
                "primary_value_text_double_tap_action",
                "secondary_value_text_hold_action",
                "secondary_value_text_double_tap_action",
                "icon_hold_action",
                "icon_double_tap_action",
              ] as const
            ).map((action) => ({
              name: action,
              selector: {
                ui_action: {
                  default_action: "none" as const,
                },
              },
            })),
          },
        ],
      },
      {
        name: "hide_background",
        selector: { boolean: {} },
      },
    ] as const
);
