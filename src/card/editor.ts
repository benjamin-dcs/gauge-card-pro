// External dependencies
import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import memoizeOne from "memoize-one";
import { assert } from "superstruct";
import {
  mdiAlphabeticalVariant,
  mdiBullseyeArrow,
  mdiFormatListNumbered,
  mdiGauge,
  mdiGestureTap,
  mdiLayers,
  mdiLayersOutline,
  mdiNumeric,
  mdiSimpleIcons,
} from "@mdi/js";

// Internalized external dependencies
import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardEditor,
  fireEvent,
} from "../dependencies/ha";

import {
  computeActionsFormSchema,
  HaFormSchema,
  loadHaComponents,
} from "../dependencies/mushroom";

// Local utilities
import { migrate_parameters } from "../utils/migrate-parameters";
import { deleteKey } from "../utils/object/delete-key";
import { trySetValue } from "../utils/object/set-value";
import setupCustomlocalize from "../localize";

// Local constants & types
import { EDITOR_NAME } from "./const";
import { GaugeCardProCardConfig, gaugeCardProConfigStruct } from "./config";

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
      showGradientOptions: boolean,
      showGradientResolution: boolean,
      enableInner: boolean,
      showInnerGradient: boolean,
      showInnerGradientResolution: boolean,
      innerSetpointType: string | undefined,
      setpointType: string | undefined,
      iconType: string | undefined
    ) =>
      [
        {
          name: "entities",
          iconPath: mdiFormatListNumbered,
          type: "expandable",
          expanded: true,
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
          iconPath: mdiGauge,
          type: "expandable",
          expanded: true,
          flatten: true,
          schema: [
            {
              type: "grid",
              schema: [
                {
                  name: "min",
                  selector: { number: { mode: "box", step: "any" } },
                },
                {
                  name: "max",
                  selector: { number: { mode: "box", step: "any" } },
                },
              ],
            },
            {
              type: "grid",
              schema: [{ name: "needle", selector: { boolean: {} } }, {}],
            },
            ...(showGradientOptions
              ? [
                  {
                    type: "grid",
                    schema: [
                      { name: "gradient", selector: { boolean: {} } },

                      ...(showGradientResolution
                        ? [
                            {
                              name: "gradient_resolution",
                              selector: {
                                select: {
                                  mode: "dropdown",
                                  options: [
                                    {
                                      value: "very_low",
                                      label: this._localize(
                                        "gradient_resolution_options.very_low"
                                      ),
                                    },
                                    {
                                      value: "low",
                                      label: this._localize(
                                        "gradient_resolution_options.low"
                                      ),
                                    },
                                    {
                                      value: "medium",
                                      label: this._localize(
                                        "gradient_resolution_options.medium"
                                      ),
                                    },
                                    {
                                      value: "high",
                                      label: this._localize(
                                        "gradient_resolution_options.high"
                                      ),
                                    },
                                  ],
                                },
                              },
                            },
                          ]
                        : [{}]),
                    ],
                  },
                ]
              : [{ type: "constant", name: "configure_segments" }]),
          ],
        },
        { name: "enable_inner", selector: { boolean: {} } },
        ...(enableInner
          ? [
              {
                name: "inner",
                iconPath: mdiGauge,
                type: "expandable",
                flatten: false,
                expanded: true,
                schema: [
                  {
                    type: "grid",
                    schema: [
                      {
                        name: "min",
                        selector: { number: { mode: "box", step: "any" } },
                      },
                      {
                        name: "max",
                        selector: { number: { mode: "box", step: "any" } },
                      },
                    ],
                  },
                  {
                    type: "grid",
                    schema: [
                      {
                        name: "mode",
                        selector: {
                          select: {
                            mode: "dropdown",
                            options: [
                              {
                                value: "severity",
                                label: this._localize(
                                  "inner_mode_options.severity"
                                ),
                              },
                              {
                                value: "static",
                                label: this._localize(
                                  "inner_mode_options.static"
                                ),
                              },
                              {
                                value: "needle",
                                label: this._localize(
                                  "inner_mode_options.needle"
                                ),
                              },
                              {
                                value: "on_main",
                                label: this._localize(
                                  "inner_mode_options.on_main"
                                ),
                              },
                            ],
                          },
                        },
                      },
                      {},
                    ],
                  },
                  ...(showInnerGradient
                    ? [
                        {
                          type: "grid",
                          schema: [
                            { name: "gradient", selector: { boolean: {} } },

                            ...(showInnerGradientResolution
                              ? [
                                  {
                                    name: "gradient_resolution",
                                    selector: {
                                      select: {
                                        mode: "dropdown",
                                        options: [
                                          {
                                            value: "very_low",
                                            label: this._localize(
                                              "gradient_resolution_options.very_low"
                                            ),
                                          },
                                          {
                                            value: "low",
                                            label: this._localize(
                                              "gradient_resolution_options.low"
                                            ),
                                          },
                                          {
                                            value: "medium",
                                            label: this._localize(
                                              "gradient_resolution_options.medium"
                                            ),
                                          },
                                          {
                                            value: "high",
                                            label: this._localize(
                                              "gradient_resolution_options.high"
                                            ),
                                          },
                                        ],
                                      },
                                    },
                                  },
                                ]
                              : [{}]),
                          ],
                        },
                      ]
                    : [{ type: "constant", name: "configure_inner_segments" }]),
                  {
                    name: "setpoint",
                    iconPath: mdiBullseyeArrow,
                    type: "expandable",
                    flatten: false,
                    schema: [
                      {
                        name: "type",
                        selector: {
                          select: {
                            mode: "dropdown",
                            options: [
                              {
                                value: "entity",
                                label: this._localize("setpoint_entity"),
                              },
                              {
                                value: "number",
                                label: this._localize("number"),
                              },
                              {
                                value: "template",
                                label: this._localize("template"),
                              },
                            ],
                          },
                        },
                      },
                      ...(innerSetpointType === "entity"
                        ? [
                            {
                              name: "value",
                              selector: {
                                entity: {
                                  domain: [
                                    "counter",
                                    "input_number",
                                    "number",
                                    "sensor",
                                  ],
                                },
                              },
                            },
                          ]
                        : [{}]),
                      ...(innerSetpointType === "number"
                        ? [
                            {
                              name: "value",
                              selector: {
                                number: { mode: "box", step: "any" },
                              },
                            },
                          ]
                        : [{}]),
                      ...(innerSetpointType === "template"
                        ? [
                            {
                              name: "value",
                              selector: { template: {} },
                            },
                          ]
                        : [{}]),
                      {
                        name: "color",
                        selector: { template: {} },
                      },
                    ],
                  },
                ],
              },
            ]
          : [{}]),
        {
          name: "setpoint",
          iconPath: mdiBullseyeArrow,
          type: "expandable",
          flatten: false,
          schema: [
            {
              name: "type",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    {
                      value: "entity",
                      label: this._localize("setpoint_entity"),
                    },
                    {
                      value: "number",
                      label: this._localize("number"),
                    },
                    {
                      value: "template",
                      label: this._localize("template"),
                    },
                  ],
                },
              },
            },
            ...(setpointType === "entity"
              ? [
                  {
                    name: "value",
                    selector: {
                      entity: {
                        domain: ["counter", "input_number", "number", "sensor"],
                      },
                    },
                  },
                ]
              : [{}]),
            ...(setpointType === "number"
              ? [
                  {
                    name: "value",
                    selector: { number: { mode: "box", step: "any" } },
                  },
                ]
              : [{}]),
            ...(setpointType === "template"
              ? [
                  {
                    name: "value",
                    selector: { template: {} },
                  },
                ]
              : [{}]),
            {
              name: "color",
              selector: { template: {} },
            },
          ],
        },
        {
          name: "titles",
          iconPath: mdiAlphabeticalVariant,
          type: "expandable",
          flatten: false,
          schema: [
            {
              name: "primary_header",
              iconPath: mdiLayers,
              type: "expandable",
              flatten: true,
              expanded: true,
              schema: [
                {
                  name: "primary",
                  selector: { template: {} },
                },
                {
                  name: "primary_color",
                  selector: { template: {} },
                },
                {
                  name: "primary_font_size",
                  selector: { template: {} },
                },
              ],
            },
            {
              name: "secondary_header",
              iconPath: mdiLayersOutline,
              type: "expandable",
              flatten: true,
              schema: [
                {
                  name: "secondary",
                  selector: { template: {} },
                },
                {
                  name: "secondary_color",
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
          iconPath: mdiNumeric,
          type: "expandable",
          flatten: false,
          schema: [
            { type: "constant", name: "value_texts_note1" },
            {
              type: "constant",
              name: "value_texts_note2",
              value: 'secondary: ""',
            },
            { type: "constant", name: "value_texts_note3" },
            {
              name: "primary_header",
              iconPath: mdiLayers,
              type: "expandable",
              flatten: true,
              expanded: true,
              schema: [
                {
                  name: "primary",
                  selector: { template: {} },
                },
                {
                  name: "primary_color",
                  selector: { template: {} },
                },
                {
                  name: "primary_unit",
                  selector: { template: {} },
                },
                {
                  name: "primary_unit_before_value",
                  selector: { boolean: {} },
                },
                {
                  name: "primary_font_size_reduction",
                  selector: {
                    number: {
                      mode: "slider",
                      step: "0.5",
                      max: 15,
                      min: 0,
                      default: 0,
                    },
                  },
                },
              ],
            },
            {
              name: "secondary_header",
              iconPath: mdiLayersOutline,
              type: "expandable",
              flatten: true,
              schema: [
                {
                  name: "secondary",
                  selector: { template: {} },
                },
                {
                  name: "secondary_color",
                  selector: { template: {} },
                },
                {
                  name: "secondary_unit",
                  selector: { template: {} },
                },
                {
                  name: "secondary_unit_before_value",
                  selector: { boolean: {} },
                },
              ],
            },
          ],
        },
        {
          name: "icon",
          iconPath: mdiSimpleIcons,
          type: "expandable",
          flatten: false,
          schema: [
            {
              name: "type",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    {
                      value: "battery",
                      label: this._localize("battery"),
                    },
                    {
                      value: "template",
                      label: this._localize("template"),
                    },
                  ],
                },
              },
            },

            ...(iconType === "battery"
              ? [
                  {
                    name: "value",
                    selector: {
                      entity: {
                        domain: ["sensor"],
                      },
                    },
                  },
                  {
                    name: "state",
                    selector: {
                      entity: {
                        domain: ["sensor"],
                      },
                    },
                  },
                  {
                    type: "grid",
                    schema: [
                      {
                        name: "threshold",
                        selector: {
                          number: {
                            mode: "box",
                            step: "any",
                            min: 0,
                            max: 100,
                          },
                        },
                      },
                      { name: "hide_label", selector: { boolean: {} } },
                    ],
                  },
                ]
              : [{}]),

            ...(iconType === "template"
              ? [
                  {
                    name: "value",
                    selector: { template: {} },
                  },
                ]
              : [{}]),
          ],
        },
        {
          name: "interactions",
          type: "expandable",
          flatten: true,
          iconPath: mdiGestureTap,
          schema: [
            {
              name: "tap_action",
              selector: {
                ui_action: {
                  default_action: "more-info",
                },
              },
            },
            {
              name: "primary_value_text_tap_action",
              selector: {
                ui_action: {
                  default_action: "none",
                },
              },
            },
            {
              name: "secondary_value_text_tap_action",
              selector: {
                ui_action: {
                  default_action: "none",
                },
              },
            },
            {
              name: "icon_tap_action",
              selector: {
                ui_action: {
                  default_action: "none",
                },
              },
            },
            {
              name: "",
              type: "optional_actions",
              flatten: true,
              schema: (
                [
                  "hold_action",
                  "double_tap_action",
                  "primary_value_text_hold_action",
                  "primary_value_text_double_tap_action",
                  "secondary_value_text_hold_action",
                  "secondary_value_text_double_tap_action",
                  "icon_hold_action",
                  "icon_double_tap_action",
                ] as const
              ).map((action) => ({
                name: action,
                selector: {
                  ui_action: {
                    default_action: "none" as const,
                  },
                },
              })),
            },
          ],
        },
        {
          name: "hide_background",
          selector: { boolean: {} },
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
    return this._localize(schema.name);
  };

  private _localize(value: string): string {
    // https://github.com/home-assistant/frontend/blob/dev/src/translations/en.json
    // Paste in https://play.jqlang.org/
    // Search for value in pasted windows (JSON)
    // Top of window shows the path
    switch (value) {
      case "battery":
        return this.hass!.localize(
          "ui.panel.lovelace.cards.energy.energy_distribution.battery"
        );
      case "color":
      case "primary_color":
      case "secondary_color":
        return this.hass!.localize("ui.panel.lovelace.editor.card.tile.color");
      case "icon":
        return this.hass!.localize(
          "ui.components.selectors.selector.types.icon"
        );
      case "max":
        return this.hass!.localize(
          "ui.panel.lovelace.editor.card.generic.maximum"
        );
      case "min":
        return this.hass!.localize(
          "ui.panel.lovelace.editor.card.generic.minimum"
        );
      case "template":
        return this.hass!.localize(
          "ui.components.selectors.selector.types.template"
        );
      case "primary_unit":
      case "secondary_unit":
        return this.hass!.localize(
          "ui.dialogs.entity_registry.editor.unit_of_measurement"
        );
      case "type":
        return this.hass!.localize(
          "ui.panel.config.helpers.picker.headers.type"
        );
      case "tap_action":
      case "hold_action":
      case "double_tap_action":
        return this.hass!.localize(
          `ui.panel.lovelace.editor.card.generic.${value}`
        );
      default:
        const customLocalize = setupCustomlocalize(this.hass!);
        return customLocalize(`editor.card.${value}`);
    }
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const showGradientOptions = this._config.segments != null;

    const showGradientResolution =
      (showGradientOptions && this._config.needle && this._config.gradient) ??
      false;

    const enabelInner = this._config?.inner !== undefined;
    const inner_mode = this._config.inner?.mode ?? "severity";
    const showInnerGradient =
      ["severity", "static", "needle"].includes(inner_mode) &&
      this._config.inner?.segments != null;
    const showInnerGradientResolution = ["static", "needle"].includes(
      inner_mode
    );
    const innerSetpointType = this._config.inner?.setpoint?.type ?? undefined;
    const setpointType = this._config.setpoint?.type ?? undefined;
    const iconType = this._config.icon?.type ?? undefined;

    let config = {
      enable_inner: this.config?.inner !== undefined,
      ...this._config,
    };

    const schema = this._schema(
      showGradientOptions,
      showGradientResolution,
      enabelInner,
      showInnerGradient,
      showInnerGradientResolution,
      innerSetpointType,
      setpointType,
      iconType
    );

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${config}
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
      config = trySetValue(config, "gradient_resolution", "medium").result;
    } else {
      config = deleteKey(config, "gradient_resolution").result;
    }

    // Inner
    if (config.enable_inner) {
      config = trySetValue(config, "inner", { mode: "severity" }, true).result;
    } else {
      config = deleteKey(config, "inner").result;
    }
    config = deleteKey(config, "enable_inner").result;

    // Inner gradient
    if (config.inner?.gradient) {
      config = trySetValue(
        config,
        "inner.gradient_resolution",
        "medium"
      ).result;
    } else {
      config = deleteKey(config, "inner.gradient_resolution").result;
    }

    // Inner Setpoint
    if (config.inner?.setpoint?.type !== this._config?.inner?.setpoint?.type) {
      config = deleteKey(config, "inner.setpoint.value").result;
    }

    // Titles
    if (config.titles?.primary === "") {
      config = deleteKey(config, "titles.primary").result;
    }
    if (config.titles?.secondary === "") {
      config = deleteKey(config, "titles.secondary").result;
    }
    if (config.titles?.primary_color === "") {
      config = deleteKey(config, "titles.primary_color").result;
    }
    if (config.titles?.secondary_color === "") {
      config = deleteKey(config, "titles.secondary_color").result;
    }
    if (config.titles?.primary_font_size === "") {
      config = deleteKey(config, "titles.primary_font_size").result;
    }
    if (config.titles?.secondary_font_size === "") {
      config = deleteKey(config, "titles.secondary_font_size").result;
    }
    if (JSON.stringify(config.titles) === "{}") {
      config = deleteKey(config, "titles").result;
    }

    // Value texts
    //    Don't remove empty_string for:
    //      - .primary
    //      - .primary_unit
    //      - .secondary
    //      - .secondary_unit
    //    This is used to overwrite default values to empty string
    if (config.value_texts?.primary_color === "") {
      config = deleteKey(config, "value_texts.primary_color").result;
    }
    if (config.value_texts?.primary_unit_before_value === false) {
      config = deleteKey(
        config,
        "value_texts.primary_unit_before_value"
      ).result;
    }
    if (config.value_texts?.secondary_color === "") {
      config = deleteKey(config, "value_texts.secondary_color").result;
    }
    if (config.value_texts?.secondary_unit_before_value === false) {
      config = deleteKey(
        config,
        "value_texts.secondary_unit_before_value"
      ).result;
    }
    if (JSON.stringify(config.value_texts) === "{}") {
      config = deleteKey(config, "value_texts").result;
    }

    // Setpoint
    if (config.setpoint?.type !== this._config?.setpoint?.type) {
      config = deleteKey(config, "setpoint.value").result;
    }

    if (JSON.stringify(config.setpoint) === "{}") {
      config = deleteKey(config, "setpoint").result;
    }

    // Icon
    if (config.icon?.type === undefined) {
      config = deleteKey(config, "icon").result;
    }
    if (config.icon?.type !== this._config?.icon?.type) {
      config = deleteKey(config, "icon.value").result;
    }
    if (config.icon?.type !== "battery") {
      config = deleteKey(config, "icon.state").result;
      config = deleteKey(config, "icon.threshold").result;
      config = deleteKey(config, "icon.hide_label").result;
    }

    fireEvent(this, "config-changed", { config });
  }
}
