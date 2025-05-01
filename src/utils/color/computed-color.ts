export function getComputedColor(color: string) {
  if (color.includes("var(")) {
    color = window
      .getComputedStyle(document.body)
      .getPropertyValue(color.slice(4, -1));
  }
  return color;
}
