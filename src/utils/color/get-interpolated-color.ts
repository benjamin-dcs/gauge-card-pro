// External dependencies
import { tinygradient } from "tinygradient";

// Local constants & types
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

/**
 * Computes a hex color by interpolating across a gradient based on a numeric value.
 *
 * This function accepts either:
 * 1. A simple two-color segment (`SingleSegment`), defined by
 *    - `colorMin` (color at `min`) and `colorMax` (color at `max`),
 *    - `min` and `max` bounds,
 *    - `value` to interpolate.
 * 2. An arbitrary gradient (`SegmentsArray`), defined by
 *    - `gradientSegments`: an array of `{ pos: number; color: string }` entries,
 *    - `min` and `max` bounds,
 *    - `value` to interpolate.
 *
 * It normalizes `value` into the [0,1] range, rounds to two decimal places,
 * then uses `tinygradient` to pick the corresponding RGB color and return it as a hex string.
 * If `value` is outside the `[min, max]` range, it returns `undefined`.
 *
 * @param opts - Either a `SingleSegment` or `SegmentsArray` describing the gradient and value.
 * @returns A hex color string (e.g. `"#3fa9f5"`) corresponding to the interpolated point,
 *          or `undefined` if `value < min` or `value > max`.
 */
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
