// External dependencies
import { GradientPath } from "../dependencies/gradient-path/gradient-path";

// Internalized external dependencies
import * as Logger from "../dependencies/calendar-card-pro";

// Local utilities
import { NumberUtils } from "../utils/number/numberUtils";

// Local constants & types
import { DEFAULT_GRADIENT_RESOLUTION, GRADIENT_RESOLUTION_MAP } from "./const";
import { Gauge, GradientSegment } from "./config";

export class GradientRenderer {
  public gauge: Gauge;

  private gp: GradientPath;

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

  public initialize(path, resolution) {
    if (!resolution) {
      resolution = DEFAULT_GRADIENT_RESOLUTION;
    }

    if (NumberUtils.isNumeric(resolution)) {
      const _resolution = Math.min(NumberUtils.tryToNumber(resolution)!, 500);
      this.gp = new GradientPath({
        path: path,
        segments: _resolution,
        samples: _resolution < 25 ? Math.max(Math.round(25 / _resolution) + 1, 3) : 1,
      });
    } else {
      this.gp = new GradientPath({
        path: path,
        segments: GRADIENT_RESOLUTION_MAP[resolution].segments,
        samples: GRADIENT_RESOLUTION_MAP[resolution].samples,
      });
    }
  }

  public render(min: number, max: number, gradientSegments: GradientSegment[]) {
    if (
      min === this._prevMin &&
      max === this._prevMax &&
      JSON.stringify(gradientSegments) === JSON.stringify(this._prevSegments)
    ) {
      return;
    }

    const width = this.gauge === "main" ? 14 : 4;

    try {
      this.gp.render({
        type: "path",
        fill: gradientSegments,
        width: width,
        stroke: gradientSegments,
        strokeWidth: 1,
      });
    } catch (e) {
      Logger.error("Error gradient:", e);
    }
    this.setPrevs(min, max, gradientSegments);
  }
}
