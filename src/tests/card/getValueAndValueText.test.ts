import { describe, it, expect, vi, afterEach } from "vitest";
import type { FrontendLocaleData, HomeAssistant } from "../../dependencies/ha";
import { NumberFormat } from "../../dependencies/ha";
import type { GaugeCardProCardConfig } from "../../card/config";
import type { Gauge } from "../../card/types/types";
import { GaugeCardProCard } from "../../card/card";
import { getValueAndValueText } from "../../card/helpers/get-value-and-valueText";

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
          primary: {
            unit_of_measurement: "",
          },
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
          primary: {
            value: testValue,
          },
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
          primary: {
            value: testValueText,
          },
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
          primary: {
            value: "1.04",
            unit_of_measurement: "kW",
          },
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
          primary: {
            value: testValue,
            unit_of_measurement: testUnit,
          },
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
          primary: {
            value: "1.04 kW",
            unit_of_measurement: "W",
          },
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
          primary: {
            value: "",
          },
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
          primary: {
            unit_before_value: true,
          },
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
    {
      name: "[main.11] no entity, value only, unit from value_text",
      gauge: "main",
      defaultValue: 0,
      config: {
        value: testValue,
        value_texts: {
          primary: {
            unit_of_measurement: "W",
          },
        },
      },
      unit_called: true,
      expected: { value: 1037.537, valueText: "1.037,54 W" },
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
          secondary: {
            unit_of_measurement: "",
          },
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
          secondary: {
            value: testValue,
          },
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
          secondary: {
            value: testValueText,
          },
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
          secondary: {
            value: "1.04",
            unit_of_measurement: "kW",
          },
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
          secondary: {
            value: testValue,
            unit_of_measurement: testUnit,
          },
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
          secondary: {
            value: "1.04 kW",
            unit_of_measurement: "W",
          },
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
          secondary: {
            value: "",
          },
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
          secondary: {
            unit_before_value: true,
          },
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
      name: "[inner.10] default value from entity attribute, default text from entity attribute, default unit NOT from entity",
      gauge: "inner",
      defaultValue: 0,
      config: {
        entity2: "sensor.mock",
        inner: {
          attribute: "current_temperature",
        },
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
          secondary: {
            value: "5347.5678",
            unit_of_measurement: "mm",
          },
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
          primary: {
            value: testValue,
            unit_of_measurement: "%",
          },
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
          primary: {
            value: testValue,
            unit_of_measurement: "%",
          },
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
      // Inject hass + config
      const card = new GaugeCardProCard();
      const mockHass = createMockHomeAssistant(hass, locale);
      const cardConfig = {
        type: "custom:gauge-card-pro",
        ...config,
      } as GaugeCardProCardConfig;

      // Mock getValue as a real spy fn
      const getValue = vi.fn((key: string) => {
        switch (key) {
          case "value":
            return cardConfig?.value;
          case "inner.value":
            return cardConfig?.inner?.value;
          case "value_texts.primary.value":
            return cardConfig?.value_texts?.primary?.value;
          case "value_texts.secondary.value":
            return cardConfig?.value_texts?.secondary?.value;
          case "value_texts.primary.unit_of_measurement":
            return cardConfig?.value_texts?.primary?.unit_of_measurement;
          case "value_texts.secondary.unit_of_measurement":
            return cardConfig?.value_texts?.secondary?.unit_of_measurement;
          default:
            return undefined;
        }
      });
      card.getValue = getValue as any;

      // Call the method on the gauge element
      const result =
        getValueAndValueText(gauge, cardConfig, mockHass, card.getValueBound) ??
        defaultValue;

      // Same expectations, but now on `getValue` (or `el.getValue`)
      if (gauge === "main") {
        expect(getValue).toHaveBeenNthCalledWith(1, "value");
        expect(getValue).toHaveBeenNthCalledWith(
          2,
          "value_texts.primary.value"
        );
        if (unit_called) {
          expect(getValue).toHaveBeenNthCalledWith(
            3,
            "value_texts.primary.unit_of_measurement"
          );
        }

        expect(getValue).not.toHaveBeenCalledWith("inner.value");
        expect(getValue).not.toHaveBeenCalledWith(
          "value_texts.secondary.value"
        );
        expect(getValue).not.toHaveBeenCalledWith(
          "value_texts.secondary.unit_of_measurement"
        );
      } else {
        expect(getValue).toHaveBeenNthCalledWith(1, "inner.value");
        expect(getValue).toHaveBeenNthCalledWith(
          2,
          "value_texts.secondary.value"
        );
        if (unit_called) {
          expect(getValue).toHaveBeenNthCalledWith(
            3,
            "value_texts.secondary.unit_of_measurement"
          );
        }

        expect(getValue).not.toHaveBeenCalledWith("value");
        expect(getValue).not.toHaveBeenCalledWith("value_texts.primary.value");
        expect(getValue).not.toHaveBeenCalledWith(
          "value_texts.primary.unit_of_measurement"
        );
      }

      expect(result).toEqual(expected);
    }
  );
});
