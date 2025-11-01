// External dependencies
import { tinygradient } from "tinygradient";
import memoizeOne from "memoize-one";

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

// Custom equality check for gradient segments arrays
function segmentsEqual(
  a: GradientSegment[],
  b: GradientSegment[]
): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].pos !== b[i].pos || a[i].color !== b[i].color) return false;
  }
  return true;
}

// Memoized tinygradient creation - avoids re-creating gradient objects for same segments
const createTinygradient = memoizeOne(
  (segments: GradientSegment[]) => tinygradient(segments),
  segmentsEqual
);

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

  // Use memoized gradient creation - huge performance win for repeated calls
  const _tinygradient = createTinygradient(gradientSegments);
  let pos: number;
  pos = (value - min) / (max - min);
  pos = Math.round(pos * 100) / 100;

  return _tinygradient.rgbAt(pos).toHexString();
}
