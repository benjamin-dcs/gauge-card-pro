/**
 * Deep equality check with a configurable max depth (default: 3).
 * Compares primitives by value, objects/arrays structurally.
 * Beyond maxDepth, falls back to reference equality (===).
 */
export function deepEqual<T>(a: T, b: T, maxDepth: number = 3): boolean {
  return _deepEqual(a, b, 0, maxDepth);
}

function _deepEqual(
  a: unknown,
  b: unknown,
  depth: number,
  maxDepth: number
): boolean {
  // Reference or primitive equality
  if (a === b) return true;

  // Null / undefined / type mismatch
  if (a == null || b == null || typeof a !== typeof b) return false;

  // Beyond max depth, only reference equality counts (already failed above)
  if (depth >= maxDepth) return false;

  // Array comparison
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, i) => _deepEqual(item, b[i], depth + 1, maxDepth));
  }

  // Object comparison
  if (typeof a === "object") {
    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) =>
      _deepEqual(objA[key], objB[key], depth + 1, maxDepth)
    );
  }

  // Primitives that weren't === (e.g. NaN)
  return false;
}
