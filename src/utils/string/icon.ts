/**
 * Determines whether a given text value represents an icon call of the form `icon(name)`.
 *
 * @param {string|undefined} value_text - The text to check, which may be a string or undefined.
 * @returns {boolean} `true` if `value_text` is a string that starts with `"icon("` and ends with `")"`; otherwise `false`.
 */
export const isIcon = (value_text: string | undefined): boolean => {
  if (typeof value_text !== "string" || value_text === undefined) return false;
  const val = String(value_text);
  return val.startsWith("icon(") && val.endsWith(")");
};

/**
 * Extracts the icon name from a given string if it follows the `icon(...)` format.
 *
 * @param {string} value_text - The input text to examine. If it represents an icon, it must start with `"icon("`
 *                              and end with `")"`. For example: `"icon(home)"`.
 * @returns {string}
 *   - If `value_text` matches the icon pattern, returns the substring inside the parentheses (e.g. `"home"`).
 *   - Otherwise, returns the original `value_text` unchanged.
 */
export const getIcon = (value_text: string): string => {
  if (!isIcon(value_text)) return value_text;
  return value_text.slice(5, -1);
};
