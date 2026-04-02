import { ActionHandlerEvent, HomeAssistant } from "../../dependencies/ha";
import type { GaugeCardProCardConfig } from "../config";
import {
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

  primaryValueAndValueText?: ValueAndValueText;
  secondaryValueAndValueText?: ValueAndValueText;

  hasMainNeedle: boolean;
  mainSetpoint?: DraftMainSetpoint;

  mainGaugeConfig?: MainGaugeConfig;
  mainGaugeData?: MainGaugeData;

  hasInnerGauge: boolean;
  innerMode?: InnerGaugeMode;
  innerSetpoint?: DraftInnerSetpoint;

  innerGaugeConfig?: InnerGaugeConfig;
  innerGaugeData?: InnerGaugeData;

  leftIconConfig?: IconConfig;
  leftIconData?: IconData;
  rightIconConfig?: IconConfig;
  rightIconData?: IconData;
  valueElementsConfig?: ValueElementsConfig;
  valueElementsData?: ValueElementsData;

  hasCardAction: boolean;
}
