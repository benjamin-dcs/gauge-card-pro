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
  gaugeCardProConfigStruct,
  migrate_parameters,
} from './config';

export const CUSTOM_LABELS = [
  'entity',
  'entity2',
  'gradient',
  'gradient_resolution',
  'gradient_resolutionOptions',
  'max',
  'min',
  'titles.primary',
  'titles.primary_color',
  'titles.secondary',
  'titles.secondary_color',
  'needle',
  'value',
  'value_texts.primary',
  'value_texts.primary_color',
  'value_texts.secondary',
  'value_texts.secondary_color',
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

  @state()
  private config?: GaugeCardProCardConfig | undefined;
  public get _config(): GaugeCardProCardConfig | undefined {
    return migrate_parameters(this.config);
  }
  public set _config(value: GaugeCardProCardConfig | undefined) {
    value = migrate_parameters(value);
    this.config = value;
  }

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
          name: 'entity2',
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
          name: 'min',
          selector: { template: {} },
        },
        {
          name: 'max',
          selector: { template: {} },
        },
        {
          name: 'titles',
          type: 'grid',
          column_min_width: '100%',
          schema: [
            {
              name: 'primary',
              parent: 'titles',
              selector: { template: {} },
            },
            {
              name: 'primary_color',
              parent: 'titles',
              selector: { template: {} },
            },
            {
              name: 'secondary',
              parent: 'titles',
              selector: { template: {} },
            },
            {
              name: 'secondary_color',
              parent: 'titles',
              selector: { template: {} },
            },
          ],
        },
        {
          name: 'value_texts',
          type: 'grid',
          column_min_width: '100%',
          schema: [
            {
              name: 'primary',
              parent: 'value_texts',
              selector: { template: {} },
            },
            {
              name: 'primary_color',
              parent: 'value_texts',
              selector: { template: {} },
            },
            {
              name: 'secondary',
              parent: 'value_texts',
              selector: { template: {} },
            },
            {
              name: 'secondary_color',
              parent: 'value_texts',
              selector: { template: {} },
            },
          ],
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
    const customLocalize = setupCustomlocalize(this.hass!);
    const parent = schema.parent ? schema.parent + '.' : '';

    if (CUSTOM_LABELS.includes(parent + schema.name)) {
      return customLocalize(`editor.card.${parent}${schema.name}`);
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
