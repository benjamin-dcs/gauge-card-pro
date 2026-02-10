// External dependencies
import memoizeOne from "memoize-one";
import { mdiDockLeft, mdiDockRight, mdiSimpleIcons } from "@mdi/js";

// Internalized external dependencies
import { HomeAssistant } from "../../../dependencies/ha";

// Editor utilities
import { localize } from "../../../utils/localize";

const ICON_TYPE_OPTIONS = (hass: HomeAssistant) => [
  { value: "battery", label: localize(hass, "battery") },
  { value: "fan-mode", label: localize(hass, "fan_mode") },
  { value: "hvac-mode", label: localize(hass, "hvac_mode") },
  { value: "swing-mode", label: localize(hass, "swing_mode") },
  { value: "template", label: localize(hass, "template") },
];

export type IconType =
  | "battery"
  | "fan-mode"
  | "hvac-mode"
  | "swing-mode"
  | "template";
type MaybeIconType = IconType | undefined;

const iconSideSchema = (
  hass: HomeAssistant,
  side: "left" | "right",
  iconType: MaybeIconType
) => {
  const iconPath = side === "left" ? mdiDockLeft : mdiDockRight;

  const typeField = {
    name: "type",
    selector: {
      select: {
        mode: "dropdown",
        options: ICON_TYPE_OPTIONS(hass),
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
    hass: HomeAssistant,
    iconLeftType: MaybeIconType,
    iconRightType: MaybeIconType
  ) => [
    {
      name: "icons",
      iconPath: mdiSimpleIcons,
      type: "expandable",
      flatten: false,
      schema: [
        iconSideSchema(hass, "left", iconLeftType),
        iconSideSchema(hass, "right", iconRightType),
      ],
    },
  ]
);
