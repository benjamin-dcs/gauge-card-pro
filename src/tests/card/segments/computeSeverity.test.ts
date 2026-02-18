import { describe, it, expect, vi, afterEach } from "vitest";
import { createMockLogger } from "../../mock-logger";
import type { Gauge, SeverityColorModes } from "../../../card/config";
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
    gauge?: Gauge;
    severity_color_mode: SeverityColorModes;
    segments?: Array<{ pos: number; color: string }>;
    min: number;
    max: number;
    value: number;
    shouldCallSegments: boolean;
    shouldCallInnerSegments: boolean;
    expected: string | undefined;
  };

  const defaultSegments = [
    { pos: 0, color: "#ff0000" },
    { pos: 100, color: "#00ff00" },
    { pos: 200, color: "#0000ff" },
  ];

  const cases: TestCase[] = [
    {
      name: "0, no interpolation",
      severity_color_mode: "basic",
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
      severity_color_mode: "basic",
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
      severity_color_mode: "basic",
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
      severity_color_mode: "basic",
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
      severity_color_mode: "basic",
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
      severity_color_mode: "basic",
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
      severity_color_mode: "interpolation",
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
      severity_color_mode: "basic",
      segments: defaultSegments,
      min: 0,
      max: 200,
      value: -1,
      shouldCallSegments: true,
      shouldCallInnerSegments: false,
      expected: "#039be5",
    },
    {
      name: "no segments config",
      severity_color_mode: "basic",
      min: 0,
      max: 200,
      value: 100,
      shouldCallSegments: true,
      shouldCallInnerSegments: false,
      expected: "#039be5",
    },
    {
      name: "inner 50, no interpolation",
      severity_color_mode: "basic",
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
      severity_color_mode: "interpolation",
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
  const log = createMockLogger();
  const card = {
    _config: vi.fn(),
    getValue: vi.fn(),
  } as unknown as GaugeCardProCard;

  it.each(cases)(
    "$name",
    ({
      gauge,
      severity_color_mode,
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
        type: "custom:gauge-card-pro",
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
      const result = computeSeverity(
        log,
        card.getValue,
        severity_color_mode,
        _gauge,
        min,
        max,
        value
      );

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
