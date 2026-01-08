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

// Schemas
import {
  entitiesSchema as _entitiesSchema,
  mainGaugeSchema as _mainGaugeSchema,
  enableInnerSchema as _enableInnerSchema,
  innerGaugeSchema as _innerGaugeSchema,
  cardFeaturesSchema as _cardFeaturesSchema,
  localize,
} from "./schemas";

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
    return localize(this.hass, schema.name);
  };

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

  private createSegmentPanel(
    gauge: "main" | "inner",
    type: "from" | "pos",
    segment,
    index: number
  ) {
    return html`                        
      <ha-expansion-panel
        class="segment-expansion-panel"
        outlined
        .header=${type === "from" ? `From: ${segment.from}` : `Pos: ${segment.pos}`}
      >
        
        <ha-icon 
          slot="leading-icon" 
          icon="mdi:square" 
          style=${styleMap({ "--icon-primary-color": segment.color })}
        ></ha-icon>

        <div class="segment-fields">
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

        <div class="editor-section button-section">
          <ha-button
            class="segment-button"
            size="small"
            @click=${this._deleteSegmentHandler(gauge, index)}
          >
            <ha-icon icon="mdi:trash-can"></ha-icon>
            ${localize(this.hass, "delete_segment")}
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
    const main_from_segments = z
      .array(GaugeSegmentSchemaFrom)
      .safeParse(this._config.segments);
    const main_pos_segments = z
      .array(GaugeSegmentSchemaPos)
      .safeParse(this._config.segments);
    const main_segments_type = main_from_segments.success
      ? "from"
      : main_pos_segments.success
        ? "pos"
        : "none";

    const showMainGradientOptions = this._config.segments != null;
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
      this._config.segments != null && !this._config.needle;
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

    let inner_segments_type: string | undefined;
    let inner_from_segments;
    let inner_pos_segments;
    let showInnerGradientOptions: boolean | undefined;
    let showInnerColorInterpolationNote: "none" | "off" | "on";
    let showInnerGradientResolution: boolean;
    let showInnerGradientBackgroundOptions: boolean;
    let showInnerGradientBackgroundResolution: boolean;
    let showInnerMinMaxIndicatorOptions: boolean;
    let innerMinIndicatorType: string | undefined;
    let innerMaxIndicatorType: string | undefined;
    let innerSetpointType: string | undefined;

    if (enabelInner) {
      inner_from_segments = z
        .array(GaugeSegmentSchemaFrom)
        .safeParse(this._config.inner?.segments);
      inner_pos_segments = z
        .array(GaugeSegmentSchemaPos)
        .safeParse(this._config.inner?.segments);
      inner_segments_type = inner_from_segments.success
        ? "from"
        : inner_pos_segments.success
          ? "pos"
          : "none";

      const inner_mode = this._config.inner?.mode ?? "severity";
      showInnerGradientOptions =
        ["severity", "static", "needle"].includes(inner_mode) &&
        this._config.inner?.segments != null;
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
        this._config.inner?.segments != null && inner_mode === "severity";
      showInnerGradientBackgroundResolution =
        this._config.inner?.gradient_background ?? false;

      showInnerMinMaxIndicatorOptions = inner_mode !== "severity";

      innerMinIndicatorType =
        this._config.inner?.min_indicator?.type ?? undefined;
      innerMaxIndicatorType =
        this._config.inner?.max_indicator?.type ?? undefined;
      innerSetpointType = this._config.inner?.setpoint?.type ?? undefined;
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
    const innerGaugeSchema = enabelInner
      ? _innerGaugeSchema(
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
        )
      : undefined;
    const cardFeaturesSchema = _cardFeaturesSchema(this.hass, iconType);

    return html` <ha-form
        class="editor-form"
        .hass=${this.hass}
        .data=${config}
        .schema=${entitiesSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>

      <ha-expansion-panel
        class="expansion-panel"
        outlined
        expanded
        .header="${localize(this.hass, "main_gauge")}"
      >
        <ha-icon slot="leading-icon" icon="mdi:gauge"></ha-icon>
        <div class="content">
          ${main_segments_type !== "none" &&
          (showMainGradientResolution ||
            showMainColorInterpolationNote === "on")
            ? html`
                <ha-expansion-panel
                  class="expansion-panel"
                  outlined
                  expanded
                  .header="${localize(this.hass, "segments")}"
                >
                  <ha-icon slot="leading-icon" icon="mdi:segment"></ha-icon>

                  <ha-alert
                    alert-type="info"
                    class="inner-alert"
                    .title=${localize(this.hass, "segments_alert.title")}
                  >
                    <div>
                      ${localize(
                        this.hass,
                        "segments_alert.description." + main_segments_type
                      )}
                    </div>

                    <div class="actions">
                      ${main_segments_type === "from"
                        ? html` <ha-button
                            size="small"
                            @click=${this._convertSegmentsHandler("main")}
                          >
                            ${localize(
                              this.hass,
                              "segments_alert.convert_to_pos"
                            )}
                          </ha-button>`
                        : nothing}
                      ${main_segments_type === "pos"
                        ? html`<ha-button
                            size="small"
                            @click=${this._convertSegmentsHandler("main")}
                          >
                            ${localize(
                              this.hass,
                              "segments_alert.convert_to_from"
                            )}
                          </ha-button>`
                        : nothing}
                    </div>
                  </ha-alert>
                  ${main_segments_type === "from"
                    ? html`${main_from_segments.data!.map((segment, index) => {
                        return this.createSegmentPanel(
                          "main",
                          "from",
                          segment,
                          index
                        );
                      })}`
                    : main_segments_type === "pos"
                      ? html`${main_pos_segments.data!.map((segment, index) => {
                          return this.createSegmentPanel(
                            "main",
                            "pos",
                            segment,
                            index
                          );
                        })}`
                      : nothing}
                  ${main_segments_type === "from" ||
                  main_segments_type === "pos"
                    ? html` <ha-button
                        class="segment-button"
                        size="small"
                        @click=${this._addSegmentHandler("main")}
                      >
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${localize(this.hass, "add_segment")}
                      </ha-button>`
                    : nothing}
                </ha-expansion-panel>
              `
            : nothing}

          <ha-form
            class="editor-form"
            .hass=${this.hass}
            .data=${config}
            .schema=${mainGaugeSchema}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
      </ha-expansion-panel>

      <ha-form
        class="editor-form"
        .hass=${this.hass}
        .data=${config}
        .schema=${enableInnerSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>

      ${enabelInner
        ? html`
          <ha-expansion-panel 
            class="expansion-panel"
            outlined 
            expanded 
            .header="${localize(this.hass, "inner_gauge")}"
          >
            <ha-icon slot="leading-icon" icon="mdi:gauge"></ha-icon>
            <div class="content">

            ${
              inner_segments_type !== "none" &&
              (showInnerGradientResolution! ||
                showInnerColorInterpolationNote! === "on")
                ? html` <ha-expansion-panel
                    class="expansion-panel"
                    outlined
                    expanded
                    .header="${localize(this.hass, "segments")}"
                  >
                    <ha-icon slot="leading-icon" icon="mdi:segment"></ha-icon>

                    <ha-alert
                      alert-type="info"
                      class="inner-alert"
                      .title=${localize(this.hass, "segments_alert.title")}
                    >
                      <div>
                        ${localize(
                          this.hass,
                          "segments_alert.description." + inner_segments_type
                        )}
                      </div>

                      <div class="actions">
                        ${inner_segments_type === "from"
                          ? html`<ha-button
                              size="small"
                              @click=${this._convertSegmentsHandler("inner")}
                            >
                              ${localize(
                                this.hass,
                                "segments_alert.convert_to_pos"
                              )}
                            </ha-button>`
                          : nothing}
                        ${inner_segments_type === "pos"
                          ? html`<ha-button
                              size="small"
                              @click=${this._convertSegmentsHandler("inner")}
                            >
                              ${localize(
                                this.hass,
                                "segments_alert.convert_to_from"
                              )}
                            </ha-button>`
                          : nothing}
                      </div>
                    </ha-alert>

                    ${inner_segments_type === "from"
                      ? html`${inner_from_segments!.data!.map(
                          (segment, index) => {
                            return this.createSegmentPanel(
                              "inner",
                              "from",
                              segment,
                              index
                            );
                          }
                        )}`
                      : inner_segments_type === "pos"
                        ? html`${inner_pos_segments.data!.map(
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
                    ${inner_segments_type === "from" ||
                    inner_segments_type === "pos"
                      ? html` <ha-button
                          class="segment-button"
                          size="small"
                          @click=${this._addSegmentHandler("inner")}
                        >
                          <ha-icon icon="mdi:plus"></ha-icon>
                          ${localize(this.hass, "add_segment")}
                        </ha-button>`
                      : nothing}
                  </ha-expansion-panel>`
                : nothing
            }
               

                  <ha-form
                    class="inner-ha-form"
                    .hass=${this.hass}
                    .data=${config}
                    .schema=${innerGaugeSchema}
                    .computeLabel=${this._computeLabel}
                    @value-changed=${this._valueChanged}
                  ></ha-form>
                </ha-expansion-panel>
              </div>
          </ha-expansion-panel>`
        : nothing}

      <ha-form
        .hass=${this.hass}
        .data=${config}
        .schema=${cardFeaturesSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>`;
  }

  private _valueChanged(ev: CustomEvent): void {
    if (ev.type === "change") {
      if (!ev.target) return;
      const target = ev.target as HTMLInputElement | HTMLSelectElement;
      const name = target.getAttribute("name");
      if (!name) return;

      let config = <LovelaceCardConfig>this._config;
      if (name.startsWith("segments.")) {
        if (name.endsWith(".color")) {
          const value = target.value;
          config = trySetValue(config, name, value, false, true).result;
        } else if (name.endsWith(".from")) {
          const value = parseFloat(target.value);
          config = trySetValue(config, name, value, false, true).result;
        }
      } else if (name.startsWith("inner.segments.")) {
        if (name.endsWith(".color")) {
          const value = target.value;
          config = trySetValue(config, name, value, false, true).result;
        } else if (name.endsWith(".from")) {
          const value = parseFloat(target.value);
          config = trySetValue(config, name, value, false, true).result;
        }
      }

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

  private _addSegmentHandler(gauge: "main" | "inner") {
    return () => this._addSegment(gauge);
  }

  private _addSegment(gauge: "main" | "inner"): void {
    const config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
    const segments = 
      gauge === "main" ? config.segments : config.inner.segments;

    if (!segments) return;

    console.log(segments)

    const isFrom = z
      .array(GaugeSegmentSchemaFrom)
      .safeParse(segments).success
    if (isFrom) {
      segments.push({ from: 100, color: "var(--info-color)" });
    } else {
      const isPos = z
        .array(GaugeSegmentSchemaPos)
        .safeParse(segments).success
      if (isPos) {
        segments.push({ pos: 100, color: "var(--info-color)" });
      }
    }

    fireEvent(this, "config-changed", { config });
  }

  private _deleteSegmentHandler(gauge: "main" | "inner", index: number) {
    return () => this._deleteSegment(gauge, index);
  }

  private _deleteSegment(gauge: "main" | "inner", index: number): void {
    const config = JSON.parse(JSON.stringify(this._config)); // deep clone so we don't mutate
    const segments = 
      gauge === "main" ? config.segments : config.inner.segments;
    segments.splice(index, 1)

    fireEvent(this, "config-changed", { config });
  }

  static get styles() {
    return [
      css`
        ha-form {
          display: block;
          margin-bottom: 24px;
        }
        .inner-ha-form {
          margin-bottom: 8px;
        }
        .editor-form {
          margin-bottom: 24px;
        }
        .expansion-panel {
          margin-bottom: 24px;
        }
        .segment-expansion-panel {
          margin-bottom: 12px;
          margin-left: 12px;
          margin-right: 12px;
        }
        .segment-fields {
          margin-top: 12px;
          margin-bottom: 12px;
          margin-left: 12px;
          margin-right: 12px;
        }
        .segment-textfield {
          width: 100%;
          margin-top: 12px;
        }
        .segment-button {
          margin-left: 12px;
          margin-bottom: 12px;
        }
        .inner-alert {
          margin-top: 12px;
          margin-left: 12px;
          margin-right: 12px;
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
