import { describe, it, expect, vi, afterEach } from "vitest";
import { computeDarkMode } from "../../dependencies/mushroom/utils/base-element";
import { GaugeCardProCard } from "../../card/card";

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

vi.mock("../../dependencies/mushroom/utils/custom-cards.ts", () => ({
  registerCustomCard: () => "",
}));

vi.mock("../../dependencies/mushroom/utils/base-element");

describe("getLightDarkModeColor", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  type TestCase = {
    name: string;
    configColor: any;
    mode: "light" | "dark";
    expected: string | undefined;
  };

  const cases: TestCase[] = [
    {
      name: "single color",
      configColor: "#aaaaaa",
      mode: "light",
      expected: "#aaaaaa",
    },
    {
      name: "light_mode",
      configColor: { light_mode: "#ffffff", dark_mode: "#000000" },
      mode: "light",
      expected: "#ffffff",
    },
    {
      name: "dark_mode",
      configColor: { light_mode: "#ffffff", dark_mode: "#000000" },
      mode: "dark",
      expected: "#000000",
    },
    {
      name: "missing dark_mode",
      configColor: { light_mode: "#ffffff" },
      mode: "dark",
      expected: "#123456",
    },
    {
      name: "missing light_mode",
      configColor: { dark_mode: "#000000" },
      mode: "dark",
      expected: "#123456",
    },
    {
      name: "undefined",
      configColor: undefined,
      mode: "dark",
      expected: "#123456",
    },
  ];

  it.each(cases)("$name", ({ configColor, mode, expected }) => {
    // mock computeDarkMode
    vi.mocked(computeDarkMode).mockReturnValue(mode === "dark");

    // mock card.getValue()
    const card = new GaugeCardProCard();
    vi.spyOn(card, "getValue").mockImplementation((key: string) => {
      switch (key) {
        case "needle_color":
          return configColor;
        default:
          return undefined;
      }
    });

    const result = card["getLightDarkModeColor"]("needle_color", "#123456");
    expect(card.getValue).toHaveBeenCalledOnce;
    expect(result).toBe(expected);
  });
});
