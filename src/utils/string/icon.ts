/**
 * Determines whether a given value represents an icon function call in string form.
 *
 * This function checks if the provided value is a string that starts with
 * `"icon("` and ends with `")"`. It returns `true` if both conditions are met,
 * indicating that the string is formatted as an icon invocation, and `false`
 * otherwise.
 *
 * @param {*} value_text - The value to test. If it is not a string, the function
 *                         will immediately return `false`.
 * @returns {boolean} `true` if `value_text` is a string starting with `"icon("`
 *                    and ending with `")"`, otherwise `false`.
 */
export const isIcon = (value_text: any): boolean => {
  if (typeof value_text !== "string") return false;
  return value_text.startsWith("icon(") && value_text.endsWith(")");
};

/**
 * Extracts the inner icon name from a wrapped icon string, or returns the original value if it's not an icon.
 *
 * @param {*} value_text - The value to check. Expected to be a string in the form `"icon(name)"` or any other type.
 * @returns {string|*} If `value_text` is an icon (as determined by `isIcon`), returns the inner name (everything between `"icon("` and `")"`). Otherwise, returns `value_text` unchanged.
 */
export const getIcon = (value_text: any): string | any => {
  if (!isIcon(value_text)) return value_text;
  return value_text!.slice(5, -1);
};
