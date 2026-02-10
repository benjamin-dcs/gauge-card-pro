// External dependencies
import { mdiFormatListNumbered } from "@mdi/js";

// Internalized external dependencies
import { HaFormSchema } from "../../../dependencies/mushroom";

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
] as const satisfies readonly HaFormSchema[];
