import { mdiGestureTap } from "@mdi/js";
import { LitElement } from "lit";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import memoizeOne from "memoize-one";
import { assert } from "superstruct";
import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardEditor,
  fireEvent,
} from "../ha";
import setupCustomlocalize from "../localize";
import { computeActionsFormSchema } from "../mushroom/shared/config/actions-config";
import { HaFormSchema } from "../mushroom/utils/form/ha-form";
import { loadHaComponents } from "../mushroom/utils/loader";
import { EDITOR_NAME } from "./_const";
import { GaugeCardProCardConfig, guageCardProConfigStruct } from "./config";

export const CUSTOM_LABELS = [
  "entity",
  "gradient",
  "gradientResolution",
  "gradientResolutionOptions",
  "green",
  "max",
  "min",
  "needle",
  "severity",
  "show_severity",
  "red",
  "value",
  "valueText",
  "yellow",
];

export interface ConfigChangedEvent {
  config: LovelaceCardConfig;
  error?: string;
  guiModeAvailable?: boolean;
}

declare global {
  interface HASSDomEvents {
    // @ts-ignore
    "config-changed": ConfigChangedEvent;
  }
}

@customElement(EDITOR_NAME)
export class GaugeCardProEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: GaugeCardProCardConfig;

  private _schema = memoizeOne(
    (
      showSeverity: boolean,
      showGradient: boolean,
      showGradientResolution: boolean
    ) =>
      [
        {
          name: "entity",
          selector: {
            entity: {
              domain: ["counter", "input_number", "number", "sensor"],
            },
          },
        },
        {
          name: "value",
          selector: { template: {} },
        },
        {
          name: "valueText",
          selector: { template: {} },
        },
        {
          name: "name",
          selector: { template: {} },
        },
        {
          name: "min",
          selector: { template: {} },
        },
        {
          name: "max",
          selector: { template: {} },
        },
        {
          name: "",
          type: "grid",
          schema: [{ name: "needle", selector: { boolean: {} } }, {}],
        },
        ...(showGradient
          ? [
              {
                name: "",
                type: "grid",
                schema: [
                  { name: "gradient", selector: { boolean: {} } },
                  ...(showGradientResolution
                    ? [
                        {
                          name: "gradientResolution",
                          selector: {
                            select: {
                              value: "gradientResolution",
                              options: [
                                {
                                  value: "low",
                                  label: this._customLocalize(
                                    "gradientResolutionOptions.low"
                                  ),
                                },
                                {
                                  value: "medium",
                                  label: this._customLocalize(
                                    "gradientResolutionOptions.medium"
                                  ),
                                },
                                {
                                  value: "high",
                                  label: this._customLocalize(
                                    "gradientResolutionOptions.high"
                                  ),
                                },
                              ],
                              mode: "dropdown",
                            },
                          },
                        },
                      ]
                    : [{}]),
                ],
              },
            ]
          : [{}]),
        ...(showGradient
          ? [
              {
                name: "",
                type: "grid",
                schema: [
                  { name: "show_severity", selector: { boolean: {} } },
                  {},
                ],
              },
            ]
          : [{}]),

        ...(showSeverity
          ? ([
              {
                name: "severity",
                type: "grid",
                schema: [
                  {
                    name: "green",
                    selector: { number: { mode: "box", step: "any" } },
                  },
                  {
                    name: "yellow",
                    selector: { number: { mode: "box", step: "any" } },
                  },
                  {
                    name: "red",
                    selector: { number: { mode: "box", step: "any" } },
                  },
                ],
              },
            ] as const)
          : []),
        ...computeActionsFormSchema(),
      ] as const
  );

  connectedCallback() {
    super.connectedCallback();
    void loadHaComponents();
  }

  public setConfig(config: GaugeCardProCardConfig): void {
    assert(config, guageCardProConfigStruct);
    this._config = config;
  }

  private _computeLabel = (schema: HaFormSchema) => {
    const customLocalize = setupCustomlocalize(this.hass!);

    if (schema.name === "entity") {
      return `${this.hass!.localize(
        "ui.panel.lovelace.editor.card.generic.entity"
      )} (${customLocalize("editor.card.template.entity_extra")})`;
    }
    if (CUSTOM_LABELS.includes(schema.name)) {
      return customLocalize(`editor.card.${schema.name}`);
    }
    return this.hass!.localize(
      `ui.panel.lovelace.editor.card.generic.${schema.name}`
    );
  };

  private _customLocalize(value: string) {
    const customLocalize = setupCustomlocalize(this.hass!);
    return customLocalize(`editor.card.${value}`);
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }
    console.log("gradient", this._config!.gradient !== undefined);
    const schema = this._schema(
      this._config!.severity !== undefined,
      this._config?.needle ?? false,
      this._config?.gradient ?? false
    );
    const data = {
      show_severity: this._config!.severity !== undefined,
      ...this._config,
    };

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    let config = ev.detail.value;

    // Severity
    if (config.show_severity) {
      config = {
        ...config,
        severity: {
          green: config.green || config.severity?.green || 0,
          yellow: config.yellow || config.severity?.yellow || 0,
          red: config.red || config.severity?.red || 0,
        },
      };
    } else if (!config.show_severity && config.severity) {
      delete config.severity;
    }

    delete config.show_severity;
    delete config.green;
    delete config.yellow;
    delete config.red;

    // Gradient
    if (config.gradient) {
      config = {
        ...config,
        gradientResolution: config.gradientResolution || "medium",
      };
    } else {
      delete config.gradientResolution;
    }

    fireEvent(this, "config-changed", { config });
  }
}
