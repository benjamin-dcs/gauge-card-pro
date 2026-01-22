// External dependencies
import memoizeOne from "memoize-one";

// Internalized external dependencies
import { HaFormSchema } from "../../../dependencies/mushroom";

export const enableInnerSchema = memoizeOne(
  () =>
    [
      { name: "enable_inner", selector: { boolean: {} } },
    ] as const satisfies readonly HaFormSchema[]
);
