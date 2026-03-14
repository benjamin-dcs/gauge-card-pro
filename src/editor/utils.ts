export function isArraySorted(arr, type) {
  const key = type === "from" ? "from" : type === "pos" ? "pos" : null;
  if (!key) return false;

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i]?.[key] > arr[i + 1]?.[key]) return false;
  }
  return true;
}
