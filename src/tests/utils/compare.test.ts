import { describe, it, expect } from "vitest";
import { compareValues } from "../../utils/compare/compare-values";

describe("compareValues - equality", () => {
  it("defaults to ==", () => {
    expect(compareValues("on", "on")).toEqual(true);
    expect(compareValues("off", "on")).toEqual(false);
  });

  it("compares numbers numerically", () => {
    expect(compareValues("21.0", 21, "==")).toEqual(true);
    expect(compareValues(128, "128.0", "==")).toEqual(true);
    expect(compareValues("0.50", 0.5, "==")).toEqual(true);
  });

  it("compares non-numbers as string", () => {
    expect(compareValues("heating", "heating", "==")).toEqual(true);
    expect(compareValues(true, "true", "==")).toEqual(true);
    expect(compareValues("", 0, "==")).toEqual(false);
    expect(compareValues(true, 1, "==")).toEqual(false);
  });

  it("!=", () => {
    expect(compareValues("off", "on", "!=")).toEqual(true);
    expect(compareValues("21.0", 21, "!=")).toEqual(false);
  });
});

describe("compareValues - ordering", () => {
  it(">", () => {
    expect(compareValues(22, 21, ">")).toEqual(true);
    expect(compareValues(21, 21, ">")).toEqual(false);
  });

  it(">=", () => {
    expect(compareValues("21.0", 21, ">=")).toEqual(true);
    expect(compareValues(20, 21, ">=")).toEqual(false);
  });

  it("<", () => {
    expect(compareValues(20, 21, "<")).toEqual(true);
    expect(compareValues(21, 21, "<")).toEqual(false);
  });

  it("<=", () => {
    expect(compareValues("21.0", 21, "<=")).toEqual(true);
    expect(compareValues(22, 21, "<=")).toEqual(false);
  });

  it("requires both sides to be numeric", () => {
    expect(compareValues("heating", "cool", ">")).toEqual(false);
    expect(compareValues("heating", 21, ">=")).toEqual(false);
    expect(compareValues(21, "heating", "<")).toEqual(false);
    expect(compareValues(true, 0, ">")).toEqual(false);
  });
});

describe("compareValues - operators", () => {
  it("accepts word aliases", () => {
    expect(compareValues("on", "on", "eq")).toEqual(true);
    expect(compareValues("off", "on", "ne")).toEqual(true);
    expect(compareValues(22, 21, "gt")).toEqual(true);
    expect(compareValues(21, 21, "gte")).toEqual(true);
    expect(compareValues(20, 21, "lt")).toEqual(true);
    expect(compareValues(21, 21, "lte")).toEqual(true);
  });

  it("never matches on an unknown operator", () => {
    expect(compareValues("on", "on", "=")).toEqual(false);
    expect(compareValues("on", "on", "equals")).toEqual(false);
    expect(compareValues(22, 21, "=>")).toEqual(false);
  });

  it("never matches on an inherited property", () => {
    expect(compareValues("on", "on", "constructor")).toEqual(false);
    expect(compareValues("on", "on", "toString")).toEqual(false);
  });
});
