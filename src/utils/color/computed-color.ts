let styleDecl: CSSStyleDeclaration | null = null;
const cache = new Map<string, { value: string; ts: number }>();

const MAX = 64;
const TTL_MS = 60_000; // 1 minute

export function getComputedColor(color: string): string {
  if (typeof color !== "string") return String(color);
  if (!(color.startsWith("var(") && color.endsWith(")"))) return color;

  const now = Date.now();
  const hit = cache.get(color);
  if (hit && now - hit.ts < TTL_MS) return hit.value;

  if (!styleDecl) styleDecl = window.getComputedStyle(document.body);

  const cssVarName = color.slice(4, -1).trim();
  const value = styleDecl.getPropertyValue(cssVarName).trim();

  cache.set(color, { value, ts: now });

  // simple cap eviction (delete oldest inserted)
  if (cache.size > MAX) {
    const oldestKey = cache.keys().next().value as string | undefined;
    if (oldestKey) cache.delete(oldestKey);
  }

  return value;
}
