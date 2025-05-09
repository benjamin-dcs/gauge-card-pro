/**
 * Safely retrieves the value at a given dot-delimited path within an object.
 *
 * @template ObjectType
 * @param {ObjectType} object
 *   The object from which to retrieve the value.
 * @param {string} path
 *   A dot-notation string describing the nested property path
 *   (e.g. `"user.address.street"`).
 * @returns {*}
 *   The value found at the specified path, or `undefined` if:
 *   - the object is `null`/`undefined`
 *   - the path is an empty string
 *   - any intermediate property along the path does not exist.
 */
export function getValueFromPath<ObjectType>(
  object: ObjectType,
  path: string
): any {
  if (!object || !path) {
    return;
  }
  const keys = path.split(".");
  let result = object;
  for (const key of keys) {
    result = result?.[key];
  }
  return result;
}
