// External dependencies
import { z } from "zod";

// Internalized external dependencies
import { Logger } from "../utils/logger";

// Local utilities
import { getComputedColor } from "../utils/color/computed-color";
import { getInterpolatedColor } from "../utils/color/get-interpolated-color";
import {
  GaugeCardProCardConfig,
  ConicGradientSegment,
  Gauge,
  GradientSegment,
  GaugeSegment,
  GaugeSegmentSchemaFrom,
  GaugeSegmentSchemaPos,
} from "./config";

// Local constants & types
import { DEFAULT_SEVERITY_COLOR, INFO_COLOR } from "./const";
import { TemplateKey } from "./card";

/**
 * Get the configured segments array (pos & color).
 * Adds an extra first segment in case the first 'pos' is larger than the 'min' of the gauge.
 * Each segment is validated. On error returns full red.
 */
export function getSegments(
  log: Logger,
  getTemplateKeyValue: (key: TemplateKey) => any,
  gauge: Gauge,
  min: number,
  max: number,
  from_midpoints = false
): GaugeSegment[] {
  const _gauge = gauge === "main" ? "" : "inner.";
  let from_segments = false;

  const config_segments = getTemplateKeyValue(<TemplateKey>`${_gauge}segments`);
  if (!config_segments || config_segments.length === 0) {
    return [{ pos: min, color: DEFAULT_SEVERITY_COLOR }];
  }

  const validateSegments = ():
    | { pos: string | number; color: string }[]
    | undefined => {
    const resultFrom = z
      .array(GaugeSegmentSchemaFrom)
      .safeParse(config_segments);
    if (resultFrom.success) {
      from_segments = true;
      return resultFrom.data.map(({ from, color }) => ({
        pos: from,
        color,
      }));
    }

    const resultPos = z.array(GaugeSegmentSchemaPos).safeParse(config_segments);
    if (resultPos.success) {
      return resultPos.data;
    }

    return undefined;
  };

  const validatedSegments = validateSegments();
  if (!validatedSegments) {
    log.error("Invalid segments definition:", config_segments);
    return [{ pos: min, color: "#ff0000" }];
  }

  let validatedNumericSegments: GaugeSegment[] = [];
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
      color: INFO_COLOR,
    });
  }

  if (max <= firstSegment.pos) {
    segments.push({
      pos: max,
      color: INFO_COLOR,
    });
    return segments;
  }

  // Convert from_segments to midpoints
  const numSegments = validatedNumericSegments.length;
  if (from_segments && from_midpoints && numSegments > 1) {
    if (min < firstSegment.pos) {
      segments.push({
        pos: (min + firstSegment.pos) / 2,
        color: INFO_COLOR,
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
 * Get the configured segments array formatted as a conic-gradient() (from 0 to 180deg).
 * Adds an extra first solid segment in case the first 'pos' is larger than the 'min' of the gauge.
 * Interpolates in case the first and/or last segment are beyond min/max.
 * Each segment is validated. On error returns full red.
 */
export function getConicGradientSegments(
  log: Logger,
  getTemplateKeyValue: (key: TemplateKey) => any,
  gauge: Gauge,
  min: number,
  max: number,
  from_midpoints = false
): ConicGradientSegment[] {
  const segments = getSegments(
    log,
    getTemplateKeyValue,
    gauge,
    min,
    max,
    from_midpoints
  );
  const numSegments = segments.length;

  // gradient-path expects at least 2 segments
  if (numSegments < 2) {
    return [
      { angle: 0, color: getComputedColor(segments[0].color) },
      { angle: 180, color: getComputedColor(segments[0].color) },
    ];
  }

  let conicSegments: ConicGradientSegment[] = [];
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
      let color = getComputedColor(segments[0].color);
      return [
        { angle: 0, color: color },
        { angle: 180, color: color },
      ];
    } else {
      // current range above highest segment
      let color = getComputedColor(segments[numSegments - 1].color);
      return [
        { angle: 0, color: color },
        { angle: 180, color: color },
      ];
    }
  }

  return conicSegments;
}

export function getConicGradientString(
  log: Logger,
  getTemplateKeyValue: (key: TemplateKey) => any,
  gauge: Gauge,
  min: number,
  max: number,
  from_midpoints = false,
  opacity: number | undefined
): string {
  const conicSegments = getConicGradientSegments(
    log,
    getTemplateKeyValue,
    gauge,
    min,
    max,
    from_midpoints
  );
  let parts: string[];
  if (opacity === undefined) {
    parts = conicSegments.map(({ color, angle }) => `${color} ${angle}deg`);
  } else {
    parts = conicSegments.map(
      ({ color, angle }) =>
        `color-mix(in srgb, ${color} ${opacity * 100}%, transparent) ${angle}deg`
    );
  }
  return parts.join(", ");
}

/**
 * Get the configured segments array formatted as a tinygradient array (pos & color; from 0 to 1).
 * Adds an extra first solid segment in case the first 'pos' is larger than the 'min' of the gauge.
 * Interpolates in case the first and/or last segment are beyond min/max.
 * Each segment is validated. On error returns full red.
 */
export function getGradientSegments(
  log: Logger,
  getTemplateKeyValue: (key: TemplateKey) => any,
  gauge: Gauge,
  min: number,
  max: number,
  from_midpoints = false
): GradientSegment[] {
  const conicSegments = getConicGradientSegments(
    log,
    getTemplateKeyValue,
    gauge,
    min,
    max,
    from_midpoints
  );
  return conicSegments.map((segment) => {
    return {
      pos: segment.angle / 180,
      color: getComputedColor(segment.color!),
    };
  });
}

/**
 * Compute the segment color at a specific value
 */
export function computeSeverity(
  log: Logger,
  getTemplateKeyValue: (key: TemplateKey) => any,
  config: GaugeCardProCardConfig,
  gauge: Gauge,
  min: number,
  max: number,
  value: number
): string | undefined {
  if (gauge === "main" && config!.needle) return undefined;
  if (gauge === "inner" && ["static", "needle"].includes(config!.inner!.mode!))
    return undefined;

  const interpolation =
    gauge === "main" ? config!.gradient : config!.inner!.gradient; // here we're sure to have an inner
  if (interpolation) {
    const gradienSegments = getGradientSegments(
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
  getTemplateKeyValue: (key: TemplateKey) => any,
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
  return INFO_COLOR; // should never happen, but just in case
}
