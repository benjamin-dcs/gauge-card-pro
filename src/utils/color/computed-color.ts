export function getComputedColor(color: string) {
  if (!(color.startsWith("var(") && color.endsWith(")"))) return color;
  return window
    .getComputedStyle(document.body)
    .getPropertyValue(color.slice(4, -1));
}
