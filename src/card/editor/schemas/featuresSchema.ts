// External dependencies
import type { HassEntity } from "home-assistant-js-websocket";
import memoizeOne from "memoize-one";

// Internalized external dependencies
import {
  HomeAssistant,
  compareClimateHvacModes,
} from "../../../dependencies/ha";
import { HaFormSchema } from "../../../dependencies/mushroom";

// Editor utilities
import { localize } from "../../../utils/localize";

export const featureEntitySchema = [
  {
    type: "constant",
    name: "features_max_icons",
  },
  {
    name: "feature_entity",
    selector: {
      entity: {
        domain: ["climate"],
      },
    },
  },
] as const satisfies readonly HaFormSchema[];

export const featuresAdjustTemperatureSchema = memoizeOne(
  () =>
    [
      {
        type: "constant",
        name: "adjust_temperature_text",
      },
    ] as const satisfies readonly HaFormSchema[]
);

type FormatEntityStateFunc = (stateObj: HassEntity, state?: string) => string;

export const featuresClimateFanModesSchema = memoizeOne(
  (
    hass: HomeAssistant,
    formatEntityState: FormatEntityStateFunc,
    stateObj: HassEntity | undefined,
    customizeModes: boolean
  ) =>
    [
      {
        name: "fan_style",
        selector: {
          select: {
            multiple: false,
            mode: "list",
            options: ["dropdown", "icons"].map((mode) => ({
              value: mode,
              label: localize(hass, mode),
            })),
          },
        },
      },
      {
        name: "customise_fan_modes",
        selector: {
          boolean: {},
        },
      },
      ...(customizeModes
        ? ([
            {
              name: "fan_modes",
              selector: {
                select: {
                  reorder: true,
                  multiple: true,
                  options: (stateObj?.attributes.fan_modes || [])
                    .concat()
                    .map((mode) => ({
                      value: mode,
                      label: stateObj
                        ? formatEntityState(stateObj, mode)
                        : mode,
                    })),
                },
              },
            },
          ] as const satisfies readonly HaFormSchema[])
        : []),
    ] as const satisfies readonly HaFormSchema[]
);

export const featuresClimateHvacModesSchema = memoizeOne(
  (
    hass: HomeAssistant,
    formatEntityState: FormatEntityStateFunc,
    stateObj: HassEntity | undefined,
    customizeModes: boolean
  ) =>
    [
      {
        name: "hvac_style",
        selector: {
          select: {
            multiple: false,
            mode: "list",
            options: ["dropdown", "icons"].map((mode) => ({
              value: mode,
              label: localize(hass, mode),
            })),
          },
        },
      },
      {
        name: "customise_hvac_modes",
        selector: {
          boolean: {},
        },
      },
      ...(customizeModes
        ? ([
            {
              name: "hvac_modes",
              selector: {
                select: {
                  reorder: true,
                  multiple: true,
                  options: (stateObj?.attributes.hvac_modes || [])
                    .concat()
                    .sort(compareClimateHvacModes)
                    .map((mode) => ({
                      value: mode,
                      label: stateObj
                        ? formatEntityState(stateObj, mode)
                        : mode,
                    })),
                },
              },
            },
          ] as const satisfies readonly HaFormSchema[])
        : []),
    ] as const satisfies readonly HaFormSchema[]
);

export const featuresClimateOverviewSchema = memoizeOne(
  () =>
    [
      {
        type: "constant",
        name: "climate_overview_text",
      },
    ] as const satisfies readonly HaFormSchema[]
);

export const featuresClimateSwingModesSchema = memoizeOne(
  (
    hass: HomeAssistant,
    formatEntityState: FormatEntityStateFunc,
    stateObj: HassEntity | undefined,
    customizeModes: boolean
  ) =>
    [
      {
        name: "swing_style",
        selector: {
          select: {
            multiple: false,
            mode: "list",
            options: ["dropdown", "icons"].map((mode) => ({
              value: mode,
              label: localize(hass, mode),
            })),
          },
        },
      },
      {
        name: "customise_swing_modes",
        selector: {
          boolean: {},
        },
      },
      ...(customizeModes
        ? ([
            {
              name: "swing_modes",
              selector: {
                select: {
                  reorder: true,
                  multiple: true,
                  options: (stateObj?.attributes.swing_modes || [])
                    .concat()
                    .map((mode) => ({
                      value: mode,
                      label: stateObj
                        ? formatEntityState(stateObj, mode)
                        : mode,
                    })),
                },
              },
            },
          ] as const satisfies readonly HaFormSchema[])
        : []),
    ] as const satisfies readonly HaFormSchema[]
);
