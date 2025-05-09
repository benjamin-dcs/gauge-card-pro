/**
 * Resolves a CSS custom-property reference to its computed value on <body>,
 * or returns the original input if it’s not a valid CSS variable.
 *
 * @param color - Either:
 *   • A CSS custom-property reference in the form `"var(--some-color)"`,
 *   • Any other string (e.g. `"#ff0000"`, `"red"`, `"rgb(255,0,0)"`),
 *   • Or a non-string value (which is returned unchanged).
 * @returns The resolved CSS value of the custom property (e.g. `"#ff0000"`),
 *          or the original input if it wasn’t a valid `var(...)` reference.
 */
export function getComputedColor(color: string) {
  if (typeof color !== "string") return color;
  if (!(color.startsWith("var(") && color.endsWith(")"))) return color;
  return window
    .getComputedStyle(document.body)
    .getPropertyValue(color.slice(4, -1));
}
