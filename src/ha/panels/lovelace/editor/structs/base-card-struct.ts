import { object, string, any } from 'superstruct';

export const baseLovelaceCardConfig = object({
  type: string(),
  view_layout: any(),
  layout_options: any(),
  grid_options: any(),
  visibility: any(),
});
