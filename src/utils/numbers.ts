export function toNumberOrDefault(
  value: unknown,
  defaultValue: number
): number {
  const num = Number(value);
  return Number.isNaN(num) ? defaultValue : num;
}
