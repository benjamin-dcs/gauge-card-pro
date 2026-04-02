import { getSeverityGradientValueClippath } from "../utils";

import type {
  InnerGaugeConfig,
  InnerGaugeData,
  MainGaugeConfig,
  MainGaugeData,
} from "../types/types";

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

export function updateGaugeData(
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
