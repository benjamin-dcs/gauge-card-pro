import type { ActionConfig } from "../../dependencies/ha";
import type { InnerSetpoint, MainSetpoint } from "./indicators";
import type {
  AnimationSpeed,
  InnerGaugeMode,
  Layout,
  NeedleStroke,
  NeedleStyle,
} from "./types";

export type AnimatedElements =
  | "mainNeedle"
  | "mainMinIndicator"
  | "mainMaxIndicator"
  | "mainSetpoint"
  | "innerNeedle"
  | "innerMinIndicator"
  | "innerMaxIndicator"
  | "innerSetpoint";

export type ValueAndValueText = {
  value: number | undefined;
  valueText: string;
};

export type NeedleData = {
  angle: number;
  color?: string;
  customShape?: string;
};

export type ValueTextData = {
  text: string;
  color?: string;
};
export type PrimaryValueTextData = ValueTextData & {
  fontSizeReduction?: number;
};

type ValueTextConfig = {
  actionEntity?: string;
  tapAction?: ActionConfig;
  holdAction?: ActionConfig;
  doubleTapAction?: ActionConfig;
};

export type ValueElementsConfig = {
  layout: Layout;
  needle_style: NeedleStyle;
  mainNeedle?: ValueElementsConfigNeedle;
  innerNeedle?: ValueElementsConfigNeedle;
  primaryValueText: ValueTextConfig;
  secondaryValueText: ValueTextConfig;
  animation_speed: AnimationSpeed;
  innerGaugeMode: InnerGaugeMode | undefined;
};

export type ValueElementsConfigNeedle = {
  svg: string;
  stroke?: NeedleStroke;
};

export type ValueElementsData = {
  mainNeedle?: NeedleData;
  mainSetpoint?: MainSetpoint;
  innerNeedle?: NeedleData;
  innerSetpoint?: InnerSetpoint;
  primaryValueText?: PrimaryValueTextData;
  secondaryValueText?: ValueTextData;
};
