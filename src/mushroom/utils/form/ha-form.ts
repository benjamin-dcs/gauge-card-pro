import type { LitElement } from 'lit';
import { Selector } from './ha-selector';

interface HaDurationData {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export type HaFormSchema =
  | HaFormConstantSchema
  | HaFormStringSchema
  | HaFormIntegerSchema
  | HaFormFloatSchema
  | HaFormBooleanSchema
  | HaFormSelectSchema
  | HaFormMultiSelectSchema
  | HaFormTimeSchema
  | HaFormSelector
  | HaFormGridSchema;

export interface HaFormBaseSchema {
  name: string;
  // This value is applied if no data is submitted for this field
  default?: HaFormData;
  required?: boolean;
  description?: {
    suffix?: string;
    // This value will be set initially when form is loaded
    suggested_value?: HaFormData;
  };
  context?: Record<string, string>;
}

export interface HaFormGridSchema extends HaFormBaseSchema {
  type: 'grid';
  name: '';
  column_min_width?: string;
  schema: HaFormSchema[];
}

export interface HaFormSelector extends HaFormBaseSchema {
  type?: never;
  selector: Selector;
}

export interface HaFormConstantSchema extends HaFormBaseSchema {
  type: 'constant';
  value?: string;
}

export interface HaFormIntegerSchema extends HaFormBaseSchema {
  type: 'integer';
  default?: HaFormIntegerData;
  valueMin?: number;
  valueMax?: number;
}

export interface HaFormSelectSchema extends HaFormBaseSchema {
  type: 'select';
  options: Array<[string, string]>;
}

export interface HaFormMultiSelectSchema extends HaFormBaseSchema {
  type: 'multi_select';
  options: Record<string, string> | string[] | Array<[string, string]>;
}

export interface HaFormFloatSchema extends HaFormBaseSchema {
  type: 'float';
}

export interface HaFormStringSchema extends HaFormBaseSchema {
  type: 'string';
  format?: string;
}

export interface HaFormBooleanSchema extends HaFormBaseSchema {
  type: 'boolean';
}

export interface HaFormTimeSchema extends HaFormBaseSchema {
  type: 'positive_time_period_dict';
}

export interface HaFormDataContainer {
  [key: string]: HaFormData;
}

export type HaFormData =
  | HaFormStringData
  | HaFormIntegerData
  | HaFormFloatData
  | HaFormBooleanData
  | HaFormSelectData
  | HaFormMultiSelectData
  | HaFormTimeData;

export type HaFormStringData = string;
export type HaFormIntegerData = number;
export type HaFormFloatData = number;
export type HaFormBooleanData = boolean;
export type HaFormSelectData = string;
export type HaFormMultiSelectData = string[];
export type HaFormTimeData = HaDurationData;

export interface HaFormElement extends LitElement {
  schema: HaFormSchema | HaFormSchema[];
  data?: HaFormDataContainer | HaFormData;
  label?: string;
}
