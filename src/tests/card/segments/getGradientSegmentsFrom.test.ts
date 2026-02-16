import { describe, it, expect, vi, afterEach } from "vitest";

import { createMockLogger } from "../../mock-logger";
import { GaugeCardProCard } from "../../../card/card";
import { getTinygradientSegments } from "../../../card/_segments";

vi.mock(
  "../../../dependencies/ha/panels/lovelace/common/directives/action-handler-directive.ts",
  () => ({ isTouch: () => false })
);

vi.mock("../../../dependencies/mushroom/utils/custom-cards.ts", () => ({
  registerCustomCard: () => "",
}));

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

describe("getGradientSegments", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  type TestCase = {
    name: string;
    min: number;
    max: number;
    segments?: {}[];
    expected: {}[] | undefined;
  };

  const cases: TestCase[] = [
    {
      name: "midpoints - from style",
      min: 0,
      max: 100,
      segments: [
        { from: 0, color: "#00ff00" },
        { from: 40, color: "#ffff00" },
        { from: 80, color: "#ff0000" },
      ],
      expected: [
        { pos: 0, color: "#00ff00" },
        { pos: 0.2, color: "#00ff00" },
        { pos: 0.6, color: "#ffff00" },
        { pos: 0.9, color: "#ff0000" },
      ],
    },
    {
      name: "midpoints - pos style",
      min: 0,
      max: 100,
      segments: [
        { from: 0, color: "#00ff00" },
        { from: 40, color: "#ffff00" },
        { from: 80, color: "#ff0000" },
      ],
      expected: [
        { pos: 0, color: "#00ff00" },
        { pos: 0.2, color: "#00ff00" },
        { pos: 0.6, color: "#ffff00" },
        { pos: 0.9, color: "#ff0000" },
      ],
    },
    {
      name: "midpoints - 1st from below min",
      min: -100,
      max: 100,
      segments: [
        { from: 0, color: "#00ff00" },
        { from: 40, color: "#ffff00" },
        { from: 80, color: "#ff0000" },
      ],
      expected: [
        { pos: 0, color: "#039be5" },
        { pos: 0.25, color: "#039be5" },
        { pos: 0.5, color: "#00ff00" },
        { pos: 0.6, color: "#00ff00" },
        { pos: 0.8, color: "#ffff00" },
        { pos: 0.95, color: "#ff0000" },
      ],
    },
  ];

  const log = createMockLogger();
  const card = new GaugeCardProCard();
  it.each(cases)("$name", ({ min, max, segments, expected }) => {
    vi.spyOn(card, "_config", "get").mockReturnValue({
      type: "custom:gauge-card-pro",
    });

    vi.spyOn(card, "getValue").mockImplementation((key: string) => {
      switch (key) {
        case "segments":
          return segments;
        default:
          return undefined;
      }
    });

    const result = getTinygradientSegments(
      log,
      card.getValue,
      "main",
      min,
      max,
      true
    );

    expect(card.getValue).toHaveBeenNthCalledWith(1, "segments");
    expect(result).toEqual(expected);
  });
});
