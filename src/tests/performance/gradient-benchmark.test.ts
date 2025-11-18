import { describe, it, expect } from "vitest";
import { getInterpolatedColor } from "../../utils/color/get-interpolated-color";
import { GradientSegment } from "../../card/config";

describe("Gradient Performance Benchmarks", () => {
  const gradientSegments: GradientSegment[] = [
    { pos: 0, color: "#ff0000" },
    { pos: 0.25, color: "#FFA500" },
    { pos: 0.5, color: "#ffff00" },
    { pos: 0.75, color: "#00ff00" },
    { pos: 1, color: "#0000ff" },
  ];

  it("should measure getInterpolatedColor with gradient segments", () => {
    const iterations = 1000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      const value = Math.random() * 100;
      getInterpolatedColor({
        gradientSegments,
        min: 0,
        max: 100,
        value,
      });
    }

    const end = performance.now();
    const duration = end - start;
    const avgTime = duration / iterations;

    console.log(`\n📊 Gradient Interpolation Benchmark:`);
    console.log(`  Total time: ${duration.toFixed(2)}ms`);
    console.log(`  Iterations: ${iterations}`);
    console.log(`  Average per call: ${avgTime.toFixed(4)}ms`);
    console.log(`  Calls per second: ${(1000 / avgTime).toFixed(0)}`);

    // Test passes as long as it completes (we're just measuring performance)
    expect(avgTime).toBeGreaterThan(0);
  });

  it("should measure getInterpolatedColor with simple two-color gradient", () => {
    const iterations = 1000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      const value = Math.random() * 100;
      getInterpolatedColor({
        min: 0,
        max: 100,
        value,
        colorMin: "#ff0000",
        colorMax: "#0000ff",
      });
    }

    const end = performance.now();
    const duration = end - start;
    const avgTime = duration / iterations;

    console.log(`\n📊 Simple Gradient Benchmark:`);
    console.log(`  Total time: ${duration.toFixed(2)}ms`);
    console.log(`  Iterations: ${iterations}`);
    console.log(`  Average per call: ${avgTime.toFixed(4)}ms`);
    console.log(`  Calls per second: ${(1000 / avgTime).toFixed(0)}`);

    expect(avgTime).toBeGreaterThan(0);
  });

  it("should measure repeated calls with same segments (tests caching)", () => {
    const iterations = 1000;
    const start = performance.now();

    // Use same segments and same value to test if caching helps
    for (let i = 0; i < iterations; i++) {
      getInterpolatedColor({
        gradientSegments,
        min: 0,
        max: 100,
        value: 50, // Same value each time
      });
    }

    const end = performance.now();
    const duration = end - start;
    const avgTime = duration / iterations;

    console.log(`\n📊 Repeated Calls (Cache Test):`);
    console.log(`  Total time: ${duration.toFixed(2)}ms`);
    console.log(`  Iterations: ${iterations}`);
    console.log(`  Average per call: ${avgTime.toFixed(4)}ms`);
    console.log(`  Calls per second: ${(1000 / avgTime).toFixed(0)}`);

    expect(avgTime).toBeGreaterThan(0);
  });
});
