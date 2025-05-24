// External dependencies
import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import memoizeOne from "memoize-one";
import { assert } from "superstruct";

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
// import { migrate_parameters } from "../utils/migrate-parameters";
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
    // value = migrate_parameters(value);
    this.config = value;
  }

  private _schema = memoizeOne(
    (
      showGradientResolution: boolean,
      enableInner: boolean,
      showInnerGradient: boolean,
      showInnerGradientResolution: boolean
    ) =>
      [
        {
          name: "entities",
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
              selector: { number: { mode: "box", step: "any" } },
            },
            {
              name: "max",
              selector: { number: { mode: "box", step: "any" } },
            },
            {
              type: "grid",
              schema: [{ name: "needle", selector: { boolean: {} } }, {}],
            },
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
                            value: "gradient_resolution",
                            options: [
                              {
                                value: "very_low",
                                label: this._customLocalize(
                                  "gradient_resolution_options.very_low"
                                ),
                              },
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
          ],
        },
        { name: "enable_inner", selector: { boolean: {} } },
        ...(enableInner
          ? [
              {
                name: "inner",
                type: "expandable",
                flatten: false,
                expanded: true,
                schema: [
                  {
                    name: "value",
                    selector: { template: {} },
                  },
                  {
                    name: "min",
                    selector: { number: { mode: "box", step: "any" } },
                  },
                  {
                    name: "max",
                    selector: { number: { mode: "box", step: "any" } },
                  },
                  {
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
                              {
                                value: "on_main",
                                label: this._customLocalize(
                                  "inner_mode_options.on_main"
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
                                            value: "very_low",
                                            label: this._customLocalize(
                                              "gradient_resolution_options.very_low"
                                            ),
                                          },
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
            ]
          : [{}]),
        {
          name: "setpoint",
          type: "expandable",
          flatten: false,
          schema: [
            {
              name: "value",
              selector: { number: { mode: "box", step: "any" } },
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
                {
                  name: "primary_unit",
                  selector: { template: {} },
                },
                {
                  name: "secondary_unit",
                  selector: { template: {} },
                },
              ],
            },
          ],
        },
        {
          name: "actions",
          type: "expandable",
          flatten: true,
          schema: [...computeActionsFormSchema()],
        },
        {
          name: "hide_background",
          selector: { boolean: {} },
        },
      ] as const
  );

  connectedCallback() {
    // this._config = migrate_parameters(this._config);
    super.connectedCallback();
    void loadHaComponents();
  }

  public setConfig(config: GaugeCardProCardConfig): void {
    // config = migrate_parameters(config);
    assert(config, gaugeCardProConfigStruct);
    this._config = config;
  }

  private _computeLabel = (schema: HaFormSchema) => {
    const customLocalize = setupCustomlocalize(this.hass!);

    function getIconPrefix() {
      switch (schema.name) {
        case "actions":
          return "🏃‍♀️";
        case "entities":
          return "⚛️";
        case "inner":
          return "🌈";
        case "main_gauge":
          return "🌈";
        case "primary":
          return "📋";
        case "primary_color":
          return "🎨";
        case "primary_font_size":
          return "↕️";
        case "primary_unit":
          return "📐";
        case "secondary":
          return "📋";
        case "secondary_color":
          return "🎨";
        case "secondary_font_size":
          return "↕️";
        case "secondary_unit":
          return "📐";
        case "setpoint":
          return "🎯";
        case "titles":
          return "🔠";
        case "value_texts":
          return "🔢";
        default:
          return undefined;
      }
    }

    const iconPrefixedCustomLabel = getIconPrefix();
    if (iconPrefixedCustomLabel) {
      return (
        iconPrefixedCustomLabel +
        " " +
        customLocalize(`editor.card.${schema.name}`)
      );
    }

    switch (schema.name) {
      case "color":
        return this.hass!.localize("ui.panel.lovelace.editor.card.tile.color");
      case "max":
        return this.hass!.localize(
          "ui.panel.lovelace.editor.card.generic.maximum"
        );
      case "min":
        return this.hass!.localize(
          "ui.panel.lovelace.editor.card.generic.minimum"
        );
      case "tap_action":
      case "hold_action":
      case "double_tap_action":
        return this.hass!.localize(
          `ui.panel.lovelace.editor.card.generic.${schema.name}`
        );
      default:
        return customLocalize(`editor.card.${schema.name}`);
    }
  };

  private _customLocalize(value: string) {
    const customLocalize = setupCustomlocalize(this.hass!);
    return customLocalize(`editor.card.${value}`);
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const showGradientResolution =
      (this._config.needle && this._config.gradient) ?? false;
    const enabelInner = this._config?.inner !== undefined;

    const inner_mode =
      this._config?.inner?.mode !== undefined
        ? this._config.inner.mode
        : "severity";

    const showInnerGradient =
      ["severity", "static", "needle"].includes(inner_mode) ?? false;
    const showInnerGradientResolution =
      ["static", "needle"].includes(inner_mode) ?? false;

    const config = {
      enable_inner: this.config?.inner !== undefined,
      ...this._config,
    };

    const schema = this._schema(
      showGradientResolution,
      enabelInner,
      showInnerGradient,
      showInnerGradientResolution
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

    fireEvent(this, "config-changed", { config });
  }
}
