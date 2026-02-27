// External dependencies
import memoizeOne from "memoize-one";
import {
  mdiAlphabeticalVariant,
  mdiFormatListNumbered,
  mdiLayers,
  mdiLayersOutline,
  mdiNumeric,
  mdiDockLeft,
  mdiDockRight,
  mdiSimpleIcons,
  mdiGestureTap,
} from "@mdi/js";
import type { HassEntity } from "home-assistant-js-websocket";

// Internalized external dependencies
import { HomeAssistant, compareClimateHvacModes } from "../../dependencies/ha";
import { HaFormSchema } from "../../dependencies/mushroom";

// Editor utilities
import { localize } from "../../utils/localize";

export const headerSchema = [
  {
    name: "header",
    type: "string",
  },
] as const satisfies readonly HaFormSchema[];

export const entitiesSchema = [
  {
    name: "entities",
    iconPath: mdiFormatListNumbered,
    type: "expandable",
    expanded: true,
    flatten: true,
    schema: [
      {
        name: "entity",
        selector: { entity: {} },
      },
      {
        name: "entity2",
        selector: { entity: {} },
      },
    ],
  },
] as const satisfies readonly HaFormSchema[];

export const titlesSchema = [
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
] as const satisfies readonly HaFormSchema[];

export const valueTextsSchema = [
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
                step: 0.5,
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
] as const satisfies readonly HaFormSchema[];

const ICON_TYPE_OPTIONS = (lang: string) => [
  { value: "battery", label: localize(lang, "battery") },
  { value: "fan-mode", label: localize(lang, "fan_mode") },
  { value: "hvac-mode", label: localize(lang, "hvac_mode") },
  { value: "swing-mode", label: localize(lang, "swing_mode") },
  { value: "template", label: localize(lang, "template") },
];

export type IconType =
  | "battery"
  | "fan-mode"
  | "hvac-mode"
  | "swing-mode"
  | "template";
type MaybeIconType = IconType | undefined;

const iconSideSchema = (
  lang: string,
  side: "left" | "right",
  iconType: MaybeIconType
) => {
  const iconPath = side === "left" ? mdiDockLeft : mdiDockRight;

  const typeField = {
    name: "type",
    selector: {
      select: {
        mode: "dropdown",
        options: ICON_TYPE_OPTIONS(lang),
      },
    },
  };

  const batteryFields = [
    { name: "value", selector: { entity: { domain: ["sensor"] } } },
    { name: "state", selector: { entity: { domain: ["sensor"] } } },
    {
      type: "grid",
      schema: [
        {
          name: "threshold",
          selector: {
            number: { mode: "box", step: "any", min: 0, max: 100 },
          },
        },
        { name: "hide_label", selector: { boolean: {} } },
      ],
    },
  ];

  const climateModeFields = [
    { name: "value", selector: { entity: { domain: ["climate"] } } },
    { name: "hide_label", selector: { boolean: {} } },
  ];

  const templateFields = [{ name: "value", selector: { template: {} } }];

  const extra =
    iconType === "battery"
      ? batteryFields
      : iconType === "fan-mode" ||
          iconType === "hvac-mode" ||
          iconType === "swing-mode"
        ? climateModeFields
        : iconType === "template"
          ? templateFields
          : [];

  return {
    name: side,
    iconPath,
    type: "expandable",
    flatten: false,
    expanded: false,
    schema: [typeField, ...extra],
  };
};

export const iconsSchema = memoizeOne(
  (
    lang: string,
    iconLeftType: MaybeIconType,
    iconRightType: MaybeIconType
  ) => [
    {
      name: "icons",
      iconPath: mdiSimpleIcons,
      type: "expandable",
      flatten: false,
      schema: [
        iconSideSchema(lang, "left", iconLeftType),
        iconSideSchema(lang, "right", iconRightType),
      ],
    },
  ]
);

export const interactionsSchema = [
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
] as const;

export const featureEntitySchema = [
  {
    type: "constant",
    name: "features_max_icons",
  },
  {
    name: "feature_entity",
    selector: {
      entity: {
        domain: ["climate"],
      },
    },
  },
] as const satisfies readonly HaFormSchema[];

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
    lang: string,
    stateObj: HassEntity | undefined,
    customizeModes: boolean
  ) =>
    [
      {
        name: "fan_style",
        selector: {
          select: {
            multiple: false,
            mode: "list",
            options: ["dropdown", "icons"].map((mode) => ({
              value: mode,
              label: localize(lang, mode),
            })),
          },
        },
      },
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
                      label: localize(
                        lang,
                        `features.fan_modes.${mode.toLowerCase()}`
                      ),
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
    lang: string,
    stateObj: HassEntity | undefined,
    customizeModes: boolean
  ) =>
    [
      {
        name: "hvac_style",
        selector: {
          select: {
            multiple: false,
            mode: "list",
            options: ["dropdown", "icons"].map((mode) => ({
              value: mode,
              label: localize(lang, mode),
            })),
          },
        },
      },
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
                      label: localize(
                        lang,
                        `features.hvac_modes.${mode.toLowerCase()}`
                      ),
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
    lang: string,
    stateObj: HassEntity | undefined,
    customizeModes: boolean
  ) =>
    [
      {
        name: "swing_style",
        selector: {
          select: {
            multiple: false,
            mode: "list",
            options: ["dropdown", "icons"].map((mode) => ({
              value: mode,
              label: localize(lang, mode),
            })),
          },
        },
      },
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
                      label: localize(
                        lang,
                        `features.swing_modes.${mode.toLowerCase()}`
                      ),
                    })),
                },
              },
            },
          ] as const satisfies readonly HaFormSchema[])
        : []),
    ] as const satisfies readonly HaFormSchema[]
);
