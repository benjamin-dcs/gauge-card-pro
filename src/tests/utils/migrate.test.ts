import { describe, it, expect } from "vitest";
import { migrate_parameters } from "../../utils/migrate-parameters";

describe("migrate_parameters", () => {
  it("v0.4.0 -> v0.8.0", () => {
    const config: object = {
      type: "custom:gauge-card-pro",
      min: 0,
      max: 100,
      primary: "Primary title",
      primary_color: "Primary title color",
      secondary: "Secondary title",
      secondary_color: "Secondary title color",
      value_text: "Primary value-text",
      value_text_color: "Primary value-text color",
      inner: {
        min: -1,
        max: 1,
        value_text: "Secondary value-text",
        value_text_color: "Secondary value-text color",
      },
    };
    const migrated_config: object = {
      type: "custom:gauge-card-pro",
      min: 0,
      max: 100,
      inner: {
        min: -1,
        max: 1,
      },
      titles: {
        primary: "Primary title",
        primary_color: "Primary title color",
        secondary: "Secondary title",
        secondary_color: "Secondary title color",
      },
      value_texts: {
        primary: "Primary value-text",
        primary_color: "Primary value-text color",
        secondary: "Secondary value-text",
        secondary_color: "Secondary value-text color",
      },
    };
    const result = migrate_parameters(config);
    expect(result).toEqual(migrated_config);
  });
});
