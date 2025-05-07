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
import { GaugeCardProCardConfig, gaugeCardProConfigStruct } from "./config";
import { migrate_parameters } from "../utils/migrate-parameters";

export const CUSTOM_LABELS = [
  "actions",
  "color",
  "entities",
  "entity",
  "entity2",
  "gradient",
  "gradient_resolution",
  "gradient_resolutionOptions",
  "hide_background",
  "inner",
  "main_gauge",
  "max",
  "min",
  "mode",
  "primary",
  "primary_color",
  "primary_font_size",
  "secondary",
  "secondary_color",
  "secondary_font_size",
  "setpoint",
  "titles",
  "needle",
  "value",
  "value_texts",
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

  @state()
  private config?: GaugeCardProCardConfig | undefined;
  public get _config(): GaugeCardProCardConfig | undefined {
    return this.config;
  }
  public set _config(value: GaugeCardProCardConfig | undefined) {
    value = migrate_parameters(value);
    this.config = value;
  }

  private _schema = memoizeOne(
    (
      showGradient: boolean,
      showGradientResolution: boolean,
      showInnerGradient: boolean,
      showInnerGradientResolution: boolean
    ) =>
      [
        {
          name: "entities",
          type: "expandable",
          flatten: true,
          schema: [
            {
              name: "entity",
              selector: {
                entity: {
                  domain: ["counter", "input_number", "number", "sensor"],
                },
              },
            },
            {
              name: "entity2",
              selector: {
                entity: {
                  domain: ["counter", "input_number", "number", "sensor"],
                },
              },
            },
          ],
        },
        {
          name: "main_gauge",
          type: "expandable",
          expanded: true,
          flatten: true,
          schema: [
            {
              name: "value",
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
                              name: "gradient_resolution",
                              selector: {
                                select: {
                                  value: "gradient_resolution",
                                  options: [
                                    {
                                      value: "low",
                                      label: this._customLocalize(
                                        "gradient_resolution_options.low"
                                      ),
                                    },
                                    {
                                      value: "medium",
                                      label: this._customLocalize(
                                        "gradient_resolution_options.medium"
                                      ),
                                    },
                                    {
                                      value: "high",
                                      label: this._customLocalize(
                                        "gradient_resolution_options.high"
                                      ),
                                    },
                                    {
                                      value: "ultra",
                                      label: this._customLocalize(
                                        "gradient_resolution_options.ultra"
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
          ],
        },
        {
          name: "inner",
          type: "expandable",
          flatten: false,
          schema: [
            {
              name: "value",
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
              schema: [
                {
                  name: "mode",
                  selector: {
                    select: {
                      value: "inner_mode",
                      options: [
                        {
                          value: "severity",
                          label: this._customLocalize(
                            "inner_mode_options.severity"
                          ),
                        },
                        {
                          value: "static",
                          label: this._customLocalize(
                            "inner_mode_options.static"
                          ),
                        },
                        {
                          value: "needle",
                          label: this._customLocalize(
                            "inner_mode_options.needle"
                          ),
                        },
                      ],
                      mode: "dropdown",
                    },
                  },
                },
                {},
              ],
            },
            ...(showInnerGradient
              ? [
                  {
                    name: "",
                    type: "grid",
                    schema: [
                      { name: "gradient", selector: { boolean: {} } },
                      ...(showInnerGradientResolution
                        ? [
                            {
                              name: "gradient_resolution",
                              selector: {
                                select: {
                                  value: "gradient_resolution",
                                  options: [
                                    {
                                      value: "low",
                                      label: this._customLocalize(
                                        "gradient_resolution_options.low"
                                      ),
                                    },
                                    {
                                      value: "medium",
                                      label: this._customLocalize(
                                        "gradient_resolution_options.medium"
                                      ),
                                    },
                                    {
                                      value: "high",
                                      label: this._customLocalize(
                                        "gradient_resolution_options.high"
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
          ],
        },
        {
          name: "setpoint",
          type: "expandable",
          flatten: false,
          schema: [
            {
              name: "value",
              selector: { template: {} },
            },
            {
              name: "color",
              selector: { template: {} },
            },
          ],
        },
        {
          name: "titles",
          type: "expandable",
          flatten: false,
          schema: [
            {
              type: "grid",
              column_min_width: "100%",
              schema: [
                {
                  name: "primary",
                  selector: { template: {} },
                },
                {
                  name: "secondary",
                  selector: { template: {} },
                },
                {
                  name: "primary_color",
                  selector: { template: {} },
                },
                {
                  name: "secondary_color",
                  selector: { template: {} },
                },
                {
                  name: "primary_font_size",
                  selector: { template: {} },
                },
                {
                  name: "secondary_font_size",
                  selector: { template: {} },
                },
              ],
            },
          ],
        },
        {
          name: "value_texts",
          type: "expandable",
          flatten: false,
          schema: [
            {
              type: "grid",
              column_min_width: "100%",
              schema: [
                {
                  name: "primary",
                  selector: { template: {} },
                },
                {
                  name: "secondary",
                  selector: { template: {} },
                },
                {
                  name: "primary_color",
                  selector: { template: {} },
                },
                {
                  name: "secondary_color",
                  selector: { template: {} },
                },
              ],
            },
          ],
        },
        {
          name: "hide_background",
          selector: { boolean: {} },
        },
        {
          name: "actions",
          type: "expandable",
          flatten: true,
          schema: [...computeActionsFormSchema()],
        },
      ] as const
  );

  connectedCallback() {
    this._config = migrate_parameters(this._config);
    super.connectedCallback();
    void loadHaComponents();
  }

  public setConfig(config: GaugeCardProCardConfig): void {
    config = migrate_parameters(config);
    assert(config, gaugeCardProConfigStruct);
    this._config = config;
  }

  private _computeLabel = (schema: HaFormSchema) => {
    const customLocalize = setupCustomlocalize(this.hass!);

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

    const inner_mode =
      this._config?.inner?.mode !== undefined ? this._config.inner.mode : "";
    const inner_gradient =
      this._config?.inner !== undefined
        ? (this.config?.inner?.gradient ?? false)
        : false;

    const schema = this._schema(
      this._config?.needle ?? false, // showGradient
      this._config?.gradient ?? false, // showGradientResolution
      ["static", "needle"].includes(inner_mode) ?? false,
      inner_gradient
    );

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    let config = ev.detail.value;

    // Gradient
    if (config.gradient) {
      config = {
        ...config,
        gradient_resolution: config.gradient_resolution || "medium",
      };
    } else {
      delete config.gradient_resolution;
    }

    fireEvent(this, "config-changed", { config });
  }
}
