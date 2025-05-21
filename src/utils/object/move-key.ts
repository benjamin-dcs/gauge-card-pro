// General utilities
import { deleteKey } from "./delete-key";
import { trySetValue } from "./set-value";

/**
 * Creates a deep clone of the given object and moves a property from one path to another.
 *
 * The function:
 * 1. Clones the `source` object using `structuredClone`, so the original remains unmodified.
 * 2. Reads the value at the nested path specified by `from` (dot-separated).
 * 3. If the value exists, attempts to set it at the `to` path (dot-separated),
 *    optionally allowing overwriting of existing values.
 * 4. If setting succeeds, deletes the original key at the `from` path in the clone.
 *
 * @param {any} source - The object (or value) to operate on. Can be any JSON-serializable value.
 * @param {string} from - Dot-separated path to the key in the source object to move (e.g. `"a.b.c"`).
 * @param {string} to - Dot-separated path where the key should be moved (e.g. `"x.y.z"`).
 * @param {boolean} [overwrite=false] - If `true`, existing values at the `to` path will be overwritten.
 *                                       If `false`, the move will not override existing values.
 * @returns {any} A new object (clone of `source`) with the key moved if possible; otherwise, the unchanged clone.
 */
export function moveKey(
  source: any,
  from: string,
  to: string,
  overwrite: boolean = false
): any {
  const clone = structuredClone(source);
  const fromParts = from.split(".");

  let fromObj = clone;
  for (let i = 0; i < fromParts.length - 1; i++) {
    fromObj = fromObj?.[fromParts[i]];
    if (typeof fromObj !== "object" || fromObj === null) {
      return clone;
    }
  }

  const keyFrom = fromParts[fromParts.length - 1];
  const value = fromObj?.[keyFrom];

  if (value === undefined) {
    return clone;
  }

  let { result: newClone, success } = trySetValue(
    clone,
    to,
    value,
    true,
    overwrite
  );

  if (success) newClone = deleteKey(newClone, from).result;

  return newClone;
}
