import { describe, it, expect, vi, afterEach } from "vitest";
import type { Gauge } from "../../../card/config";
import type { GaugeCardProCard } from "../../../card/card";
import { computeSeverity } from "../../../card/_segments";

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
  () => ({ isTouch: () => false })
);

describe("computeSeverity", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  type TestCase = {
    name: string;
    config: {
      type: string;
      gradient?: boolean;
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

  const defaultSegments = [
    { from: 0, color: "#ff0000" },
    { from: 100, color: "#00ff00" },
    { from: 200, color: "#0000ff" },
  ];

  const cases: TestCase[] = [
    {
      name: "0, no interpolation",
      config: {
        type: "custom:gauge-card-pro",
        gradient: false,
        needle: false,
      },
      segments: defaultSegments,
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
        gradient: false,
        needle: false,
      },
      segments: defaultSegments,
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
        gradient: false,
        needle: false,
      },
      segments: defaultSegments,
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
        gradient: false,
        needle: false,
      },
      segments: defaultSegments,
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
        gradient: false,
        needle: false,
      },
      segments: defaultSegments,
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
        gradient: false,
        needle: false,
      },
      segments: defaultSegments,
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
        gradient: true,
        needle: false,
      },
      segments: defaultSegments,
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
        gradient: false,
        needle: false,
      },
      segments: defaultSegments,
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
        gradient: false,
        needle: true,
      },
      segments: defaultSegments,
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
        gradient: false,
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
          gradient: false,
        },
      },
      segments: defaultSegments,
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
          gradient: true,
        },
      },
      segments: defaultSegments,
      gauge: "inner",
      min: 0,
      max: 200,
      value: 50,
      shouldCallSegments: false,
      shouldCallInnerSegments: true,
      expected: "#807f00",
    },
  ];

  const card = {
    _config: vi.fn(),
    getValue: vi.fn(),
  } as unknown as GaugeCardProCard;

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
      // mock _config
      vi.spyOn(card, "_config", "get").mockReturnValue({
        type: config.type,
        gradient: config.gradient,
        needle: config.needle,
        inner: config.inner,
      });

      // mock card.getValue()
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

      const _gauge = gauge === undefined ? "main" : "inner";
      const result = computeSeverity(card, _gauge, min, max, value);

      if (shouldCallSegments) {
        expect(card.getValue).toHaveBeenNthCalledWith(1, "segments");
      } else {
        expect(card.getValue).not.toHaveBeenCalledWith("segments");
      }

      if (shouldCallInnerSegments) {
        expect(card.getValue).toHaveBeenNthCalledWith(1, "inner.segments");
      } else {
        expect(card.getValue).not.toHaveBeenCalledWith("inner.segments");
      }

      expect(result).toBe(expected);
    }
  );
});
