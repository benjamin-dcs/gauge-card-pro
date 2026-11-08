import { NumberUtils } from "../number/numberUtils";

/**
 * Word aliases for the comparison operators.
 *
 * In YAML `>` is the folded block scalar indicator, so the symbols only work when
 * they are quoted (`">="`). The aliases work without quotes.
 */
export const COMPARISON_OPERATOR_ALIASES = {
  eq: "==",
  ne: "!=",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
} as const;

export type ComparisonOperatorAlias = keyof typeof COMPARISON_OPERATOR_ALIASES;
export type ComparisonOperatorSymbol =
  (typeof COMPARISON_OPERATOR_ALIASES)[ComparisonOperatorAlias];
export type ComparisonOperator =
  ComparisonOperatorAlias | ComparisonOperatorSymbol;

export const DEFAULT_COMPARISON_OPERATOR: ComparisonOperatorSymbol = "==";

type CompareFn = (value: unknown, target: unknown) => boolean;

function equals(value: unknown, target: unknown): boolean {
  // Numbers are compared numerically, so a value of `21.0` matches `21`
  if (NumberUtils.isNumeric(value) && NumberUtils.isNumeric(target)) {
    return Number(value) === Number(target);
  }
  return String(value) === String(target);
}

// Ordering only makes sense for numbers: `"heating" > "cool"` is meaningless
function numeric(compare: (value: number, target: number) => boolean) {
  return (value: unknown, target: unknown) =>
    NumberUtils.isNumeric(value) && NumberUtils.isNumeric(target)
      ? compare(Number(value), Number(target))
      : false;
}

// Maps, so that a user-defined operator can never reach Object.prototype
const ALIASES = new Map<string, string>(
  Object.entries(COMPARISON_OPERATOR_ALIASES)
);

const COMPARISONS = new Map<string, CompareFn>([
  ["==", equals],
  ["!=", (value, target) => !equals(value, target)],
  [">", numeric((value, target) => value > target)],
  [">=", numeric((value, target) => value >= target)],
  ["<", numeric((value, target) => value < target)],
  ["<=", numeric((value, target) => value <= target)],
]);

/**
 * Compares two values using the given operator, e.g. `">="` or its alias `"gte"`.
 *
 * Equality falls back to a string comparison when either side isn't numeric, the
 * ordering operators require both sides to be numeric. An unknown operator never
 * matches, so a typo doesn't silently behave like an equality check.
 *
 * @param value - The value to compare.
 * @param target - The value to compare against.
 * @param operator - The operator to use. Defaults to `"=="`.
 * @returns `true` if the comparison succeeds; otherwise `false`.
 */
export function compareValues(
  value: unknown,
  target: unknown,
  operator: string = DEFAULT_COMPARISON_OPERATOR
): boolean {
  const compare = COMPARISONS.get(ALIASES.get(operator) ?? operator);
  return compare !== undefined && compare(value, target);
}
