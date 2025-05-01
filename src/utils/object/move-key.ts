import { deleteKey } from "./delete-key";
import { trySetValue } from "./set-value";

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

  if (success) deleteKey(newClone, from);

  return newClone;
}
