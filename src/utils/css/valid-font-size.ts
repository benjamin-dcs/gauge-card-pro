/**
 * Checks whether a given value is a valid CSS font-size.
 *
 * This function first ensures the input is a string, then uses the
 * browser’s native `CSS.supports()` API to verify that the string
 * is recognized as a valid value for the `font-size` property.
 *
 * @param font_size - The font-size value to validate (e.g. "16px", "1.2em", "small").
 * @returns `true` if `font_size` is a string and is supported by the browser’s CSS parser; otherwise `false`.
 */
export function isValidFontSize(font_size: string): boolean {
  if (typeof font_size !== "string") return false;
  return CSS.supports("font-size", font_size);
}
