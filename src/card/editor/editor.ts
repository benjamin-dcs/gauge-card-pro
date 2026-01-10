// External dependencies
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { assert } from "superstruct";
import { styleMap } from "lit/directives/style-map.js";
import { z } from "zod";

// Internalized external dependencies
import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardEditor,
  fireEvent,
} from "../../dependencies/ha";

import { HaFormSchema, loadHaComponents } from "../../dependencies/mushroom";

// Local utilities
import { migrate_parameters } from "../../utils/migrate-parameters";
import { deleteKey } from "../../utils/object/delete-key";
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
import {
  entitiesSchema as _entitiesSchema,
  mainGaugeSchema as _mainGaugeSchema,
  enableInnerSchema as _enableInnerSchema,
  innerGaugeSchema as _innerGaugeSchema,
  cardFeaturesSchema as _cardFeaturesSchema,
} from "./schemas";
import { localize } from "./localize";

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
    if (type === "from") {
      for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i].from > arr[i + 1].from) {
              return false;
          }
      }
    } else if (type === "pos") {
      for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i].pos > arr[i + 1].pos) {
              return false;
          }
      }
    } else {
      return false
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

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    //-----------------------------------------------------------------------------
    // MAIN GAUGE
    //-----------------------------------------------------------------------------
    const mainIsSeverity = this._config.needle !== true;

    const _mainSegments = this._config.segments
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
        : _mainSegments !== undefined &&
            typeof _mainSegments === "string"
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

    const iconType = this._config.icon?.type ?? undefined;

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
      const innerSegments = this._config.inner!.segments
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
          : innerSegments !== undefined &&
              typeof innerSegments === "string"
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
    const cardFeaturesSchema = _cardFeaturesSchema(this.hass, iconType);

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
                      "plain")
                    : nothing
                  }
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
                        ?
                          this.createButton(
                          localize(this.hass, "sort"),
                          this._sortSegmentsHandler("inner"),
                          "mdi:sort",
                          "small",
                          "neutral",
                          "plain")
                        : nothing
                      }
                    </div>
                  </ha-expansion-panel>`
                : nothing}
              ${this.createHAForm(config, innerGaugeSchema)}
            </div>
          </ha-expansion-panel>`
        : nothing}
      ${this.createHAForm(config, cardFeaturesSchema)}`;
  }

  private _valueChanged(ev: CustomEvent): void {
    if (ev.type === "change") {
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
      const isFrom = z
        .array(GaugeSegmentSchemaFrom)
        .safeParse(segments).success;
      if (isFrom) {
        const lastFrom = segments.at(-1).from;
        segments.push({ from: lastFrom, color: "var(--info-color)" });
      } else {
        const isPos = z
          .array(GaugeSegmentSchemaPos)
          .safeParse(segments).success;
        if (isPos) {
          const lastPos = segments.at(-1).pos;
          segments.push({ pos: lastPos, color: "var(--info-color)" });
        }
      }
    }

    fireEvent(this, "config-changed", { config });
  }

  private _deleteSegmentHandler(gauge: "main" | "inner", index: number) {
    return () => this._deleteSegment(gauge, index);
  }

  private _deleteSegment(gauge: "main" | "inner", index: number): void {
    const config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
    const segments = gauge === "main" ? config.segments : config.inner.segments;
    segments.splice(index, 1);

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
