export function moveKey(
  source: any,
  from: string,
  to: string,
  overwrite: boolean = false
): any {
  const clone = structuredClone(source); // deep clone so we don't mutate
  const fromParts = from.split('.');
  const toParts = to.split('.');

  // Drill into the object to get the value
  let fromObj = clone;
  for (let i = 0; i < fromParts.length - 1; i++) {
    fromObj = fromObj?.[fromParts[i]];
    if (typeof fromObj !== 'object' || fromObj === null) {
      return clone; // if path doesn't exist, return unchanged
    }
  }
  const keyFrom = fromParts[fromParts.length - 1];
  const value = fromObj?.[keyFrom];

  if (value === undefined) {
    return clone; // no value to move
  }
  // Drill into the object to set the value
  let toObj = clone;
  for (let i = 0; i < toParts.length - 1; i++) {
    if (
      typeof toObj[toParts[i]] !== 'object' ||
      toObj[toParts[i]] === null ||
      toObj[toParts[i]] === undefined
    ) {
      toObj[toParts[i]] = {}; // create missing parts
    }
    toObj = toObj[toParts[i]];
  }
  const keyTo = toParts[toParts.length - 1];

  if (overwrite || toObj[keyTo] === undefined) {
    toObj[keyTo] = value;
  }

  // Now delete the original
  delete fromObj[keyFrom];
  return clone;
}
