/**
 * Safely converts an arbitrary value to a number, falling back to a default if conversion fails.
 *
 * @param value - The value to convert. Can be of any type.
 * @param defaultValue - The number to return if `value` cannot be converted to a valid number.
 * @returns The numeric conversion of `value`, or `defaultValue` if conversion produces NaN.
 */
export function toNumberOrDefault(
  value: unknown,
  defaultValue: number
): number {
  const num = Number(value);
  return Number.isNaN(num) ? defaultValue : num;
}
