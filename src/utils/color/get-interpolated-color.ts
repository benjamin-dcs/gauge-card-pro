import { tinygradient } from "tinygradient";
import { GradientSegment } from "../../card/config";

interface SingleSegment {
  min: number;
  colorMin: string;
  max: number;
  colorMax: string;
  value: number;
}

interface SegmentsArray {
  gradientSegments: GradientSegment[];
  min: number;
  max: number;
  value: number;
}

export function getInterpolatedColor(opts: SingleSegment): string | undefined;
export function getInterpolatedColor(opts: SegmentsArray): string | undefined;
export function getInterpolatedColor(
  opts: SingleSegment | SegmentsArray
): string | undefined {
  const gradientSegments =
    "gradientSegments" in opts
      ? opts.gradientSegments
      : [
          { pos: 0, color: opts.colorMin },
          { pos: 1, color: opts.colorMax },
        ];

  const min = opts.min;
  const max = opts.max;
  const value = opts.value;

  if (value < min || value > max) return;

  const _tinygradient = tinygradient(gradientSegments);
  let pos: number;
  pos = (value - min) / (max - min);
  pos = Math.round(pos * 100) / 100;

  return _tinygradient.rgbAt(pos).toHexString();
}
