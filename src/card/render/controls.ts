import type { TemplateResult } from "lit";
import { html, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { mdiChevronRight } from "@mdi/js";

import type { ClimateEntity } from "../../dependencies/ha";
import { compareClimateHvacModes, computeDomain } from "../../dependencies/ha";

import {
  getFeature,
  getFeaturePageIcon,
  getFeaturePageIconColor,
} from "../../utils/object/features";

import type {
  ClimateFeatureState,
  ClimateModeFeatureState,
  CustomFeatureState,
  Feature,
} from "../types/types";
import type { RenderControlsContext } from "../types/contexts";
import { FEATURE } from "../../constants/features";

import "../components/climate/fan-modes-control";
import "../components/climate/hvac-modes-control";
import "../components/climate/preset-modes-control";
import "../components/climate/swing-modes-control";
import "../components/climate/temperature-control";
import "../components/custom-control";
import "../components/overview";
import { renderClimateFeatureModesPage } from "./climate-feature-modes-page";

export function renderControls(card: RenderControlsContext): TemplateResult {
  const custom = computeCustomFeatureState(card);
  const {
    featureEntityObj,
    hasOverviewFeature,
    hasAdjustTemperatureFeature,
    hvac,
    fan,
    swing,
    preset,
    hasFiveOrMoreIcons,
  } = computeClimateFeatureState(card, custom);

  const hasMoreThanOnePage = (card.scrollableFeaturePages?.length ?? 0) > 1;

  // Climate pages require a climate entity, custom controls don't
  const showClimatePages = featureEntityObj !== undefined;

  const customPageIcon = getFeaturePageIcon(card._config, FEATURE.CUSTOM);
  const activePageIcon = getFeaturePageIcon(
    card._config,
    card._activeFeaturePage
  );
  const activePageIconColor = getFeaturePageIconColor(
    card._config,
    card._activeFeaturePage
  );

  return html` ${
    showClimatePages && hasOverviewFeature && card.hasSeparatedOverviewControls
      ? html` <div
          class="controls-row"
          style=${styleMap({
            "max-width": "208px",
          })}
        >
          <gcp-overview
            .hass=${card.hass}
            .entity=${featureEntityObj}
            .hasAdjustTemperatureFeature=${hasAdjustTemperatureFeature}
            .hasClimateHvacModesFeature=${hvac.enabled}
            .hasClimateFanModesFeature=${fan.enabled}
            .hasClimateSwingModesFeature=${swing.enabled}
            .hasClimatePresetModesFeature=${preset.enabled}
            .hasCustomFeature=${custom.enabled}
            .customPageIcon=${
              "icon" in customPageIcon ? customPageIcon.icon : undefined
            }
            .customPageIconColor=${getFeaturePageIconColor(
              card._config,
              FEATURE.CUSTOM
            )}
            .setPage=${(ev: CustomEvent, page: Feature) =>
              card.setFeaturePage(ev, page)}
          >
          </gcp-overview>
        </div>`
      : nothing
  }
  ${
    (showClimatePages &&
      ((hasOverviewFeature && !card.hasSeparatedOverviewControls) ||
        hasAdjustTemperatureFeature ||
        hvac.enabled ||
        fan.enabled ||
        swing.enabled ||
        preset.enabled)) ||
    custom.enabled
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
          ${
            hasMoreThanOnePage
              ? html` <div style="display: flex; justify-self: start;">
                  <gcp-icon-button
                    appearance="square"
                    title="Back to first page"
                    @click=${(ev) => card.setFirstFeaturePage(ev)}
                    style=${styleMap({
                      "--icon-color": activePageIconColor,
                      "--bg-color": `color-mix(in srgb, ${activePageIconColor} 20%, transparent)`,
                    })}
                  >
                    ${
                      "icon" in activePageIcon
                        ? html`<ha-icon .icon=${activePageIcon.icon}></ha-icon>`
                        : html`<ha-svg-icon
                            .path=${activePageIcon.path}
                          ></ha-svg-icon>`
                    }
                  </gcp-icon-button>
                </div>`
              : nothing
          }
          ${
            showClimatePages &&
            hasOverviewFeature &&
            !card.hasSeparatedOverviewControls
              ? html` <gcp-overview
                  style=${styleMap({
                    display:
                      card._activeFeaturePage !== FEATURE.OVERVIEW
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
                  .hasCustomFeature=${custom.enabled}
                  .customPageIcon=${
                    "icon" in customPageIcon ? customPageIcon.icon : undefined
                  }
                  .customPageIconColor=${getFeaturePageIconColor(
                    card._config,
                    FEATURE.CUSTOM
                  )}
                  .setPage=${(ev: CustomEvent, page: Feature) =>
                    card.setFeaturePage(ev, page)}
                >
                </gcp-overview>`
              : nothing
          }
          ${
            showClimatePages && hasAdjustTemperatureFeature
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
              : nothing
          }
          ${
            showClimatePages && hvac.enabled
              ? renderClimateFeatureModesPage(
                  card.hass,
                  "hvac",
                  featureEntityObj,
                  hvac.modes,
                  hvac.style,
                  card._activeFeaturePage
                )
              : nothing
          }
          ${
            showClimatePages && fan.enabled
              ? renderClimateFeatureModesPage(
                  card.hass,
                  "fan",
                  featureEntityObj,
                  fan.modes,
                  fan.style,
                  card._activeFeaturePage
                )
              : nothing
          }
          ${
            showClimatePages && swing.enabled
              ? renderClimateFeatureModesPage(
                  card.hass,
                  "swing",
                  featureEntityObj,
                  swing.modes,
                  swing.style,
                  card._activeFeaturePage
                )
              : nothing
          }
          ${
            showClimatePages && preset.enabled
              ? renderClimateFeatureModesPage(
                  card.hass,
                  "preset",
                  featureEntityObj,
                  preset.modes,
                  preset.style,
                  card._activeFeaturePage
                )
              : nothing
          }
          ${
            custom.enabled
              ? html` <gcp-custom-control
                  style=${styleMap({
                    display:
                      card._activeFeaturePage !== FEATURE.CUSTOM
                        ? "none"
                        : undefined,
                  })}
                  .hass=${card.hass}
                  .controls=${custom.controls}
                  .defaultEntity=${card.featureEntity ?? card._config.entity}
                >
                </gcp-custom-control>`
              : nothing
          }
          ${
            hasMoreThanOnePage
              ? html` <div style="display: flex; justify-self: end;">
                  <gcp-icon-button
                    appearance="plain"
                    @click=${(ev) => card.nextFeaturePage(ev)}
                  >
                    <ha-svg-icon .path=${mdiChevronRight}></ha-svg-icon>
                  </gcp-icon-button>
                </div>`
              : nothing
          }
        </div>`
      : nothing
  }`;
}

//=============================================================================
// CUSTOM FEATURE COMPUTATION
//=============================================================================

function computeCustomFeatureState(
  card: RenderControlsContext
): CustomFeatureState {
  if (!card.enabledFeaturePages?.includes(FEATURE.CUSTOM))
    return { enabled: false, controls: [] };

  const controls = getFeature(card._config, FEATURE.CUSTOM)?.controls ?? [];
  return { enabled: controls.length > 0, controls };
}

//=============================================================================
// CLIMATE FEATURE COMPUTATION
//=============================================================================

function computeClimateFeatureState(
  card: RenderControlsContext,
  custom: CustomFeatureState
): ClimateFeatureState {
  const disabled: ClimateModeFeatureState = {
    enabled: false,
    modes: undefined,
    style: undefined,
  };
  const noState: ClimateFeatureState = {
    featureEntityObj: undefined,
    hasOverviewFeature: false,
    hasAdjustTemperatureFeature: false,
    hvac: disabled,
    fan: disabled,
    swing: disabled,
    preset: disabled,
    hasFiveOrMoreIcons: custom.controls.length >= 5,
  };

  if (!card.featureEntity || !card.enabledFeaturePages?.length) return noState;

  const pages = card.enabledFeaturePages;
  const hasOverview = pages.includes(FEATURE.OVERVIEW);
  const hasAdjustTemp = pages.includes(FEATURE.ADJUST_TEMPERATURE);
  const hasHvac = pages.includes(FEATURE.CLIMATE_HVAC_MODES);
  const hasFan = pages.includes(FEATURE.CLIMATE_FAN_MODES);
  const hasSwing = pages.includes(FEATURE.CLIMATE_SWING_MODES);
  const hasPreset = pages.includes(FEATURE.CLIMATE_PRESET_MODES);

  if (!(
    hasOverview ||
    hasAdjustTemp ||
    hasHvac ||
    hasFan ||
    hasSwing ||
    hasPreset
  ))
    return noState;

  const featureEntityObj =
    computeDomain(card.featureEntity) === "climate"
      ? (card.hass.states[card.featureEntity] as ClimateEntity)
      : undefined;

  if (!featureEntityObj)
    return {
      ...noState,
      hasOverviewFeature: hasOverview,
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

  const pageCount = [
    hasAdjustTemp,
    hvac.enabled,
    fan.enabled,
    swing.enabled,
    preset.enabled,
    custom.enabled,
  ].filter(Boolean).length;

  // Every page (except the overview itself) has a button on the overview
  const overviewIconCount =
    hasOverview && !card.hasSeparatedOverviewControls ? pageCount : 0;

  const hasFiveOrMoreIcons = Boolean(
    overviewIconCount >= 5 ||
    custom.controls.length >= 5 ||
    (fan.enabled && fan.style !== "dropdown" && fan.modes.length >= 5) ||
    (hvac.enabled && hvac.style !== "dropdown" && hvac.modes.length >= 5) ||
    (preset.enabled &&
      preset.style !== "dropdown" &&
      preset.modes.length >= 5) ||
    (swing.enabled && swing.style !== "dropdown" && swing.modes.length >= 5)
  );

  return {
    featureEntityObj,
    hasOverviewFeature: hasOverview,
    hasAdjustTemperatureFeature: hasAdjustTemp,
    hvac,
    fan,
    swing,
    preset,
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
