export const isIcon = (value_text: string | undefined): boolean => {
  if (typeof value_text !== "string" || value_text === undefined) return false;
  const val = String(value_text);
  return val.startsWith("icon(") && val.endsWith(")");
};

export const getIcon = (value_text: string): string => {
  if (!isIcon(value_text)) return value_text;
  return value_text.slice(5, -1);
};
