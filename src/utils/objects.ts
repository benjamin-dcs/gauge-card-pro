export function getValueFromPath<ObjectType>(object: ObjectType, path: string) {
  if (!object || !path) {
    return;
  }
  const keys = path.split('.');
  let result = object;
  for (const key of keys) {
    result = result?.[key];
  }
  return result;
}

export function moveKey(
  source: any,
  from: string,
  to: string,
  overwrite: boolean = false
): any {
  const clone = structuredClone(source);
  const fromParts = from.split('.');

  let fromObj = clone;
  for (let i = 0; i < fromParts.length - 1; i++) {
    fromObj = fromObj?.[fromParts[i]];
    if (typeof fromObj !== 'object' || fromObj === null) {
      return clone;
    }
  }

  const keyFrom = fromParts[fromParts.length - 1];
  const value = fromObj?.[keyFrom];

  if (value === undefined) {
    return clone;
  }

  const { result: newClone, success } = trySetValue(
    clone,
    to,
    value,
    true,
    overwrite
  );

  if (success) {
    delete fromObj[keyFrom];
  }

  return newClone;
}

export function trySetValue(
  source: any,
  key: string,
  value: any,
  create_missing_objects = false,
  overwrite: boolean = false
): { result: any; success: boolean } {
  const clone = structuredClone(source); // deep clone so we don't mutate
  const keyParts = key.split('.');

  let newObj = clone;
  for (let i = 0; i < keyParts.length - 1; i++) {
    if (
      typeof newObj[keyParts[i]] !== 'object' ||
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
