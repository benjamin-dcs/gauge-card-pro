import { describe, it, expect } from "vitest";
import { isIconFunction, getIcon } from "../../utils/string/icon";

describe("isIcon", () => {
  it("true", () => {
    const result = isIconFunction("icon(mdi:gauge)");
    expect(result).toBe(true);
  });

  it("more than just icon", () => {
    const result = isIconFunction("icon(mdi:gauge) kW");
    expect(result).toBe(false);
  });

  it("no wrapping", () => {
    const result = isIconFunction("mdi:gauge");
    expect(result).toBe(false);
  });

  it("just text", () => {
    const result = isIconFunction("3.14 kW");
    expect(result).toBe(false);
  });

  it("number", () => {
    const result = isIconFunction(123);
    expect(result).toBe(false);
  });

  it("array", () => {
    const result = isIconFunction(["icon(mdi:gauge)"]);
    expect(result).toBe(false);
  });

  it("undefined", () => {
    const result = isIconFunction(undefined);
    expect(result).toBe(false);
  });
});

describe("getIcon", () => {
  it("mdi:gauge", () => {
    const result = getIcon("icon(mdi:gauge)");
    expect(result).toEqual("mdi:gauge");
  });

  it("more than just icon", () => {
    const result = getIcon("icon(mdi:gauge) kW");
    expect(result).toEqual("icon(mdi:gauge) kW");
  });

  it("no wrapping", () => {
    const result = getIcon("mdi:gauge");
    expect(result).toEqual("mdi:gauge");
  });

  it("just text", () => {
    const result = getIcon("3.14 kW");
    expect(result).toEqual("3.14 kW");
  });

  it("number", () => {
    const result = getIcon(123);
    expect(result).toEqual(123);
  });

  it("array", () => {
    const result = getIcon(["icon(mdi:gauge)"]);
    expect(result).toEqual(["icon(mdi:gauge)"]);
  });

  it("undefined", () => {
    const result = getIcon(undefined);
    expect(result).toEqual(undefined);
  });
});
