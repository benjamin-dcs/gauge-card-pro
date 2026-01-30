import { GaugeCardProCardConfig, FeaturesConfig } from "../../card/config";

export function hasFeature(
  config: GaugeCardProCardConfig,
  type:
    | "adjust-temperature"
    | "climate-fan-modes"
    | "climate-hvac-modes"
    | "climate-overview"
    | "climate-swing-modes"
): boolean {
  return config.features?.some((f) => f.type === type) ?? false;
}

type FeatureByType<T extends FeaturesConfig["type"]> = Extract<
  FeaturesConfig,
  { type: T }
>;

export function getFeature<T extends FeaturesConfig["type"]>(
  config: GaugeCardProCardConfig,
  type: T
): FeatureByType<T> | undefined {
  return config.features?.find((f): f is FeatureByType<T> => f.type === type);
}
