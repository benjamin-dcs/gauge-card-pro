// External dependencies
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import memoizeOne from "memoize-one";
import { assert, boolean } from "superstruct";
import {
  mdiAlphabeticalVariant,
  mdiBullseyeArrow,
  mdiFormatListNumbered,
  mdiGauge,
  mdiGaugeEmpty,
  mdiGaugeFull,
  mdiGestureTap,
  mdiLayers,
  mdiLayersOutline,
  mdiNumeric,
  mdiSimpleIcons,
} from "@mdi/js";
import { z } from "zod";

// Internalized external dependencies
import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardEditor,
  fireEvent,
} from "../dependencies/ha";

import {
  HaFormBaseSchema,
  HaFormSchema,
  loadHaComponents,
} from "../dependencies/mushroom";

// Local utilities
import { migrate_parameters } from "../utils/migrate-parameters";
import { deleteKey } from "../utils/object/delete-key";
import { trySetValue } from "../utils/object/set-value";
import setupCustomlocalize from "../localize";

// Local constants & types
import {
  GaugeCardProCardConfig,
  gaugeCardProConfigStruct,
  GaugeSegmentSchemaFrom,
  GaugeSegmentSchemaPos,
} from "./config";

import { DEFAULT_GRADIENT_RESOLUTION } from "./const";

export interface ConfigChangedEvent {
  config: LovelaceCardConfig;
  error?: string;
  guiModeAvailable?: boolean;
}

declare global {
  interface HASSDomEvents {
    // @ts-ignore
    "config-changed": ConfigChangedEvent;
  }
}

@customElement("gauge-card-pro-editor")
export class GaugeCardProEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: GaugeCardProCardConfig | undefined;

  public get _config(): GaugeCardProCardConfig | undefined {
    return this.config;
  }
  public set _config(value: GaugeCardProCardConfig | undefined) {
    value = migrate_parameters(value);
    this.config = value;
  }

  private _entitiesSchema = memoizeOne(
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

  private _mainGaugeSchema = memoizeOne(
    (
      showGradientOptions: boolean,
      showColorInterpolationNote: "none" | "off" | "on",
      showGradientResolution: boolean,
      showGradientBackgroundOptions: boolean,
      showGradientBackgroundResolution: boolean,
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
                                  label: this._localize(
                                    "gradient_resolution_options.auto"
                                  ),
                                },
                                {
                                  value: "very_low",
                                  label: this._localize(
                                    "gradient_resolution_options.very_low"
                                  ),
                                },
                                {
                                  value: "low",
                                  label: this._localize(
                                    "gradient_resolution_options.low"
                                  ),
                                },
                                {
                                  value: "medium",
                                  label: this._localize(
                                    "gradient_resolution_options.medium"
                                  ),
                                },
                                {
                                  value: "high",
                                  label: this._localize(
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
        ...(showGradientBackgroundOptions
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
                                  label: this._localize(
                                    "gradient_resolution_options.auto"
                                  ),
                                },
                                {
                                  value: "very_low",
                                  label: this._localize(
                                    "gradient_resolution_options.very_low"
                                  ),
                                },
                                {
                                  value: "low",
                                  label: this._localize(
                                    "gradient_resolution_options.low"
                                  ),
                                },
                                {
                                  value: "medium",
                                  label: this._localize(
                                    "gradient_resolution_options.medium"
                                  ),
                                },
                                {
                                  value: "high",
                                  label: this._localize(
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
                  label: this._localize("round_off"),
                },
                {
                  value: "full",
                  label: this._localize("round_full"),
                },
                {
                  value: "medium",
                  label: this._localize("round_medium"),
                },
                {
                  value: "small",
                  label: this._localize("round_small"),
                },
              ],
            },
          },
        },
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
                      label: this._localize("setpoint_entity"),
                    },
                    {
                      value: "number",
                      label: this._localize("number"),
                    },
                    {
                      value: "template",
                      label: this._localize("template"),
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
                        domain: ["counter", "input_number", "number", "sensor"],
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
                            number: { mode: "slider", step: 1, min: 0, max: 3 },
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
                      label: this._localize("setpoint_entity"),
                    },
                    {
                      value: "number",
                      label: this._localize("number"),
                    },
                    {
                      value: "template",
                      label: this._localize("template"),
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
                        domain: ["counter", "input_number", "number", "sensor"],
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
                            number: { mode: "slider", step: 1, min: 0, max: 3 },
                          },
                        },
                      ]
                    : [{}]),
                ]
              : [{}]),
          ],
        },
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
                      label: this._localize("setpoint_entity"),
                    },
                    {
                      value: "number",
                      label: this._localize("number"),
                    },
                    {
                      value: "template",
                      label: this._localize("template"),
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

  private _enableInnerSchema = memoizeOne(
    () =>
      [
        { name: "enable_inner", selector: { boolean: {} } },
      ] as const satisfies readonly HaFormSchema[]
  );

  private _innerGaugeSchema = memoizeOne(
    (
      showInnerGradient: boolean,
      showInnerColorInterpolationNote: "none" | "off" | "on",
      showInnerGradientResolution: boolean,
      showInnerGradientBackgroundOptions: boolean,
      showInnerGradientBackgroundResolution: boolean,
      innerMinIndicatorType: string | undefined,
      innerMaxIndicatorType: string | undefined,
      innerSetpointType: string | undefined
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
                          label: this._localize("inner_mode_options.severity"),
                        },
                        {
                          value: "static",
                          label: this._localize("inner_mode_options.static"),
                        },
                        {
                          value: "needle",
                          label: this._localize("inner_mode_options.needle"),
                        },
                        {
                          value: "on_main",
                          label: this._localize("inner_mode_options.on_main"),
                        },
                      ],
                    },
                  },
                },
                {},
              ],
            },
            ...(showInnerGradient
              ? [
                  {
                    type: "grid",
                    column_min_width: "100px",
                    schema: [
                      { name: "gradient", selector: { boolean: {} } },

                      ...(showInnerGradientResolution
                        ? [
                            {
                              name: "gradient_resolution",
                              selector: {
                                select: {
                                  mode: "dropdown",
                                  options: [
                                    {
                                      value: "auto",
                                      label: this._localize(
                                        "gradient_resolution_options.auto"
                                      ),
                                    },
                                    {
                                      value: "very_low",
                                      label: this._localize(
                                        "gradient_resolution_options.very_low"
                                      ),
                                    },
                                    {
                                      value: "low",
                                      label: this._localize(
                                        "gradient_resolution_options.low"
                                      ),
                                    },
                                    {
                                      value: "medium",
                                      label: this._localize(
                                        "gradient_resolution_options.medium"
                                      ),
                                    },
                                    {
                                      value: "high",
                                      label: this._localize(
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
                  ...(showInnerColorInterpolationNote === "off"
                    ? [
                        {
                          type: "constant",
                          name: "color_interpolation_note_off",
                        },
                      ]
                    : []),
                  ...(showInnerColorInterpolationNote === "on"
                    ? [
                        {
                          type: "constant",
                          name: "color_interpolation_note_on",
                        },
                      ]
                    : []),
                ]
              : [{ type: "constant", name: "configure_inner_segments" }]),
            ...(showInnerGradientBackgroundOptions
              ? [
                  {
                    type: "grid",
                    column_min_width: "100px",
                    schema: [
                      {
                        name: "gradient_background",
                        selector: { boolean: {} },
                      },

                      ...(showInnerGradientBackgroundResolution
                        ? [
                            {
                              name: "gradient_resolution",
                              selector: {
                                select: {
                                  mode: "dropdown",
                                  options: [
                                    {
                                      value: "auto",
                                      label: this._localize(
                                        "gradient_resolution_options.auto"
                                      ),
                                    },
                                    {
                                      value: "very_low",
                                      label: this._localize(
                                        "gradient_resolution_options.very_low"
                                      ),
                                    },
                                    {
                                      value: "low",
                                      label: this._localize(
                                        "gradient_resolution_options.low"
                                      ),
                                    },
                                    {
                                      value: "medium",
                                      label: this._localize(
                                        "gradient_resolution_options.medium"
                                      ),
                                    },
                                    {
                                      value: "high",
                                      label: this._localize(
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
                  ...(showInnerGradientBackgroundResolution
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
                      label: this._localize("round_off"),
                    },
                    {
                      value: "full",
                      label: this._localize("round_full"),
                    },
                    {
                      value: "small",
                      label: this._localize("round_small"),
                    },
                  ],
                },
              },
            },
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
                          label: this._localize("setpoint_entity"),
                        },
                        {
                          value: "number",
                          label: this._localize("number"),
                        },
                        {
                          value: "template",
                          label: this._localize("template"),
                        },
                      ],
                    },
                  },
                },
                ...(innerMinIndicatorType === "entity"
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
                ...(innerMinIndicatorType === "number"
                  ? [
                      {
                        name: "value",
                        selector: {
                          number: { mode: "box", step: "any" },
                        },
                      },
                    ]
                  : [{}]),
                ...(innerMinIndicatorType === "template"
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
                          label: this._localize("setpoint_entity"),
                        },
                        {
                          value: "number",
                          label: this._localize("number"),
                        },
                        {
                          value: "template",
                          label: this._localize("template"),
                        },
                      ],
                    },
                  },
                },
                ...(innerMaxIndicatorType === "entity"
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
                ...(innerMaxIndicatorType === "number"
                  ? [
                      {
                        name: "value",
                        selector: {
                          number: { mode: "box", step: "any" },
                        },
                      },
                    ]
                  : [{}]),
                ...(innerMaxIndicatorType === "template"
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
                          label: this._localize("setpoint_entity"),
                        },
                        {
                          value: "number",
                          label: this._localize("number"),
                        },
                        {
                          value: "template",
                          label: this._localize("template"),
                        },
                      ],
                    },
                  },
                },
                ...(innerSetpointType === "entity"
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
                ...(innerSetpointType === "number"
                  ? [
                      {
                        name: "value",
                        selector: {
                          number: { mode: "box", step: "any" },
                        },
                      },
                    ]
                  : [{}]),
                ...(innerSetpointType === "template"
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

  private _cardFeaturesSchema = memoizeOne(
    (iconType: string | undefined) =>
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
                      label: this._localize("battery"),
                    },
                    {
                      value: "template",
                      label: this._localize("template"),
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

  connectedCallback() {
    this._config = migrate_parameters(this._config);
    super.connectedCallback();
    void loadHaComponents();
  }

  public setConfig(config: GaugeCardProCardConfig): void {
    config = migrate_parameters(config);
    assert(config, gaugeCardProConfigStruct);
    this._config = config;
  }

  private _computeLabel = (schema: HaFormSchema) => {
    return this._localize(schema.name);
  };

  private _localize(value: string): string {
    // https://github.com/home-assistant/frontend/blob/dev/src/translations/en.json
    // Paste in https://play.jqlang.org/
    // Search for value in pasted windows (JSON)
    // Top of window shows the path
    if (value === undefined) {
      return value;
    }
    switch (value) {
      case "battery":
        return this.hass!.localize(
          "ui.panel.lovelace.cards.energy.energy_distribution.battery"
        );
      case "color":
      case "primary_color":
      case "secondary_color":
        return this.hass!.localize("ui.panel.lovelace.editor.card.tile.color");
      case "icon":
        return this.hass!.localize(
          "ui.components.selectors.selector.types.icon"
        );
      case "max":
        return this.hass!.localize(
          "ui.panel.lovelace.editor.card.generic.maximum"
        );
      case "min":
        return this.hass!.localize(
          "ui.panel.lovelace.editor.card.generic.minimum"
        );
      case "template":
        return this.hass!.localize(
          "ui.components.selectors.selector.types.template"
        );
      case "primary_unit":
      case "secondary_unit":
        return this.hass!.localize(
          "ui.dialogs.entity_registry.editor.unit_of_measurement"
        );
      case "type":
        return this.hass!.localize(
          "ui.panel.config.helpers.picker.headers.type"
        );
      case "tap_action":
      case "hold_action":
      case "double_tap_action":
        return this.hass!.localize(
          `ui.panel.lovelace.editor.card.generic.${value}`
        );
      default:
        const customLocalize = setupCustomlocalize(this.hass!);
        if (value.toString().startsWith("migration")) {
          return customLocalize(`${value}`);
        } else {
          return customLocalize(`editor.card.${value}`);
        }
    }
  }

  private _convertSegmentsHandler(gauge: string) {
    return () => this._convertSegments(gauge);
  }

  private _convertSegments(gauge: string) {
    let config: any = this.config;

    const inner = gauge === "main" ? "" : "inner.";
    const segments = gauge === "main" ? config.segments : config.inner.segments;

    const safeFromSegments = z
      .array(GaugeSegmentSchemaFrom)
      .safeParse(segments);

    if (safeFromSegments.success) {
      const pos_segments = safeFromSegments.data.map(({ from, color }) => ({
        pos: from,
        color,
      }));

      config = trySetValue(
        config,
        inner + "segments",
        pos_segments,
        false,
        true
      ).result;

      fireEvent(this, "config-changed", { config });
    } else {
      const safePosSegments = z
        .array(GaugeSegmentSchemaPos)
        .safeParse(segments);

      if (safePosSegments.success) {
        const from_segments = safePosSegments.data.map(({ pos, color }) => ({
          from: pos,
          color,
        }));

        config = trySetValue(
          config,
          inner + "segments",
          from_segments,
          false,
          true
        ).result;

        fireEvent(this, "config-changed", { config });
      }
    }
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const main_from_segments = z
      .array(GaugeSegmentSchemaFrom)
      .safeParse(this._config.segments);
    const main_pos_segments = z
      .array(GaugeSegmentSchemaPos)
      .safeParse(this._config.segments);
    const main_segments_type = main_from_segments.success
      ? "from"
      : main_pos_segments.success
        ? "pos"
        : "none";

    const inner_from_segments = z
      .array(GaugeSegmentSchemaFrom)
      .safeParse(this._config.inner?.segments);
    const inner_pos_segments = z
      .array(GaugeSegmentSchemaPos)
      .safeParse(this._config.inner?.segments);
    const inner_segments_type = inner_from_segments.success
      ? "from"
      : inner_pos_segments.success
        ? "pos"
        : "none";

    const showGradientOptions = this._config.segments != null;
    const showColorInterpolationNote =
      showGradientOptions && !this._config.needle && !this._config.gradient
        ? "off"
        : showGradientOptions && !this._config.needle && this._config.gradient
          ? "on"
          : "none";
    const showGradientResolution =
      (showGradientOptions && this._config.needle && this._config.gradient) ??
      false;

    const showGradientBackgroundOptions =
      this._config.segments != null && !this._config.needle;
    const showGradientBackgroundResolution =
      this._config.gradient_background ?? false;

    const enabelInner = this._config?.inner !== undefined;
    const inner_mode = this._config.inner?.mode ?? "severity";
    const showInnerGradient =
      ["severity", "static", "needle"].includes(inner_mode) &&
      this._config.inner?.segments != null;
    const showInnerColorInterpolationNote =
      showInnerGradient &&
      ["severity"].includes(inner_mode) &&
      !this._config.inner?.gradient
        ? "off"
        : showInnerGradient &&
            ["severity"].includes(inner_mode) &&
            this._config.inner?.gradient
          ? "on"
          : "none";
    const showInnerGradientResolution = ["static", "needle"].includes(
      inner_mode
    );
    const showInnerGradientBackgroundOptions =
      this._config.inner?.segments != null && inner_mode === "severity";
    const showInnerGradientBackgroundResolution =
      this._config.inner?.gradient_background ?? false;

    const innerMinIndicatorType =
      this._config.inner?.min_indicator?.type ?? undefined;
    const innerMaxIndicatorType =
      this._config.inner?.max_indicator?.type ?? undefined;
    const innerSetpointType = this._config.inner?.setpoint?.type ?? undefined;
    const mainMinIndicatorType = this._config.min_indicator?.type ?? undefined;
    const hasMainMinIndicatorLabel = this._config.min_indicator?.label ?? false;
    const mainMaxIndicatorType = this._config.max_indicator?.type ?? undefined;
    const hasMainMaxIndicatorLabel = this._config.max_indicator?.label ?? false;
    const mainSetpointType = this._config.setpoint?.type ?? undefined;
    const hasMainSetpointLabel = this._config.setpoint?.label ?? false;
    const iconType = this._config.icon?.type ?? undefined;

    let config = {
      enable_inner: this.config?.inner !== undefined,
      ...this._config,
    };

    const entitiesSchema = this._entitiesSchema();
    const mainGaugeSchema = this._mainGaugeSchema(
      showGradientOptions,
      showColorInterpolationNote,
      showGradientResolution,
      showGradientBackgroundOptions,
      showGradientBackgroundResolution,
      mainMinIndicatorType,
      hasMainMinIndicatorLabel,
      mainMaxIndicatorType,
      hasMainMaxIndicatorLabel,
      mainSetpointType,
      hasMainSetpointLabel
    );
    const enableInnerSchema = this._enableInnerSchema();
    const innerGaugeSchema = this._innerGaugeSchema(
      showInnerGradient,
      showInnerColorInterpolationNote,
      showInnerGradientResolution,
      showInnerGradientBackgroundOptions,
      showInnerGradientBackgroundResolution,
      innerMinIndicatorType,
      innerMaxIndicatorType,
      innerSetpointType
    );

    const cardFeaturesSchema = this._cardFeaturesSchema(iconType);

    return html`
      <ha-form
        class="editor-form"
        .hass=${this.hass}
        .data=${config}
        .schema=${entitiesSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>

      <ha-expansion-panel outlined expanded class="expansion-panel">
        <ha-icon slot="leading-icon" icon="mdi:gauge"></ha-icon>
        <h3 slot="header">${this._localize("main_gauge")}</h3>
        ${main_segments_type !== "none" &&
        (showGradientResolution || showColorInterpolationNote === "on")
          ? html`
              <ha-alert
                alert-type="info"
                class="inner-alert"
                .title=${this._localize("segments_alert.title")}
              >
                <div>
                  ${this._localize(
                    "segments_alert.description." + main_segments_type
                  )}
                </div>

                <div class="actions">
                  ${main_segments_type === "from"
                    ? html` <ha-button
                        size="small"
                        @click=${this._convertSegmentsHandler("main")}
                      >
                        ${this._localize("segments_alert.convert_to_pos")}
                      </ha-button>`
                    : nothing}
                  ${main_segments_type === "pos"
                    ? html` <ha-button
                        size="small"
                        @click=${this._convertSegmentsHandler("main")}
                      >
                        ${this._localize("segments_alert.convert_to_from")}
                      </ha-button>`
                    : nothing}
                </div>
              </ha-alert>
            `
          : nothing}
        <div class="content">
          <ha-form
            class="editor-form"
            .hass=${this.hass}
            .data=${config}
            .schema=${mainGaugeSchema}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
      </ha-expansion-panel>

      <ha-form
        class="editor-form"
        .hass=${this.hass}
        .data=${config}
        .schema=${enableInnerSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>

      ${enabelInner
        ? html` <ha-expansion-panel outlined expanded class="expansion-panel">
            <ha-icon slot="leading-icon" icon="mdi:gauge"></ha-icon>
            <h3 slot="header">${this._localize("inner_gauge")}</h3>

            <div class="content">
              <ha-form
                class="inner-ha-form"
                .hass=${this.hass}
                .data=${config}
                .schema=${innerGaugeSchema}
                .computeLabel=${this._computeLabel}
                @value-changed=${this._valueChanged}
              ></ha-form>
            </div>
          </ha-expansion-panel>`
        : nothing}

      <ha-form
        .hass=${this.hass}
        .data=${config}
        .schema=${cardFeaturesSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    let config = ev.detail.value;

    // Gradient
    if (config.gradient || config.gradient_background) {
      config = trySetValue(
        config,
        "gradient_resolution",
        DEFAULT_GRADIENT_RESOLUTION
      ).result;
    } else {
      config = deleteKey(config, "gradient_resolution").result;
    }

    // Inner
    if (config.enable_inner) {
      config = trySetValue(config, "inner", { mode: "severity" }, true).result;
    } else {
      config = deleteKey(config, "inner").result;
    }
    config = deleteKey(config, "enable_inner").result;

    // Inner gradient
    if (config.inner?.gradient || config.inner?.gradient_background) {
      config = trySetValue(
        config,
        "inner.gradient_resolution",
        DEFAULT_GRADIENT_RESOLUTION
      ).result;
    } else {
      config = deleteKey(config, "inner.gradient_resolution").result;
    }

    // Inner Min indicator
    if (
      config.inner?.min_indicator?.type !==
      this._config?.inner?.min_indicator?.type
    ) {
      config = deleteKey(config, "inner.min_indicator.value").result;
    }

    // Inner Max indicator
    if (
      config.inner?.max_indicator?.type !==
      this._config?.inner?.max_indicator?.type
    ) {
      config = deleteKey(config, "inner.max_indicator.value").result;
    }

    // Inner Setpoint
    if (config.inner?.setpoint?.type !== this._config?.inner?.setpoint?.type) {
      config = deleteKey(config, "inner.setpoint.value").result;
    }

    // Titles
    if (config.titles?.primary === "") {
      config = deleteKey(config, "titles.primary").result;
    }
    if (config.titles?.secondary === "") {
      config = deleteKey(config, "titles.secondary").result;
    }
    if (config.titles?.primary_color === "") {
      config = deleteKey(config, "titles.primary_color").result;
    }
    if (config.titles?.secondary_color === "") {
      config = deleteKey(config, "titles.secondary_color").result;
    }
    if (config.titles?.primary_font_size === "") {
      config = deleteKey(config, "titles.primary_font_size").result;
    }
    if (config.titles?.secondary_font_size === "") {
      config = deleteKey(config, "titles.secondary_font_size").result;
    }
    if (JSON.stringify(config.titles) === "{}") {
      config = deleteKey(config, "titles").result;
    }

    // Value texts
    //    Don't remove empty_string for:
    //      - .primary
    //      - .primary_unit
    //      - .secondary
    //      - .secondary_unit
    //    This is used to overwrite default values to empty string
    if (config.value_texts?.primary_color === "") {
      config = deleteKey(config, "value_texts.primary_color").result;
    }
    if (config.value_texts?.primary_unit_before_value === false) {
      config = deleteKey(
        config,
        "value_texts.primary_unit_before_value"
      ).result;
    }
    if (config.value_texts?.secondary_color === "") {
      config = deleteKey(config, "value_texts.secondary_color").result;
    }
    if (config.value_texts?.secondary_unit_before_value === false) {
      config = deleteKey(
        config,
        "value_texts.secondary_unit_before_value"
      ).result;
    }
    if (JSON.stringify(config.value_texts) === "{}") {
      config = deleteKey(config, "value_texts").result;
    }

    // Min indicator
    if (config.min_indicator?.type !== this._config?.min_indicator?.type) {
      config = deleteKey(config, "min_indicator.value").result;
    }
    if (config.min_indicator?.type === undefined) {
      config = deleteKey(config, "min_indicator").result;
    }

    // Max indicator
    if (config.max_indicator?.type !== this._config?.max_indicator?.type) {
      config = deleteKey(config, "max_indicator.value").result;
    }
    if (config.max_indicator?.type === undefined) {
      config = deleteKey(config, "max_indicator").result;
    }

    // Setpoint
    if (config.setpoint?.type !== this._config?.setpoint?.type) {
      config = deleteKey(config, "setpoint.value").result;
    }

    if (JSON.stringify(config.setpoint) === "{}") {
      config = deleteKey(config, "setpoint").result;
    }

    // Icon
    if (config.icon?.type === undefined) {
      config = deleteKey(config, "icon").result;
    }
    if (config.icon?.type !== this._config?.icon?.type) {
      config = deleteKey(config, "icon.value").result;
    }
    if (config.icon?.type !== "battery") {
      config = deleteKey(config, "icon.state").result;
      config = deleteKey(config, "icon.threshold").result;
      config = deleteKey(config, "icon.hide_label").result;
    }

    fireEvent(this, "config-changed", { config });
  }

  static get styles() {
    return [
      css`
        ha-form {
          display: block;
          margin-bottom: 24px;
        }
        .inner-ha-form {
          margin-bottom: 8px;
        }
        .editor-form {
          margin-bottom: 24px;
        }
        .expansion-panel {
          margin-bottom: 24px;
        }
        .inner-alert {
          margin-left: 12px;
          margin-right: 12px;
        }
        ha-expansion-panel {
          display: block;
          --expansion-panel-content-padding: 0;
          border-radius: 6px;
          --ha-card-border-radius: 6px;
        }
        ha-expansion-panel .content {
          padding: 12px;
        }
        ha-expansion-panel > *[slot="header"] {
          margin: 0;
          font-size: inherit;
          font-weight: inherit;
        }
        ha-expansion-panel ha-icon {
          color: var(--secondary-text-color);
        }
        ha-alert {
          margin-bottom: 16px;
          display: block;
        }
        ha-alert a {
          color: var(--primary-color);
        }
        ha-alert .actions {
          display: flex;
          width: 100%;
          flex: 1;
          align-items: flex-end;
          flex-direction: row;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 8px;
          border-radius: 8px;
        }
      `,
    ];
  }
}
