import type { TemplateResult } from "lit";
import { html, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { mdiChevronRight } from "@mdi/js";

import type { ClimateEntity } from "../../dependencies/ha";
import { compareClimateHvacModes, computeDomain } from "../../dependencies/ha";

import { getFeature } from "../../utils/object/features";

import type {
  ClimateFeatureState,
  ClimateModeFeatureState,
  Feature,
} from "../types/types";
import type { RenderControlsContext } from "../types/render-controls-context";
import {
  FEATURE,
  FEATURE_PAGE_ICON,
  FEATURE_PAGE_ICON_COLOR,
} from "../../constants/features";

import "../components/climate-fan-modes-control";
import "../components/climate-hvac-modes-control";
import "../components/climate-overview";
import "../components/climate-preset-modes-control";
import "../components/climate-swing-modes-control";
import "../components/climate-temperature-control";
import { renderClimateFeatureModesPage } from "./climate-feature-modes-page";

export function renderControls(card: RenderControlsContext): TemplateResult {
  const {
    featureEntityObj,
    hasClimateOverviewFeature,
    hasAdjustTemperatureFeature,
    hvac,
    fan,
    swing,
    preset,
    hasMoreThanOnePage,
    hasFiveOrMoreIcons,
  } = computeClimateFeatureState(card);

  return html` ${featureEntityObj !== undefined &&
  hasClimateOverviewFeature &&
  card.hasSeparatedOverviewControls
    ? html` <div
        class="controls-row"
        style=${styleMap({
          "max-width": "208px",
        })}
      >
        <gcp-climate-overview
          .hass=${card.hass}
          .entity=${featureEntityObj}
          .hasAdjustTemperatureFeature=${hasAdjustTemperatureFeature}
          .hasClimateHvacModesFeature=${hvac.enabled}
          .hasClimateFanModesFeature=${fan.enabled}
          .hasClimateSwingModesFeature=${swing.enabled}
          .hasClimatePresetModesFeature=${preset.enabled}
          .setPage=${(ev: CustomEvent, page: Feature) =>
            card.setFeaturePage(ev, page)}
        >
        </gcp-climate-overview>
      </div>`
    : nothing}
  ${featureEntityObj !== undefined &&
  (hasClimateOverviewFeature ||
    hasAdjustTemperatureFeature ||
    hvac.enabled ||
    fan.enabled ||
    swing.enabled)
    ? html` <div
        class="controls-row"
        style=${styleMap({
          "grid-template-columns": hasMoreThanOnePage
            ? "36px auto 36px"
            : undefined,
          "max-width":
            hasMoreThanOnePage && hasFiveOrMoreIcons
              ? "300px"
              : hasMoreThanOnePage
                ? "250px"
                : "208px",
        })}
      >
        ${hasMoreThanOnePage
          ? html` <div style="display: flex; justify-self: start;">
              <gcp-icon-button
                appearance="square"
                title="Back to first page"
                @click=${(ev) => card.setFirstFeaturePage(ev)}
                style=${styleMap({
                  "--icon-color":
                    FEATURE_PAGE_ICON_COLOR[card._activeFeaturePage],
                  "--bg-color": `color-mix(in srgb, ${FEATURE_PAGE_ICON_COLOR[card._activeFeaturePage]} 20%, transparent)`,
                })}
              >
                <ha-svg-icon
                  .path=${FEATURE_PAGE_ICON[card._activeFeaturePage]}
                ></ha-svg-icon>
              </gcp-icon-button>
            </div>`
          : nothing}
        ${hasClimateOverviewFeature && !card.hasSeparatedOverviewControls
          ? html` <gcp-climate-overview
              style=${styleMap({
                display:
                  card._activeFeaturePage !== FEATURE.CLIMATE_OVERVIEW
                    ? "none"
                    : undefined,
              })}
              .hass=${card.hass}
              .entity=${featureEntityObj}
              .hasAdjustTemperatureFeature=${hasAdjustTemperatureFeature}
              .hasClimateHvacModesFeature=${hvac.enabled}
              .hasClimateFanModesFeature=${fan.enabled}
              .hasClimateSwingModesFeature=${swing.enabled}
              .hasClimatePresetModesFeature=${preset.enabled}
              .setPage=${(ev: CustomEvent, page: Feature) =>
                card.setFeaturePage(ev, page)}
            >
            </gcp-climate-overview>`
          : nothing}
        ${hasAdjustTemperatureFeature
          ? html` <gcp-climate-temperature-control
              style=${styleMap({
                display:
                  card._activeFeaturePage !== FEATURE.ADJUST_TEMPERATURE
                    ? "none"
                    : undefined,
              })}
              .callService=${card.hass.callService}
              .entity=${featureEntityObj}
              .unitTemp=${card.hass.config.unit_system.temperature}
            >
            </gcp-climate-temperature-control>`
          : nothing}
        ${hvac.enabled
          ? renderClimateFeatureModesPage(
              card.hass,
              "hvac",
              featureEntityObj,
              hvac.modes,
              hvac.style,
              card._activeFeaturePage
            )
          : nothing}
        ${fan.enabled
          ? renderClimateFeatureModesPage(
              card.hass,
              "fan",
              featureEntityObj,
              fan.modes,
              fan.style,
              card._activeFeaturePage
            )
          : nothing}
        ${swing.enabled
          ? renderClimateFeatureModesPage(
              card.hass,
              "swing",
              featureEntityObj,
              swing.modes,
              swing.style,
              card._activeFeaturePage
            )
          : nothing}
        ${preset.enabled
          ? renderClimateFeatureModesPage(
              card.hass,
              "preset",
              featureEntityObj,
              preset.modes,
              preset.style,
              card._activeFeaturePage
            )
          : nothing}
        ${hasMoreThanOnePage
          ? html` <div style="display: flex; justify-self: end;">
              <gcp-icon-button
                appearance="plain"
                @click=${(ev) => card.nextFeaturePage(ev)}
              >
                <ha-svg-icon .path=${mdiChevronRight}></ha-svg-icon>
              </gcp-icon-button>
            </div>`
          : nothing}
      </div>`
    : nothing}`;
}

//=============================================================================
// CLIMATE FEATURE COMPUTATION
//=============================================================================

function computeClimateFeatureState(
  card: RenderControlsContext
): ClimateFeatureState {
  const disabled: ClimateModeFeatureState = {
    enabled: false,
    modes: undefined,
    style: undefined,
  };
  const noState: ClimateFeatureState = {
    featureEntityObj: undefined,
    hasClimateOverviewFeature: false,
    hasAdjustTemperatureFeature: false,
    hvac: disabled,
    fan: disabled,
    swing: disabled,
    preset: disabled,
    hasMoreThanOnePage: false,
    hasFiveOrMoreIcons: false,
  };

  if (!card.featureEntity || !card.enabledFeaturePages?.length) return noState;

  const pages = card.enabledFeaturePages;
  const hasOverview = pages.includes(FEATURE.CLIMATE_OVERVIEW);
  const hasAdjustTemp = pages.includes(FEATURE.ADJUST_TEMPERATURE);
  const hasHvac = pages.includes(FEATURE.CLIMATE_HVAC_MODES);
  const hasFan = pages.includes(FEATURE.CLIMATE_FAN_MODES);
  const hasSwing = pages.includes(FEATURE.CLIMATE_SWING_MODES);
  const hasPreset = pages.includes(FEATURE.CLIMATE_PRESET_MODES);

  if (
    !(
      hasOverview ||
      hasAdjustTemp ||
      hasHvac ||
      hasFan ||
      hasSwing ||
      hasPreset
    )
  )
    return noState;

  const featureEntityObj =
    computeDomain(card.featureEntity) === "climate"
      ? (card.hass.states[card.featureEntity] as ClimateEntity)
      : undefined;

  if (!featureEntityObj)
    return {
      ...noState,
      hasClimateOverviewFeature: hasOverview,
      hasAdjustTemperatureFeature: hasAdjustTemp,
    };

  const hvac = computeClimateHvacModeFeature(card, featureEntityObj, hasHvac);
  const fan = computeClimateFanModeFeature(card, featureEntityObj, hasFan);
  const swing = computeClimateSwingModeFeature(
    card,
    featureEntityObj,
    hasSwing
  );
  const preset = computeClimatePresetModeFeature(
    card,
    featureEntityObj,
    hasPreset
  );

  const hasMoreThanOnePage =
    [
      hasAdjustTemp,
      hvac.enabled,
      fan.enabled,
      swing.enabled,
      preset.enabled,
    ].filter(Boolean).length > 1;

  const hasFiveOrMoreIcons = Boolean(
    (hasOverview &&
      !card.hasSeparatedOverviewControls &&
      hasAdjustTemp &&
      fan.enabled &&
      hvac.enabled &&
      preset.enabled &&
      swing.enabled) ||
    (fan.enabled && fan.style !== "dropdown" && fan.modes.length >= 5) ||
    (hvac.enabled && hvac.style !== "dropdown" && hvac.modes.length >= 5) ||
    (preset.enabled &&
      preset.style !== "dropdown" &&
      preset.modes.length >= 5) ||
    (swing.enabled && swing.style !== "dropdown" && swing.modes.length >= 5)
  );

  return {
    featureEntityObj,
    hasClimateOverviewFeature: hasOverview,
    hasAdjustTemperatureFeature: hasAdjustTemp,
    hvac,
    fan,
    swing,
    preset,
    hasMoreThanOnePage,
    hasFiveOrMoreIcons,
  };
}

function computeClimateHvacModeFeature(
  card: RenderControlsContext,
  entity: ClimateEntity,
  enabled: boolean
): ClimateModeFeatureState {
  if (!enabled) return { enabled: false, modes: undefined, style: undefined };
  const feature = getFeature(card._config, FEATURE.CLIMATE_HVAC_MODES);
  const allowlist = feature?.hvac_modes ?? entity.attributes.hvac_modes ?? [];
  const modes = entity.attributes.hvac_modes
    .filter((m) => allowlist.includes(m))
    .sort(compareClimateHvacModes);
  if (!modes.length)
    return { enabled: false, modes: undefined, style: undefined };
  return { enabled: true, modes, style: feature?.style };
}

function computeClimateFanModeFeature(
  card: RenderControlsContext,
  entity: ClimateEntity,
  enabled: boolean
): ClimateModeFeatureState {
  if (!enabled) return { enabled: false, modes: undefined, style: undefined };
  const feature = getFeature(card._config, FEATURE.CLIMATE_FAN_MODES);
  const allowlist = feature?.fan_modes ?? entity.attributes.fan_modes ?? [];
  const modes = (entity.attributes.fan_modes ?? []).filter((m) =>
    allowlist.includes(m)
  );
  if (!modes.length)
    return { enabled: false, modes: undefined, style: undefined };
  return { enabled: true, modes, style: feature?.style };
}

function computeClimateSwingModeFeature(
  card: RenderControlsContext,
  entity: ClimateEntity,
  enabled: boolean
): ClimateModeFeatureState {
  if (!enabled) return { enabled: false, modes: undefined, style: undefined };
  const feature = getFeature(card._config, FEATURE.CLIMATE_SWING_MODES);
  const allowlist = feature?.swing_modes ?? entity.attributes.swing_modes ?? [];
  const modes = (entity.attributes.swing_modes ?? []).filter((m) =>
    allowlist.includes(m)
  );
  if (!modes.length)
    return { enabled: false, modes: undefined, style: undefined };
  return { enabled: true, modes, style: feature?.style };
}

function computeClimatePresetModeFeature(
  card: RenderControlsContext,
  entity: ClimateEntity,
  enabled: boolean
): ClimateModeFeatureState {
  if (!enabled) return { enabled: false, modes: undefined, style: undefined };
  const feature = getFeature(card._config, FEATURE.CLIMATE_PRESET_MODES);
  const allowlist =
    feature?.preset_modes ?? entity.attributes.preset_modes ?? [];
  const modes = (entity.attributes.preset_modes ?? []).filter((m) =>
    allowlist.includes(m)
  );
  if (!modes.length)
    return { enabled: false, modes: undefined, style: undefined };
  return { enabled: true, modes, style: feature?.style };
}
