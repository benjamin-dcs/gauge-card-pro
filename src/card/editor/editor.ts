// External dependencies
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { assert } from "superstruct";
import { styleMap } from "lit/directives/style-map.js";
import { includes, z } from "zod";

// Internalized external dependencies
import {
  compareClimateHvacModes,
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardEditor,
  fireEvent,
} from "../../dependencies/ha";

import { HaFormSchema, loadHaComponents } from "../../dependencies/mushroom";

// Local utilities
import { migrate_parameters } from "../../utils/migrate-parameters";
import { deleteKey } from "../../utils/object/delete-key";
import { getFeature, hasFeature } from "../../utils/object/features";
import { trySetValue } from "../../utils/object/set-value";

// Local constants & types
import { gaugeCardProConfigStruct } from "./structs";
import {
  GaugeCardProCardConfig,
  GaugeSegmentSchemaFrom,
  GaugeSegmentSchemaPos,
} from "../config";

import { DEFAULT_GRADIENT_RESOLUTION } from "../const";

// Editor utilities
import { entitiesSchema as _entitiesSchema } from "./schemas/entitiesSchema";
import { mainGaugeSchema as _mainGaugeSchema } from "./schemas/mainGaugeSchema";
import { enableInnerSchema as _enableInnerSchema } from "./schemas/enableInnerSchema";
import { innerGaugeSchema as _innerGaugeSchema } from "./schemas/innerGaugeSchema";
import {
  cardFeaturesSchema as _cardFeaturesSchema,
  featureEntitySchema as _featureEntitySchema,
  featuresAdjustTemperatureSchema as _featuresAdjustTemperatureSchema,
  featuresClimateHvacModesSchema as _featuresClimateHvacModesSchema,
} from "./schemas/cardFeaturesSchema";

import { localize } from "../../utils/localize";

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

function isArraySorted(arr, type) {
  const key = type === "from" ? "from" : type === "pos" ? "pos" : null;
  if (!key) return false;

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i]?.[key] > arr[i + 1]?.[key]) return false;
  }
  return true;
}

@customElement("gauge-card-pro-editor")
export class GaugeCardProEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: GaugeCardProCardConfig | undefined;

  public get _config(): GaugeCardProCardConfig | undefined {
    return this.config;
  }
  public set _config(value: GaugeCardProCardConfig | undefined) {
    value = migrate_parameters(value);
    this.config = value;
  }

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
    return localize(this.hass!, schema.name);
  };

  private createHAForm(config, schema, large_margin = false) {
    return html` <ha-form
      class="editor-form${large_margin ? "-large" : ""}"
      .hass=${this.hass}
      .data=${config}
      .schema=${schema}
      .computeLabel=${this._computeLabel}
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
        this.hass!,
        isSeverity
          ? "segments_alert.title_severity"
          : "segments_alert.title_gradient"
      )}
    >
      <div>
        ${localize(this.hass!, "segments_alert.description." + segmentsType)}
      </div>

      <div class="actions">
        ${segmentsType === "from"
          ? this.createButton(
              localize(this.hass!, "segments_alert.convert_to_pos"),
              this._convertSegmentsHandler(gauge)
            )
          : segmentsType === "pos"
            ? this.createButton(
                localize(this.hass!, "segments_alert.convert_to_from"),
                this._convertSegmentsHandler(gauge)
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
          localize(this.hass!, "delete_segment"),
          this._deleteSegmentHandler(gauge, index),
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

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    //-----------------------------------------------------------------------------
    // MAIN GAUGE
    //-----------------------------------------------------------------------------
    const mainIsSeverity = this._config.needle !== true;

    const _mainSegments = this._config.segments;
    const mainFromSegments = z
      .array(GaugeSegmentSchemaFrom)
      .safeParse(_mainSegments);
    const mainPosSegments = z
      .array(GaugeSegmentSchemaPos)
      .safeParse(_mainSegments);
    const mainSegmentType = mainFromSegments.success
      ? "from"
      : mainPosSegments.success
        ? "pos"
        : _mainSegments !== undefined && typeof _mainSegments === "string"
          ? "template"
          : "none";

    const showMainSegmentsPanel = mainSegmentType !== "template";
    const showMainSortSegmentsButton =
      Array.isArray(_mainSegments) &&
      _mainSegments.length > 1 &&
      !isArraySorted(_mainSegments, mainSegmentType);

    const _mainHasGradient = this._config.gradient === true;
    const showMainConvertAlert =
      (mainSegmentType === "from" || mainSegmentType === "pos") &&
      _mainHasGradient;

    const showMainGradientOptions = _mainSegments != null;
    const showMainColorInterpolationNote =
      showMainGradientOptions && !this._config.needle && !this._config.gradient
        ? "off"
        : showMainGradientOptions &&
            !this._config.needle &&
            this._config.gradient
          ? "on"
          : "none";
    const showMainGradientResolution =
      (showMainGradientOptions &&
        this._config.needle &&
        this._config.gradient) ??
      false;

    const showMainSeverityGaugeOptions =
      _mainSegments != null && !this._config.needle;
    const showMainGradientBackgroundResolution =
      this._config.gradient_background ?? false;

    const showMainMinMaxIndicatorOptions = this._config.needle === true;

    const mainMinIndicatorType = this._config.min_indicator?.type ?? undefined;
    const hasMainMinIndicatorLabel = this._config.min_indicator?.label ?? false;

    const mainMaxIndicatorType = this._config.max_indicator?.type ?? undefined;
    const hasMainMaxIndicatorLabel = this._config.max_indicator?.label ?? false;

    const mainSetpointType = this._config.setpoint?.type ?? undefined;
    const hasMainSetpointLabel = this._config.setpoint?.label ?? false;

    const iconLeftType = this._config.icons?.left?.type ?? undefined;
    const iconRightType = this._config.icons?.right?.type ?? undefined;

    const featureEntity =
      this._config.feature_entity !== undefined
        ? this._config.feature_entity
        : this.config?.entity?.startsWith("climate")
          ? this.config.entity
          : undefined;
    const hasFeatureEntity = featureEntity !== undefined;

    const usedFeatures = {
      adjust_temperature: hasFeature(this._config, "adjust-temperature"),
      climate_hvac_modes: hasFeature(this._config, "climate-hvac-modes"),
    };

    //-----------------------------------------------------------------------------
    // INNER GAUGE
    //-----------------------------------------------------------------------------

    const enabelInner = this._config?.inner !== undefined;

    let innerIsSeverity: boolean;
    let innerFromSegments;
    let innerPosSegments;
    let innerSegmentsType: "from" | "pos" | "template" | "none";
    let showInnerSegmentsPanel: boolean;
    let showInnerSortSegmentsButton: boolean;
    let _innerHasGradient: boolean;
    let showInnerConvertAlert: boolean;
    let showInnerGradientOptions: boolean | undefined;
    let showInnerColorInterpolationNote: "none" | "off" | "on";
    let showInnerGradientResolution: boolean;
    let showInnerGradientBackgroundOptions: boolean;
    let showInnerGradientBackgroundResolution: boolean;
    let showInnerMinMaxIndicatorOptions: boolean;
    let innerMinIndicatorType: string | undefined;
    let innerMaxIndicatorType: string | undefined;
    let innerSetpointType: string | undefined;

    let innerGaugeSchema;

    if (enabelInner) {
      const innerSegments = this._config.inner!.segments;
      innerFromSegments = z
        .array(GaugeSegmentSchemaFrom)
        .safeParse(innerSegments);
      innerPosSegments = z
        .array(GaugeSegmentSchemaPos)
        .safeParse(innerSegments);
      innerSegmentsType = innerFromSegments.success
        ? "from"
        : innerPosSegments.success
          ? "pos"
          : innerSegments !== undefined && typeof innerSegments === "string"
            ? "template"
            : "none";

      showInnerSegmentsPanel = innerSegmentsType !== "template";
      showInnerSortSegmentsButton =
        Array.isArray(innerSegments) &&
        innerSegments.length > 1 &&
        !isArraySorted(innerSegments, innerSegmentsType);

      _innerHasGradient = this._config.inner!.gradient === true;
      showInnerConvertAlert = innerSegmentsType !== "none" && _innerHasGradient;

      const inner_mode = this._config.inner?.mode ?? "severity";
      innerIsSeverity = inner_mode === "severity";
      showInnerGradientOptions =
        ["severity", "static", "needle"].includes(inner_mode) &&
        innerSegments != null;
      showInnerColorInterpolationNote =
        showInnerGradientOptions &&
        ["severity"].includes(inner_mode) &&
        !this._config.inner?.gradient
          ? "off"
          : showInnerGradientOptions &&
              ["severity"].includes(inner_mode) &&
              this._config.inner?.gradient
            ? "on"
            : "none";
      showInnerGradientResolution = ["static", "needle"].includes(inner_mode);
      showInnerGradientBackgroundOptions =
        innerSegments != null && inner_mode === "severity";
      showInnerGradientBackgroundResolution =
        this._config.inner?.gradient_background ?? false;

      showInnerMinMaxIndicatorOptions = inner_mode !== "severity";

      innerMinIndicatorType =
        this._config.inner?.min_indicator?.type ?? undefined;
      innerMaxIndicatorType =
        this._config.inner?.max_indicator?.type ?? undefined;
      innerSetpointType = this._config.inner?.setpoint?.type ?? undefined;

      innerGaugeSchema = _innerGaugeSchema(
        this.hass,
        showInnerGradientOptions ?? false,
        showInnerColorInterpolationNote!,
        showInnerGradientResolution!,
        showInnerGradientBackgroundOptions!,
        showInnerGradientBackgroundResolution!,
        showInnerMinMaxIndicatorOptions!,
        innerMinIndicatorType,
        innerMaxIndicatorType,
        innerSetpointType
      );
    }

    const config = {
      enable_inner: this.config?.inner !== undefined,
      customise_hvac_modes:
        getFeature(this.config!, "climate-hvac-modes")?.hvac_modes !==
        undefined,
      hvac_modes: getFeature(this.config!, "climate-hvac-modes")?.hvac_modes,
      ...this._config,
    };

    const entitiesSchema = _entitiesSchema();
    const mainGaugeSchema = _mainGaugeSchema(
      this.hass,
      showMainGradientOptions,
      showMainColorInterpolationNote,
      showMainGradientResolution,
      showMainSeverityGaugeOptions,
      showMainGradientBackgroundResolution,
      showMainMinMaxIndicatorOptions,
      mainMinIndicatorType,
      hasMainMinIndicatorLabel,
      mainMaxIndicatorType,
      hasMainMaxIndicatorLabel,
      mainSetpointType,
      hasMainSetpointLabel
    );
    const enableInnerSchema = _enableInnerSchema();
    const cardFeaturesSchema = _cardFeaturesSchema(
      this.hass,
      iconLeftType,
      iconRightType
    );

    const featureEntitySchema = _featureEntitySchema();
    const featuresAdjustTemperatureSchema = _featuresAdjustTemperatureSchema();

    const featureEntityStateObj = featureEntity
      ? this.hass.states[featureEntity]
      : undefined;
    const featureCustomizeHvacModes = hasFeature(
      this._config,
      "climate-hvac-modes"
    )
      ? this._config.features?.find((f) => f.type === "climate-hvac-modes")
          ?.hvac_modes !== undefined
      : false;
    const featuresClimateHvacModesSchema = _featuresClimateHvacModesSchema(
      this.hass.formatEntityState,
      featureEntityStateObj,
      featureCustomizeHvacModes
    );

    return html` ${this.createHAForm(config, entitiesSchema, true)}

      <ha-expansion-panel
        class="expansion-panel"
        outlined
        expanded
        .header="${localize(this.hass, "main_gauge")}"
      >
        <ha-icon slot="leading-icon" icon="mdi:gauge"></ha-icon>
        <div class="content">
          ${showMainSegmentsPanel
            ? html`<ha-expansion-panel
                class="expansion-panel"
                outlined
                expanded
                .header="${localize(this.hass, "segments")}"
              >
                <ha-icon slot="leading-icon" icon="mdi:segment"></ha-icon>
                <div class="content">
                  ${showMainConvertAlert
                    ? this.createConvertSegmentsAlert(
                        "main",
                        mainIsSeverity,
                        mainSegmentType
                      )
                    : nothing}
                  ${mainSegmentType === "from"
                    ? mainFromSegments.data!.map((segment, index) => {
                        return this.createSegmentPanel(
                          "main",
                          "from",
                          segment,
                          index
                        );
                      })
                    : mainSegmentType === "pos"
                      ? mainPosSegments.data!.map((segment, index) => {
                          return this.createSegmentPanel(
                            "main",
                            "pos",
                            segment,
                            index
                          );
                        })
                      : nothing}
                  ${this.createButton(
                    localize(this.hass, "add_segment"),
                    this._addSegmentHandler("main"),
                    "mdi:plus",
                    "small",
                    "brand",
                    "filled"
                  )}
                  ${showMainSortSegmentsButton
                    ? this.createButton(
                        localize(this.hass, "sort"),
                        this._sortSegmentsHandler("main"),
                        "mdi:sort",
                        "small",
                        "neutral",
                        "plain"
                      )
                    : nothing}
                </div>
              </ha-expansion-panel>`
            : nothing}
          ${this.createHAForm(config, mainGaugeSchema)}
        </div>
      </ha-expansion-panel>

      ${this.createHAForm(config, enableInnerSchema)}
      ${enabelInner
        ? html` <ha-expansion-panel
            class="expansion-panel"
            outlined
            expanded
            .header="${localize(this.hass, "inner_gauge")}"
          >
            <ha-icon slot="leading-icon" icon="mdi:gauge"></ha-icon>
            <div class="content">
              ${showInnerSegmentsPanel!
                ? html` <ha-expansion-panel
                    class="expansion-panel"
                    outlined
                    expanded
                    .header="${localize(this.hass, "segments")}"
                  >
                    <ha-icon slot="leading-icon" icon="mdi:segment"></ha-icon>
                    <div class="content">
                      ${showInnerConvertAlert!
                        ? this.createConvertSegmentsAlert(
                            "inner",
                            innerIsSeverity!,
                            innerSegmentsType!
                          )
                        : nothing}
                      ${innerSegmentsType! === "from"
                        ? html`${innerFromSegments!.data!.map(
                            (segment, index) => {
                              return this.createSegmentPanel(
                                "inner",
                                "from",
                                segment,
                                index
                              );
                            }
                          )}`
                        : innerSegmentsType! === "pos"
                          ? html`${innerPosSegments.data!.map(
                              (segment, index) => {
                                return this.createSegmentPanel(
                                  "inner",
                                  "pos",
                                  segment,
                                  index
                                );
                              }
                            )}`
                          : nothing}
                      ${this.createButton(
                        localize(this.hass, "add_segment"),
                        this._addSegmentHandler("inner"),
                        "mdi:plus",
                        "small",
                        "brand",
                        "filled"
                      )}
                      ${showInnerSortSegmentsButton!
                        ? this.createButton(
                            localize(this.hass, "sort"),
                            this._sortSegmentsHandler("inner"),
                            "mdi:sort",
                            "small",
                            "neutral",
                            "plain"
                          )
                        : nothing}
                    </div>
                  </ha-expansion-panel>`
                : nothing}
              ${this.createHAForm(config, innerGaugeSchema)}
            </div>
          </ha-expansion-panel>`
        : nothing}
      ${this.createHAForm(config, cardFeaturesSchema, true)}
      <ha-expansion-panel
        class="expansion-panel"
        outlined
        .header="${localize(this.hass, "features")}"
      >
        <ha-icon slot="leading-icon" icon="mdi:list-box"></ha-icon>
        <div class="content">
          ${this.createHAForm(config, featureEntitySchema, true)}
          ${hasFeatureEntity && usedFeatures.adjust_temperature
            ? html` <ha-expansion-panel
                class="expansion-panel"
                outlined
                expanded
                .header="${localize(this.hass, "adjust_temperature")}"
              >
                <ha-icon slot="leading-icon" icon="mdi:thermometer"></ha-icon>
                <div class="content">
                  ${this.createHAForm(config, featuresAdjustTemperatureSchema)}
                </div>
                <div class="button-bottom">
                  ${this.createButton(
                    localize(this.hass!, "delete_feature"),
                    this._deleteAdjustTemperatureControlHandler(),
                    "mdi:trash-can",
                    "small",
                    "danger",
                    "plain"
                  )}
                </div>
              </ha-expansion-panel>`
            : nothing}
          ${hasFeatureEntity && usedFeatures.climate_hvac_modes
            ? html` <ha-expansion-panel
                class="expansion-panel"
                outlined
                expanded
                .header="${localize(this.hass, "climate_hvac_modes")}"
              >
                <ha-icon slot="leading-icon" icon="mdi:hvac"></ha-icon>
                <div class="content">
                  ${this.createHAForm(config, featuresClimateHvacModesSchema)}
                </div>
                <div class="button-bottom">
                  ${this.createButton(
                    localize(this.hass!, "delete_feature"),
                    this._deleteClimateHvacModesControlHandler(),
                    "mdi:trash-can",
                    "small",
                    "danger",
                    "plain"
                  )}
                </div>
              </ha-expansion-panel>`
            : nothing}
          ${hasFeatureEntity
            ? html` <ha-button-menu
                corner="BOTTOM_START"
                menuCorner="START"
                fixed
                @closed=${(e) => e.stopPropagation()}
                @click=${(e) => e.stopPropagation()}
              >
                <ha-button
                  size="small"
                  variant="brand"
                  appearance="filled"
                  slot="trigger"
                >
                  <ha-icon
                    icon="mdi:plus"
                    slot="start"
                    style="color: inherit"
                  ></ha-icon>
                  ${localize(this.hass, "add_feature")}
                </ha-button>
                <mwc-list-item
                  graphic="icon"
                  style=${styleMap({
                    display: !(
                      usedFeatures.adjust_temperature &&
                      usedFeatures.climate_hvac_modes
                    )
                      ? "none"
                      : "",
                  })}
                >
                  <ha-icon
                    icon="mdi:minus-box-outline"
                    slot="graphic"
                  ></ha-icon>
                  ${localize(this.hass, "no_items_available")}
                </mwc-list-item>

                <mwc-list-item
                  graphic="icon"
                  @click=${() => {
                    this._addAdjustTemperatureControl();
                  }}
                  style=${styleMap({
                    display: usedFeatures.adjust_temperature ? "none" : "",
                  })}
                >
                  <ha-icon icon="mdi:thermometer" slot="graphic"></ha-icon>
                  ${localize(this.hass, "adjust_temperature")}
                </mwc-list-item>

                <mwc-list-item
                  graphic="icon"
                  @click=${() => {
                    this._addClimateHvacModesControl();
                  }}
                  style=${styleMap({
                    display: usedFeatures.climate_hvac_modes ? "none" : "",
                  })}
                >
                  <ha-icon icon="mdi:hvac" slot="graphic"></ha-icon>
                  ${localize(this.hass, "climate_hvac_modes")}
                </mwc-list-item>
              </ha-button-menu>`
            : nothing}
        </div>
      </ha-expansion-panel>`;
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

      const value = name.endsWith(".color")
        ? target.value
        : name.endsWith(".from") || name.endsWith(".pos")
          ? parseFloat(target.value)
          : undefined;

      const config = trySetValue(this._config, name, value, false, true).result;

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
          DEFAULT_GRADIENT_RESOLUTION
        ).result;
      } else {
        config = deleteKey(config, "gradient_resolution").result;
      }

      // Inner
      if (config.enable_inner) {
        config = trySetValue(
          config,
          "inner",
          { mode: "severity" },
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
      } else {
        config = deleteKey(config, "inner.marker").result;
      }

      // Inner Gradient
      if (config.inner?.gradient || config.inner?.gradient_background) {
        config = trySetValue(
          config,
          "inner.gradient_resolution",
          DEFAULT_GRADIENT_RESOLUTION
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

      if (JSON.stringify(config.inner?.setpoint) === "{}") {
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

      if (JSON.stringify(config.setpoint) === "{}") {
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

      // Features
      if (
        config.feature_entity === undefined ||
        JSON.stringify(config.features) === "[]"
      ) {
        config = deleteKey(config, "features").result;
      }
      if (hasFeature(config, "climate-hvac-modes")) {
        let featureCustomiseHvacModes = getFeature(
          config,
          "climate-hvac-modes"
        );
        if (featureCustomiseHvacModes) {
          if (config.customise_hvac_modes !== true) {
            delete featureCustomiseHvacModes.hvac_modes;
            config = deleteKey(config, "customise_hvac_modes").result;
            config = deleteKey(config, "hvac_modes").result;
          } else if (
            config.customise_hvac_modes === true &&
            !featureCustomiseHvacModes.hvac_modes
          ) {
            const stateObj = config.feature_entity
              ? this.hass!.states[config.feature_entity]
              : undefined;
            const ordererHvacModes = (stateObj?.attributes.hvac_modes || [])
              .concat()
              .sort(compareClimateHvacModes);
            featureCustomiseHvacModes.hvac_modes = ordererHvacModes;
          } else if (config.hvac_modes !== undefined) {
            featureCustomiseHvacModes.hvac_modes = config.hvac_modes;
          }
        }
      }

      config = deleteKey(config, "customise_hvac_modes").result;
      config = deleteKey(config, "hvac_modes").result;

      fireEvent(this, "config-changed", { config });
    }
  }

  private _convertSegmentsHandler(gauge: string) {
    return () => this._convertSegments(gauge);
  }

  private _convertSegments(gauge: string) {
    let config: any = this.config;

    const inner = gauge === "main" ? "" : "inner.";
    const segments = gauge === "main" ? config.segments : config.inner.segments;

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

  private _addSegmentHandler(gauge: "main" | "inner") {
    return () => this._addSegment(gauge);
  }

  private _addSegment(gauge: "main" | "inner"): void {
    let config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
    const segments = gauge === "main" ? config.segments : config.inner.segments;

    if (!segments) {
      config = trySetValue(
        config,
        `${gauge === "main" ? "" : "inner."}segments`,
        [{ pos: 100, color: "var(--info-color)" }],
        true
      ).result;
    } else {
      // Source - https://stackoverflow.com/a
      // Posted by Bill the Lizard, modified by community. See post 'Timeline' for change history
      // Retrieved 2026-01-10, License - CC BY-SA 3.0

      const randomColor = "#000000".replace(/0/g, function () {
        return (~~(Math.random() * 16)).toString(16);
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
    }

    fireEvent(this, "config-changed", { config });
  }

  private _deleteSegmentHandler(gauge: "main" | "inner", index: number) {
    return () => this._deleteSegment(gauge, index);
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

  private _sortSegmentsHandler(gauge: "main" | "inner") {
    return () => this._sortSegments(gauge);
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

  private _addAdjustTemperatureControl() {
    this._addFeature({ type: "adjust-temperature" });
  }

  private _addClimateHvacModesControl() {
    this._addFeature({ type: "climate-hvac-modes" });
  }

  private _addFeature(feature) {
    let config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
    const current_features = config.features ?? [];
    config = trySetValue(
      config,
      "features",
      [...current_features, ...[feature]],
      true,
      true
    ).result;
    fireEvent(this, "config-changed", { config });
  }

  private _deleteAdjustTemperatureControlHandler() {
    return () => this._deleteFeature("adjust-temperature");
  }

  private _deleteClimateHvacModesControlHandler() {
    return () => this._deleteFeature("climate-hvac-modes");
  }

  private _deleteFeature(feature: "adjust-temperature" | "climate-hvac-modes") {
    let config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
    const current_features = config.features ?? [];
    config.features = this.removeFeature(current_features, feature);
    fireEvent(this, "config-changed", { config });
  }

  static get styles() {
    return [
      css`
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
