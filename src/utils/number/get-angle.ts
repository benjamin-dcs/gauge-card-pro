// Core HA helpers
import { getValueInPercentage, normalize } from "../../ha/util/calculate";

/**
 * Converts a numeric value within a specified range into an angle between 0° and 180°.
 *
 * This function first normalizes the input `value` relative to the provided `min` and `max` bounds,
 * then computes its percentage position within that range, and finally maps that percentage to
 * an angle on a semicircle (0–180 degrees).
 *
 * @param value - The current value to convert into an angle.
 * @param min   - The minimum possible value (corresponds to 0°).
 * @param max   - The maximum possible value (corresponds to 180°).
 * @returns A number in degrees (0–180) representing where `value` falls within the `[min, max]` range.
 */
export const getAngle = (value: number, min: number, max: number) => {
  const percentage = getValueInPercentage(normalize(value, min, max), min, max);
  return (percentage * 180) / 100;
};
