// Heavily modifed version from mushroom.

import type { HomeAssistant } from "../dependencies/ha";
import { repository } from "../../package.json";

import { CustomCardSuggestion } from "../editor/types";

export type GetEntitySuggestion = (
  hass: HomeAssistant,
  entityId: string
) => CustomCardSuggestion | CustomCardSuggestion[] | null;

interface RegisterCardParams {
  type: string;
  name: string;
  description: string;
  getEntitySuggestion?: GetEntitySuggestion;
}

interface CustomCardEntry extends RegisterCardParams {
  preview?: boolean;
  documentationURL?: string;
}

export function registerCustomCard(params: RegisterCardParams) {
  const windowWithCards = window as unknown as Window & {
    customCards: CustomCardEntry[];
  };
  windowWithCards.customCards = windowWithCards.customCards || [];

  windowWithCards.customCards.push({
    type: params.type,
    name: params.name,
    description: params.description,
    preview: true,
    documentationURL: `${repository.url}/blob/main/README.md`,
    getEntitySuggestion: params.getEntitySuggestion,
  });
}
