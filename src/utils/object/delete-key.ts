export function deleteKey(obj: any, path: string): boolean {
  const keys = path.split('.');
  const lastKey = keys.pop();

  if (!lastKey) return false;

  let current = obj;
  for (const key of keys) {
    if (typeof current[key] !== 'object' || current[key] === null) {
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
