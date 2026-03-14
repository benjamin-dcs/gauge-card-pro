import { html, HTMLTemplateResult, nothing } from "lit";
import { getFeature, hasFeature } from "../../utils/object/features";
import type { IconType } from "./generalSchemas";
import {
  headerSchema,
  entitiesSchema,
  iconsSchema as _iconsSchema,
  interactionsSchema,
  titlesSchema,
  valueTextsSchema,
  featureEntitySchema,
  featuresAdjustTemperatureSchema as _featuresAdjustTemperatureSchema,
  featuresClimateFanModesSchema as _featuresClimateFanModesSchema,
  featuresClimateHvacModesSchema as _featuresClimateHvacModesSchema,
  featuresClimateOverviewSchema as _featuresClimateOverviewSchema,
  featuresClimatePresetModesSchema as _featuresClimatePresetModesSchema,
  featuresClimateSwingModesSchema as _featuresClimateSwingModesSchema,
} from "./generalSchemas";
import type { EditorRenderContext } from "../../card/types";
import { localize } from "../../utils/localize";

export function renderGeneralTab(ctx: EditorRenderContext, config) {
  const hass = ctx.hass;
  const lang = hass.locale.language;

  const iconLeftType = <IconType>config.icons?.left?.type ?? undefined;
  const iconRightType = <IconType>config.icons?.right?.type ?? undefined;
  const iconsSchema = _iconsSchema(lang, iconLeftType, iconRightType);

  const featureEntity =
    config.feature_entity !== undefined
      ? config.feature_entity
      : config?.entity?.startsWith("climate")
        ? config.entity
        : undefined;

  const usedFeatures = {
    adjust_temperature: hasFeature(config, "adjust-temperature"),
    climate_fan_modes: hasFeature(config, "climate-fan-modes"),
    climate_hvac_modes: hasFeature(config, "climate-hvac-modes"),
    climate_overview: hasFeature(config, "climate-overview"),
    climate_preset_modes: hasFeature(config, "climate-preset-modes"),
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
    lang,
    featureEntityStateObj,
    featureCustomizeFanModes
  );

  const featureCustomizeHvacModes = usedFeatures.climate_hvac_modes
    ? config.features?.find((f) => f.type === "climate-hvac-modes")
        ?.hvac_modes !== undefined
    : false;
  const featuresClimateHvacModesSchema = _featuresClimateHvacModesSchema(
    lang,
    featureEntityStateObj,
    featureCustomizeHvacModes
  );

  const featureCustomizeSwingModes = usedFeatures.climate_swing_modes
    ? // ? config.features?.find((f) => f.type === "climate-swing-modes")
      //     ?.swing_modes !== undefined
      // : false;
      getFeature(config, "climate-swing-modes")?.swing_modes !== undefined
    : false;
  const featuresClimateSwingModesSchema = _featuresClimateSwingModesSchema(
    lang,
    featureEntityStateObj,
    featureCustomizeSwingModes
  );

  const featureCustomizePresetModes = usedFeatures.climate_preset_modes
    ? config.features?.find((f) => f.type === "climate-preset-modes")
        ?.preset_modes !== undefined
    : false;
  const featuresClimatePresetModesSchema = _featuresClimatePresetModesSchema(
    lang,
    featureEntityStateObj,
    featureCustomizePresetModes
  );

  const mergedSchemas = [
    ...headerSchema,
    ...entitiesSchema,
    ...titlesSchema,
    ...valueTextsSchema,
    ...iconsSchema,
    ...interactionsSchema,
  ];

  return html` ${ctx.createHAForm(config, mergedSchemas, true)}
    <ha-expansion-panel
      class="expansion-panel"
      outlined
      .header="${localize(lang, "features")}"
    >
      <ha-icon slot="leading-icon" icon="mdi:list-box"></ha-icon>
      <div class="content">
        ${ctx.createHAForm(config, featureEntitySchema, true)}
        ${hasFeatureEntity && usedFeatures.climate_overview
          ? html` <ha-expansion-panel
              class="expansion-panel"
              outlined
              expanded
              .header="${localize(lang, "climate_overview")}"
            >
              <ha-icon slot="leading-icon" icon="mdi:glasses"></ha-icon>
              <div class="content">
                ${ctx.createHAForm(config, featuresClimateOverviewSchema)}
              </div>
              <div class="button-bottom">
                ${ctx.createButton(
                  localize(lang, "delete_feature"),
                  () => ctx.deleteFeature("climate-overview"),
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
              .header="${localize(lang, "adjust_temperature")}"
            >
              <ha-icon slot="leading-icon" icon="mdi:thermometer"></ha-icon>
              <div class="content">
                ${ctx.createHAForm(config, featuresAdjustTemperatureSchema)}
              </div>
              <div class="button-bottom">
                ${ctx.createButton(
                  localize(lang, "delete_feature"),
                  () => ctx.deleteFeature("adjust-temperature"),
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
              .header="${localize(lang, "climate_hvac_modes")}"
            >
              <ha-icon slot="leading-icon" icon="mdi:hvac"></ha-icon>
              <div class="content">
                ${ctx.createHAForm(config, featuresClimateHvacModesSchema)}
              </div>
              <div class="button-bottom">
                ${ctx.createButton(
                  localize(lang, "delete_feature"),
                  () => ctx.deleteFeature("climate-hvac-modes"),
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
              .header="${localize(lang, "climate_fan_modes")}"
            >
              <ha-icon slot="leading-icon" icon="mdi:fan"></ha-icon>
              <div class="content">
                ${ctx.createHAForm(config, featuresClimateFanModesSchema)}
              </div>
              <div class="button-bottom">
                ${ctx.createButton(
                  localize(lang, "delete_feature"),
                  () => ctx.deleteFeature("climate-fan-modes"),
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
              .header="${localize(lang, "climate_swing_modes")}"
            >
              <ha-icon
                slot="leading-icon"
                icon="mdi:arrow-oscillating"
              ></ha-icon>
              <div class="content">
                ${ctx.createHAForm(config, featuresClimateSwingModesSchema)}
              </div>
              <div class="button-bottom">
                ${ctx.createButton(
                  localize(lang, "delete_feature"),
                  () => ctx.deleteFeature("climate-swing-modes"),
                  "mdi:trash-can",
                  "small",
                  "danger",
                  "plain"
                )}
              </div>
            </ha-expansion-panel>`
          : nothing}
        ${hasFeatureEntity && usedFeatures.climate_preset_modes
          ? html` <ha-expansion-panel
              class="expansion-panel"
              outlined
              expanded
              .header="${localize(lang, "climate_preset_modes")}"
            >
              <ha-icon
                slot="leading-icon"
                icon="mdi:play-circle-outline"
              ></ha-icon>
              <div class="content">
                ${ctx.createHAForm(config, featuresClimatePresetModesSchema)}
              </div>
              <div class="button-bottom">
                ${ctx.createButton(
                  localize(lang, "delete_feature"),
                  () => ctx.deleteFeature("climate-preset-modes"),
                  "mdi:trash-can",
                  "small",
                  "danger",
                  "plain"
                )}
              </div>
            </ha-expansion-panel>`
          : nothing}
        ${hasFeatureEntity
          ? html` <ha-dropdown @wa-select=${ctx.addFeature}>
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
                ${localize(lang, "add_feature")}
              </ha-button>
              ${renderFeatureItems(usedFeatures, lang)}
            </ha-dropdown>`
          : nothing}
      </div>
    </ha-expansion-panel>`;
}

function renderFeatureItems(
  usedFeatures: {
    adjust_temperature: boolean;
    climate_fan_modes: boolean;
    climate_hvac_modes: boolean;
    climate_overview: boolean;
    climate_preset_modes: boolean;
    climate_swing_modes: boolean;
  },
  lang: string
): HTMLTemplateResult {
  return html`
    ${usedFeatures.climate_overview &&
    usedFeatures.adjust_temperature &&
    usedFeatures.climate_hvac_modes &&
    usedFeatures.climate_fan_modes &&
    usedFeatures.climate_swing_modes &&
    usedFeatures.climate_preset_modes
      ? html` <ha-dropdown-item>
          <ha-icon icon="mdi:minus-box-outline" slot="icon"></ha-icon>
          ${localize(lang, "no_items_available")}
        </ha-dropdown-item>`
      : nothing}
    ${!usedFeatures.climate_overview
      ? html` <ha-dropdown-item value="climate-overview">
          <ha-icon icon="mdi:glasses" slot="icon"></ha-icon>
          ${localize(lang, "climate_overview")}
        </ha-dropdown-item>`
      : nothing}
    ${!usedFeatures.adjust_temperature
      ? html` <ha-dropdown-item value="adjust-temperature">
          <ha-icon icon="mdi:thermometer" slot="icon"></ha-icon>
          ${localize(lang, "adjust_temperature")}
        </ha-dropdown-item>`
      : nothing}
    ${!usedFeatures.climate_hvac_modes
      ? html` <ha-dropdown-item value="climate-hvac-modes">
          <ha-icon icon="mdi:hvac" slot="icon"></ha-icon>
          ${localize(lang, "climate_hvac_modes")}
        </ha-dropdown-item>`
      : nothing}
    ${!usedFeatures.climate_fan_modes
      ? html` <ha-dropdown-item value="climate-fan-modes">
          <ha-icon icon="mdi:fan" slot="icon"></ha-icon>
          ${localize(lang, "climate_fan_modes")}
        </ha-dropdown-item>`
      : nothing}
    ${!usedFeatures.climate_swing_modes
      ? html` <ha-dropdown-item value="climate-swing-modes">
          <ha-icon icon="mdi:arrow-oscillating" slot="icon"></ha-icon>
          ${localize(lang, "climate_swing_modes")}
        </ha-dropdown-item>`
      : nothing}
    ${!usedFeatures.climate_preset_modes
      ? html` <ha-dropdown-item value="climate-preset-modes">
          <ha-icon icon="mdi:format-list-bulleted" slot="icon"></ha-icon>
          ${localize(lang, "climate_preset_modes")}
        </ha-dropdown-item>`
      : nothing}
  `;
}
