import { describe, it, expect, vi, afterEach } from "vitest";

import type { GaugeCardProCard } from "../card/card";
import { getGradientSegments } from "../card/_segments";

vi.mock("../utils/color/computed-color", () => ({
  getComputedColor: (color: string) => {
    switch (color) {
      case "var(--info-color)":
        return "#039be5";
      default:
        return color;
    }
  },
}));

vi.mock(
  "../dependencies/ha/panels/lovelace/common/directives/action-handler-directive.ts",
  () => ({
    isTouch: () => false,
  })
);

describe("getGradientSegments", () => {
  const card = { getValue: vi.fn() } as unknown as GaugeCardProCard;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("single segment", () => {
    const getValueSpy = vi.spyOn(card, "getValue");
    getValueSpy.mockImplementation((key: string) => {
      switch (key) {
        case "min":
          return 0;
        case "max":
          return 100;
        case "segments":
          return [{ from: 0, color: "#ff0000" }];
        default:
          return undefined;
      }
    });

    const min = card.getValue("min");
    const max = card.getValue("max");
    const result = getGradientSegments(card, "main", min, max);

    expect(card.getValue).toHaveBeenCalledWith("segments");
    expect(result).toEqual([
      { pos: 0, color: "#ff0000" },
      { pos: 1, color: "#ff0000" },
    ]);
  });

  it("multiple, matching min/max, no interpolation", () => {
    const getValueSpy = vi.spyOn(card, "getValue");
    getValueSpy.mockImplementation((key: string) => {
      switch (key) {
        case "min":
          return 100;
        case "max":
          return 200;
        case "segments":
          return [
            { from: 100, color: "#ff0000" },
            { from: 110, color: "#00ff00" },
            { from: 120, color: "#0000ff" },
            { from: 160, color: "#00ff00" },
            { from: 200, color: "#ff0000" },
          ];
        default:
          return undefined;
      }
    });

    const min = card.getValue("min");
    const max = card.getValue("max");
    const result = getGradientSegments(card, "main", min, max);

    expect(card.getValue).toHaveBeenCalledWith("segments");
    expect(result).toEqual([
      { pos: 0, color: "#ff0000" },
      { pos: 0.1, color: "#00ff00" },
      { pos: 0.2, color: "#0000ff" },
      { pos: 0.6, color: "#00ff00" },
      { pos: 1, color: "#ff0000" },
    ]);
  });

  it("multiple, sub-match min/max, no interpolation", () => {
    const getValueSpy = vi.spyOn(card, "getValue");
    getValueSpy.mockImplementation((key: string) => {
      switch (key) {
        case "min":
          return 110;
        case "max":
          return 160;
        case "segments":
          return [
            { from: 100, color: "#ff0000" },
            { from: 110, color: "#00ff00" },
            { from: 120, color: "#0000ff" },
            { from: 160, color: "#00ff00" },
            { from: 200, color: "#ff0000" },
          ];
        default:
          return undefined;
      }
    });

    const min = card.getValue("min");
    const max = card.getValue("max");
    const result = getGradientSegments(card, "main", min, max);

    expect(card.getValue).toHaveBeenCalledWith("segments");
    expect(result).toEqual([
      { pos: 0, color: "#00ff00" },
      { pos: 0.2, color: "#0000ff" },
      { pos: 1, color: "#00ff00" },
    ]);
  });

  it("range fully below lowest segment", () => {
    const getValueSpy = vi.spyOn(card, "getValue");
    getValueSpy.mockImplementation((key: string) => {
      switch (key) {
        case "min":
          return 0;
        case "max":
          return 10;
        case "segments":
          return [
            { from: 100, color: "#ff0000" },
            { from: 110, color: "#00ff00" },
            { from: 120, color: "#0000ff" },
            { from: 160, color: "#00ff00" },
            { from: 200, color: "#ff0000" },
          ];
        default:
          return undefined;
      }
    });

    const min = card.getValue("min");
    const max = card.getValue("max");
    const result = getGradientSegments(card, "main", min, max);

    expect(card.getValue).toHaveBeenCalledWith("segments");
    expect(result).toEqual([
      { pos: 0, color: "#039be5" },
      { pos: 1, color: "#039be5" },
    ]);
  });

  it("max @ first from", () => {
    const getValueSpy = vi.spyOn(card, "getValue");
    getValueSpy.mockImplementation((key: string) => {
      switch (key) {
        case "min":
          return 0;
        case "max":
          return 100;
        case "segments":
          return [
            { from: 100, color: "#ff0000" },
            { from: 110, color: "#00ff00" },
            { from: 120, color: "#0000ff" },
            { from: 160, color: "#00ff00" },
            { from: 200, color: "#ff0000" },
          ];
        default:
          return undefined;
      }
    });

    const min = card.getValue("min");
    const max = card.getValue("max");
    const result = getGradientSegments(card, "main", min, max);

    expect(card.getValue).toHaveBeenCalledWith("segments");
    expect(result).toEqual([
      { pos: 0, color: "#039be5" },
      { pos: 1, color: "#039be5" },
      { pos: 1, color: "#ff0000" },
    ]);
  });

  it("min @ last from", () => {
    const getValueSpy = vi.spyOn(card, "getValue");
    getValueSpy.mockImplementation((key: string) => {
      switch (key) {
        case "min":
          return 200;
        case "max":
          return 300;
        case "segments":
          return [
            { from: 100, color: "#ff0000" },
            { from: 110, color: "#00ff00" },
            { from: 120, color: "#0000ff" },
            { from: 160, color: "#00ff00" },
            { from: 200, color: "#ff0000" },
          ];
        default:
          return undefined;
      }
    });

    const min = card.getValue("min");
    const max = card.getValue("max");
    const result = getGradientSegments(card, "main", min, max);

    expect(card.getValue).toHaveBeenCalledWith("segments");
    expect(result).toEqual([
      { pos: 0, color: "#ff0000" },
      { pos: 1, color: "#ff0000" },
    ]);
  });

  it("range fully above highest segment", () => {
    const getValueSpy = vi.spyOn(card, "getValue");
    getValueSpy.mockImplementation((key: string) => {
      switch (key) {
        case "min":
          return 1000;
        case "max":
          return 2000;
        case "segments":
          return [
            { from: 100, color: "#ff0000" },
            { from: 110, color: "#00ff00" },
            { from: 120, color: "#0000ff" },
            { from: 160, color: "#00ff00" },
            { from: 200, color: "#ff0000" },
          ];
        default:
          return undefined;
      }
    });

    const min = card.getValue("min");
    const max = card.getValue("max");
    const result = getGradientSegments(card, "main", min, max);

    expect(card.getValue).toHaveBeenCalledWith("segments");
    expect(result).toEqual([
      { pos: 0, color: "#ff0000" },
      { pos: 1, color: "#ff0000" },
    ]);
  });

  it("interpolation to min", () => {
    const getValueSpy = vi.spyOn(card, "getValue");
    getValueSpy.mockImplementation((key: string) => {
      switch (key) {
        case "min":
          return 250;
        case "max":
          return 300;
        case "segments":
          return [
            { from: 0, color: "#000000" },
            { from: 100, color: "#ffffff" },
            { from: 200, color: "#00ff00" },
            { from: 300, color: "#ff0000" },
          ];
        default:
          return undefined;
      }
    });

    const min = card.getValue("min");
    const max = card.getValue("max");
    const result = getGradientSegments(card, "main", min, max);

    expect(card.getValue).toHaveBeenCalledWith("segments");
    expect(result).toEqual([
      { pos: 0, color: "#7f8000" },
      { pos: 1, color: "#ff0000" },
    ]);
  });

  it("interpolation to max", () => {
    const getValueSpy = vi.spyOn(card, "getValue");
    getValueSpy.mockImplementation((key: string) => {
      switch (key) {
        case "min":
          return 100;
        case "max":
          return 150;
        case "segments":
          return [
            { from: 0, color: "#ffffff" },
            { from: 100, color: "#ff0000" },
            { from: 200, color: "#00ff00" },
            { from: 300, color: "#ffffff" },
          ];
        default:
          return undefined;
      }
    });

    const min = card.getValue("min");
    const max = card.getValue("max");
    const result = getGradientSegments(card, "main", min, max);

    expect(card.getValue).toHaveBeenCalledWith("segments");
    expect(result).toEqual([
      { pos: 0, color: "#ff0000" },
      { pos: 1, color: "#807f00" },
    ]);
  });
});
