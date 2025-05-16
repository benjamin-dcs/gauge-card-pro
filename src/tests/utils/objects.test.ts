import { describe, it, expect } from "vitest";
import { moveKey } from "../../utils/object/move-key";
import { deleteKey } from "../../utils/object/delete-key";
import { trySetValue } from "../../utils/object/set-value";

describe("trySetValue", () => {
  it("delete 1", () => {
    const { result, success } = deleteKey({ a: { b: { c: 42 } } }, "a.b.c");
    expect(success).toBe(true);
    expect(result).toEqual({ a: { b: {} } });
  });
});

describe("trySetValue", () => {
  it("sets a new value in an empty object", () => {
    const { result, success } = trySetValue({}, "a.b.c", 42, true);
    expect(success).toBe(true);
    expect(result).toEqual({ a: { b: { c: 42 } } });
  });

  it("does not overwrite an existing value by default", () => {
    const { result, success } = trySetValue(
      { a: { b: { c: 1 } } },
      "a.b.c",
      42
    );
    expect(success).toBe(false);
    expect(result.a.b.c).toBe(1);
  });

  it("overwrites a value when overwrite is true", () => {
    const { result, success } = trySetValue(
      { a: { b: { c: 1 } } },
      "a.b.c",
      42,
      true,
      true
    );
    expect(success).toBe(true);
    expect(result.a.b.c).toBe(42);
  });

  it("returns unchanged clone if path is missing and create_missing_objects is false", () => {
    const original = { a: {} };
    const { result, success } = trySetValue(original, "a.b.c", 42, false);
    expect(success).toBe(false);
    expect(result).toEqual(original);
  });
});

describe("moveKey", () => {
  it("moves a shallow key", () => {
    const input = { x: 1 };
    const output = moveKey(input, "x", "y");
    expect(output).toEqual({ y: 1 });
  });

  it("moves a deep key into a new path", () => {
    const input = { a: { b: { c: 99 } } };
    const output = moveKey(input, "a.b.c", "x.y.z");
    expect(output).toEqual({ a: { b: {} }, x: { y: { z: 99 } } });
  });

  it("does not overwrite an existing key unless overwrite=true", () => {
    const input = { a: { b: { c: 123 } }, x: { y: { z: 999 } } };
    const output = moveKey(input, "a.b.c", "x.y.z", false);
    expect(output.a.b).toEqual({ c: 123 }); // not deleted
    expect(output.x.y.z).toBe(999); // not overwritten
  });

  it("overwrites and deletes source when overwrite=true", () => {
    const input = { a: { b: { c: 10 } }, x: { y: { z: 999 } } };
    const output = moveKey(input, "a.b.c", "x.y.z", true);
    expect(output.a.b).toEqual({}); // key deleted
    expect(output.x.y.z).toBe(10); // overwritten
  });
});
