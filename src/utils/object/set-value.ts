export function trySetValue(
  source: any,
  key: string,
  value: any,
  create_missing_objects = false,
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
      if (create_missing_objects) {
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
