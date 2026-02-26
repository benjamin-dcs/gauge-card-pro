import {
  GaugeCardProCardConfig,
  FeaturesConfig,
} from "../../card/config";
import {
  Feature,
} from "../../card/types";

export function hasFeature(
  config: GaugeCardProCardConfig,
  type: Feature
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

export function setFeatureOption<
  T extends Feature,
  K extends keyof FeatureByType<T>,
>(
  config: GaugeCardProCardConfig,
  feature: T,
  key: K,
  value: FeatureByType<T>[K]
): GaugeCardProCardConfig {
  return {
    ...config,
    features: config.features?.map((f) =>
      f.type === feature ? { ...f, [key]: value } : f
    ),
  };
}

type OptionalKeys<T> = {
  [P in keyof T]-?: undefined extends T[P] ? P : never;
}[keyof T];

export function deleteFeatureOption<
  T extends Feature,
  K extends OptionalKeys<FeatureByType<T>>,
>(config: GaugeCardProCardConfig, feature: T, key: K): GaugeCardProCardConfig {
  return {
    ...config,
    features: config.features?.map((f) => {
      if (f.type !== feature) return f;

      const { [key]: _deleted, ...rest } = f as FeatureByType<T>;
      return rest as FeatureByType<T>;
    }),
  };
}
