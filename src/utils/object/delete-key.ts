/**
 * Deletes a property from a nested object by following a dot-separated path.
 *
 * Given an object and a string path like `"a.b.c"`, this function will traverse
 * `obj.a.b` and attempt to delete the `c` property. If any segment of the path
 * doesn’t exist or isn’t an object, or if the final key is missing, it does nothing.
 *
 * @param {Object} obj - The object from which to delete the key.
 * @param {string} path - The dot-separated path to the key to delete (e.g. `"foo.bar.baz"`).
 * @returns {boolean} Returns `true` if the key was found and deleted; otherwise `false`.
 */
export function deleteKey(obj: any, path: string): boolean {
  const keys = path.split(".");
  const lastKey = keys.pop();

  if (!lastKey) return false;

  let current = obj;
  for (const key of keys) {
    if (typeof current[key] !== "object" || current[key] === null) {
      return false; // Path does not exist or is not an object
    }
    current = current[key];
  }

  if (current && lastKey in current) {
    delete current[lastKey];
    return true;
  }

  return false;
}
