import { getThemeColors } from "./theme";

export const DEFAULTS = {
  gradient: {
    backgroundOpacity: 0.25,
    resolution: "auto" as const,
    numericalResolution: 25,
    numericalResolutionMin: 1,
    numericalResolutionMax: 180,
  },

  values: {
    min: 0,
    max: 100,
  },

  ui: {
    iconColor: "var(--primary-text-color)",
    minMaxIndicators: {
      opacity: 0.8,
      fill: "rgb(255, 255, 255)",
      labelColor: "#111111",
    },
    needleColor: "var(--primary-text-color)",
    setpointNeedleColor: "var(--error-color)",
    titleColor: "var(--primary-text-color)",
    titleFontSizePrimary: "15px",
    titleFontSizeSecondary: "14px",
    valueTextColor: "var(--primary-text-color)",
  },

  inner: {
    mode: "severity" as const,
  },

  severity: {
    colorMode: "basic" as const,
    // keep this lazy
    defaultColor: () => getThemeColors().info,
  },
} as const;
