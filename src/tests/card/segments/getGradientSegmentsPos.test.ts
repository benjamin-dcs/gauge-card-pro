import { describe, it, expect, vi, afterEach } from "vitest";

import { createMockLogger } from "../../mock-logger";

import type { GaugeCardProCard } from "../../../card/card";
import { getGradientSegments } from "../../../card/_segments";

vi.mock("../../../utils/color/computed-color", () => ({
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
  "../../../dependencies/ha/panels/lovelace/common/directives/action-handler-directive.ts",
  () => ({
    isTouch: () => false,
  })
);

describe("getGradientSegments", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  type TestCase = {
    name: string;
    min: number;
    max: number;
    segmentsOverride?: {}[];
    expected: {}[] | undefined;
  };

  const cases: TestCase[] = [
    {
      name: "single segment",
      min: 0,
      max: 100,
      segmentsOverride: [{ from: 0, color: "#ff0000" }],
      expected: [
        { pos: 0, color: "#ff0000" },
        { pos: 1, color: "#ff0000" },
      ],
    },
    {
      name: "multiple, matching min/max, no interpolation",
      min: 100,
      max: 200,
      expected: [
        { pos: 0, color: "#ff0000" },
        { pos: 0.1, color: "#00ff00" },
        { pos: 0.2, color: "#0000ff" },
        { pos: 0.6, color: "#00ff00" },
        { pos: 1, color: "#ff0000" },
      ],
    },
    {
      name: "multiple, sub, matching min/max, no interpolation",
      min: 110,
      max: 160,
      expected: [
        { pos: 0, color: "#00ff00" },
        { pos: 0.2, color: "#0000ff" },
        { pos: 1, color: "#00ff00" },
      ],
    },
    {
      name: "range fully below lowest segment",
      min: 0,
      max: 10,
      expected: [
        { pos: 0, color: "#039be5" },
        { pos: 1, color: "#039be5" },
      ],
    },
    {
      name: "range fully above highest segment",
      min: 1000,
      max: 2000,
      expected: [
        { pos: 0, color: "#ff0000" },
        { pos: 1, color: "#ff0000" },
      ],
    },
    {
      name: "max @ first from",
      min: 0,
      max: 100,
      expected: [
        { pos: 0, color: "#039be5" },
        { pos: 1, color: "#039be5" },
      ],
    },
    {
      name: "min @ last from",
      min: 200,
      max: 300,
      expected: [
        { pos: 0, color: "#ff0000" },
        { pos: 1, color: "#ff0000" },
      ],
    },
    {
      name: "interpolation to min",
      min: 250,
      max: 300,
      segmentsOverride: [
        { from: 0, color: "#000000" },
        { from: 100, color: "#ffffff" },
        { from: 200, color: "#00ff00" },
        { from: 300, color: "#ff0000" },
      ],
      expected: [
        { pos: 0, color: "#7f8000" },
        { pos: 1, color: "#ff0000" },
      ],
    },
    {
      name: "interpolation to max",
      min: 100,
      max: 150,
      segmentsOverride: [
        { from: 0, color: "#ffffff" },
        { from: 100, color: "#ff0000" },
        { from: 200, color: "#00ff00" },
        { from: 300, color: "#ffffff" },
      ],
      expected: [
        { pos: 0, color: "#ff0000" },
        { pos: 1, color: "#807f00" },
      ],
    },
  ];

  // mock card.getValue()
  const log = createMockLogger();
  const card = {
    log: vi.fn(),
    getValue: vi.fn(),
  } as unknown as GaugeCardProCard;
  it.each(cases)("$name", ({ min, max, segmentsOverride, expected }) => {
    vi.spyOn(card, "getValue").mockImplementation((key: string) => {
      switch (key) {
        case "segments":
          return segmentsOverride
            ? segmentsOverride
            : [
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

    const result = getGradientSegments(log, card.getValue, "main", min, max);

    expect(card.getValue).toHaveBeenNthCalledWith(1, "segments");
    expect(result).toEqual(expected);
  });
});
