// External dependencies
import type { HassEntity } from "home-assistant-js-websocket";
import memoizeOne from "memoize-one";
import {
  mdiAlphabeticalVariant,
  mdiDockLeft,
  mdiDockRight,
  mdiGestureTap,
  mdiLayers,
  mdiLayersOutline,
  mdiNumeric,
  mdiSimpleIcons,
} from "@mdi/js";

// Internalized external dependencies
import {
  ClimateEntity,
  HomeAssistant,
  compareClimateHvacModes,
} from "../../../dependencies/ha";
import { HaFormSchema } from "../../../dependencies/mushroom";

// Editor utilities
import { localize } from "../../../utils/localize";

export const cardFeaturesSchema = memoizeOne(
  (
    hass: HomeAssistant,
    iconLeftType: string | undefined,
    iconRightType: string | undefined
  ) =>
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
        name: "icons",
        iconPath: mdiSimpleIcons,
        type: "expandable",
        flatten: false,
        schema: [
          {
            name: "left",
            iconPath: mdiDockLeft,
            type: "expandable",
            flatten: false,
            expanded: false,
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
                        value: "fan-mode",
                        label: localize(hass, "fan_mode"),
                      },
                      {
                        value: "hvac-mode",
                        label: localize(hass, "hvac_mode"),
                      },
                      {
                        value: "swing-mode",
                        label: localize(hass, "swing_mode"),
                      },
                      {
                        value: "template",
                        label: localize(hass, "template"),
                      },
                    ],
                  },
                },
              },
              ...(iconLeftType === "battery"
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
                  ]
                : []),
              ...(iconLeftType === "fan-mode"
                ? [
                    {
                      name: "value",
                      selector: {
                        entity: {
                          domain: ["climate"],
                        },
                      },
                    },
                    { name: "hide_label", selector: { boolean: {} } },
                  ]
                : []),
              ...(iconLeftType === "hvac-mode"
                ? [
                    {
                      name: "value",
                      selector: {
                        entity: {
                          domain: ["climate"],
                        },
                      },
                    },
                    { name: "hide_label", selector: { boolean: {} } },
                  ]
                : []),
              ...(iconLeftType === "swing-mode"
                ? [
                    {
                      name: "value",
                      selector: {
                        entity: {
                          domain: ["climate"],
                        },
                      },
                    },
                    { name: "hide_label", selector: { boolean: {} } },
                  ]
                : []),
              ...(iconLeftType === "template"
                ? [
                    {
                      name: "value",
                      selector: { template: {} },
                    },
                  ]
                : []),
            ],
          },
          {
            name: "right",
            iconPath: mdiDockRight,
            type: "expandable",
            flatten: false,
            expanded: false,
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
                        value: "hvac-mode",
                        label: localize(hass, "hvac_mode"),
                      },
                      {
                        value: "swing-mode",
                        label: localize(hass, "swing_mode"),
                      },
                      {
                        value: "template",
                        label: localize(hass, "template"),
                      },
                    ],
                  },
                },
              },

              ...(iconRightType === "battery"
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
                  ]
                : []),
              ...(iconRightType === "fan-mode"
                ? [
                    {
                      name: "value",
                      selector: {
                        entity: {
                          domain: ["climate"],
                        },
                      },
                    },
                    { name: "hide_label", selector: { boolean: {} } },
                  ]
                : []),
              ...(iconRightType === "hvac-mode"
                ? [
                    {
                      name: "value",
                      selector: {
                        entity: {
                          domain: ["climate"],
                        },
                      },
                    },
                    { name: "hide_label", selector: { boolean: {} } },
                  ]
                : []),
              ...(iconRightType === "swing-mode"
                ? [
                    {
                      name: "value",
                      selector: {
                        entity: {
                          domain: ["climate"],
                        },
                      },
                    },
                    { name: "hide_label", selector: { boolean: {} } },
                  ]
                : []),
              ...(iconRightType === "template"
                ? [
                    {
                      name: "value",
                      selector: { template: {} },
                    },
                  ]
                : []),
            ],
          },
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
                "icon_left_tap_action",
                "icon_left_hold_action",
                "icon_left_double_tap_action",
                "icon_right_tap_action",
                "icon_right_hold_action",
                "icon_right_double_tap_action",
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
    ] as const
);

export const featureEntitySchema = memoizeOne(
  () =>
    [
      {
        name: "feature_entity",
        selector: {
          entity: {
            domain: ["climate"],
          },
        },
      },
    ] as const satisfies readonly HaFormSchema[]
);

export const featuresAdjustTemperatureSchema = memoizeOne(
  () =>
    [
      {
        type: "constant",
        name: "adjust_temperature_text",
      },
    ] as const satisfies readonly HaFormSchema[]
);

type FormatEntityStateFunc = (stateObj: HassEntity, state?: string) => string;

export const featuresClimateFanModesSchema = memoizeOne(
  (
    formatEntityState: FormatEntityStateFunc,
    stateObj: HassEntity | undefined,
    customizeModes: boolean
  ) =>
    [
      {
        name: "customise_fan_modes",
        selector: {
          boolean: {},
        },
      },
      ...(customizeModes
        ? ([
            {
              name: "fan_modes",
              selector: {
                select: {
                  reorder: true,
                  multiple: true,
                  options: (stateObj?.attributes.fan_modes || [])
                    .concat()
                    .map((mode) => ({
                      value: mode,
                      label: stateObj
                        ? formatEntityState(stateObj, mode)
                        : mode,
                    })),
                },
              },
            },
          ] as const satisfies readonly HaFormSchema[])
        : []),
    ] as const satisfies readonly HaFormSchema[]
);

export const featuresClimateHvacModesSchema = memoizeOne(
  (
    formatEntityState: FormatEntityStateFunc,
    stateObj: HassEntity | undefined,
    customizeModes: boolean
  ) =>
    [
      {
        name: "customise_hvac_modes",
        selector: {
          boolean: {},
        },
      },
      ...(customizeModes
        ? ([
            {
              name: "hvac_modes",
              selector: {
                select: {
                  reorder: true,
                  multiple: true,
                  options: (stateObj?.attributes.hvac_modes || [])
                    .concat()
                    .sort(compareClimateHvacModes)
                    .map((mode) => ({
                      value: mode,
                      label: stateObj
                        ? formatEntityState(stateObj, mode)
                        : mode,
                    })),
                },
              },
            },
          ] as const satisfies readonly HaFormSchema[])
        : []),
    ] as const satisfies readonly HaFormSchema[]
);

export const featuresClimateOverviewSchema = memoizeOne(
  () =>
    [
      {
        type: "constant",
        name: "climate_overview_text",
      },
    ] as const satisfies readonly HaFormSchema[]
);

export const featuresClimateSwingModesSchema = memoizeOne(
  (
    formatEntityState: FormatEntityStateFunc,
    stateObj: HassEntity | undefined,
    customizeModes: boolean
  ) =>
    [
      {
        name: "customise_swing_modes",
        selector: {
          boolean: {},
        },
      },
      ...(customizeModes
        ? ([
            {
              name: "swing_modes",
              selector: {
                select: {
                  reorder: true,
                  multiple: true,
                  options: (stateObj?.attributes.swing_modes || [])
                    .concat()
                    .map((mode) => ({
                      value: mode,
                      label: stateObj
                        ? formatEntityState(stateObj, mode)
                        : mode,
                    })),
                },
              },
            },
          ] as const satisfies readonly HaFormSchema[])
        : []),
    ] as const satisfies readonly HaFormSchema[]
);
