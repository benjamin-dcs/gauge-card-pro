import { describe, it, expect, vi, afterEach } from "vitest";
import {
  FrontendLocaleData,
  NumberFormat,
  TimeFormat,
  DateFormat,
  TimeZone,
  FirstWeekday,
} from "../../dependencies/ha/data/translation";
import { HomeAssistant } from "../../dependencies/ha";
import type { Gauge, GaugeCardProCardConfig } from "../../card/config";
import { GaugeCardProCard } from "../../card/card";

vi.mock(
  "../../dependencies/ha/panels/lovelace/common/directives/action-handler-directive.ts",
  () => ({ isTouch: () => false })
);

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

vi.mock("../../dependencies/mushroom/utils/custom-cards.ts", () => ({
  registerCustomCard: () => "",
}));

const testLocale: FrontendLocaleData = {
  language: "en-GB",
  number_format: NumberFormat.decimal_comma,
  time_format: TimeFormat.language,
  date_format: DateFormat.language,
  time_zone: TimeZone.local,
  first_weekday: FirstWeekday.language,
};

export const createMockHomeAssistant = (hass?): HomeAssistant => {
  const mock: Partial<HomeAssistant> = {
    locale: testLocale,
    states: hass?.states,
    entities: hass?.entities,
  };

  return mock as HomeAssistant;
};

describe("getValueAndValueText", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  type TestCase = {
    name: string;
    gauge: Gauge;
    defaultValue: number;
    config?: Partial<GaugeCardProCardConfig>;
    hass?: {
      states?: any;
      entities?: any;
    };
    expected: { value: number | undefined; valueText: string };
  };

  const testValue = "1037.537";
  const testvalueText = "1.037,54";
  const testUnit = " °C";

  const casesMain: TestCase[] = [
    {
      name: "[main.1] template value, template text, no unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        value: testValue,
        value_texts: {
          primary: testvalueText,
        },
      },
      expected: { value: 1037.537, valueText: "1.037,54" },
    },
    {
      name: "[main.2] template value, template text, with unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        value: testValue,
        value_texts: {
          primary: testvalueText,
          primary_unit: testUnit,
        },
      },
      expected: { value: 1037.537, valueText: "1.037,54 °C" },
    },
    {
      name: "[main.3] default value from entity, default text from entity, no unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      expected: { value: 1037.537, valueText: "1.037,5" },
    },
    {
      name: "[main.4] default value from entity, default text from entity, with unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        value_texts: {
          primary_unit: testUnit,
        },
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      expected: { value: 1037.537, valueText: "1.037,5 °C" },
    },
    {
      name: "[main.5] template value, default text from value, no unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        value: "2075.074",
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      expected: { value: 2075.074, valueText: "2.075,07" },
    },
    {
      name: "[main.6] default value from entity, template text, no unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        value_texts: {
          primary: "test text",
        },
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 2 } },
      },
      expected: { value: 1037.537, valueText: "test text" },
    },
    {
      name: "[main.7] default value from entity, template text, with unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        value_texts: {
          primary: "test text",
          primary_unit: testUnit,
        },
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 2 } },
      },
      expected: { value: 1037.537, valueText: "test text °C" },
    },
    {
      name: "[main.8] default value from default, template text, with unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.broken",
        value_texts: {
          primary: "test text",
          primary_unit: testUnit,
        },
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 2 } },
      },
      expected: { value: 0, valueText: "test text °C" },
    },
    {
      name: "[main.9] default value from unavailable entity, default text unavailable from entity, no unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: "unavailable" },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      expected: { value: 0, valueText: "" },
    },
  ];

  const casesInner: TestCase[] = [
    {
      name: "[inner.1] template value, template text, no unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        inner: {
          value: testValue,
        },
        value_texts: {
          secondary: testvalueText,
        },
      },
      expected: { value: 1037.537, valueText: "1.037,54" },
    },
    {
      name: "[inner.2] template value, template text, with unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        inner: {
          value: testValue,
        },
        value_texts: {
          secondary: testvalueText,
          secondary_unit: testUnit,
        },
      },
      expected: { value: 1037.537, valueText: "1.037,54 °C" },
    },
    {
      name: "[inner.3] default value from entity, default text from entity, no unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        inner: {},
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      expected: { value: 1037.537, valueText: "1.037,5" },
    },
    {
      name: "[inner.4] default value from entity, default text from entity, with unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        inner: {},
        value_texts: {
          secondary_unit: testUnit,
        },
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      expected: { value: 1037.537, valueText: "1.037,5 °C" },
    },
    {
      name: "[inner.5] template value, default text from value, no unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        inner: {
          value: "2075.074",
        },
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      expected: { value: 2075.074, valueText: "2.075,07" },
    },
    {
      name: "[inner.6] default value from entity, template text, no unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        inner: {},
        value_texts: {
          secondary: "test text",
        },
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 2 } },
      },
      expected: { value: 1037.537, valueText: "test text" },
    },
    {
      name: "[inner.7] default value from entity, template text, with unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        inner: {},
        value_texts: {
          secondary: "test text",
          secondary_unit: testUnit,
        },
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 2 } },
      },
      expected: { value: 1037.537, valueText: "test text °C" },
    },
    {
      name: "[inner.8] default value from default, template text, with unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.broken",
        inner: {},
        value_texts: {
          secondary: "test text",
          secondary_unit: testUnit,
        },
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 2 } },
      },
      expected: { value: 0, valueText: "test text °C" },
    },
    {
      name: "[inner.9] default value from unavailable entity, default text unavailable from entity, no unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: "unavailable" },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      expected: { value: 0, valueText: "" },
    },
    {
      name: "[inner.10] just primary gauge, inner should be empty",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      expected: { value: 0, valueText: "" },
    },
    {
      name: "[inner.99] default value from entity, numerical template text, with unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        entity2: "sensor.mock",
        inner: {},
        value_texts: {
          secondary: "5347.5678",
          secondary_unit: " mm",
        },
      },
      hass: {
        states: {
          "sensor.mock": { entity_id: "sensor.mock", state: testValue },
        },
        entities: { "sensor.mock": { display_precision: 0 } },
      },
      expected: { value: 1037.537, valueText: "5.347,57 mm" },
    },
  ];

  const card = new GaugeCardProCard();
  it.each([...casesMain, ...casesInner])(
    "$name",
    ({ gauge, defaultValue, config, hass, expected }) => {
      // mock card.getValue()
      vi.spyOn(card, "getValue").mockImplementation((key: string) => {
        switch (key) {
          case "value":
            return config?.value;
          case "inner.value":
            return config?.inner?.value;
          case "value_texts.primary":
            return config?.value_texts?.primary;
          case "value_texts.secondary":
            return config?.value_texts?.secondary;
          case "value_texts.primary_unit":
            return config?.value_texts?.primary_unit;
          case "value_texts.secondary_unit":
            return config?.value_texts?.secondary_unit;
          default:
            return undefined;
        }
      });

      // mock _config
      vi.spyOn(card, "_config", "get").mockReturnValue({
        type: "custom:gauge-card-pro",
        ...config,
      });

      // mock hass
      vi.spyOn(card, "hass", "get").mockReturnValue(
        createMockHomeAssistant(hass)
      );

      const result = card["getValueAndValueText"](gauge, defaultValue);
      if (gauge === "main") {
        expect(card.getValue).toHaveBeenNthCalledWith(1, "value");
        expect(card.getValue).toHaveBeenNthCalledWith(2, "value_texts.primary");
        expect(card.getValue).toHaveBeenNthCalledWith(
          3,
          "value_texts.primary_unit"
        );

        expect(card.getValue).not.toHaveBeenCalledWith("inner.value");
        expect(card.getValue).not.toHaveBeenCalledWith("value_texts.secondary");
        expect(card.getValue).not.toHaveBeenCalledWith(
          "value_texts.secondary_unit"
        );
      } else {
        expect(card.getValue).toHaveBeenNthCalledWith(1, "inner.value");
        expect(card.getValue).toHaveBeenNthCalledWith(
          2,
          "value_texts.secondary"
        );
        expect(card.getValue).toHaveBeenNthCalledWith(
          3,
          "value_texts.secondary_unit"
        );

        expect(card.getValue).not.toHaveBeenCalledWith("value");
        expect(card.getValue).not.toHaveBeenCalledWith("value_texts.primary");
        expect(card.getValue).not.toHaveBeenCalledWith(
          "value_texts.primary_unit"
        );
      }

      expect(result).toEqual(expected);
    }
  );
});
