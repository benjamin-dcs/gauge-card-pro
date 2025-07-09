// Couldn't get the package to work, so internalized from https://github.com/dy/is-svg-path
export function isValidSvgPath(path: any) {
  if (typeof path !== "string") return false;

  path = path.trim();

  // https://www.w3.org/TR/SVG/paths.html#PathDataBNF
  if (
    /^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(path) &&
    /[\dz]$/i.test(path) &&
    path.length > 4
  )
    return true;

  return false;
}
