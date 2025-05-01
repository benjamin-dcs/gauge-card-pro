import { describe, it, expect } from "vitest";
import { toNumberOrDefault } from "../utils/number/number_or_default";

describe("toNumberOrDefault", () => {
  it("return number if number", () => {
    const result = toNumberOrDefault(123, 0);
    expect(result).toEqual(123);
  });

  it("convert string to number", () => {
    const result = toNumberOrDefault("123", 0);
    expect(result).toEqual(123);
  });

  it("return default for NaN", () => {
    const result = toNumberOrDefault("abc", 0);
    expect(result).toEqual(0);
  });
});
