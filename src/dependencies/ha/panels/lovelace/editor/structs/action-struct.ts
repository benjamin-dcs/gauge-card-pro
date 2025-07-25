import {
  array,
  boolean,
  dynamic,
  enums,
  literal,
  object,
  optional,
  string,
  type,
  union,
} from "superstruct";
import { BaseActionConfig } from "../../../../data/lovelace";

const actionConfigStructUser = object({
  user: string(),
});

const actionConfigStructConfirmation = union([
  boolean(),
  object({
    text: optional(string()),
    excemptions: optional(array(actionConfigStructUser)),
  }),
]);

const actionConfigStructUrl = object({
  action: literal("url"),
  url_path: string(),
  confirmation: optional(actionConfigStructConfirmation),
});

const actionConfigStructService = object({
  action: enums(["call-service", "perform-action"]),
  service: optional(string()),
  perform_action: optional(string()),
  service_data: optional(object()),
  data: optional(object()),
  target: optional(
    object({
      entity_id: optional(union([string(), array(string())])),
      device_id: optional(union([string(), array(string())])),
      area_id: optional(union([string(), array(string())])),
      floor_id: optional(union([string(), array(string())])),
      label_id: optional(union([string(), array(string())])),
    })
  ),
  confirmation: optional(actionConfigStructConfirmation),
});

const actionConfigStructNavigate = object({
  action: literal("navigate"),
  navigation_path: string(),
  navigation_replace: optional(boolean()),
  confirmation: optional(actionConfigStructConfirmation),
});

const actionConfigStructAssist = type({
  action: literal("assist"),
  pipeline_id: optional(string()),
  start_listening: optional(boolean()),
});

const actionConfigStructMoreInfo = type({
  action: literal("more-info"),
  entity: optional(string()),
});

export const actionConfigStructType = object({
  action: enums([
    "none",
    "toggle",
    "more-info",
    "call-service",
    "perform-action",
    "url",
    "navigate",
    "assist",
  ]),
  confirmation: optional(actionConfigStructConfirmation),
});

export const actionConfigStruct = dynamic<any>((value) => {
  if (value && typeof value === "object" && "action" in value) {
    switch ((value as BaseActionConfig).action!) {
      case "call-service": {
        return actionConfigStructService;
      }
      case "perform-action": {
        return actionConfigStructService;
      }
      case "navigate": {
        return actionConfigStructNavigate;
      }
      case "url": {
        return actionConfigStructUrl;
      }
      case "assist": {
        return actionConfigStructAssist;
      }
      case "more-info": {
        return actionConfigStructMoreInfo;
      }
    }
  }

  return actionConfigStructType;
});
