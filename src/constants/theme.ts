import { getComputedColor } from "../utils/color/computed-color";

const fallback = (value: string | undefined | null, hex: string) =>
  value || hex;

export function getThemeColors() {
  return {
    error: fallback(getComputedColor("var(--error-color)"), "#db4437"),
    success: fallback(getComputedColor("var(--success-color)"), "#43a047"),
    warning: fallback(getComputedColor("var(--warning-color)"), "#ffa600"),
    info: fallback(getComputedColor("var(--info-color)"), "#039be5"),
  } as const;
}
