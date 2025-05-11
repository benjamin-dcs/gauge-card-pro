// External dependencies
import { GradientPath } from "../gradient-path/gradient-path";

// General utilities
import { toNumberOrDefault } from "../utils/number/number-or-default";

// Local constants & types
import {
  DEFAULT_GRADIENT_RESOLUTION,
  DEFAULT_MAX,
  DEFAULT_MIN,
  GRADIENT_RESOLUTION_MAP,
  console_error,
} from "./_const";
import { Gauge, GradientSegment } from "./config";

// Core functionality
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

  private setPrevs(
    min: number | undefined = undefined,
    max: number | undefined = undefined,
    segments: GradientSegment[] | undefined = undefined
  ) {
    this._prevMin = min;
    this._prevMax = max;
    this._prevSegments = segments;
  }

  public render(card: GaugeCardProCard) {
    const config = card._config;
    const hasGradient =
      this.gauge === "main" ? config!.gradient : config!.inner?.gradient;

    if (!hasGradient) {
      this.setPrevs();
      return;
    }

    let min = toNumberOrDefault(card.getValue("min"), DEFAULT_MIN);
    let max = toNumberOrDefault(card.getValue("max"), DEFAULT_MAX);
    
    if (this.gauge === "inner") {
      min = toNumberOrDefault(card.getValue("inner.min"), min);
      max = toNumberOrDefault(card.getValue("inner.max"), max);
    }
    
    const gradientPathContainer = card.renderRoot
      .querySelector("ha-card > gauge-card-pro-gauge")
      ?.shadowRoot?.querySelector(`#${this.gauge}-gauge`)
      ?.querySelector("#gradient-path-container");
    const segments = getGradientSegments(card, this.gauge, min, max);

    // Check whether any significant parameters have changed
    if (
      gradientPathContainer !== null &&
      min === this._prevMin &&
      max === this._prevMax &&
      JSON.stringify(segments) === JSON.stringify(this._prevSegments)
    ) {
      this.setPrevs();
      return;
    }

    const levelPath = card.renderRoot
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
      console_error("Error gradient:", e);
    }
    this.setPrevs(min, max, segments);
  }
}
