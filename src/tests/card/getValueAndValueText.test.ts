import { describe, it, expect, vi, afterEach } from "vitest";
import {
  FrontendLocaleData,
  HomeAssistant,
  NumberFormat,
} from "../../dependencies/ha";
import type { Gauge, GaugeCardProCardConfig } from "../../card/config";
import { GaugeCardProGauge } from "../../card/gauge";

vi.mock(
  "../../dependencies/ha/panels/lovelace/common/directives/action-handler-directive.ts",
  () => ({ isTouch: () => false })
);

vi.mock("../../dependencies/mushroom/utils/custom-cards.ts", () => ({
  registerCustomCard: () => "",
}));

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

const testLocale: Partial<FrontendLocaleData> = {
  language: "en",
  number_format: NumberFormat.decimal_comma,
};

export const createMockHomeAssistant = (hass?, locale?): HomeAssistant => {
  const mock: Partial<HomeAssistant> = {
    locale: locale ?? testLocale,
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
      attributes?: any;
    };
    locale?: Partial<FrontendLocaleData>;
    unit_called: boolean;
    expected: { value: number | string | undefined; valueText: string };
  };

  const testValue = "1037.537";
  const testAttributeValue = "2936.1379";
  const testValueText = "1,04 kW";
  const testUnit = "W";

  const casesMain: TestCase[] = [
    {
      name: "[main.1] default value from entity, default text from entity, default unit from entity",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "1.037,5 W" },
    },
    {
      name: "[main.2] default value from entity, default text from entity, unit overwrite",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        value_texts: {
          primary_unit: "",
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "1.037,5" },
    },
    {
      name: "[main.3] default value from entity, template numeric value_text, default unit from entity",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        value_texts: {
          primary: testValue,
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: false,
      expected: { value: 1037.537, valueText: "1.037,54 W" },
    },
    {
      name: "[main.4] default value from entity, template non-numeric value_text, no unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        value_texts: {
          primary: testValueText,
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: false,
      expected: { value: 1037.537, valueText: "1,04 kW" },
    },
    {
      name: "[main.5] default value from entity, template numeric value_text, template/string unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        value_texts: {
          primary: "1.04",
          primary_unit: "kW",
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: false,
      expected: { value: 1037.537, valueText: "1,04 kW" },
    },
    {
      name: "[main.6] template value, template text, template unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        value: testValue,
        value_texts: {
          primary: testValue,
          primary_unit: testUnit,
        },
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "1.037,54 W" },
    },
    {
      name: "[main.7] valueText isNaN -> no unit",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        value_texts: {
          primary: "1.04 kW",
          primary_unit: "W",
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: "W",
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 2 } },
      },
      unit_called: false,
      expected: { value: 1037.537, valueText: "1.04 kW" },
    },
    {
      name: "[main.8] overwrite primary",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        value_texts: {
          primary: "",
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: false,
      expected: { value: 1037.537, valueText: "" },
    },
    {
      name: "[main.9] default value from entity, default text from entity, default unit from entity, unit before value",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        value_texts: {
          primary_unit_before_value: true,
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: "€",
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "€ 1.037,5" },
    },
    {
      name: "[main.10] default value from entity attribute, default text from entity attribute, default unit NOT from entity",
      gauge: "main",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        attribute: "current_temperature",
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
              current_temperature: testAttributeValue,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: true,
      expected: { value: 2936.1379, valueText: "2.936,14" },
    },
  ];

  const casesInner: TestCase[] = [
    {
      name: "[inner.1] default value from entity, default text from entity, default unit from entity",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "1.037,5 W" },
    },
    {
      name: "[inner.2] default value from entity, default text from entity, unit overwrite",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        value_texts: {
          secondary_unit: "",
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "1.037,5" },
    },
    {
      name: "[inner.3] default value from entity, template numeric value_text, default unit from entity",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        value_texts: {
          secondary: testValue,
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: false,
      expected: { value: 1037.537, valueText: "1.037,54 W" },
    },
    {
      name: "[inner.4] default value from entity, template non-numeric value_text, no unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        value_texts: {
          secondary: testValueText,
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: false,
      expected: { value: 1037.537, valueText: "1,04 kW" },
    },
    {
      name: "[inner.5] default value from entity, template numeric value_text, template/string unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        value_texts: {
          secondary: "1.04",
          secondary_unit: "kW",
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: false,
      expected: { value: 1037.537, valueText: "1,04 kW" },
    },
    {
      name: "[inner.6] template value, template text, template unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        inner: {
          value: testValue,
        },
        value_texts: {
          secondary: testValue,
          secondary_unit: testUnit,
        },
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "1.037,54 W" },
    },
    {
      name: "[inner.7] valueText isNaN -> no unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        value_texts: {
          secondary: "1.04 kW",
          secondary_unit: "W",
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: "W",
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 2 } },
      },
      unit_called: false,
      expected: { value: 1037.537, valueText: "1.04 kW" },
    },
    {
      name: "[inner.8] overwrite secondary",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        value_texts: {
          secondary: "",
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: testUnit,
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: false,
      expected: { value: 1037.537, valueText: "" },
    },
    {
      name: "[inner.9] default value from entity, default text from entity, default unit from entity, unit before value",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        value_texts: {
          secondary_unit_before_value: true,
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {
              unit_of_measurement: "€",
            },
          },
        },
        entities: { "sensor.mock": { display_precision: 1 } },
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "€ 1.037,5" },
    },
  ];

  const casesMisc: TestCase[] = [
    {
      name: "[misc.1] default value from entity, numerical template text, with unit",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity: "sensor.mock",
        entity2: "sensor.mock",
        inner: {},
        value_texts: {
          secondary: "5347.5678",
          secondary_unit: "mm",
        },
      },
      hass: {
        states: {
          "sensor.mock": {
            entity_id: "sensor.mock",
            state: testValue,
            attributes: {},
          },
        },
        entities: { "sensor.mock": { display_precision: 0 } },
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "5.347,57 mm" },
    },
    {
      name: "[misc.2] no space before percentage for en-locale",
      gauge: "main",
      defaultValue: 0,
      config: {
        value: testValue,
        value_texts: {
          primary: testValue,
          primary_unit: "%",
        },
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "1.037,54%" },
    },
    {
      name: "[misc.3] space before percentage for de-locale",
      gauge: "main",
      defaultValue: 0,
      config: {
        value: testValue,
        value_texts: {
          primary: testValue,
          primary_unit: "%",
        },
      },
      locale: {
        language: "de",
        number_format: NumberFormat.decimal_comma,
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "1.037,54 %" },
    },
  ];

  it.each([...casesMain, ...casesInner, ...casesMisc])(
    "$name",
    ({ gauge, defaultValue, config, hass, locale, unit_called, expected }) => {
      const el = new GaugeCardProGauge();

      // Inject hass + config
      el.hass = createMockHomeAssistant(hass, locale);
      el.config = {
        type: "custom:gauge-card-pro",
        ...config,
      } as GaugeCardProCardConfig;

      // Mock getValue as a real spy fn
      const getValue = vi.fn((key: string) => {
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
      el.getValue = getValue as any;

      // Call the method on the gauge element
      const result = el["getValueAndValueText"](gauge, defaultValue);

      // Same expectations, but now on `getValue` (or `el.getValue`)
      if (gauge === "main") {
        expect(getValue).toHaveBeenNthCalledWith(1, "value");
        expect(getValue).toHaveBeenNthCalledWith(2, "value_texts.primary");
        if (unit_called) {
          expect(getValue).toHaveBeenNthCalledWith(
            3,
            "value_texts.primary_unit"
          );
        }

        expect(getValue).not.toHaveBeenCalledWith("inner.value");
        expect(getValue).not.toHaveBeenCalledWith("value_texts.secondary");
        expect(getValue).not.toHaveBeenCalledWith("value_texts.secondary_unit");
      } else {
        expect(getValue).toHaveBeenNthCalledWith(1, "inner.value");
        expect(getValue).toHaveBeenNthCalledWith(2, "value_texts.secondary");
        if (unit_called) {
          expect(getValue).toHaveBeenNthCalledWith(
            3,
            "value_texts.secondary_unit"
          );
        }

        expect(getValue).not.toHaveBeenCalledWith("value");
        expect(getValue).not.toHaveBeenCalledWith("value_texts.primary");
        expect(getValue).not.toHaveBeenCalledWith("value_texts.primary_unit");
      }

      expect(result).toEqual(expected);
    }
  );
});
