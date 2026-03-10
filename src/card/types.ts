import type { SeverityColorMode } from "./config";

export type Gauge = "main" | "inner";

export type MainSeverityGaugeMarker = { negative: string; positive: string };

export type GaugeData = {
  min: number;
  max: number;
};

export type SeverityConfig = {
  mode: SeverityColorMode;
  withGradientBackground: boolean;
  fromCenter: boolean;
};

export type SeverityData = {
  angle: number;
  color: string;
};

export interface ConicGradientSegment {
  angle: number;
  color?: string;
}

export interface GradientSegment {
  pos: number;
  color?: string;
}

export type MinMaxIndicator = {
  angle: number;
  color?: string;
  opacity?: number;
  isRounded?: boolean;
  customShape?: string;
  label?: { text: string; color?: string; hasInner: boolean };
};

export type Setpoint = {
  angle: number;
  color?: string;
  customShape?: string;
  label?: { text: string; color?: string; hasInner: boolean };
};

export type Feature =
  | "adjust-temperature"
  | "climate-fan-modes"
  | "climate-hvac-modes"
  | "climate-swing-modes"
  | "climate-overview"
  | "climate-preset-modes";
