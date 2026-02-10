// External dependencies
import { mdiGestureTap } from "@mdi/js";

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
