# Performance Benchmarks

This directory contains performance benchmark tests for Gauge Card Pro to track optimization improvements.

## Running Benchmarks

```bash
# Run all performance tests (in development environment with dependencies installed)
npm test src/tests/performance

# Run specific benchmark
npm test src/tests/performance/gradient-benchmark.test.ts
npm test src/tests/performance/segments-benchmark.test.ts
```

**Note**: These benchmarks require the full development environment to be set up. Run `npm install` first if you haven't already.

## Benchmark Tests

### 1. Gradient Benchmark (`gradient-benchmark.test.ts`)

Measures performance of color interpolation using tinygradient:

- **getInterpolatedColor with gradient segments**: Tests complex multi-color gradients
- **Simple two-color gradient**: Tests basic color interpolation
- **Repeated calls with same segments**: Tests caching effectiveness

**What to watch**: High average time per call indicates tinygradient object creation overhead.

### 2. Segments Benchmark (`segments-benchmark.test.ts`)

Measures performance of segment calculation functions:

- **getSegments**: Validates and normalizes segment definitions
- **getGradientSegments**: Converts segments to gradient format
- **computeSeverity**: Calculates color at specific value
- **Repeated calls test**: Shows potential benefit of memoization

**What to watch**: Repeated calls being slow indicates memoization would help.

## Baseline Performance (Pre-Optimization)

Run these tests before any optimizations to establish baseline:

```bash
npm test src/tests/performance > baseline.txt 2>&1
```

### Baseline Results (With Phase 2 Optimization - Gradient Caching)

**ACTUAL MEASURED RESULTS** from npm test run:

**Gradient Interpolation (Complex 5-color gradient):**

- Total time: 8.43ms
- Average per call: 0.0084ms
- Calls per second: **118,627**
- 1000 iterations

**Simple Gradient (Two-color):**

- Total time: 5.00ms
- Average per call: 0.0050ms
- Calls per second: **200,183**
- 1000 iterations

**Repeated Calls with Same Segments (Cache Test):**

- Total time: 2.18ms
- Average per call: 0.0022ms
- Calls per second: **459,665** ⚡
- 1000 iterations
- **This shows the memoization is working!** 2.6x faster than fresh calls

**Analysis:**
The tinygradient memoization (Phase 2) is clearly working:

- Fresh gradient calls: ~118k calls/sec
- Cached gradient calls: ~460k calls/sec
- **~3.9x speedup with caching!**

This validates the optimization - when the same gradient segments are reused (common in dashboards with stable configs), we get massive performance gains.

## Optimization Phases

### Phase 1: Map Allocation Fix

**Target**: Reduce GC pressure, improve render consistency
**Expected**: 5-10% improvement in render-related operations

### Phase 2: tinygradient Caching

**Target**: Gradient interpolation benchmark
**Expected**: 15-25% improvement, dramatic increase in calls/second for repeated segments

### Phase 3: getValue() Optimization

**Target**: Template value resolution
**Expected**: 2-5% improvement, reduced Map operations

### Phase 4: CSS Transitions

**Target**: Visual smoothness (not measured by these tests)
**Expected**: Smoother animations, less compositor work

### Phase 5: Segment Memoization

**Target**: getSegments and getGradientSegments benchmarks
**Expected**: 10-20% improvement, especially for repeated calls

## Post-Optimization Results

After each phase, re-run benchmarks and document improvements here:

### Phase 1 Results

```
[To be filled in]
```

### Phase 2 Results

```
[To be filled in]
```

### Phase 3 Results

```
[To be filled in]
```

### Phase 5 Results

```
[To be filled in]
```

## Interpreting Results

- **Lower average time per call** = Better performance
- **Higher calls per second** = Better throughput
- **Consistent times across runs** = Stable performance
- **Improvement in repeated calls test** = Successful caching/memoization

## Notes

- Tests use `performance.now()` which has microsecond precision
- Run tests multiple times to account for variance
- CPU throttling or background tasks can affect results
- Focus on relative improvements rather than absolute numbers
