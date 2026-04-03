import type { HomeAssistant } from "../../dependencies/ha";
import type { Feature } from "./types";
import type { GaugeCardProCardConfig } from "../config";

export interface RenderControlsContext {
  readonly hass: HomeAssistant;
  readonly _config: GaugeCardProCardConfig;

  setFirstFeaturePage(ev: CustomEvent): void;
  setFeaturePage(ev: CustomEvent, page: Feature): void;
  nextFeaturePage(ev: CustomEvent): void;

  readonly featureEntity?: string;
  readonly enabledFeaturePages?: Feature[];
  readonly hasSeparatedOverviewControls?: boolean;

  readonly _activeFeaturePage: Feature;
}
