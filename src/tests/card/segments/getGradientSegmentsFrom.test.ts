import { describe, it, expect, vi, afterEach } from "vitest";

// import type { GaugeCardProCard } from "../../../card/card";
import { GaugeCardProCard } from "../../../card/card";
import { getGradientSegments } from "../../../card/_segments";

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
    use_new_from_segments_style?: boolean;
  };

  const cases: TestCase[] = [
    {
      name: "midpoints - old style",
      min: 0,
      max: 100,
      segments: [
        { from: 0, color: "#00ff00" },
        { from: 40, color: "#ffff00" },
        { from: 80, color: "#ff0000" },
      ],
      expected: [
        { pos: 0, color: "#00ff00" },
        { pos: 0.4, color: "#ffff00" },
        { pos: 0.8, color: "#ff0000" },
      ],
      use_new_from_segments_style: false,
    },
    {
      name: "midpoints - new style",
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
  ];

  const card = new GaugeCardProCard();
  it.each(cases)(
    "$name",
    ({ min, max, segments, expected, use_new_from_segments_style = true }) => {
      vi.spyOn(card, "_config", "get").mockReturnValue({
        type: "custom:gauge-card-pro",
        use_new_from_segments_style: use_new_from_segments_style,
      });

      vi.spyOn(card, "getValue").mockImplementation((key: string) => {
        switch (key) {
          case "segments":
            return segments;
          default:
            return undefined;
        }
      });

      const result = getGradientSegments(card, "main", min, max, true);

      expect(card.getValue).toHaveBeenNthCalledWith(1, "segments");
      expect(result).toEqual(expected);
    }
  );
});
