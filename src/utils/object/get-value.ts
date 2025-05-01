export function getValueFromPath<ObjectType>(object: ObjectType, path: string) {
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
