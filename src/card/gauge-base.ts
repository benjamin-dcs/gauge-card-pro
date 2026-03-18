import type { PropertyValues } from "lit";
import { LitElement } from "lit";

import { updateGaugeData } from "./helpers/update-gauge-data";
import type {
  InnerGaugeConfig,
  InnerGaugeData,
  MainGaugeConfig,
  MainGaugeData,
} from "./types";

/**
 * Shared base for MainGauge and InnerGauge.
 *
 * Subclasses must:
 *  - Declare `config` and `data` as `@property` fields with their specific types.
 *  - Bridge them via `gaugeConfig` / `gaugeData` getters.
 *  - Implement `updateConfig()`.
 */
export abstract class GaugeBase extends LitElement {
  // Derived config state (not reactive; recomputed on config/data changes)
  protected isRounded = false;
  protected roundMask?: string;

  protected severityRoundAngle = 0;
  protected severityGradientValueClippath = "";
  protected severityCenteredDashArray = "";
  protected severityCenteredDashOffset = 0;

  /** Override in subclass to return the typed `config` property. */
  protected abstract get gaugeConfig(): MainGaugeConfig | InnerGaugeConfig;
  /** Override in subclass to return the typed `data` property. */
  protected abstract get gaugeData(): MainGaugeData | InnerGaugeData;

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);
    if (changedProperties.has("config")) this.updateConfig();
    if (changedProperties.has("data")) this.updateData();
  }

  protected abstract updateConfig(): void;

  protected updateData(): void {
    Object.assign(this, updateGaugeData(this.gaugeConfig, this.gaugeData));
  }
}
