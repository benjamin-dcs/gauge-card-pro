// External dependencies
import { z } from "zod";

// Internalized external dependencies
import * as Logger from "../dependencies/calendar-card-pro";

// Local utilities
import { getComputedColor } from "../utils/color/computed-color";
import { getInterpolatedColor } from "../utils/color/get-interpolated-color";
import {
  Gauge,
  GradientSegment,
  GaugeSegment,
  GaugeSegmentSchema,
} from "./config";

// Local constants & types
import { DEFAULT_SEVERITY_COLOR, INFO_COLOR } from "./const";
import { GaugeCardProCard, TemplateKey } from "./card";

/**
 * Get the configured segments array (from & color).
 * Adds an extra first segment in case the first 'from' is larger than the 'min' of the gauge.
 * Each segment is validated. On error returns full red.
 * @param [solidifyFirstMissingSegment=false] - Adds an extra element before the first 'from' to create a solid range from 'min' to 'first from'
 */
export function getSegments(
  card: GaugeCardProCard,
  gauge: Gauge,
  min: number,
  solidifyFirstMissingSegment: boolean = false
): GaugeSegment[] {
  const _gauge = gauge === "main" ? "" : "inner.";
  const segments: GaugeSegment[] = card.getValue(
    <TemplateKey>`${_gauge}segments`
  );

  if (!segments) {
    return [{ from: 0, color: DEFAULT_SEVERITY_COLOR }];
  }

  const GaugeSegmentArraySchema = z.array(GaugeSegmentSchema);
  let validatedSegments: GaugeSegment[];
  try {
    validatedSegments = GaugeSegmentArraySchema.parse(segments);
  } catch {
    Logger.error("Invalid segments definition:", segments);
    return [{ from: 0, color: "#FF0000" }];
  }

  validatedSegments.sort((a: GaugeSegment, b: GaugeSegment) => a.from - b.from);

  // In case the first 'from' is larger than the 'min' of the gauge, add a solid segment of INFO_COLOR
  if (validatedSegments[0].from > min) {
    if (solidifyFirstMissingSegment) {
      validatedSegments.unshift({
        from: validatedSegments[0].from,
        color: INFO_COLOR,
      });
    }
    validatedSegments.unshift({
      from: min,
      color: INFO_COLOR,
    });
  }
  return validatedSegments;
}

/**
 * Get the configured segments array formatted as a tinygradient array (pos & color; from 0 to 1).
 * Adds an extra first solid segment in case the first 'from' is larger than the 'min' of the gauge.
 * Interpolates in case the first and/or last segment are beyond min/max.
 * Each segment is validated. On error returns full red.
 */
export function getGradientSegments(
  card: GaugeCardProCard,
  gauge: Gauge,
  min: number,
  max: number
): GradientSegment[] {
  const segments = getSegments(card, gauge, min, true);
  const numLevels = segments.length;

  // gradient-path expects at least 2 segments
  if (numLevels < 2) {
    return [
      { pos: 0, color: segments[0].color },
      { pos: 1, color: segments[0].color },
    ];
  }

  let gradientSegments: GradientSegment[] = [];
  const diff = max - min;

  for (let i = 0; i < numLevels; i++) {
    const level = segments[i].from;
    let color = getComputedColor(segments[i].color);
    let pos: number;

    if (level < min) {
      let nextLevel: number;
      let nextColor: string;
      if (i + 1 < numLevels) {
        nextLevel = segments[i + 1].from;
        nextColor = getComputedColor(segments[i + 1].color);
        if (nextLevel <= min) {
          // both current level and next level are invisible -> skip
          continue;
        }
      } else {
        // only current level is below minimum. The next iteration will determine what to do with this segment
        continue;
      }
      // segment is partly invisible, so we interpolate the minimum color to pos 0
      color = getInterpolatedColor({
        min: level,
        colorMin: color,
        max: nextLevel,
        colorMax: nextColor,
        value: min,
      })!;
      pos = 0;
    } else if (level > max) {
      let prevLevel: number;
      let prevColor: string;
      if (i > 0) {
        prevLevel = segments[i - 1].from;
        prevColor = getComputedColor(segments[i - 1].color);
        if (prevLevel >= max) {
          // both current level and previous level are invisible -> skip
          continue;
        }
      } else {
        // only current level is above maximum. The next iteration will determine what to do with this segment
        continue;
      }
      // segment is partly invisible, so we interpolate the maximum color to pos 1
      color = getInterpolatedColor({
        min: prevLevel,
        colorMin: prevColor,
        max: level,
        colorMax: color,
        value: max,
      })!;
      pos = 1;
    } else {
      pos = (level - min) / diff;
    }

    gradientSegments.push({ pos: pos, color: color });
  }

  if (gradientSegments.length < 2) {
    if (max <= segments[0].from) {
      // current range below lowest segment
      let color = getComputedColor(segments[0].color);
      return [
        { pos: 0, color: color },
        { pos: 1, color: color },
      ];
    } else {
      // current range above highest segment
      let color = getComputedColor(segments[numLevels - 1].color);
      return [
        { pos: 0, color: color },
        { pos: 1, color: color },
      ];
    }
  }

  return gradientSegments;
}

/**
 * Compute the segment color at a specific value
 */
export function computeSeverity(
  card: GaugeCardProCard,
  gauge: Gauge,
  min: number,
  max: number,
  value: number
): string | undefined {
  if (gauge === "main" && card._config!.needle) return undefined;
  if (
    gauge === "inner" &&
    ["static", "needle"].includes(card._config!.inner!.mode!)
  )
    return undefined;

  const interpolation =
    gauge === "main" ? card._config!.gradient : card._config!.inner!.gradient; // here we're sure to have an inner
  if (interpolation) {
    const gradienSegments = getGradientSegments(card, gauge, min, max);
    return getInterpolatedColor({
      gradientSegments: gradienSegments,
      min: min,
      max: max,
      value: Math.min(value, max), // beyond max, the gauge shows max. Also needed for getInterpolatedColor
    })!;
  } else {
    return getSegmentColor(card, gauge, min, value)!;
  }
}

/**
 * Get the configured segment color at a specific value
 */
function getSegmentColor(
  card: GaugeCardProCard,
  gauge: Gauge,
  min: number,
  value: number
): string {
  const segments = getSegments(card, gauge, min);
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (
      segment &&
      value >= segment.from &&
      (i + 1 === segments.length || value < segments[i + 1]?.from)
    ) {
      return segment.color;
    }
  }
  return DEFAULT_SEVERITY_COLOR;
}
