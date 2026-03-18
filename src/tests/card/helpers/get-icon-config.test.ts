import { describe, it, expect } from "vitest";
import { GaugeCardProCardConfig } from "../../../card/config";
import { MoreInfoActionConfig } from "../../../dependencies/ha";
import { getIconConfig } from "../../../card/helpers/get-icon-config";

const config: GaugeCardProCardConfig = {
  type: `custom:gauge-card-pro`,
  entity: "sensor.entity",
  feature_entity: "climate.hvac",
  icons: {
    left: {
      type: "battery",
      value: "sensor.battery",
    },
    right: {
      type: "hvac-mode",
    },
  },
  icon_left_tap_action: {
    action: "more-info",
  },
  icon_left_hold_action: {
    action: "more-info",
  },
  icon_right_tap_action: {
    action: "more-info",
    entity: "sensor.right_tap",
  } as MoreInfoActionConfig,
  icon_right_double_tap_action: {
    action: "perform-action",
    perform_action: "switch.toggle",
    target: {
      entity_id: "switch.double_tap_toggle",
    },
  },
};

describe("getIconConfig", () => {
  it("left", () => {
    const result = getIconConfig("left", config);
    expect(result).toEqual({
      actionEntity: "sensor.battery",
      tapAction: {
        action: "more-info",
      },
      holdAction: {
        action: "more-info",
      },
      doubleTapAction: undefined,
    });
  });

  it("right", () => {
    const result = getIconConfig("right", config);
    expect(result).toEqual({
      actionEntity: "climate.hvac",
      tapAction: {
        action: "more-info",
        entity: "sensor.right_tap",
      },
      holdAction: undefined,
      doubleTapAction: {
        action: "perform-action",
        perform_action: "switch.toggle",
        target: {
          entity_id: "switch.double_tap_toggle",
        },
      },
    });
  });
});
