/**
 * Deep-clones the given source object and attempts to set a value at the specified
 * dot-delimited path. Returns the cloned object and whether the assignment succeeded.
 *
 * @param {T} source
 *   The original object or value to clone. This function will not mutate the input.
 * @param {string} key
 *   A dot-delimited path specifying where to set the value (e.g. `"user.profile.name"`).
 * @param {*} value
 *   The value to assign at the target path.
 * @param {boolean} [createMissingObjects=false]
 *   If `true`, any missing nested objects along the path will be created as empty objects.
 *   If `false`, the function will abort and return `success: false` if any part of the
 *   path is missing or not an object.
 * @param {boolean} [overwrite=false]
 *   If `true`, will overwrite an existing value at the target path. If `false`,
 *   and the property already exists (not `undefined`), the function will not modify it
 *   and will return `success: false`.
 *
 * @returns {{ result: T, success: boolean }}
 *   - `result`: A deep clone of `source` with the attempted assignment applied (if successful).
 *   - `success`: `true` if the value was set, `false` otherwise.
 */
export function trySetValue(
  source: any,
  key: string,
  value: any,
  createMissingObjects: boolean = false,
  overwrite: boolean = false
): { result: any; success: boolean } {
  const clone = structuredClone(source); // deep clone so we don't mutate
  const keyParts = key.split(".");

  let newObj = clone;
  for (let i = 0; i < keyParts.length - 1; i++) {
    if (
      typeof newObj[keyParts[i]] !== "object" ||
      newObj[keyParts[i]] === null ||
      newObj[keyParts[i]] === undefined
    ) {
      if (createMissingObjects) {
        newObj[keyParts[i]] = {};
      } else {
        return { result: clone, success: false };
      }
    }
    newObj = newObj[keyParts[i]];
  }

  const keyTo = keyParts[keyParts.length - 1];

  if (overwrite || newObj[keyTo] === undefined) {
    newObj[keyTo] = value;
    return { result: clone, success: true };
  }

  return { result: clone, success: false };
}
