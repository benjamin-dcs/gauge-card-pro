export function isValidFontSize(font_size: string): boolean {
  if (typeof font_size !== "string") return false;
  return CSS.supports("font-size", font_size);
}
