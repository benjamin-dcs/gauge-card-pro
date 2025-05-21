/**
 * Deletes a property from a nested object by following a dot-separated path.
 *
 * Given an object and a string path like `"a.b.c"`, this function will traverse
 * `obj.a.b` and attempt to delete the `c` property. If any segment of the path
 * doesn’t exist or isn’t an object, or if the final key is missing, it does nothing.
 *
 * @param {Object} source - The object from which to delete the key.
 * @param {string} path - The dot-separated path to the key to delete (e.g. `"foo.bar.baz"`).
 * @returns {{ result: T, success: boolean }} Returns `true` with updated source if the key was found and deleted; otherwise `false` with the source.
 */
export function deleteKey(
  source: any,
  path: string
): { result: any; success: boolean } {
  const clone = JSON.parse(JSON.stringify(source)); // deep clone so we don't mutate
  const keys = path.split(".");
  const lastKey = keys.pop();

  if (!lastKey) return { result: source, success: false };

  let current = clone;
  for (const key of keys) {
    if (typeof current[key] !== "object" || current[key] === null) {
      return { result: clone, success: false }; // Path does not exist or is not an object
    }
    current = current[key];
  }

  if (current && lastKey in current) {
    delete current[lastKey];
    return { result: clone, success: true };
  }
  return { result: clone, success: false };
}
