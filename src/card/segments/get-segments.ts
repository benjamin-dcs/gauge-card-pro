// Internalized external dependencies
import type { Logger } from "../../utils/logger";

// Local utilities
import { getInterpolatedColor } from "../../utils/color/get-interpolated-color";
import type { GradientResolutions, SeverityColorModes } from "../config";
import type { Gauge } from "../types";

// Local constants & types
import { getThemeColors } from "../../constants/theme";
import type { GetValueFn } from "../card";

import {
  getConicGradientSegments,
  getInterpolatedConicGradientSegments,
  getSegments,
  getTinygradientSegments,
} from "./core";

export function getConicGradientString(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  gauge: Gauge,
  min: number,
  max: number,
  fromMidpoints = false,
  resolution: GradientResolutions,
  opacity: number | undefined
): string {
  const conicSegments =
    resolution === "auto"
      ? getConicGradientSegments(
          log,
          getTemplateKeyValue,
          gauge,
          min,
          max,
          fromMidpoints
        )
      : getInterpolatedConicGradientSegments(
          log,
          getTemplateKeyValue,
          gauge,
          min,
          max,
          fromMidpoints,
          resolution
        );

  let parts: string[] = [];
  if (opacity === undefined) {
    for (let i = 0; i < conicSegments.length; i++) {
      parts.push(`${conicSegments[i].color} ${conicSegments[i].angle}deg`);

      if (resolution !== "auto") {
        if (i + 1 < conicSegments.length) {
          parts.push(
            `${conicSegments[i].color} ${conicSegments[i + 1].angle}deg`
          );
        } else {
          parts.push(`${conicSegments[i].color} 180deg`);
        }
      }
    }
  } else {
    parts = conicSegments.map(
      ({ color, angle }) =>
        `color-mix(in srgb, ${color} ${opacity * 100}%, transparent) ${angle}deg`
    );
  }

  // prevents bleeding
  const firstColor = conicSegments[0].color;
  const lastColor = conicSegments[conicSegments.length - 1].color;
  parts.push(`${lastColor} 270deg`);
  parts.push(`${firstColor} 270deg`);
  parts.push(`${firstColor} 360deg`);

  return parts.join(", ");
}

/**
 * Compute the segment color at a specific value
 */
export function computeSeverity(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  severity_color_mode: SeverityColorModes,
  gauge: Gauge,
  min: number,
  max: number,
  value: number,
  clamp_min = false
): string | undefined {
  if (severity_color_mode === "gradient") return undefined;
  if (clamp_min) value = Math.max(value, min);

  const interpolation = severity_color_mode === "interpolation";
  if (interpolation) {
    const gradienSegments = getTinygradientSegments(
      log,
      getTemplateKeyValue,
      gauge,
      min,
      max,
      true
    );
    return getInterpolatedColor({
      gradientSegments: gradienSegments,
      min: min,
      max: max,
      value: Math.min(value, max), // beyond max, the gauge shows max. Also needed for getInterpolatedColor
    })!;
  } else {
    return getSegmentColor(log, getTemplateKeyValue, gauge, min, max, value)!;
  }
}

/**
 * Get the configured segment color at a specific value
 */
function getSegmentColor(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  gauge: Gauge,
  min: number,
  max: number,
  value: number
): string {
  const segments = getSegments(log, getTemplateKeyValue, gauge, min, max);
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (
      segment &&
      value >= segment.pos &&
      (i + 1 === segments.length || value < segments[i + 1]?.pos)
    ) {
      return segment.color;
    }
  }
  return getThemeColors().info; // should never happen, but just in case
}

export function getFlatArcConicGradientString(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  gauge: Gauge,
  min: number,
  max: number
): string {
  const conicSegments = getConicGradientSegments(
    log,
    getTemplateKeyValue,
    gauge,
    min,
    max,
    false
  );

  const parts: string[] = [];
  for (let i = 0; i < conicSegments.length; i++) {
    parts.push(`${conicSegments[i].color} ${conicSegments[i].angle}deg`);

    if (i + 1 < conicSegments.length) {
      parts.push(`${conicSegments[i].color} ${conicSegments[i + 1].angle}deg`);
    } else {
      parts.push(`${conicSegments[i].color} 180deg`);
    }
  }

  // prevents bleeding
  const firstColor = conicSegments[0].color;
  const lastColor = conicSegments[conicSegments.length - 1].color;
  parts.push(`${lastColor} 270deg`);
  parts.push(`${firstColor} 270deg`);
  parts.push(`${firstColor} 360deg`);

  return parts.join(", ");
}
