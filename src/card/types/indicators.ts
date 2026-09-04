//=============================================================================
// MIN/MAX INDICATORS
//=============================================================================

type MinMaxIndicatorLabel = {
  text: string;
  customColor?: string;
  hasInner: boolean;
};
type MinMaxIndicator<
  TLabel extends MinMaxIndicatorLabel | undefined = MinMaxIndicatorLabel,
> = {
  angle: number;
  customColor?: string;
  opacity?: number;
  customShape?: string;
} & (TLabel extends MinMaxIndicatorLabel
  ? { label?: TLabel }
  : { label?: never });

export type MainMinMaxIndicator = MinMaxIndicator<MinMaxIndicatorLabel>;
export type InnerMinMaxIndicator = MinMaxIndicator<undefined>;

export type DraftMainMinMaxIndicator = {
  value: number;
  opts: Omit<MainMinMaxIndicator, "angle">;
};
export type DraftInnerMinMaxIndicator = {
  value: number;
  opts: Omit<InnerMinMaxIndicator, "angle">;
};

//=============================================================================
// SETPOINT
//=============================================================================

type SetpointLabel = { text: string };
type Setpoint<TLabel extends SetpointLabel | undefined = SetpointLabel> = {
  angle: number;
  customColor?: string;
  opacity?: number;
  customShape?: string;
} & (TLabel extends SetpointLabel ? { label?: TLabel } : { label?: never });

export type MainSetpoint = Setpoint<SetpointLabel>;
export type InnerSetpoint = Setpoint<undefined>;

export type DraftMainSetpoint = {
  value: number;
  opts: Omit<MainSetpoint, "angle">;
};
export type DraftInnerSetpoint = {
  value: number;
  opts: Omit<InnerSetpoint, "angle">;
};
