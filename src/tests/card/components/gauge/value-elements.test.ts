import { describe, expect, it, vi } from "vitest";
import {
  GaugeCardProGaugeValueElements,
  getStableSvgTextBounds,
  type SvgTextBounds,
} from "../../../../card/components/gauge/value-elements";

vi.mock(
  "../../../../dependencies/ha/panels/lovelace/common/directives/action-handler-directive.ts",
  () => ({ isTouch: () => false })
);

const bounds = (
  x: number,
  y: number,
  width: number,
  height: number
): SvgTextBounds => ({ x, y, width, height });

describe("getStableSvgTextBounds", () => {
  it("adds horizontal padding to the initial measurement", () => {
    expect(getStableSvgTextBounds(undefined, bounds(10, 20, 30, 40))).toEqual(
      bounds(5, 20, 40, 40)
    );
  });

  it("keeps retained bounds for a smaller measurement", () => {
    const retained = bounds(-5, -20, 110, 30);

    expect(getStableSvgTextBounds(retained, bounds(0, -15, 60, 20))).toEqual(
      retained
    );
  });

  it("expands for larger measurements and does not shrink afterward", () => {
    const initial = getStableSvgTextBounds(undefined, bounds(0, -20, 100, 20));
    const expanded = getStableSvgTextBounds(initial, bounds(-10, -25, 130, 30));

    expect(expanded).toEqual(bounds(-15, -25, 140, 30));
    expect(getStableSvgTextBounds(expanded, bounds(0, -15, 50, 10))).toEqual(
      expanded
    );
  });

  it("allows primary and secondary bounds to stabilize independently", () => {
    const primary = getStableSvgTextBounds(undefined, bounds(0, -20, 100, 20));
    let secondary = getStableSvgTextBounds(undefined, bounds(0, -10, 40, 10));

    secondary = getStableSvgTextBounds(secondary, bounds(0, -12, 80, 12));

    expect(primary).toEqual(bounds(-5, -20, 110, 20));
    expect(secondary).toEqual(bounds(-5, -12, 90, 12));
  });

  it("establishes a fresh baseline after one element's bounds are reset", () => {
    const retainedPrimary = getStableSvgTextBounds(
      undefined,
      bounds(0, -20, 100, 20)
    );
    const secondary = getStableSvgTextBounds(undefined, bounds(0, -12, 80, 12));

    const resetPrimary = getStableSvgTextBounds(
      undefined,
      bounds(0, -8, 20, 8)
    );

    expect(retainedPrimary).toEqual(bounds(-5, -20, 110, 20));
    expect(resetPrimary).toEqual(bounds(-5, -8, 30, 8));
    expect(secondary).toEqual(bounds(-5, -12, 90, 12));
  });

  it("ignores zero-sized and unavailable measurements", () => {
    const retained = bounds(-5, -20, 110, 20);

    expect(getStableSvgTextBounds(retained, bounds(0, 0, 0, 20))).toEqual(
      retained
    );
    expect(getStableSvgTextBounds(retained, bounds(0, 0, 20, 0))).toEqual(
      retained
    );
    expect(
      getStableSvgTextBounds(retained, bounds(Number.NaN, 0, 20, 10))
    ).toEqual(retained);
    expect(
      getStableSvgTextBounds(
        retained,
        bounds(0, 0, Number.POSITIVE_INFINITY, 10)
      )
    ).toEqual(retained);
    expect(getStableSvgTextBounds(retained, undefined)).toEqual(retained);
    expect(
      getStableSvgTextBounds(undefined, bounds(0, 0, 0, 0))
    ).toBeUndefined();
  });
});

describe("GaugeCardProGaugeValueElements text bounds", () => {
  type ValueText = { text: string } | undefined;
  type ValueElementsHarness = {
    data: {
      primaryValueText: ValueText;
      secondaryValueText: ValueText;
    };
    shadowRoot: {
      querySelector: (selector: string) => {
        querySelector: () => { getBBox: () => SvgTextBounds };
        setAttribute: (name: string, value: string) => void;
      };
    };
    _primaryValueTextBounds: SvgTextBounds | undefined;
    _secondaryValueTextBounds: SvgTextBounds | undefined;
  };
  const rescaleSvgText = Reflect.get(
    GaugeCardProGaugeValueElements.prototype,
    "_rescaleSvgText"
  ) as (
    this: ValueElementsHarness,
    element?: "all" | "primary-value-text" | "secondary-value-text"
  ) => void;

  it.each([undefined, { text: "icon(mdi:gauge)" }] as const)(
    "resets only the primary bounds when its text is replaced with %s",
    (primaryValueText) => {
      const primaryGetBBox = vi
        .fn()
        .mockReturnValueOnce(bounds(0, -20, 100, 20))
        .mockReturnValueOnce(bounds(0, -8, 20, 8));
      const secondaryGetBBox = vi.fn(() => bounds(0, -12, 80, 12));
      const primarySvg = {
        querySelector: vi.fn(() => ({ getBBox: primaryGetBBox })),
        setAttribute: vi.fn(),
      };
      const secondarySvg = {
        querySelector: vi.fn(() => ({ getBBox: secondaryGetBBox })),
        setAttribute: vi.fn(),
      };
      const valueElements: ValueElementsHarness = {
        data: {
          primaryValueText: { text: "100" },
          secondaryValueText: { text: "80" },
        },
        shadowRoot: {
          querySelector: vi.fn((selector: string) =>
            selector === "#primary-value-text-box" ? primarySvg : secondarySvg
          ),
        },
        _primaryValueTextBounds: undefined,
        _secondaryValueTextBounds: undefined,
      };

      rescaleSvgText.call(valueElements);
      const secondaryBounds = valueElements._secondaryValueTextBounds;

      valueElements.data.primaryValueText = primaryValueText;
      rescaleSvgText.call(valueElements, "primary-value-text");

      expect(valueElements._primaryValueTextBounds).toBeUndefined();
      expect(valueElements._secondaryValueTextBounds).toEqual(secondaryBounds);

      valueElements.data.primaryValueText = { text: "20" };
      rescaleSvgText.call(valueElements, "primary-value-text");

      expect(valueElements._primaryValueTextBounds).toEqual(
        bounds(-5, -8, 30, 8)
      );
      expect(valueElements._secondaryValueTextBounds).toEqual(secondaryBounds);
    }
  );
});
