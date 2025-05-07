import { describe, it, expect } from "vitest";
import { getAngle } from "../utils/number/get-angle";
import { toNumberOrDefault } from "../utils/number/number-or-default";

describe("getAngle", () => {
  it("0-180 90", () => {
    const result = getAngle(90, 0, 180);
    expect(result).toEqual(90);
  });

  it("0-360 180", () => {
    const result = getAngle(180, 0, 360);
    expect(result).toEqual(90);
  });
});

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
