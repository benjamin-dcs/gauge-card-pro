import { GradientPath } from "../gradient-path/gradient-path";
import { Gauge, GradientSegment, GaugeCardProCardConfig } from "./config";
import {
  DEFAULT_GRADIENT_RESOLUTION,
  GRADIENT_RESOLUTION_MAP,
  log_error,
} from "./_const";
import { getGradientSegments } from "./_segments";

import { GaugeCardProCard } from "./card";

export class GradientRenderer {
  public gauge: Gauge;

  private _prevMin?: number;
  private _prevMax?: number;
  private _prevSegments?: GradientSegment[];

  constructor(gauge: Gauge) {
    this.gauge = gauge;
  }

  private areSegmentsEqual(
    newState: GradientSegment[] | undefined,
    oldState: GradientSegment[] | undefined
  ) {
    if (newState === undefined && oldState !== undefined) return false;
    if (newState !== undefined && oldState === undefined) return false;
    return JSON.stringify(newState) === JSON.stringify(oldState);
  }

  private setPrevs(
    min: number | undefined = undefined,
    max: number | undefined = undefined,
    segments: GradientSegment[] | undefined = undefined
  ) {
    this._prevMin = min;
    this._prevMax = max;
    this._prevSegments = segments;
  }

  public render(
    card: GaugeCardProCard,
    config: GaugeCardProCardConfig,
    min: number,
    max: number,
    renderRoot
  ) {
    const hasGradient =
      this.gauge === "main" ? config!.gradient : config!.inner?.gradient;

    if (!hasGradient) {
      this.setPrevs();
      return;
    }

    const gradientPathContainer = renderRoot
      .querySelector("ha-card > gauge-card-pro-gauge")
      ?.shadowRoot?.querySelector(`#${this.gauge}-gauge`)
      ?.querySelector("#gradient-path-container");
    const segments = getGradientSegments(card, this.gauge, min, max);

    // Check whether any significant parameters have changed
    if (
      gradientPathContainer !== null &&
      min === this._prevMin &&
      max === this._prevMax &&
      this.areSegmentsEqual(segments, this._prevSegments)
    ) {
      this.setPrevs();
      return;
    }

    const levelPath = renderRoot
      .querySelector("ha-card > gauge-card-pro-gauge")
      ?.shadowRoot?.querySelector(`#${this.gauge}-gauge`)
      ?.querySelector("#gradient-path");

    if (!levelPath) {
      this.setPrevs();
      return;
    }
    const gaugeConfig = this.gauge === "main" ? config : config?.inner;
    const width = this.gauge === "main" ? 14 : 4;
    const gradientResolution =
      gaugeConfig &&
      gaugeConfig.gradient_resolution !== undefined &&
      Object.keys(GRADIENT_RESOLUTION_MAP).includes(
        gaugeConfig.gradient_resolution
      )
        ? gaugeConfig.gradient_resolution
        : DEFAULT_GRADIENT_RESOLUTION;

    try {
      const gp = new GradientPath({
        path: levelPath,
        segments: GRADIENT_RESOLUTION_MAP[gradientResolution].segments,
        samples: GRADIENT_RESOLUTION_MAP[gradientResolution].samples,
        removeChild: false,
      });

      gp.render({
        type: "path",
        fill: segments,
        width: width,
        stroke: segments,
        strokeWidth: 1,
      });
    } catch (e) {
      log_error("Error gradient:", e);
    }
    this.setPrevs(min, max, segments);
  }
}
