import { LitElement } from 'lit';
import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import memoizeOne from 'memoize-one';
import { assert } from 'superstruct';
import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardEditor,
  fireEvent,
} from '../ha';
import setupCustomlocalize from '../localize';
import { computeActionsFormSchema } from '../mushroom/shared/config/actions-config';
import { HaFormSchema } from '../mushroom/utils/form/ha-form';
import { loadHaComponents } from '../mushroom/utils/loader';
import { EDITOR_NAME } from './_const';
import {
  GaugeCardProCardConfig,
  guageCardProConfigStruct,
  migrate_parameters,
} from './config';

export const CUSTOM_LABELS = [
  'entity',
  'gradient',
  'gradient_resolution',
  'gradient_resolutionOptions',
  'max',
  'min',
  'primary',
  'secondary',
  'needle',
  'value',
  'value_text',
];

export interface ConfigChangedEvent {
  config: LovelaceCardConfig;
  error?: string;
  guiModeAvailable?: boolean;
}

declare global {
  interface HASSDomEvents {
    // @ts-ignore
    'config-changed': ConfigChangedEvent;
  }
}

@customElement(EDITOR_NAME)
export class GaugeCardProEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: GaugeCardProCardConfig;

  private _schema = memoizeOne(
    (showGradient: boolean, showGradientResolution: boolean) =>
      [
        {
          name: 'entity',
          selector: {
            entity: {
              domain: ['counter', 'input_number', 'number', 'sensor'],
            },
          },
        },
        {
          name: 'value',
          selector: { template: {} },
        },
        {
          name: 'value_text',
          selector: { template: {} },
        },
        {
          name: 'primary',
          selector: { template: {} },
        },
        {
          name: 'secondary',
          selector: { template: {} },
        },
        {
          name: 'min',
          selector: { template: {} },
        },
        {
          name: 'max',
          selector: { template: {} },
        },
        {
          name: '',
          type: 'grid',
          schema: [{ name: 'needle', selector: { boolean: {} } }, {}],
        },
        ...(showGradient
          ? [
              {
                name: '',
                type: 'grid',
                schema: [
                  { name: 'gradient', selector: { boolean: {} } },
                  ...(showGradientResolution
                    ? [
                        {
                          name: 'gradient_resolution',
                          selector: {
                            select: {
                              value: 'gradient_resolution',
                              options: [
                                {
                                  value: 'low',
                                  label: this._customLocalize(
                                    'gradient_resolution_options.low'
                                  ),
                                },
                                {
                                  value: 'medium',
                                  label: this._customLocalize(
                                    'gradient_resolution_options.medium'
                                  ),
                                },
                                {
                                  value: 'high',
                                  label: this._customLocalize(
                                    'gradient_resolution_options.high'
                                  ),
                                },
                              ],
                              mode: 'dropdown',
                            },
                          },
                        },
                      ]
                    : [{}]),
                ],
              },
            ]
          : [{}]),
        ...computeActionsFormSchema(),
      ] as const
  );

  connectedCallback() {
    super.connectedCallback();
    void loadHaComponents();
  }

  public setConfig(config: GaugeCardProCardConfig): void {
    config = migrate_parameters(config);

    assert(config, guageCardProConfigStruct);
    this._config = config;
  }

  private _computeLabel = (schema: HaFormSchema) => {
    const customLocalize = setupCustomlocalize(this.hass!);

    if (CUSTOM_LABELS.includes(schema.name)) {
      return customLocalize(`editor.card.${schema.name}`);
    }
    return this.hass!.localize(
      `ui.panel.lovelace.editor.card.generic.${schema.name}`
    );
  };

  private _customLocalize(value: string) {
    const customLocalize = setupCustomlocalize(this.hass!);
    return customLocalize(`editor.card.${value}`);
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const schema = this._schema(
      this._config?.needle ?? false, // showGradient
      this._config?.gradient ?? false // showGradientResolution
    );

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    let config = ev.detail.value;

    // Gradient
    if (config.gradient) {
      config = {
        ...config,
        gradient_resolution: config.gradient_resolution || 'medium',
      };
    } else {
      delete config.gradient_resolution;
    }

    fireEvent(this, 'config-changed', { config });
  }
}
