import { describe, it, expect } from "vitest";
import { isIcon, getIcon } from "../utils/string/icon";

describe("isIcon", () => {
  it("true", () => {
    const result = isIcon("icon(mdi:gauge)");
    expect(result).toBe(true);
  });

  it("no wrapping", () => {
    const result = isIcon("mdi:gauge");
    expect(result).toBe(false);
  });

  it("just text", () => {
    const result = isIcon("3.14 kW");
    expect(result).toBe(false);
  });
});

describe("getIcon", () => {
  it("mdi:gauge", () => {
    const result = getIcon("icon(mdi:gauge)");
    expect(result).toEqual("mdi:gauge");
  });

  it("no wrapping", () => {
    const result = getIcon("mdi:gauge");
    expect(result).toEqual("mdi:gauge");
  });

  it("just text", () => {
    const result = getIcon("3.14 kW");
    expect(result).toEqual("3.14 kW");
  });
});
