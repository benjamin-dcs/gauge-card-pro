import { describe, it, expect } from "vitest";
import {
  getSegments,
  getGradientSegments,
  computeSeverity,
} from "../../card/_segments";
import { GaugeCardProCard } from "../../card/card";
import { GaugeCardProCardConfig } from "../../card/config";

// Mock minimal card instance for testing
function createMockCard(config: Partial<GaugeCardProCardConfig>): any {
  return {
    _config: {
      use_new_from_segments_style: true,
      segments: [
        { from: 0, color: "#ff0000" },
        { from: 25, color: "#FFA500" },
        { from: 50, color: "#ffff00" },
        { from: 75, color: "#00ff00" },
        { from: 100, color: "#0000ff" },
      ],
      ...config,
    },
    getValue: function (key: string) {
      if (key === "segments") return this._config.segments;
      if (key === "inner.segments") return this._config.inner?.segments;
      return undefined;
    },
  };
}

describe("Segment Calculation Benchmarks", () => {
  it("should measure getSegments performance", () => {
    const mockCard = createMockCard({});
    const iterations = 10000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      getSegments(mockCard, "main", 0, 100);
    }

    const end = performance.now();
    const duration = end - start;
    const avgTime = duration / iterations;

    console.log(`\n📊 getSegments Benchmark:`);
    console.log(`  Total time: ${duration.toFixed(2)}ms`);
    console.log(`  Iterations: ${iterations}`);
    console.log(`  Average per call: ${avgTime.toFixed(4)}ms`);
    console.log(`  Calls per second: ${(1000 / avgTime).toFixed(0)}`);

    expect(avgTime).toBeGreaterThan(0);
  });

  it("should measure getGradientSegments performance", () => {
    const mockCard = createMockCard({});
    const iterations = 10000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      getGradientSegments(mockCard, "main", 0, 100);
    }

    const end = performance.now();
    const duration = end - start;
    const avgTime = duration / iterations;

    console.log(`\n📊 getGradientSegments Benchmark:`);
    console.log(`  Total time: ${duration.toFixed(2)}ms`);
    console.log(`  Iterations: ${iterations}`);
    console.log(`  Average per call: ${avgTime.toFixed(4)}ms`);
    console.log(`  Calls per second: ${(1000 / avgTime).toFixed(0)}`);

    expect(avgTime).toBeGreaterThan(0);
  });

  it("should measure computeSeverity performance", () => {
    const mockCard = createMockCard({
      needle: false,
      gradient: true,
    });
    const iterations = 1000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      const value = Math.random() * 100;
      computeSeverity(mockCard, "main", 0, 100, value);
    }

    const end = performance.now();
    const duration = end - start;
    const avgTime = duration / iterations;

    console.log(`\n📊 computeSeverity Benchmark:`);
    console.log(`  Total time: ${duration.toFixed(2)}ms`);
    console.log(`  Iterations: ${iterations}`);
    console.log(`  Average per call: ${avgTime.toFixed(4)}ms`);
    console.log(`  Calls per second: ${(1000 / avgTime).toFixed(0)}`);

    expect(avgTime).toBeGreaterThan(0);
  });

  it("should measure repeated calls with same inputs (tests caching potential)", () => {
    const mockCard = createMockCard({});
    const iterations = 10000;
    const start = performance.now();

    // Call with same inputs repeatedly to see if caching would help
    for (let i = 0; i < iterations; i++) {
      getSegments(mockCard, "main", 0, 100);
    }

    const end = performance.now();
    const duration = end - start;
    const avgTime = duration / iterations;

    console.log(`\n📊 Repeated getSegments (Cache Potential Test):`);
    console.log(`  Total time: ${duration.toFixed(2)}ms`);
    console.log(`  Iterations: ${iterations}`);
    console.log(`  Average per call: ${avgTime.toFixed(4)}ms`);
    console.log(`  Note: If slow, memoization would help significantly`);

    expect(avgTime).toBeGreaterThan(0);
  });
});
