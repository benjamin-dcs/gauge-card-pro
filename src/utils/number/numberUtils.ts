/**
 * Utility class for number-related operations and checks.
 */
export class NumberUtils {
  /**
   * Checks whether a value is numeric (either a finite number or a string representing a finite number).
   *
   * This function acts as a type guard, narrowing the type of `val` to `number` if it returns true.
   *
   * @param value - The value to test.
   * @returns `true` if `val` is a finite number; otherwise `false`.
   */
  static isNumeric(value: unknown): value is number {
    return Number.isFinite(Number(value));
  }

  /**
   * Attempts to convert the given value to a number.
   * If the value is not numeric (per NumberUtils.isNumeric), returns undefined.
   *
   * @param {*} value - The value to convert.
   * @returns {(number|undefined)} The numeric value if conversion succeeded; otherwise undefined.
   */
  static tryToNumber(value: any): number | undefined {
    if (!NumberUtils.isNumeric(value)) return undefined;
    return typeof value === "number" ? value : Number(value);
  }

  /**
   * Converts a value to a number if possible, otherwise returns a provided default.
   *
   * @param value - The value to convert.
   * @param defaultValue - The number to return if `value` is not numeric.
   * @returns The numeric representation of `value` if it is numeric; otherwise `defaultValue`.
   */
  static toNumberOrDefault(value: any, defaultValue: number): number {
    return NumberUtils.tryToNumber(value) ?? defaultValue;
  }
}
