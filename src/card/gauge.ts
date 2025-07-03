// Core functionality
import {
  Gauge,
  GaugeCardProCardConfig,
  GaugeSegment,
  GradientSegment,
} from "./config";
import { gaugeCSS } from "./css/gauge";

const stopPropagation = (ev) => ev.stopPropagation();

@customElement("gauge-card-pro-gauge")
export class GaugeCardProGauge extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ type: Boolean }) public hasHold = false;
  @property({ type: Boolean }) public hasDoubleClick = false;

  // main gauge
  @property({ type: Boolean }) public gradient = false;
  @property({ type: Number }) public max = 100;
  @property({ type: Number }) public min = 0;
  @property({ type: Boolean }) public needle = false;
  @property({ type: String }) public needleColor = "";
  @property({ type: Array }) public segments?: GaugeSegment[];
  @property({ type: Array }) public gradientSegments?: GradientSegment[];
  @property({ type: String }) public gradientResolution?: string | number;
  @property({ type: Number }) public value = 0;

  // value texts
  @property({ attribute: false, type: String })
  public primaryValueText?: string;
  @property({ type: String })
  public primaryValueTextColor = "";
  @property({ type: String }) public primaryValueTextFontSizeReduction = "";

  @property({ attribute: false, type: String })
  public secondaryValueText?: string;
  @property({ type: String }) public secondaryValueTextColor = "";

  // inner gauge
  @property({ type: Boolean }) public hasInnerGauge = false;

  @property({ type: Boolean }) public innerGradient = false;
  @property({ type: Number }) public innerMax = 100;
  @property({ type: Number }) public innerMin = 0;
  @property({ type: Boolean }) public innerMode = "severity";
  @property({ type: String }) public innerNeedleColor = "";
  @property({ type: Array }) public innerSegments?: GaugeSegment[];
  @property({ type: Boolean }) public innerSetpoint = false;
  @property({ type: String }) public innerSetpointNeedleColor = "";
  @property({ type: Number }) public innerSetpointValue = 0;
  @property({ type: Array }) public innerGradientSegments?: GradientSegment[];
  @property({ type: String }) public innerGradientResolution?: string | number;
  @property({ type: Number }) public innerValue = 0;

  // setpoint
  @property({ type: Boolean }) public setpoint = false;
  @property({ type: String }) public setpointNeedleColor = "";
  @property({ type: Number }) public setpointValue = 0;

  // icons
  @property({ type: String }) public iconIcon?: string;
  @property({ type: String }) public iconColor?: string;
  @property({ type: String }) public iconLabel?: string;

  // needle shapes
  @property({ type: String }) public needleShapeMain?: string;
  @property({ type: String }) public needleShapeMainWithInner?: string;
  @property({ type: String }) public needleShapeMainSetpoint?: string;
  @property({ type: String }) public needleShapeInner?: string;
  @property({ type: String }) public needleShapeInnerOnMain?: string;
  @property({ type: String }) public needleShapeInnerSetpoint?: string;
  @property({ type: String }) public needleShapeInnerSetpointOnMain?: string;

  @state() public _config?: GaugeCardProCardConfig;
  @state() private _angle = 0;
  @state() private _inner_angle = 0;
  @state() private _inner_setpoint_angle = 0;
  @state() private _setpoint_angle = 0;
  @state() private _updated = false;

  static styles = gaugeCSS;

  protected render() {
    return svg`







      

      `;
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gauge-card-pro-gauge": GaugeCardProGauge;
  }
}
