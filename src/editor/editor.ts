// External dependencies
import type { PropertyValues } from "lit";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { assert } from "superstruct";
import { styleMap } from "lit/directives/style-map.js";
import { z } from "zod";

// Internalized external dependencies
import type {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "../dependencies/ha";
import { compareClimateHvacModes, fireEvent } from "../dependencies/ha";

import type { HaFormSchema } from "../dependencies/mushroom";
import { loadHaComponents } from "../dependencies/mushroom";

// Local utilities
import { migrateConfig } from "../utils/migrate-config";
import { deleteKey } from "../utils/object/delete-key";
import {
  deleteFeatureOption,
  getFeature,
  hasFeature,
  setFeatureOption,
} from "../utils/object/features";
import { trySetValue } from "../utils/object/set-value";

// Local constants & types
import { gaugeCardProConfigStruct } from "./structs";
import type { GaugeCardProCardConfig } from "../card/config";

import {
  GaugeSegmentSchemaFrom,
  GaugeSegmentSchemaPos,
} from "../card/types/types";
import type { EditorRenderContext, Feature } from "../card/types/types";

import { DEFAULTS } from "../constants/defaults";
import { VERSION } from "../constants/logger";

import { localize } from "../utils/localize";
import { NumberUtils } from "../utils/number/numberUtils";
import { renderGeneralTab } from "./tabs/generalRender";
import { renderMainGaugeTab } from "./tabs/mainGaugeRender";
import { renderInnerGaugeTab } from "./tabs/innerGaugeRender";
import { renderAdvancedTab } from "./tabs/advancedRender";
import { FEATURE } from "../constants/features";
import { moveKey } from "../utils/object/move-key";

const tabs = ["general", "main_gauge", "inner_gauge", "advanced"] as const;

interface ConfigChangedEvent {
  config: LovelaceCardConfig;
  error?: string;
  guiModeAvailable?: boolean;
}

declare global {
  interface HASSDomEvents {
    "config-changed": ConfigChangedEvent;
  }
}

@customElement("gauge-card-pro-editor")
export class GaugeCardProEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: GaugeCardProCardConfig;

  @state() private _currTab: (typeof tabs)[number] = "general";

  private _lang?: string;

  connectedCallback() {
    super.connectedCallback();
    loadHaComponents();
  }

  public setConfig(config: GaugeCardProCardConfig | undefined): void {
    config = migrateConfig(config);
    assert(config, gaugeCardProConfigStruct);
    this._config = config;
    fireEvent(this, "config-changed", { config });
  }

  private get _editorContext(): EditorRenderContext {
    return {
      hass: this.hass!,
      createHAForm: this.createHAForm.bind(this),
      createButton: this.createButton.bind(this),
      createConvertSegmentsAlert: this.createConvertSegmentsAlert.bind(this),
      createSegmentPanel: this.createSegmentPanel.bind(this),
      addSegment: this._addSegment.bind(this),
      sortSegments: this._sortSegments.bind(this),
      deleteFeature: this._deleteFeature.bind(this),
      addFeature: this._addFeature.bind(this),
    };
  }

  private readonly _computeLabel = (
    schema: HaFormSchema,
    gauge: "main" | "inner" | "none" = "none"
  ) => {
    return localize(this.hass!.locale.language, schema.name, gauge);
  };

  private createHAForm(
    config: GaugeCardProCardConfig,
    schema,
    large_margin = false,
    gauge: "main" | "inner" | "none" = "none"
  ) {
    return html` <ha-form
      class="editor-form${large_margin ? "-large" : ""}"
      .hass=${this.hass}
      .data=${config}
      .schema=${schema}
      .computeLabel=${(schema: HaFormSchema) =>
        this._computeLabel(schema, gauge)}
      @value-changed=${this._valueChanged}
    ></ha-form>`;
  }

  private createButton(
    text: string,
    clickFunction: () => void,
    icon?: string,
    size?: "small" | "medium",
    variant?: "brand" | "neutral" | "danger" | "warning" | "success",
    appearance?: "accent" | "filled" | "plain"
  ) {
    return html` <ha-button
      size="${size ?? "small"}"
      variant=${variant !== undefined ? `${variant}` : nothing}
      appearance=${appearance !== undefined ? `${appearance}` : nothing}
      @click=${clickFunction}
    >
      ${icon !== undefined
        ? html`<ha-icon
            icon="${icon}"
            slot="start"
            style="color: inherit"
          ></ha-icon>`
        : nothing}
      ${text}
    </ha-button>`;
  }

  private createConvertSegmentsAlert(
    gauge: "main" | "inner",
    isSeverity: boolean,
    segmentsType: "from" | "pos" | "template" | "none"
  ) {
    return html` <ha-alert
      alert-type="info"
      .title=${localize(
        this._lang!,
        isSeverity
          ? "segments_alert.title_severity"
          : "segments_alert.title_gradient"
      )}
    >
      <div>
        ${localize(this._lang!, "segments_alert.description." + segmentsType)}
      </div>

      <div class="actions">
        ${segmentsType === "from"
          ? this.createButton(
              localize(this._lang!, "segments_alert.convert_to_pos"),
              () => this._convertSegments(gauge)
            )
          : segmentsType === "pos"
            ? this.createButton(
                localize(this._lang!, "segments_alert.convert_to_from"),
                () => this._convertSegments(gauge)
              )
            : nothing}
      </div>
    </ha-alert>`;
  }

  private createSegmentPanel(
    gauge: "main" | "inner",
    type: "from" | "pos",
    segment,
    index: number
  ) {
    return html` <ha-expansion-panel
      class="segment-expansion-panel"
      outlined
      .header=${type === "from"
        ? `From: ${segment.from}`
        : `Position: ${segment.pos}`}
    >
      <ha-icon
        slot="leading-icon"
        icon="mdi:square"
        style=${styleMap({ "--icon-primary-color": segment.color })}
      ></ha-icon>

      <div class="content">
        <ha-textfield
          class="segment-textfield"
          name="${gauge === "main" ? "" : "inner."}segments.${index}.${type}"
          label="${type === "from" ? "From" : "Pos"}"
          type="number"
          .value="${type === "from" ? segment.from : segment.pos}"
          step="0.01"
          @keyup="${this._valueChanged}"
          @change="${this._valueChanged}"
        ></ha-textfield>

        <ha-textfield
          class="segment-textfield"
          name="${gauge === "main" ? "" : "inner."}segments.${index}.color"
          label="Color"
          type="text"
          .value="${segment.color}"
          @keyup="${this._valueChanged}"
          @change="${this._valueChanged}"
        ></ha-textfield>
      </div>

      <div class="button-bottom">
        ${this.createButton(
          localize(this._lang!, "delete_segment"),
          () => this._deleteSegment(gauge, index),
          "mdi:trash-can",
          "small",
          "danger",
          "plain"
        )}
      </div>
    </ha-expansion-panel>`;
  }

  private removeFeature<T extends { type: string }>(
    features: T[],
    typeToRemove: string
  ): T[] {
    return features.filter((f) => f.type !== typeToRemove);
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("hass")) {
      this._lang = this.hass?.locale.language;
    }
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    let config = {
      enable_inner: this._config.inner !== undefined,

      primary_value_text_tap_action:
        this._config?.value_texts?.primary?.tap_action,
      primary_value_text_hold_action:
        this._config?.value_texts?.primary?.hold_action,
      primary_value_text_double_tap_action:
        this._config?.value_texts?.primary?.double_tap_action,
      secondary_value_text_tap_action:
        this._config?.value_texts?.secondary?.tap_action,
      secondary_value_text_hold_action:
        this._config?.value_texts?.secondary?.hold_action,
      secondary_value_text_double_tap_action:
        this._config?.value_texts?.secondary?.double_tap_action,
      icon_left_tap_action: this._config?.icons?.left?.tap_action,
      icon_left_hold_action: this._config?.icons?.left?.hold_action,
      icon_left_double_tap_action: this._config?.icons?.left?.double_tap_action,
      icon_right_tap_action: this._config?.icons?.right?.tap_action,
      icon_right_hold_action: this._config?.icons?.right?.hold_action,
      icon_right_double_tap_action:
        this._config?.icons?.right?.double_tap_action,

      separated_overview: hasFeature(this._config, FEATURE.CLIMATE_OVERVIEW)
        ? (getFeature(this._config, FEATURE.CLIMATE_OVERVIEW)?.separate ??
          false)
        : undefined,
      hvac_style: hasFeature(this._config, FEATURE.CLIMATE_HVAC_MODES)
        ? (getFeature(this._config, FEATURE.CLIMATE_HVAC_MODES)?.style ??
          "icons")
        : undefined,
      customise_hvac_modes:
        getFeature(this._config, FEATURE.CLIMATE_HVAC_MODES)?.hvac_modes !==
        undefined,
      hvac_modes: getFeature(this._config, FEATURE.CLIMATE_HVAC_MODES)
        ?.hvac_modes,
      fan_style: hasFeature(this._config, FEATURE.CLIMATE_FAN_MODES)
        ? (getFeature(this._config, FEATURE.CLIMATE_FAN_MODES)?.style ??
          "icons")
        : undefined,
      customise_fan_modes:
        getFeature(this._config, FEATURE.CLIMATE_FAN_MODES)?.fan_modes !==
        undefined,
      fan_modes: getFeature(this._config, FEATURE.CLIMATE_FAN_MODES)?.fan_modes,
      swing_style: hasFeature(this._config, FEATURE.CLIMATE_SWING_MODES)
        ? (getFeature(this._config, FEATURE.CLIMATE_SWING_MODES)?.style ??
          "icons")
        : undefined,
      customise_swing_modes:
        getFeature(this._config, FEATURE.CLIMATE_SWING_MODES)?.swing_modes !==
        undefined,
      swing_modes: getFeature(this._config, FEATURE.CLIMATE_SWING_MODES)
        ?.swing_modes,
      preset_style: hasFeature(this._config, FEATURE.CLIMATE_PRESET_MODES)
        ? (getFeature(this._config, FEATURE.CLIMATE_PRESET_MODES)?.style ??
          "icons")
        : undefined,
      customise_preset_modes:
        getFeature(this._config, FEATURE.CLIMATE_PRESET_MODES)?.preset_modes !==
        undefined,
      preset_modes: getFeature(this._config, FEATURE.CLIMATE_PRESET_MODES)
        ?.preset_modes,
      gradient_resolution_mode: NumberUtils.isNumeric(
        this._config.gradient_resolution
      )
        ? "numerical"
        : "auto",
      ...this._config,
    };

    if (config.enable_inner) {
      config = trySetValue(
        config,
        "inner.gradient_resolution_mode",
        NumberUtils.isNumeric(this._config.inner?.gradient_resolution)
          ? "numerical"
          : "auto",
        true
      ).result;
    }

    return html` <ha-tab-group @wa-tab-show=${this._handleTabChanged}>
        ${tabs.map(
          (tab) => html`
            <ha-tab-group-tab
              slot="nav"
              .active=${this._currTab === tab}
              panel=${tab}
            >
              ${localize(this._lang!, tab)}
            </ha-tab-group-tab>
          `
        )}
      </ha-tab-group>
      ${this._currTab === "general"
        ? renderGeneralTab(this._editorContext, config)
        : nothing}
      ${this._currTab === "main_gauge"
        ? renderMainGaugeTab(this._editorContext, config)
        : nothing}
      ${this._currTab === "inner_gauge"
        ? renderInnerGaugeTab(this._editorContext, config)
        : nothing}
      ${this._currTab === "advanced"
        ? renderAdvancedTab(this._editorContext, config)
        : nothing}
      <ha-alert alert-type="info" .title=${localize(this._lang!, "need_help")}>
        <br />
        <div>${unsafeHTML(localize(this._lang!, "need_help_description"))}</div>
        <div class="actions">
          <a
            href="https://chatgpt.com/g/g-698c7177f22481919cb8260f05134f25-gauge-card-pro-assistant"
            target="_blank"
            rel="noreferrer noopener"
          >
            <ha-button size="small">
              ${localize(this._lang!, "open_assistant")}
            </ha-button>
          </a>
        </div>
      </ha-alert>
      <ha-form-constant
        .label=${`${localize(this._lang!, "thanks_for_using_gcp")} (v${VERSION})`}
        .schema=${{ value: undefined }}
        style="text-align: center; margin-bottom: 16px;"
      >
      </ha-form-constant>`;
  }

  private _valueChanged(ev: CustomEvent): void {
    if (ev.type === "change") {
      // Triggered by segments buttons
      const target = ev.target as HTMLInputElement | HTMLSelectElement;
      const name = target?.getAttribute("name");
      if (!name || !ev.target) return;

      const isSegmentField =
        name.startsWith("segments.") || name.startsWith("inner.segments.");
      if (!isSegmentField) {
        fireEvent(this, "config-changed", { config: this._config! });
        return;
      }

      let value;
      if (name.endsWith(".color")) {
        value = target.value;
      } else if (name.endsWith(".from") || name.endsWith(".pos")) {
        value = Number.parseFloat(target.value);
      } else {
        value = undefined;
      }

      const config = trySetValue(
        this._config,
        name,
        value,
        false,
        true
      ).result!;

      fireEvent(this, "config-changed", { config });
    } else if (ev.type === "value-changed") {
      // Triggered by regular Visual Editor interactions
      let config = ev.detail.value;

      config = deleteKey(config, "use_new_from_segments_style").result;

      if (config.needle !== true) {
        config = deleteKey(config, "min_indicator").result;
        config = deleteKey(config, "max_indicator").result;
      } else {
        config = deleteKey(config, "marker").result;
      }

      // Main Gradient
      if (config.gradient || config.gradient_background) {
        config = trySetValue(
          config,
          "gradient_resolution",
          DEFAULTS.gradient.resolution
        ).result;
      } else {
        config = deleteKey(config, "gradient_resolution").result;
      }

      // Inner
      if (config.enable_inner) {
        config = trySetValue(
          config,
          "inner",
          { mode: DEFAULTS.inner.mode },
          true
        ).result;
      } else {
        config = deleteKey(config, "inner").result;
      }
      config = deleteKey(config, "enable_inner").result;

      // Inner Severity Gauge
      if (config.inner?.mode === "severity") {
        config = deleteKey(config, "inner.min_indicator").result;
        config = deleteKey(config, "inner.max_indicator").result;
      }

      // Inner Gradient
      if (config.inner?.gradient || config.inner?.gradient_background) {
        config = trySetValue(
          config,
          "inner.gradient_resolution",
          DEFAULTS.gradient.resolution
        ).result;
      } else {
        config = deleteKey(config, "inner.gradient_resolution").result;
      }

      // Inner Min indicator
      if (
        config.inner?.min_indicator?.type !==
        this._config?.inner?.min_indicator?.type
      ) {
        config = deleteKey(config, "inner.min_indicator.value").result;
      }

      // Inner Max indicator
      if (
        config.inner?.max_indicator?.type !==
        this._config?.inner?.max_indicator?.type
      ) {
        config = deleteKey(config, "inner.max_indicator.value").result;
      }

      // Inner Setpoint
      if (
        config.inner?.setpoint?.type !== this._config?.inner?.setpoint?.type
      ) {
        config = deleteKey(config, "inner.setpoint.value").result;
      }

      if (
        config.inner?.setpoint?.type === undefined ||
        JSON.stringify(config.inner?.setpoint) === "{}"
      ) {
        config = deleteKey(config, "inner.setpoint").result;
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

      // Min indicator
      if (config.min_indicator?.type !== this._config?.min_indicator?.type) {
        config = deleteKey(config, "min_indicator.value").result;
      }
      if (config.min_indicator?.type === undefined) {
        config = deleteKey(config, "min_indicator").result;
      }

      // Max indicator
      if (config.max_indicator?.type !== this._config?.max_indicator?.type) {
        config = deleteKey(config, "max_indicator.value").result;
      }
      if (config.max_indicator?.type === undefined) {
        config = deleteKey(config, "max_indicator").result;
      }

      // Setpoint
      if (config.setpoint?.type !== this._config?.setpoint?.type) {
        config = deleteKey(config, "setpoint.value").result;
      }

      if (
        config.setpoint?.type === undefined ||
        JSON.stringify(config.setpoint) === "{}"
      ) {
        config = deleteKey(config, "setpoint").result;
      }

      // Icon - Left
      if (config.icons?.left?.type === undefined) {
        config = deleteKey(config, "icons.left").result;
      }
      if (config.icons?.left?.type !== this._config?.icons?.left?.type) {
        config = deleteKey(config, "icons.left.value").result;
      }
      if (config.icons?.left?.type !== "battery") {
        config = deleteKey(config, "icons.left.state").result;
        config = deleteKey(config, "icons.left.threshold").result;
      }
      if (!["battery", "hvac-mode"].includes(config.icons?.left?.type)) {
        config = deleteKey(config, "icons.left.hide_label").result;
      }

      // Icon - Right
      if (config.icons?.right?.type === undefined) {
        config = deleteKey(config, "icons.right").result;
      }
      if (config.icons?.right?.type !== this._config?.icons?.right?.type) {
        config = deleteKey(config, "icons.right.value").result;
      }
      if (config.icons?.right?.type !== "battery") {
        config = deleteKey(config, "icons.right.state").result;
        config = deleteKey(config, "icons.right.threshold").result;
      }
      if (!["battery", "hvac-mode"].includes(config.icons?.right?.type)) {
        config = deleteKey(config, "icons.right.hide_label").result;
      }

      // Actions
      if (config.primary_value_text_tap_action !== undefined) {
        config = moveKey(
          config,
          "primary_value_text_tap_action",
          "value_texts.primary.tap_action",
          true
        );
      }
      if (config.primary_value_text_hold_action !== undefined) {
        config = moveKey(
          config,
          "primary_value_text_hold_action",
          "value_texts.primary.hold_action",
          true
        );
      }
      if (config.primary_value_text_double_tap_action !== undefined) {
        config = moveKey(
          config,
          "primary_value_text_double_tap_action",
          "value_texts.primary.double_tap_action",
          true
        );
      }

      if (config.secondary_value_text_tap_action !== undefined) {
        config = moveKey(
          config,
          "secondary_value_text_tap_action",
          "value_texts.secondary.tap_action",
          true
        );
      }
      if (config.secondary_value_text_hold_action !== undefined) {
        config = moveKey(
          config,
          "secondary_value_text_hold_action",
          "value_texts.secondary.hold_action",
          true
        );
      }
      if (config.secondary_value_text_double_tap_action !== undefined) {
        config = moveKey(
          config,
          "secondary_value_text_double_tap_action",
          "value_texts.secondary.double_tap_action",
          true
        );
      }

      if (config.icon_left_tap_action !== undefined) {
        config = moveKey(
          config,
          "icon_left_tap_action",
          "icons.left.tap_action",
          true
        );
      }
      if (config.icon_left_hold_action !== undefined) {
        config = moveKey(
          config,
          "icon_left_hold_action",
          "icons.left.hold_action",
          true
        );
      }
      if (config.icon_left_double_tap_action !== undefined) {
        config = moveKey(
          config,
          "icon_left_double_tap_action",
          "icons.left.double_tap_action",
          true
        );
      }

      if (config.icon_right_tap_action !== undefined) {
        config = moveKey(
          config,
          "icon_right_tap_action",
          "icons.right.tap_action",
          true
        );
      }
      if (config.icon_right_hold_action !== undefined) {
        config = moveKey(
          config,
          "icon_right_hold_action",
          "icons.right.hold_action",
          true
        );
      }
      if (config.icon_right_double_tap_action !== undefined) {
        config = moveKey(
          config,
          "icon_right_double_tap_action",
          "icons.right.double_tap_action",
          true
        );
      }

      // Features
      if (JSON.stringify(config.features) === "[]") {
        config = deleteKey(config, "features").result;
      }

      const featureOverview = getFeature(config, FEATURE.CLIMATE_OVERVIEW);
      if (featureOverview) {
        if (config.separated_overview !== undefined) {
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_OVERVIEW,
            "separate",
            config.separated_overview
          );
        }
        config = deleteKey(config, "separated_overview").result;
      }

      const featureHvacModes = getFeature(config, FEATURE.CLIMATE_HVAC_MODES);
      if (featureHvacModes) {
        if (config.hvac_style !== undefined) {
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_HVAC_MODES,
            "style",
            config.hvac_style
          );
          config = deleteKey(config, "hvac_style").result;
        }

        if (config.customise_hvac_modes !== true) {
          config = deleteFeatureOption(
            config,
            FEATURE.CLIMATE_HVAC_MODES,
            "hvac_modes"
          );
          config = deleteKey(config, "customise_hvac_modes").result;
          config = deleteKey(config, "hvac_modes").result;
        } else if (
          config.customise_hvac_modes === true &&
          !featureHvacModes.hvac_modes
        ) {
          const stateObj = config.feature_entity
            ? this.hass!.states[config.feature_entity]
            : config.entity
              ? this.hass!.states[config.entity]
              : undefined;
          const orderedHvacModes = (stateObj?.attributes.hvac_modes || [])
            .concat()
            .sort(compareClimateHvacModes);
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_HVAC_MODES,
            "hvac_modes",
            orderedHvacModes
          );
        } else if (config.hvac_modes !== undefined) {
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_HVAC_MODES,
            "hvac_modes",
            config.hvac_modes
          );
        }
      }
      config = deleteKey(config, "customise_hvac_modes").result;
      config = deleteKey(config, "hvac_modes").result;

      const featureFanModes = getFeature(config, FEATURE.CLIMATE_FAN_MODES);
      if (featureFanModes) {
        if (config.fan_style !== undefined) {
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_FAN_MODES,
            "style",
            config.fan_style
          );
          config = deleteKey(config, "fan_style").result;
        }

        if (config.customise_fan_modes !== true) {
          config = deleteFeatureOption(
            config,
            FEATURE.CLIMATE_FAN_MODES,
            "fan_modes"
          );
          config = deleteKey(config, "customise_fan_modes").result;
          config = deleteKey(config, "fan_modes").result;
        } else if (
          config.customise_fan_modes === true &&
          !featureFanModes.fan_modes
        ) {
          const stateObj = config.feature_entity
            ? this.hass!.states[config.feature_entity]
            : config.entity
              ? this.hass!.states[config.entity]
              : undefined;
          const fanModes = (stateObj?.attributes.fan_modes || []).concat();
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_FAN_MODES,
            "fan_modes",
            fanModes
          );
        } else if (config.fan_modes !== undefined) {
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_FAN_MODES,
            "fan_modes",
            config.fan_modes
          );
        }
      }
      config = deleteKey(config, "customise_fan_modes").result;
      config = deleteKey(config, "fan_modes").result;

      const featureSwingModes = getFeature(config, FEATURE.CLIMATE_SWING_MODES);
      if (featureSwingModes) {
        if (config.swing_style !== undefined) {
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_SWING_MODES,
            "style",
            config.swing_style
          );
          config = deleteKey(config, "swing_style").result;
        }

        if (config.customise_swing_modes !== true) {
          config = deleteFeatureOption(
            config,
            FEATURE.CLIMATE_SWING_MODES,
            "swing_modes"
          );
          config = deleteKey(config, "customise_swing_modes").result;
          config = deleteKey(config, "swing_modes").result;
        } else if (
          config.customise_swing_modes === true &&
          !featureSwingModes.swing_modes
        ) {
          const stateObj = config.feature_entity
            ? this.hass!.states[config.feature_entity]
            : config.entity
              ? this.hass!.states[config.entity]
              : undefined;
          const swingModes = (stateObj?.attributes.swing_modes || []).concat();
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_SWING_MODES,
            "swing_modes",
            swingModes
          );
        } else if (config.swing_modes !== undefined) {
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_SWING_MODES,
            "swing_modes",
            config.swing_modes
          );
        }
      }
      config = deleteKey(config, "customise_swing_modes").result;
      config = deleteKey(config, "swing_modes").result;

      const featurePresetModes = getFeature(
        config,
        FEATURE.CLIMATE_PRESET_MODES
      );
      if (featurePresetModes) {
        if (config.preset_style !== undefined) {
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_PRESET_MODES,
            "style",
            config.preset_style
          );
          config = deleteKey(config, "preset_style").result;
        }

        if (config.customise_preset_modes !== true) {
          config = deleteFeatureOption(
            config,
            FEATURE.CLIMATE_PRESET_MODES,
            "preset_modes"
          );
          config = deleteKey(config, "customise_preset_modes").result;
          config = deleteKey(config, "preset_modes").result;
        } else if (
          config.customise_preset_modes === true &&
          !featurePresetModes.preset_modes
        ) {
          const stateObj = config.feature_entity
            ? this.hass!.states[config.feature_entity]
            : config.entity
              ? this.hass!.states[config.entity]
              : undefined;
          const presetModes = (
            stateObj?.attributes.preset_modes || []
          ).concat();
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_PRESET_MODES,
            "preset_modes",
            presetModes
          );
        } else if (config.preset_modes !== undefined) {
          config = setFeatureOption(
            config,
            FEATURE.CLIMATE_PRESET_MODES,
            "preset_modes",
            config.preset_modes
          );
        }
      }
      config = deleteKey(config, "customise_preset_modes").result;
      config = deleteKey(config, "preset_modes").result;

      const mainGradientResolutionMode = config.gradient_resolution_mode;
      const isMainGradientResolutionNumeric = NumberUtils.isNumeric(
        config.gradient_resolution
      );
      if (
        mainGradientResolutionMode === "auto" &&
        isMainGradientResolutionNumeric
      ) {
        config = trySetValue(
          config,
          "gradient_resolution",
          DEFAULTS.gradient.resolution,
          true,
          true
        ).result;
      } else if (
        mainGradientResolutionMode === "numerical" &&
        !isMainGradientResolutionNumeric
      ) {
        config = trySetValue(
          config,
          "gradient_resolution",
          DEFAULTS.gradient.numericalResolution,
          true,
          true
        ).result;
      }
      config = deleteKey(config, "gradient_resolution_mode").result;

      const innerGradientResolutionMode =
        config.inner?.gradient_resolution_mode;
      const isInnerGradientResolutionNumeric = NumberUtils.isNumeric(
        config.inner?.gradient_resolution
      );
      if (
        innerGradientResolutionMode === "auto" &&
        isInnerGradientResolutionNumeric
      ) {
        config = trySetValue(
          config,
          "inner.gradient_resolution",
          DEFAULTS.gradient.resolution,
          true,
          true
        ).result;
      } else if (
        innerGradientResolutionMode === "numerical" &&
        !isInnerGradientResolutionNumeric
      ) {
        config = trySetValue(
          config,
          "inner.gradient_resolution",
          DEFAULTS.gradient.numericalResolution,
          true,
          true
        ).result;
      }
      config = deleteKey(config, "inner.gradient_resolution_mode").result;

      fireEvent(this, "config-changed", { config });
    }
  }

  private _handleTabChanged(ev: CustomEvent): void {
    const newTab = ev.detail.name;
    if (newTab === this._currTab) {
      return;
    }
    this._currTab = newTab;
  }

  private _convertSegments(gauge: string) {
    let config: GaugeCardProCardConfig = this._config!;

    const inner = gauge === "main" ? "" : "inner.";
    const segments =
      gauge === "main" ? config.segments : config.inner!.segments;

    const safeFromSegments = z
      .array(GaugeSegmentSchemaFrom)
      .safeParse(segments);

    if (safeFromSegments.success) {
      const pos_segments = safeFromSegments.data.map(({ from, color }) => ({
        pos: from,
        color,
      }));

      config = trySetValue(
        config,
        inner + "segments",
        pos_segments,
        false,
        true
      ).result;

      fireEvent(this, "config-changed", { config });
    } else {
      const safePosSegments = z
        .array(GaugeSegmentSchemaPos)
        .safeParse(segments);

      if (safePosSegments.success) {
        const from_segments = safePosSegments.data.map(({ pos, color }) => ({
          from: pos,
          color,
        }));

        config = trySetValue(
          config,
          inner + "segments",
          from_segments,
          false,
          true
        ).result;

        fireEvent(this, "config-changed", { config });
      }
    }
  }

  private _addSegment(gauge: "main" | "inner"): void {
    let config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
    const segments = gauge === "main" ? config.segments : config.inner.segments;

    if (segments) {
      // Source - https://stackoverflow.com/a/5092872
      // Posted by Bill the Lizard, modified by community. See post 'Timeline' for change history
      // Retrieved 2026-01-10, License - CC BY-SA 3.0
      const randomColor = "#000000".replaceAll("0", function () {
        return Math.trunc(Math.random() * 16).toString(16);
      });

      const isFrom = z
        .array(GaugeSegmentSchemaFrom)
        .safeParse(segments).success;
      if (isFrom) {
        const value = segments.length >= 1 ? segments.at(-1).from : 100;
        segments.push({ from: value, color: randomColor });
      } else {
        const isPos = z
          .array(GaugeSegmentSchemaPos)
          .safeParse(segments).success;
        if (isPos) {
          const value = segments.length >= 1 ? segments.at(-1).pos : 100;
          segments.push({ pos: value, color: randomColor });
        }
      }
    } else {
      config = trySetValue(
        config,
        `${gauge === "main" ? "" : "inner."}segments`,
        [{ pos: 100, color: "var(--info-color)" }],
        true
      ).result;
    }

    fireEvent(this, "config-changed", { config });
  }

  private _deleteSegment(gauge: "main" | "inner", index: number): void {
    let config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
    const segments = gauge === "main" ? config.segments : config.inner.segments;
    if (segments.length === 1) {
      const key = gauge === "main" ? "segments" : "inner.segments";
      config = deleteKey(config, key).result;
    } else {
      segments.splice(index, 1);
    }

    fireEvent(this, "config-changed", { config });
  }

  private _sortSegments(gauge: "main" | "inner") {
    const config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
    const segments = gauge === "main" ? config.segments : config.inner.segments;

    const isFrom = z.array(GaugeSegmentSchemaFrom).safeParse(segments).success;
    if (isFrom) {
      segments.sort((a, b) => a.from - b.from);
    } else {
      const isPos = z.array(GaugeSegmentSchemaPos).safeParse(segments).success;
      if (isPos) {
        segments.sort((a, b) => a.pos - b.pos);
      }
    }

    fireEvent(this, "config-changed", { config });
  }

  private _addFeature(ev) {
    const feature = ev.detail.item.value as Feature;
    if (!feature) {
      return;
    }

    let config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
    const current_features = config.features ?? [];
    config = trySetValue(
      config,
      "features",
      [...current_features, { type: feature }],
      true,
      true
    ).result;
    fireEvent(this, "config-changed", { config });
  }

  private _deleteFeature(feature: Feature) {
    const config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
    const current_features = config.features ?? [];
    config.features = this.removeFeature(current_features, feature);
    fireEvent(this, "config-changed", { config });
  }

  static get styles() {
    return [
      css`
        ha-tab-group {
          margin-bottom: 16px;
        }
        ha-tab-group-tab {
          flex: 1;
        }
        ha-tab-group-tab::part(base) {
          width: 100%;
          justify-content: center;
        }
        .editor-form {
          margin-bottom: 8px;
        }
        .editor-form-large {
          margin-bottom: 24px;
        }
        .expansion-panel {
          margin-bottom: 24px;
        }
        .segment-expansion-panel {
          margin-bottom: 12px;
        }
        .segment-textfield {
          width: 100%;
          margin-top: 12px;
        }

        .button-bottom {
          padding-left: 12px;
          padding-right: 12px;
          padding-bottom: 12px;
        }
        .constant {
          font-weight: var(--ha-font-weight-medium);
        }
        ha-form {
          display: block;
          margin-bottom: 24px;
        }
        ha-expansion-panel {
          display: block;
          --expansion-panel-content-padding: 0;
          border-radius: 6px;
          --ha-card-border-radius: 6px;
        }
        ha-expansion-panel .content {
          padding: 12px;
        }
        ha-expansion-panel > *[slot="header"] {
          margin: 0;
          font-size: inherit;
          font-weight: inherit;
        }
        ha-expansion-panel ha-icon {
          color: var(--secondary-text-color);
        }
        ha-alert {
          margin-bottom: 16px;
          display: block;
        }
        ha-alert a {
          color: var(--primary-color);
        }
        ha-alert .actions {
          display: flex;
          width: 100%;
          flex: 1;
          align-items: flex-end;
          flex-direction: row;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 8px;
          border-radius: 8px;
        }
      `,
    ];
  }
}
