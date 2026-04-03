import type { ActionHandlerEvent, HomeAssistant } from "../../dependencies/ha";
import type { GaugeCardProCardConfig } from "../config";
import type {
  DraftInnerSetpoint,
  DraftMainSetpoint,
  IconConfig,
  IconData,
  InnerGaugeConfig,
  InnerGaugeData,
  InnerGaugeMode,
  MainGaugeConfig,
  MainGaugeData,
  ValueAndValueText,
  ValueElementsConfig,
  ValueElementsData,
} from "./types";

export interface RenderGaugeContext {
  readonly hass: HomeAssistant;
  readonly _config: GaugeCardProCardConfig;

  _handleCardAction(ev: ActionHandlerEvent): void;

  readonly primaryValueAndValueText?: ValueAndValueText;
  readonly secondaryValueAndValueText?: ValueAndValueText;

  readonly hasMainNeedle: boolean;
  readonly mainSetpoint?: DraftMainSetpoint;

  readonly mainGaugeConfig?: MainGaugeConfig;
  readonly mainGaugeData?: MainGaugeData;

  readonly hasInnerGauge: boolean;
  readonly innerMode?: InnerGaugeMode;
  readonly innerSetpoint?: DraftInnerSetpoint;

  readonly innerGaugeConfig?: InnerGaugeConfig;
  readonly innerGaugeData?: InnerGaugeData;

  readonly leftIconConfig?: IconConfig;
  readonly leftIconData?: IconData;
  readonly rightIconConfig?: IconConfig;
  readonly rightIconData?: IconData;
  readonly valueElementsConfig?: ValueElementsConfig;
  readonly valueElementsData?: ValueElementsData;

  readonly hasCardAction: boolean;
}
