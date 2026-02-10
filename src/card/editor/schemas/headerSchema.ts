// Internalized external dependencies
import { HaFormSchema } from "../../../dependencies/mushroom";

export const headerSchema = [
  {
    name: "header",
    type: "string",
  },
] as const satisfies readonly HaFormSchema[];
