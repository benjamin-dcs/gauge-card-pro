import type { PropertyValues } from "lit";
import { LitElement } from "lit";

import type {
  InnerGaugeConfig,
  InnerGaugeData,
  MainGaugeConfig,
  MainGaugeData,
} from "../../types/types";

type GaugeUpdateData = {
  severityRoundAngle: number;
  severityGradientValueClippath: string;
  severityCenteredDashArray: string;
  severityCenteredDashOffset: number;
};

const emptyReturn: GaugeUpdateData = {
  severityRoundAngle: 0,
  severityGradientValueClippath: "",
  severityCenteredDashArray: "",
  severityCenteredDashOffset: 0,
};

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
    Object.assign(this, computeGaugeData(this.gaugeConfig, this.gaugeData));
  }
}

function computeGaugeData(
  config: MainGaugeConfig | InnerGaugeConfig,
  data: MainGaugeData | InnerGaugeData
): GaugeUpdateData {
  if (config.mode !== "severity") return emptyReturn;

  const severityCfg = config.severity;
  const angle = data.severity?.angle;

  if (!severityCfg || angle == null) return emptyReturn;

  const severityRoundAngle =
    severityCfg.fromCenter && angle < 90 ? angle : -180 + angle;

  let severityGradientValueClippath: string;
  if (severityCfg.mode === "gradient") {
    severityGradientValueClippath = getSeverityGradientValueClippath(
      angle,
      severityCfg.fromCenter
    );
  } else {
    severityGradientValueClippath = "";
  }

  let severityCenteredDashArray: string;
  let severityCenteredDashOffset: number;
  if (severityCfg.fromCenter) {
    // somehow the +0.01 fixes some rendering glitches
    if (angle < 90) {
      const d = 90 - angle;
      severityCenteredDashArray = `${d} ${360 - d + 0.01}`;
      severityCenteredDashOffset = d;
    } else {
      const d = angle - 90;
      severityCenteredDashArray = `${d} ${360 - d + 0.01}`;
      severityCenteredDashOffset = 0;
    }
  } else {
    severityCenteredDashArray = "";
    severityCenteredDashOffset = 0;
  }

  return {
    severityRoundAngle,
    severityGradientValueClippath,
    severityCenteredDashArray,
    severityCenteredDashOffset,
  };
}

function getSeverityGradientValueClippath(
  angle: number,
  centered: boolean
): string {
  const clamped = Math.max(0, Math.min(180, angle));
  const t = Math.PI - (clamped * Math.PI) / 180;

  const xOut = +(50 * Math.cos(t)).toFixed(3);
  const yOut = +(-50 * Math.sin(t)).toFixed(3);

  if (centered && angle == 90) {
    return "";
  } else if (centered) {
    const sweep = angle <= 90 ? 0 : 1;
    return [
      `M 0 0`,
      `L 0 -50`,
      `A 50 50 0 0 ${sweep} ${xOut} ${yOut}`,
      `L 0 0`,
      `Z`,
    ].join(" ");
  } else {
    return [
      `M 0 0`,
      `L -50 0`,
      `A 50 50 0 0 1 ${xOut} ${yOut}`,
      `L 0 0`,
      `Z`,
    ].join(" ");
  }
}
