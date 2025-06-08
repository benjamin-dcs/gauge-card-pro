import { describe, it, expect } from "vitest";
import { getAngle } from "../../utils/number/get-angle";
import { NumberUtils } from "../../utils/number/numberUtils";

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

describe("isNumeric", () => {
  it("numeric 123", () => {
    const result = NumberUtils.isNumeric(123);
    expect(result).toEqual(true);
  });

  it("string 123", () => {
    const result = NumberUtils.isNumeric("123");
    expect(result).toEqual(true);
  });

  it("hex", () => {
    const result = NumberUtils.isNumeric("0x10");
    expect(result).toEqual(true);
  });

  it("exp.", () => {
    const result = NumberUtils.isNumeric("1e3");
    expect(result).toEqual(true);
  });

  // Every object in JavaScript (and thus TypeScript) inherits a default valueOf() method from Object.prototype,
  // which normally returns the object itself. By providing your own valueOf method, you override that default.
  it("object", () => {
    const result = NumberUtils.isNumeric({ valueOf: () => 5 });
    expect(result).toEqual(true);
  });

  it("string", () => {
    const result = NumberUtils.isNumeric("abc");
    expect(result).toEqual(false);
  });
});

describe("toNumberOrDefault", () => {
  it("return number if number", () => {
    const result = NumberUtils.toNumberOrDefault(123, 0);
    expect(result).toEqual(123);
  });

  it("convert string to number", () => {
    const result = NumberUtils.toNumberOrDefault("123", 0);
    expect(result).toEqual(123);
  });

  it("return default for NaN", () => {
    const result = NumberUtils.toNumberOrDefault("abc", 0);
    expect(result).toEqual(0);
  });
});
