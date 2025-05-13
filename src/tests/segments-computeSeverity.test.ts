import { describe, it, expect, vi, afterEach } from "vitest";
import type { Gauge } from "../card/config";
import type { GaugeCardProCard } from "../card/card";
import { computeSeverity } from "../card/_segments";

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
  () => ({ isTouch: () => false })
);

describe("computeSeverity", () => {
  const card = {
    _config: vi.fn(),
    getValue: vi.fn(),
  } as unknown as GaugeCardProCard;

  afterEach(() => {
    vi.clearAllMocks();
  });

  type TestCase = {
    name: string;
    config: {
      type: string;
      color_interpolation?: boolean;
      needle?: boolean;
      inner?: {};
    };
    gauge?: Gauge;
    segments?: Array<{ from: number; color: string }>;
    min: number;
    max: number;
    value: number;
    shouldCallSegments: boolean;
    shouldCallInnerSegments: boolean;
    expected: string | undefined;
  };

  const cases: TestCase[] = [
    {
      name: "0, no interpolation",
      config: {
        type: "custom:gauge-card-pro",
        color_interpolation: false,
        needle: false,
      },
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 100, color: "#00ff00" },
        { from: 200, color: "#0000ff" },
      ],
      min: 0,
      max: 200,
      value: 0,
      shouldCallSegments: true,
      shouldCallInnerSegments: false,
      expected: "#ff0000",
    },
    {
      name: "50, no interpolation",
      config: {
        type: "custom:gauge-card-pro",
        color_interpolation: false,
        needle: false,
      },
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 100, color: "#00ff00" },
        { from: 200, color: "#0000ff" },
      ],
      min: 0,
      max: 200,
      value: 50,
      shouldCallSegments: true,
      shouldCallInnerSegments: false,
      expected: "#ff0000",
    },
    {
      name: "100, no interpolation",
      config: {
        type: "custom:gauge-card-pro",
        color_interpolation: false,
        needle: false,
      },
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 100, color: "#00ff00" },
        { from: 200, color: "#0000ff" },
      ],
      min: 0,
      max: 200,
      value: 100,
      shouldCallSegments: true,
      shouldCallInnerSegments: false,
      expected: "#00ff00",
    },
    {
      name: "150, no interpolation",
      config: {
        type: "custom:gauge-card-pro",
        color_interpolation: false,
        needle: false,
      },
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 100, color: "#00ff00" },
        { from: 200, color: "#0000ff" },
      ],
      min: 0,
      max: 200,
      value: 150,
      shouldCallSegments: true,
      shouldCallInnerSegments: false,
      expected: "#00ff00",
    },
    {
      name: "200, no interpolation",
      config: {
        type: "custom:gauge-card-pro",
        color_interpolation: false,
        needle: false,
      },
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 100, color: "#00ff00" },
        { from: 200, color: "#0000ff" },
      ],
      min: 0,
      max: 200,
      value: 200,
      shouldCallSegments: true,
      shouldCallInnerSegments: false,
      expected: "#0000ff",
    },
    {
      name: "250, no interpolation",
      config: {
        type: "custom:gauge-card-pro",
        color_interpolation: false,
        needle: false,
      },
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 100, color: "#00ff00" },
        { from: 200, color: "#0000ff" },
      ],
      min: 0,
      max: 200,
      value: 200,
      shouldCallSegments: true,
      shouldCallInnerSegments: false,
      expected: "#0000ff",
    },
    {
      name: "50, with interpolation",
      config: {
        type: "custom:gauge-card-pro",
        color_interpolation: true,
        needle: false,
      },
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 100, color: "#00ff00" },
        { from: 200, color: "#0000ff" },
      ],
      min: 0,
      max: 200,
      value: 50,
      shouldCallSegments: true,
      shouldCallInnerSegments: false,
      expected: "#807f00",
    },
    {
      name: "-1",
      config: {
        type: "custom:gauge-card-pro",
        color_interpolation: false,
        needle: false,
      },
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 100, color: "#00ff00" },
        { from: 200, color: "#0000ff" },
      ],
      min: 0,
      max: 200,
      value: -1,
      shouldCallSegments: true,
      shouldCallInnerSegments: false,
      expected: "#039be5",
    },
    {
      name: "needle",
      config: {
        type: "custom:gauge-card-pro",
        color_interpolation: false,
        needle: true,
      },
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 100, color: "#00ff00" },
        { from: 200, color: "#0000ff" },
      ],
      min: 0,
      max: 200,
      value: 100,
      shouldCallSegments: false,
      shouldCallInnerSegments: false,
      expected: undefined,
    },
    {
      name: "no segments config",
      config: {
        type: "custom:gauge-card-pro",
        color_interpolation: false,
        needle: false,
      },
      min: 0,
      max: 200,
      value: 100,
      shouldCallSegments: true,
      shouldCallInnerSegments: false,
      expected: "#039be5",
    },
    {
      name: "inner 50, no interpolation",
      config: {
        type: "custom:gauge-card-pro",
        inner: {
          mode: "severity",
          color_interpolation: false,
        },
      },
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 100, color: "#00ff00" },
        { from: 200, color: "#0000ff" },
      ],
      gauge: "inner",
      min: 0,
      max: 200,
      value: 50,
      shouldCallSegments: false,
      shouldCallInnerSegments: true,
      expected: "#ff0000",
    },
    {
      name: "inner 50, with interpolation",
      config: {
        type: "custom:gauge-card-pro",
        inner: {
          mode: "severity",
          color_interpolation: true,
        },
      },
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 100, color: "#00ff00" },
        { from: 200, color: "#0000ff" },
      ],
      gauge: "inner",
      min: 0,
      max: 200,
      value: 50,
      shouldCallSegments: false,
      shouldCallInnerSegments: true,
      expected: "#807f00",
    },
  ];

  it.each(cases)(
    "$name",
    ({
      config,
      gauge,
      segments,
      min,
      max,
      value,
      expected,
      shouldCallSegments,
      shouldCallInnerSegments,
    }) => {
      const _gauge = gauge === undefined ? "main" : "inner";

      // 1) mock the config getter
      vi.spyOn(card, "_config", "get").mockReturnValue({
        type: config.type,
        color_interpolation: config.color_interpolation,
        needle: config.needle,
        inner: config.inner,
      });

      // 2) mock everything getValue should return
      vi.spyOn(card, "getValue").mockImplementation((key: string) => {
        switch (key) {
          case "segments":
            return segments;
          case "inner.segments":
            return segments;
          default:
            return undefined;
        }
      });

      // 3) run computeSeverity
      const result = computeSeverity(card, _gauge, min, max, value);

      // 4) branch on whether segments should have been fetched
      if (shouldCallSegments) {
        expect(card.getValue).toHaveBeenCalledWith("segments");
      } else {
        expect(card.getValue).not.toHaveBeenCalledWith("segments");
      }

      if (shouldCallInnerSegments) {
        expect(card.getValue).toHaveBeenCalledWith("inner.segments");
      } else {
        expect(card.getValue).not.toHaveBeenCalledWith("inner.segments");
      }

      // 5) assert
      expect(result).toBe(expected);
    }
  );
});
