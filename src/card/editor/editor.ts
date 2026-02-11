// External dependencies
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { assert } from "superstruct";
import { styleMap } from "lit/directives/style-map.js";
import { z } from "zod";

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

import { Feature } from "../config";
import { DEFAULT_GRADIENT_RESOLUTION, VERSION } from "../const";

// Editor utilities
import { headerSchema } from "./schemas/headerSchema";
import { entitiesSchema } from "./schemas/entitiesSchema";
import { iconsSchema as _iconsSchema, IconType } from "./schemas/iconsSchema";
import { interactionsSchema } from "./schemas/interactionsSchema";
import { titlesSchema } from "./schemas/titlesSchema";
import { valueTextsSchema } from "./schemas/valueTextsSchema";

import { mainGaugeSchema as _mainGaugeSchema } from "./schemas/mainGaugeSchema";
import { enableInnerSchema as _enableInnerSchema } from "./schemas/enableInnerSchema";
import { innerGaugeSchema as _innerGaugeSchema } from "./schemas/innerGaugeSchema";
import {
  featureEntitySchema,
  featuresAdjustTemperatureSchema as _featuresAdjustTemperatureSchema,
  featuresClimateFanModesSchema as _featuresClimateFanModesSchema,
  featuresClimateHvacModesSchema as _featuresClimateHvacModesSchema,
  featuresClimateOverviewSchema as _featuresClimateOverviewSchema,
  featuresClimateSwingModesSchema as _featuresClimateSwingModesSchema,
} from "./schemas/featuresSchema";

import { localize } from "../../utils/localize";

const tabs = ["general", "main_gauge", "inner_gauge"] as const;

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

  @state() private _currTab: (typeof tabs)[number] = "general";

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
              () => this._convertSegments(gauge)
            )
          : segmentsType === "pos"
            ? this.createButton(
                localize(this.hass!, "segments_alert.convert_to_from"),
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

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const config = {
      enable_inner: this.config?.inner !== undefined,
      hvac_style: hasFeature(this.config!, "climate-hvac-modes")
        ? (getFeature(this.config!, "climate-hvac-modes")?.style ?? "icons")
        : undefined,
      customise_hvac_modes:
        getFeature(this.config!, "climate-hvac-modes")?.hvac_modes !==
        undefined,
      hvac_modes: getFeature(this.config!, "climate-hvac-modes")?.hvac_modes,
      fan_style: hasFeature(this.config!, "climate-fan-modes")
        ? (getFeature(this.config!, "climate-fan-modes")?.style ?? "icons")
        : undefined,
      customise_fan_modes:
        getFeature(this._config!, "climate-fan-modes")?.fan_modes !== undefined,
      fan_modes: getFeature(this._config!, "climate-fan-modes")?.fan_modes,
      swing_style: hasFeature(this.config!, "climate-swing-modes")
        ? (getFeature(this.config!, "climate-swing-modes")?.style ?? "icons")
        : undefined,
      customise_swing_modes:
        getFeature(this.config!, "climate-swing-modes")?.swing_modes !==
        undefined,
      swing_modes: getFeature(this.config!, "climate-swing-modes")?.swing_modes,
      ...this._config,
    };

    return html` <ha-tab-group @wa-tab-show=${this._handleTabChanged}>
        ${tabs.map(
          (tab) => html`
            <ha-tab-group-tab
              slot="nav"
              .active=${this._currTab === tab}
              panel=${tab}
            >
              ${localize(this.hass!, tab)}
            </ha-tab-group-tab>
          `
        )}
      </ha-tab-group>
      ${this._currTab === "general"
        ? this._renderGeneralTab(this.hass, config)
        : nothing}
      ${this._currTab === "main_gauge"
        ? this._renderMainGaugeTab(this.hass, config)
        : nothing}
      ${this._currTab === "inner_gauge"
        ? this._renderInnerGaugeTab(this.hass, config)
        : nothing}

      <ha-form-constant
        .label=${`${localize(this.hass!, "thanks_for_using_gcp")} (v${VERSION})`}
        .schema=${{ value: undefined }}
        style="text-align: center; margin-bottom: 16px;"
      >
      </ha-form-constant>`;
  }

  private _renderGeneralTab(
    hass: HomeAssistant,
    config: GaugeCardProCardConfig
  ) {
    const iconLeftType = <IconType>config.icons?.left?.type ?? undefined;
    const iconRightType = <IconType>config.icons?.right?.type ?? undefined;
    const iconsSchema = _iconsSchema(hass, iconLeftType, iconRightType);

    const featureEntity =
      config.feature_entity !== undefined
        ? config.feature_entity
        : this.config?.entity?.startsWith("climate")
          ? this.config.entity
          : undefined;

    const usedFeatures = {
      adjust_temperature: hasFeature(config, "adjust-temperature"),
      climate_fan_modes: hasFeature(config, "climate-fan-modes"),
      climate_hvac_modes: hasFeature(config, "climate-hvac-modes"),
      climate_overview: hasFeature(config, "climate-overview"),
      climate_swing_modes: hasFeature(config, "climate-swing-modes"),
    };

    const featureEntityStateObj = featureEntity
      ? hass.states[featureEntity]
      : undefined;

    const hasFeatureEntity = featureEntityStateObj !== undefined;

    const featuresClimateOverviewSchema = _featuresClimateOverviewSchema();

    const featuresAdjustTemperatureSchema = _featuresAdjustTemperatureSchema();

    const featureCustomizeFanModes = usedFeatures.climate_fan_modes
      ? config.features?.find((f) => f.type === "climate-fan-modes")
          ?.fan_modes !== undefined
      : false;
    const featuresClimateFanModesSchema = _featuresClimateFanModesSchema(
      hass,
      hass.formatEntityState,
      featureEntityStateObj,
      featureCustomizeFanModes
    );

    const featureCustomizeHvacModes = usedFeatures.climate_hvac_modes
      ? config.features?.find((f) => f.type === "climate-hvac-modes")
          ?.hvac_modes !== undefined
      : false;
    const featuresClimateHvacModesSchema = _featuresClimateHvacModesSchema(
      hass,
      hass.formatEntityState,
      featureEntityStateObj,
      featureCustomizeHvacModes
    );

    const featureCustomizeSwingModes = usedFeatures.climate_swing_modes
      ? config.features?.find((f) => f.type === "climate-swing-modes")
          ?.swing_modes !== undefined
      : false;
    const featuresClimateSwingModesSchema = _featuresClimateSwingModesSchema(
      hass,
      hass.formatEntityState,
      featureEntityStateObj,
      featureCustomizeSwingModes
    );

    const mergedSchemas = [
      ...headerSchema,
      ...entitiesSchema,
      ...titlesSchema,
      ...valueTextsSchema,
      ...iconsSchema,
      ...interactionsSchema,
    ];

    return html` ${this.createHAForm(config, mergedSchemas, true)}
      <ha-expansion-panel
        class="expansion-panel"
        outlined
        .header="${localize(hass, "features")}"
      >
        <ha-icon slot="leading-icon" icon="mdi:list-box"></ha-icon>
        <div class="content">
          ${this.createHAForm(config, featureEntitySchema, true)}
          ${hasFeatureEntity && usedFeatures.climate_overview
            ? html` <ha-expansion-panel
                class="expansion-panel"
                outlined
                expanded
                .header="${localize(hass, "climate_overview")}"
              >
                <ha-icon slot="leading-icon" icon="mdi:glasses"></ha-icon>
                <div class="content">
                  ${this.createHAForm(config, featuresClimateOverviewSchema)}
                </div>
                <div class="button-bottom">
                  ${this.createButton(
                    localize(hass, "delete_feature"),
                    () => this._deleteFeature("climate-overview"),
                    "mdi:trash-can",
                    "small",
                    "danger",
                    "plain"
                  )}
                </div>
              </ha-expansion-panel>`
            : nothing}
          ${hasFeatureEntity && usedFeatures.adjust_temperature
            ? html` <ha-expansion-panel
                class="expansion-panel"
                outlined
                expanded
                .header="${localize(hass, "adjust_temperature")}"
              >
                <ha-icon slot="leading-icon" icon="mdi:thermometer"></ha-icon>
                <div class="content">
                  ${this.createHAForm(config, featuresAdjustTemperatureSchema)}
                </div>
                <div class="button-bottom">
                  ${this.createButton(
                    localize(hass, "delete_feature"),
                    () => this._deleteFeature("adjust-temperature"),
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
                .header="${localize(hass, "climate_hvac_modes")}"
              >
                <ha-icon slot="leading-icon" icon="mdi:hvac"></ha-icon>
                <div class="content">
                  ${this.createHAForm(config, featuresClimateHvacModesSchema)}
                </div>
                <div class="button-bottom">
                  ${this.createButton(
                    localize(hass, "delete_feature"),
                    () => this._deleteFeature("climate-hvac-modes"),
                    "mdi:trash-can",
                    "small",
                    "danger",
                    "plain"
                  )}
                </div>
              </ha-expansion-panel>`
            : nothing}
          ${hasFeatureEntity && usedFeatures.climate_fan_modes
            ? html` <ha-expansion-panel
                class="expansion-panel"
                outlined
                expanded
                .header="${localize(hass, "climate_fan_modes")}"
              >
                <ha-icon slot="leading-icon" icon="mdi:fan"></ha-icon>
                <div class="content">
                  ${this.createHAForm(config, featuresClimateFanModesSchema)}
                </div>
                <div class="button-bottom">
                  ${this.createButton(
                    localize(hass, "delete_feature"),
                    () => this._deleteFeature("climate-fan-modes"),
                    "mdi:trash-can",
                    "small",
                    "danger",
                    "plain"
                  )}
                </div>
              </ha-expansion-panel>`
            : nothing}
          ${hasFeatureEntity && usedFeatures.climate_swing_modes
            ? html` <ha-expansion-panel
                class="expansion-panel"
                outlined
                expanded
                .header="${localize(hass, "climate_swing_modes")}"
              >
                <ha-icon
                  slot="leading-icon"
                  icon="mdi:arrow-oscillating"
                ></ha-icon>
                <div class="content">
                  ${this.createHAForm(config, featuresClimateSwingModesSchema)}
                </div>
                <div class="button-bottom">
                  ${this.createButton(
                    localize(this.hass!, "delete_feature"),
                    () => this._deleteFeature("climate-swing-modes"),
                    "mdi:trash-can",
                    "small",
                    "danger",
                    "plain"
                  )}
                </div>
              </ha-expansion-panel>`
            : nothing}
          ${hasFeatureEntity
            ? html` <ha-dropdown @wa-select=${this._addFeature}>
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
                  ${localize(hass, "add_feature")}
                </ha-button>
                ${(
                  usedFeatures.climate_overview &&
                  usedFeatures.adjust_temperature &&
                  usedFeatures.climate_hvac_modes &&
                  usedFeatures.climate_fan_modes &&
                  usedFeatures.climate_swing_modes
                )
                  ? html` <ha-dropdown-item>
                      <ha-icon
                        icon="mdi:minus-box-outline"
                        slot="icon"
                      ></ha-icon>
                      ${localize(hass, "no_items_available")}
                    </ha-dropdown-item>`
                  : nothing}
                ${!usedFeatures.climate_overview
                  ? html` <ha-dropdown-item value="climate-overview">
                      <ha-icon icon="mdi:glasses" slot="icon"></ha-icon>
                      ${localize(hass, "climate_overview")}
                    </ha-dropdown-item>`
                  : nothing}
                ${!usedFeatures.adjust_temperature
                  ? html` <ha-dropdown-item value="adjust-temperature">
                      <ha-icon icon="mdi:thermometer" slot="icon"></ha-icon>
                      ${localize(hass, "adjust_temperature")}
                    </ha-dropdown-item>`
                  : nothing}
                ${!usedFeatures.climate_hvac_modes
                  ? html` <ha-dropdown-item value="climate-hvac-modes">
                      <ha-icon icon="mdi:hvac" slot="icon"></ha-icon>
                      ${localize(hass, "climate_hvac_modes")}
                    </ha-dropdown-item>`
                  : nothing}
                ${!usedFeatures.climate_fan_modes
                  ? html` <ha-dropdown-item value="climate-fan-modes">
                      <ha-icon icon="mdi:fan" slot="icon"></ha-icon>
                      ${localize(hass, "climate_fan_modes")}
                    </ha-dropdown-item>`
                  : nothing}
                ${!usedFeatures.climate_swing_modes
                  ? html` <ha-dropdown-item value="climate-swing-modes">
                      <ha-icon icon="mdi:arrow-oscillating" slot="icon"></ha-icon>
                      ${localize(hass, "climate_swing_modes")}
                    </ha-dropdown-item>`
                  : nothing}
              </ha-dropdown>`
            : nothing}
        </div>
      </ha-expansion-panel>`;
  }

  private _renderMainGaugeTab(
    hass: HomeAssistant,
    config: GaugeCardProCardConfig
  ) {
    //-----------------------------------------------------------------------------
    // MAIN GAUGE
    //-----------------------------------------------------------------------------
    const mainIsSeverity = config.needle !== true;

    const _mainSegments = config.segments;
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

    const _mainHasGradient = config.gradient === true;
    const showMainConvertAlert =
      (mainSegmentType === "from" || mainSegmentType === "pos") &&
      _mainHasGradient;

    const showMainGradientOptions = _mainSegments != null;
    const showMainColorInterpolationNote =
      showMainGradientOptions && !config.needle && !config.gradient
        ? "off"
        : showMainGradientOptions && !config.needle && config.gradient
          ? "on"
          : "none";
    const showMainGradientResolution =
      (showMainGradientOptions && config.needle && config.gradient) ?? false;

    const showMainSeverityGaugeOptions =
      _mainSegments != null && !config.needle;
    const showMainGradientBackgroundResolution =
      config.gradient_background ?? false;

    const showMainMinMaxIndicatorOptions = config.needle === true;

    const mainMinIndicatorType = config.min_indicator?.type ?? undefined;
    const hasMainMinIndicatorLabel = config.min_indicator?.label ?? false;

    const mainMaxIndicatorType = config.max_indicator?.type ?? undefined;
    const hasMainMaxIndicatorLabel = config.max_indicator?.label ?? false;

    const mainSetpointType = config.setpoint?.type ?? undefined;
    const hasMainSetpointLabel = config.setpoint?.label ?? false;

    const mainGaugeSchema = _mainGaugeSchema(
      hass,
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

    return html` <div class="content">
      ${showMainSegmentsPanel
        ? html`<ha-expansion-panel
            class="expansion-panel"
            outlined
            expanded
            .header="${localize(hass, "segments")}"
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
                localize(hass, "add_segment"),
                () => this._addSegment("main"),
                "mdi:plus",
                "small",
                "brand",
                "filled"
              )}
              ${showMainSortSegmentsButton
                ? this.createButton(
                    localize(hass, "sort"),
                    () => this._sortSegments("main"),
                    "mdi:sort",
                    "small",
                    "neutral",
                    "plain"
                  )
                : nothing}
            </div>
          </ha-expansion-panel>`
        : nothing}
      ${this.createHAForm(config, mainGaugeSchema, true)}
    </div>`;
  }

  private _renderInnerGaugeTab(
    hass: HomeAssistant,
    config: GaugeCardProCardConfig
  ) {
    //-----------------------------------------------------------------------------
    // INNER GAUGE
    //-----------------------------------------------------------------------------

    const enableInnerSchema = _enableInnerSchema();

    const enabelInner = config.inner !== undefined;

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
      const innerSegments = config.inner!.segments;
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

      _innerHasGradient = config.inner!.gradient === true;
      showInnerConvertAlert = innerSegmentsType !== "none" && _innerHasGradient;

      const inner_mode = config.inner?.mode ?? "severity";
      innerIsSeverity = inner_mode === "severity";
      showInnerGradientOptions =
        ["severity", "static", "needle"].includes(inner_mode) &&
        innerSegments != null;
      showInnerColorInterpolationNote =
        showInnerGradientOptions &&
        ["severity"].includes(inner_mode) &&
        !config.inner?.gradient
          ? "off"
          : showInnerGradientOptions &&
              ["severity"].includes(inner_mode) &&
              config.inner?.gradient
            ? "on"
            : "none";
      showInnerGradientResolution = ["static", "needle"].includes(inner_mode);
      showInnerGradientBackgroundOptions =
        innerSegments != null && inner_mode === "severity";
      showInnerGradientBackgroundResolution =
        config.inner?.gradient_background ?? false;

      showInnerMinMaxIndicatorOptions = inner_mode !== "severity";

      innerMinIndicatorType = config.inner?.min_indicator?.type ?? undefined;
      innerMaxIndicatorType = config.inner?.max_indicator?.type ?? undefined;
      innerSetpointType = config.inner?.setpoint?.type ?? undefined;

      innerGaugeSchema = _innerGaugeSchema(
        hass,
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

    return html`
      ${this.createHAForm(config, enableInnerSchema)}
      ${enabelInner
        ? html` <div class="content">
            ${showInnerSegmentsPanel!
              ? html` <ha-expansion-panel
                  class="expansion-panel"
                  outlined
                  expanded
                  .header="${localize(hass, "segments")}"
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
                      localize(hass, "add_segment"),
                      () => this._addSegment("inner"),
                      "mdi:plus",
                      "small",
                      "brand",
                      "filled"
                    )}
                    ${showInnerSortSegmentsButton!
                      ? this.createButton(
                          localize(hass, "sort"),
                          () => this._sortSegments("inner"),
                          "mdi:sort",
                          "small",
                          "neutral",
                          "plain"
                        )
                      : nothing}
                  </div>
                </ha-expansion-panel>`
              : nothing}
            ${this.createHAForm(config, innerGaugeSchema, true)}
          </div>`
        : nothing}
    `;
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
          if (config.hvac_style !== undefined) {
            featureCustomiseHvacModes.style = config.hvac_style;
            config = deleteKey(config, "hvac_style").result;
          }
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

      if (hasFeature(config, "climate-fan-modes")) {
        let featureCustomiseFanModes = getFeature(config, "climate-fan-modes");
        if (featureCustomiseFanModes) {
          if (config.fan_style !== undefined) {
            featureCustomiseFanModes.style = config.fan_style;
            config = deleteKey(config, "fan_style").result;
          }
          if (config.customise_fan_modes !== true) {
            delete featureCustomiseFanModes.fan_modes;
            config = deleteKey(config, "customise_fan_modes").result;
            config = deleteKey(config, "fan_modes").result;
          } else if (
            config.customise_fan_modes === true &&
            !featureCustomiseFanModes.fan_modes
          ) {
            const stateObj = config.feature_entity
              ? this.hass!.states[config.feature_entity]
              : undefined;
            const fanModes = (stateObj?.attributes.fan_modes || []).concat();
            featureCustomiseFanModes.fan_modes = fanModes;
          } else if (config.fan_modes !== undefined) {
            featureCustomiseFanModes.fan_modes = config.fan_modes;
          }
        }
      }
      config = deleteKey(config, "customise_fan_modes").result;
      config = deleteKey(config, "fan_modes").result;

      if (hasFeature(config, "climate-swing-modes")) {
        let featureCustomiseSwingModes = getFeature(
          config,
          "climate-swing-modes"
        );
        if (featureCustomiseSwingModes) {
          if (config.swing_style !== undefined) {
            featureCustomiseSwingModes.style = config.swing_style;
            config = deleteKey(config, "swing_style").result;
          }
          if (config.customise_swing_modes !== true) {
            delete featureCustomiseSwingModes.swing_modes;
            config = deleteKey(config, "customise_swing_modes").result;
            config = deleteKey(config, "swing_modes").result;
          } else if (
            config.customise_swing_modes === true &&
            !featureCustomiseSwingModes.swing_modes
          ) {
            const stateObj = config.feature_entity
              ? this.hass!.states[config.feature_entity]
              : undefined;
            const swingModes = (
              stateObj?.attributes.swing_modes || []
            ).concat();
            featureCustomiseSwingModes.swing_modes = swingModes;
          } else if (config.swing_modes !== undefined) {
            featureCustomiseSwingModes.swing_modes = config.swing_modes;
          }
        }
      }
      config = deleteKey(config, "customise_swing_modes").result;
      config = deleteKey(config, "swing_modes").result;

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
      [...current_features, ...[{ type: feature }]],
      true,
      true
    ).result;
    fireEvent(this, "config-changed", { config });
  }

  private _deleteFeature(
    feature:
      | "adjust-temperature"
      | "climate-fan-modes"
      | "climate-hvac-modes"
      | "climate-overview"
      | "climate-swing-modes"
  ) {
    let config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
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
