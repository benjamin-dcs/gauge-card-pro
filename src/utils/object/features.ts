import type { GaugeCardProCardConfig, FeaturesConfig } from "../../card/config";
import type { Feature, FeaturePageIcon } from "../../card/types/types";
import {
  FEATURE,
  FEATURE_PAGE_ICON,
  FEATURE_PAGE_ICON_COLOR,
} from "../../constants/features";

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

/**
 * Icon of a feature-page, either as an "mdi:*" string from the config (`ha-icon`)
 * or as a built-in MDI path (`ha-svg-icon`).
 */
export function getFeaturePageIcon(
  config: GaugeCardProCardConfig,
  page: Feature
): FeaturePageIcon {
  if (page === FEATURE.CUSTOM) {
    const icon = getFeature(config, FEATURE.CUSTOM)?.page_icon;
    if (icon) return { icon };
  }
  return { path: FEATURE_PAGE_ICON[page] };
}

export function getFeaturePageIconColor(
  config: GaugeCardProCardConfig,
  page: Feature
): string {
  if (page === FEATURE.CUSTOM) {
    const color = getFeature(config, FEATURE.CUSTOM)?.page_icon_color;
    if (color) return color;
  }
  return FEATURE_PAGE_ICON_COLOR[page];
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

      /* eslint-disable @typescript-eslint/no-unused-vars */
      // _deleted is a required variable that we need to extract to remove the key from the object,
      // but we don't actually use it for anything
      const { [key]: _deleted, ...rest } = f as FeatureByType<T>;
      return rest as FeatureByType<T>;
    }),
  };
}
