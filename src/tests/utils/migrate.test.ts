import { describe, it, expect } from "vitest";
import { migrate_parameters } from "../../utils/migrate-parameters";

describe("migrate_parameters", () => {
  it("icon.battery", () => {
    const config: object = {
      type: "custom:gauge-card-pro",
      entity: "sensor.test",
      icon: {
        battery: "sensor.battery",
      },
    };
    const migrated_config: object = {
      type: "custom:gauge-card-pro",
      entity: "sensor.test",
      icon: {
        type: "battery",
        value: "sensor.battery",
      },
    };
    const result = migrate_parameters(config);
    expect(result).toEqual(migrated_config);
  });

  it("icon.template", () => {
    const config: object = {
      type: "custom:gauge-card-pro",
      entity: "sensor.test",
      icon: {
        template: "{{ template }}",
      },
    };
    const migrated_config: object = {
      type: "custom:gauge-card-pro",
      entity: "sensor.test",
      icon: {
        type: "template",
        value: "{{ template }}",
      },
    };
    const result = migrate_parameters(config);
    expect(result).toEqual(migrated_config);
  });
});
