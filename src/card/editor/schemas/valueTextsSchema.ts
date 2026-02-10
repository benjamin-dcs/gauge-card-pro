// External dependencies
import { mdiLayers, mdiLayersOutline, mdiNumeric } from "@mdi/js";

// Internalized external dependencies
import { HaFormSchema } from "../../../dependencies/mushroom";

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
