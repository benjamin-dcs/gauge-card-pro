// External dependencies
import { z } from "zod";

// Internalized external dependencies
import type { Logger } from "../../utils/logger";

// Local utilities
import { getComputedColor } from "../../utils/color/computed-color";
import { getInterpolatedColor } from "../../utils/color/get-interpolated-color";

// Local constants & types
import { DEFAULTS } from "../../constants/defaults";
import { getThemeColors } from "../../constants/theme";
import type { GaugeSegment, GaugeSegmentFrom } from "../config";
import { GaugeSegmentSchemaFrom, GaugeSegmentSchemaPos } from "../config";
import type { ConicGradientSegment, Gauge, GradientSegment } from "../types";
import type { GetValueFn, TemplateKey } from "../card";

const segmentsCache = new Map<string, GaugeSegment[]>();
const SEGMENTS_CACHE_MAX = 200;

/**
 * Build a stable-ish cache key for segments.
 * - Includes min/max/from_midpoints because those affect % conversion and midpoint logic.
 * - Uses JSON.stringify to make templated segments cacheable even if new arrays are created each update.
 *
 * Note: JSON.stringify order matters. For arrays of plain objects (as in your examples) this is stable.
 */
function cacheKey(
  configSegments: unknown,
  min: number,
  max: number,
  fromMidpoints: boolean
): string {
  let serialized: string;

  try {
    serialized = JSON.stringify(configSegments);
  } catch {
    // Fallback: if something is not serializable, disable caching for this input
    serialized = String(configSegments);
  }

  return `${min}|${max}|${fromMidpoints ? 1 : 0}|${serialized}`;
}

/**
 * Get a cached entry and mark it as most-recently-used.
 * Map iteration order is insertion order, so we "touch" by delete+set.
 */
function cacheGet(key: string): GaugeSegment[] | undefined {
  const hit = segmentsCache.get(key);
  if (!hit) return undefined;

  // Touch (LRU)
  segmentsCache.delete(key);
  segmentsCache.set(key, hit);

  return hit;
}

/**
 * Put entry and evict oldest if needed.
 */
function cacheSet(key: string, value: GaugeSegment[]): void {
  // Replace existing (and move to end)
  segmentsCache.delete(key);
  segmentsCache.set(key, value);

  if (segmentsCache.size > SEGMENTS_CACHE_MAX) {
    const oldestKey = segmentsCache.keys().next().value as string | undefined;
    if (oldestKey !== undefined) segmentsCache.delete(oldestKey);
  }
}

function _computeSegments(
  log: Logger,
  configSegments: unknown,
  min: number,
  max: number,
  fromMidpoints: boolean
): GaugeSegment[] {
  let fromSegments = false;

  const validateSegments = ():
    | { pos: string | number; color: string }[]
    | undefined => {
    const resultFrom = z
      .array(GaugeSegmentSchemaFrom)
      .safeParse(configSegments);
    if (resultFrom.success) {
      fromSegments = true;
      return resultFrom.data.map(({ from, color }) => ({
        pos: from,
        color,
      }));
    }

    const resultPos = z.array(GaugeSegmentSchemaPos).safeParse(configSegments);
    if (resultPos.success) {
      return resultPos.data;
    }

    return undefined;
  };

  const validatedSegments = validateSegments();
  if (!validatedSegments) {
    log.error("Invalid segments definition:", configSegments);
    return [{ pos: min, color: "#ff0000" }];
  }

  const validatedNumericSegments: GaugeSegment[] = [];
  validatedSegments.forEach((segment) => {
    if (String(segment.pos).slice(-1) === "%") {
      const pos =
        (Number(String(segment.pos).slice(0, -1)) / 100) * (max - min) + min;
      validatedNumericSegments.push({
        pos: pos,
        color: segment.color,
      });
    } else {
      validatedNumericSegments.push({
        pos: Number(segment.pos),
        color: segment.color,
      });
    }
  });

  validatedNumericSegments.sort(
    (a: GaugeSegment, b: GaugeSegment) => a.pos - b.pos
  );

  let segments: GaugeSegment[] = [];
  const firstSegment = validatedNumericSegments[0];

  // In case the first 'pos' is larger than the 'min' of the gauge, add INFO_COLOR from min
  if (min < firstSegment.pos) {
    segments.push({
      pos: min,
      color: getThemeColors().info,
    });
  }

  if (max <= firstSegment.pos) {
    segments.push({
      pos: max,
      color: getThemeColors().info,
    });
    return segments;
  }

  // Convert from_segments to midpoints
  const numSegments = validatedNumericSegments.length;
  if (fromSegments && fromMidpoints && numSegments > 1) {
    if (min < firstSegment.pos) {
      segments.push({
        pos: (min + firstSegment.pos) / 2,
        color: getThemeColors().info,
      });
    }

    segments.push({
      pos: firstSegment.pos,
      color: firstSegment.color,
    });

    for (let i = 0; i < numSegments - 1; i++) {
      const currentSegment = validatedNumericSegments[i];
      const nextSegment = validatedNumericSegments[i + 1];
      const midpointPos = (currentSegment.pos + nextSegment.pos) / 2;
      segments.push({
        pos: midpointPos,
        color: currentSegment.color,
      });
    }

    const lastSegment = validatedNumericSegments[numSegments - 1];
    if (max > lastSegment.pos) {
      const midpointPos = (lastSegment.pos + max) / 2;
      segments.push({
        pos: midpointPos,
        color: lastSegment.color,
      });
    } else {
      segments.push({
        pos: validatedNumericSegments[numSegments - 1].pos,
        color: validatedNumericSegments[numSegments - 1].color,
      });
    }
  } else {
    segments = [...segments, ...validatedNumericSegments];
  }

  return segments;
}

/**
 * Get the configured segments array (pos & color).
 * Adds an extra first segment in case the first 'pos' is larger than the 'min' of the gauge.
 * Each segment is validated. On error returns full red.
 */
export function getSegments(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  gauge: Gauge,
  min: number,
  max: number,
  fromMidpoints = false
): GaugeSegment[] {
  const _gauge = gauge === "main" ? "" : "inner.";

  const configSegments = getTemplateKeyValue<
    GaugeSegment[] | GaugeSegmentFrom[] | string
  >(`${_gauge}segments` as TemplateKey);
  if (!configSegments || configSegments.length === 0) {
    return [{ pos: min, color: DEFAULTS.severity.defaultColor() }];
  }

  const key = cacheKey(configSegments, min, max, fromMidpoints);
  const cachedSegments = cacheGet(key);
  if (cachedSegments) return cachedSegments;

  const computedSegments = _computeSegments(
    log,
    configSegments,
    min,
    max,
    fromMidpoints
  );
  cacheSet(key, computedSegments);
  return computedSegments;
}

/**
 * Get the configured segments array formatted as a conic-gradient() (from 0 to 180deg).
 * Adds an extra first solid segment in case the first 'pos' is larger than the 'min' of the gauge.
 * Interpolates in case the first and/or last segment are beyond min/max.
 * Each segment is validated. On error returns full red.
 */
// Possible candidate for caching as it's used in both Conic and GradientPath background
// However most logic here is for edge cases:
//  - if (numSegments < 2)
//  - if (level < min)
//  - else if (level > max)
//  - if (conicSegments.length < 2)
export function getConicGradientSegments(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  gauge: Gauge,
  min: number,
  max: number,
  fromMidpoints = false
): ConicGradientSegment[] {
  const segments = getSegments(
    log,
    getTemplateKeyValue,
    gauge,
    min,
    max,
    fromMidpoints
  );
  const numSegments = segments.length;

  // make solid if only 1 segment is defined
  if (numSegments < 2) {
    return [
      { angle: 0, color: getComputedColor(segments[0].color) },
      { angle: 180, color: getComputedColor(segments[0].color) },
    ];
  }

  const conicSegments: ConicGradientSegment[] = [];
  const diff = max - min;

  for (let i = 0; i < numSegments; i++) {
    const level = segments[i].pos;
    let color = segments[i].color;
    let angle: number;

    if (level < min) {
      let nextLevel: number;
      let nextColor: string;
      if (i + 1 < numSegments) {
        nextLevel = segments[i + 1].pos;
        nextColor = segments[i + 1].color;
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
        colorMin: getComputedColor(color),
        max: nextLevel,
        colorMax: getComputedColor(nextColor),
        value: min,
      })!;
      angle = 0;
    } else if (level > max) {
      let prevLevel: number;
      let prevColor: string;
      if (i > 0) {
        prevLevel = segments[i - 1].pos;
        prevColor = segments[i - 1].color;
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
        colorMin: getComputedColor(prevColor),
        max: level,
        colorMax: getComputedColor(color),
        value: max,
      })!;
      angle = 180;
    } else {
      angle = ((level - min) / diff) * 180;
    }

    conicSegments.push({ angle: angle, color: color });
  }

  if (conicSegments.length < 2) {
    if (max <= segments[0].pos) {
      // current range below lowest segment
      const color = getComputedColor(segments[0].color);
      return [
        { angle: 0, color: color },
        { angle: 180, color: color },
      ];
    } else {
      // current range above highest segment
      const color = getComputedColor(segments[numSegments - 1].color);
      return [
        { angle: 0, color: color },
        { angle: 180, color: color },
      ];
    }
  }

  return conicSegments;
}

export function getInterpolatedConicGradientSegments(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  gauge: Gauge,
  min: number,
  max: number,
  fromMidpoints = false,
  resolution: number
): ConicGradientSegment[] {
  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  const tinygradientSegments = getTinygradientSegments(
    log,
    getTemplateKeyValue,
    gauge,
    min,
    max,
    fromMidpoints
  );

  const clampedResolution = clamp(
    resolution,
    DEFAULTS.gradient.numericalResolutionMin,
    DEFAULTS.gradient.numericalResolutionMax
  );
  const interpolatedConicSegments: ConicGradientSegment[] = [];
  for (let i = 0; i < clampedResolution; i++) {
    const angle = i / clampedResolution;
    const color = getInterpolatedColor({
      gradientSegments: tinygradientSegments,
      min: 0,
      max: 1,
      value: angle,
    });
    interpolatedConicSegments.push({ angle: angle * 180, color: color });
  }

  return interpolatedConicSegments;
}

/**
 * Get the configured segments array formatted as a tinygradient array (pos & color; from 0 to 1).
 * Adds an extra first solid segment in case the first 'pos' is larger than the 'min' of the gauge.
 * Interpolates in case the first and/or last segment are beyond min/max.
 * Each segment is validated. On error returns full red.
 */
export function getTinygradientSegments(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  gauge: Gauge,
  min: number,
  max: number,
  fromMidpoints = false
): GradientSegment[] {
  const conicSegments = getConicGradientSegments(
    log,
    getTemplateKeyValue,
    gauge,
    min,
    max,
    fromMidpoints
  );
  return conicSegments.map((segment) => {
    return {
      pos: segment.angle / 180,
      color: getComputedColor(segment.color!),
    };
  });
}
