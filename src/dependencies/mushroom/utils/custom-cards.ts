// Heavily modifed version of the original code from mushroom.

import type { HomeAssistant, LovelaceCardConfig } from "../../ha";
import { repository } from "../../../../package.json";

export interface CustomCardSuggestion<
  T extends LovelaceCardConfig = LovelaceCardConfig,
> {
  label?: string;
  config: T;
}

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
