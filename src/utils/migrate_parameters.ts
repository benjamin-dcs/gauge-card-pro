import { moveKey } from "../utils/object/move-key";

export function migrate_parameters(config: any) {
  if (config) {
    // v0.4.0

    config = moveKey(config, "gradientResolution", "gradient_resolution");
    config = moveKey(config, "name", "titles.primary");
    config = moveKey(config, "segmentsTemplate", "segments");
    config = moveKey(config, "severityTemplate", "severity");
    config = moveKey(config, "valueText", "value_text");

    // v0.8.0

    config = moveKey(config, "primary", "titles.primary");
    config = moveKey(config, "primary_color", "titles.primary_color");

    config = moveKey(config, "secondary", "titles.secondary");
    config = moveKey(config, "secondary_color", "titles.secondary_color");

    config = moveKey(config, "value_text", "value_texts.primary");
    config = moveKey(config, "value_text_color", "value_texts.primary_color");

    config = moveKey(config, "inner.value_text", "value_texts.secondary");
    config = moveKey(
      config,
      "inner.value_text_color",
      "value_texts.secondary_color"
    );

    config = _moveSeverityToSegments(config);
  }
  return config;
}

function _moveSeverityToSegments(config: any) {
  const clone = structuredClone(config); // deep clone so we don't mutate

  if (config.severity === undefined) {
    return clone;
  }

  // templates are not converted
  if (typeof config.severity === "string") {
    return clone;
  }

  if (config.segments !== undefined) {
    return clone;
  }

  const green = config.severity.green;
  const yellow = config.severity.yellow;
  const red = config.severity.red;

  let segments: any = [];
  if (green !== undefined) {
    segments.push({ from: green, color: "var(--success-color)" });
  }

  if (yellow !== undefined) {
    segments.push({ from: yellow, color: "var(--warning-color)" });
  }

  if (red !== undefined) {
    segments.push({ from: red, color: "var(--error-color)" });
  }

  segments.sort((a, b) => a.from - b.from);

  clone["segments"] = segments;
  delete clone.severity;
  return clone;
}
