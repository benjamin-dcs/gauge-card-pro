// External dependencies
import { mdiAlphabeticalVariant, mdiLayers, mdiLayersOutline } from "@mdi/js";

// Internalized external dependencies
import { HaFormSchema } from "../../../dependencies/mushroom";

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
