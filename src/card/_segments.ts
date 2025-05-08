import { tinygradient } from "tinygradient";
import { z } from "zod";

import { getComputedColor } from "../utils/color/computed-color";
import {
  Gauge,
  GradientSegment,
  GaugeSegment,
  GaugeSegmentSchema,
} from "./config";
import { GaugeCardProCard, TemplateKey } from "./card";
import {
  DEFAULT_SEVERITY_COLOR,
  ERROR_COLOR,
  INFO_COLOR,
  log_error,
} from "./_const";

export function getSegments(
  card: GaugeCardProCard,
  gauge: Gauge
): GaugeSegment[] {
  const _gauge = gauge === "main" ? "" : "inner.";
  const segments: GaugeSegment[] = card.getValue(
    <TemplateKey>`${_gauge}segments`
  );

  if (!segments) {
    return [{ from: 0, color: DEFAULT_SEVERITY_COLOR }];
  }

  const GaugeSegmentArraySchema = z.array(GaugeSegmentSchema);
  let validatedSegments;
  try {
    validatedSegments = GaugeSegmentArraySchema.parse(segments);
  } catch {
    log_error("Invalid segments definition:", segments);
    return [{ from: 0, color: ERROR_COLOR }];
  }

  return validatedSegments.sort((a, b) => a.from - b.from);
}

export function computeSeverity(
  card: GaugeCardProCard,
  gauge: Gauge,
  numberValue: number
): string | undefined {
  if (gauge === "main" && card.config!.needle) return undefined;
  if (
    gauge === "inner" &&
    ["static", "needle"].includes(card.config!.inner!.mode!)
  )
    return undefined;

  const _gauge = gauge === "main" ? "" : "inner.";
  const _segments = card.getValue(<TemplateKey>`${_gauge}segments`);

  if (!_segments) return DEFAULT_SEVERITY_COLOR;

  let segments: GaugeSegment[] = _segments;
  segments = [...segments].sort((a, b) => a.from - b.from);

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (
      segment &&
      numberValue >= segment.from &&
      (i + 1 === segments.length || numberValue < segments[i + 1]?.from)
    ) {
      return segment.color;
    }
  }
  return DEFAULT_SEVERITY_COLOR;
}

export function getRgbAtGaugePos(
  card: GaugeCardProCard,
  gauge: Gauge,
  min: number,
  max: number,
  value: number
): string {
  const interpolation =
    gauge === "main"
      ? card.config!.color_interpolation
      : card.config!.inner!.color_interpolation; // here we're sure to have an inner
  if (interpolation) {
    const gradienSegments = getGradientSegments(card, gauge, min, max);
    const _tinygradient = tinygradient(gradienSegments);
    let pos: number;
    pos = (value - min) / (max - min);
    pos = Math.round(pos * 100) / 100;

    if (pos < gradienSegments[0].pos) return INFO_COLOR;

    pos = Math.min(1, pos);
    return _tinygradient.rgbAt(pos).toHexString();
  } else {
    return computeSeverity(card, gauge, value)!;
  }
}

export function getRgbAtPos(
  min: number,
  colorMin: string,
  max: number,
  colorMax: string,
  value: number
): string {
  const gradienSegments = [
    { pos: 0, color: colorMin },
    { pos: 1, color: colorMax },
  ];
  const _tinygradient = tinygradient(gradienSegments);
  let pos: number;
  pos = (value - min) / (max - min);
  pos = Math.round(pos * 100) / 100;
  pos = Math.min(1, pos);
  pos = Math.max(0, pos);
  return _tinygradient.rgbAt(pos).toHexString();
}

export function getGradientSegments(
  card: GaugeCardProCard,
  gauge: Gauge,
  min: number,
  max: number
): GradientSegment[] {
  const segments = getSegments(card, gauge);
  const numLevels = segments.length;

  // gradient-path expects at least 2 segments
  if (numLevels < 2) {
    return [
      { color: segments[0].color, pos: 0 },
      { color: segments[0].color, pos: 1 },
    ];
  }

  let gradientSegments: GradientSegment[] = [];
  const diff = max - min;

  for (let i = 0; i < numLevels; i++) {
    let level = segments[i].from;
    let color = getComputedColor(segments[i].color);
    let pos: number;

    if (level < min) {
      let nextLevel: number;
      let nextColor: string;
      if (i + 1 < numLevels) {
        nextLevel = segments[i + 1].from;
        nextColor = getComputedColor(segments[i + 1].color);
        if (nextLevel < min) {
          // both current level and next level are invisible -> skip
          continue;
        }
      } else {
        continue;
      }
      color = getRgbAtPos(level, color, nextLevel, nextColor, min);
      pos = 0;
    } else if (level > max) {
      let prevLevel: number;
      let prevColor: string;
      if (i > 0) {
        prevLevel = segments[i - 1].from;
        prevColor = getComputedColor(segments[i - 1].color);
        if (prevLevel > max) {
          // both current level and previous level are invisible -> skip
          continue;
        }
      } else {
        continue;
      }
      color = getRgbAtPos(prevLevel, prevColor, level, color, max);
      pos = 1;
    } else {
      level = level - min;
      pos = level / diff;
    }

    gradientSegments.push({ color: color, pos: pos });
  }

  if (gradientSegments.length < 2) {
    if (max <= segments[0].from) {
      // current range below lowest segment
      let color = getComputedColor(segments[0].color);
      return [
        { color: color, pos: 0 },
        { color: color, pos: 1 },
      ];
    } else {
      // current range above highest segment
      let color = getComputedColor(segments[numLevels - 1].color);
      return [
        { color: color, pos: 0 },
        { color: color, pos: 1 },
      ];
    }
  }

  if (gradientSegments[0].pos !== 0) {
    gradientSegments.unshift({
      color: INFO_COLOR,
      pos: gradientSegments[0].pos,
    });
    gradientSegments.unshift({ color: INFO_COLOR, pos: 0 });
  }

  return gradientSegments;
}
