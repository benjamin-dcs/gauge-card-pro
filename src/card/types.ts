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
