import { describe, bench, it, expect, vi } from "vitest";

import { createMockLogger } from "../mock-logger";
import type { Logger } from "../../utils/logger";

import type { GaugeCardProCard } from "../../card/card";
import { getConicGradientString } from "../../card/_segments";
import { GaugeCardProCardConfig } from "../../card/config";

vi.mock("../../utils/color/computed-color", () => ({
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
  "../../dependencies/ha/panels/lovelace/common/directives/action-handler-directive.ts",
  () => ({ isTouch: () => false })
);

// Mock minimal card instance for testing
function createMockCard(config: Partial<GaugeCardProCardConfig>): {
  _config: GaugeCardProCardConfig;
  getValue: any;
  log: Logger;
} {
  const _config: GaugeCardProCardConfig = {
    segments: [
      { pos: 0, color: "#ff0000" },
      { pos: 25, color: "#FFA500" },
      { pos: 50, color: "#ffff00" },
      { pos: 75, color: "#00ff00" },
      { pos: 100, color: "#0000ff" },
    ],
    ...config,
  } as GaugeCardProCardConfig;

  const getValue: any = (key) => {
    if (key === "segments") return _config.segments;
    if (key === "inner.segments") return _config.inner?.segments;
    return undefined;
  };

  const log = createMockLogger();

  return {
    _config,
    getValue,
    log,
  };
}

describe("Segment Calculation Benchmarks", () => {
  bench("should measure getConicGradientString performance", () => {
    const card = createMockCard({});
    const iterations = 10000;

    for (let i = 0; i < iterations; i++) {
      getConicGradientString(
        card.log,
        card.getValue,
        "main",
        0,
        100,
        false,
        undefined
      );
    }
  });
});
