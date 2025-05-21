import { describe, it, expect } from "vitest";
import { getInterpolatedColor } from "../../utils/color/get-interpolated-color";

describe("getInterpolatedColor - single", () => {
  it("min", () => {
    const result = getInterpolatedColor({
      min: 100,
      colorMin: "#ff0000",
      max: 200,
      colorMax: "00ff00",
      value: 100,
    });
    expect(result).toEqual("#ff0000");
  });

  it("max", () => {
    const result = getInterpolatedColor({
      min: 100,
      colorMin: "#ff0000",
      max: 200,
      colorMax: "00ff00",
      value: 200,
    });
    expect(result).toEqual("#00ff00");
  });

  it("mid", () => {
    const result = getInterpolatedColor({
      min: 100,
      colorMin: "#ff0000",
      max: 200,
      colorMax: "00ff00",
      value: 150,
    });
    expect(result).toEqual("#807f00");
  });

  it("too small", () => {
    const result = getInterpolatedColor({
      min: 100,
      colorMin: "#ff0000",
      max: 200,
      colorMax: "00ff00",
      value: 0,
    });
    expect(result).toEqual(undefined);
  });

  it("too big", () => {
    const result = getInterpolatedColor({
      min: 100,
      colorMin: "#ff0000",
      max: 200,
      colorMax: "00ff00",
      value: 300,
    });
    expect(result).toEqual(undefined);
  });
});

describe("getInterpolatedColor - array", () => {
  const gradientSegments = [
    { pos: 0, color: "#ff0000" },
    { pos: 1, color: "#00ff00" },
  ];
  it("min", () => {
    const result = getInterpolatedColor({
      gradientSegments: gradientSegments,
      min: 100,
      max: 200,
      value: 100,
    });
    expect(result).toEqual("#ff0000");
  });

  it("max", () => {
    const result = getInterpolatedColor({
      gradientSegments: gradientSegments,
      min: 100,
      max: 200,
      value: 200,
    });
    expect(result).toEqual("#00ff00");
  });

  it("mid", () => {
    const result = getInterpolatedColor({
      gradientSegments: gradientSegments,
      min: 100,
      max: 200,
      value: 150,
    });
    expect(result).toEqual("#807f00");
  });

  it("too small", () => {
    const result = getInterpolatedColor({
      gradientSegments: gradientSegments,
      min: 100,
      max: 200,
      value: 0,
    });
    expect(result).toEqual(undefined);
  });

  it("too big", () => {
    const result = getInterpolatedColor({
      gradientSegments: gradientSegments,
      min: 100,
      max: 200,
      value: 300,
    });
    expect(result).toEqual(undefined);
  });
});
