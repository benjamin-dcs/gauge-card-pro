import { GaugeCardProCardConfig } from "../config";

/**
 * Default config used both for the card picker stub (`getStubConfig`) and for
 * the entity suggestion shown in the "add card by entity" dialog.
 *
 * @param entity - The entity the card is created for.
 * @returns The default Gauge Card Pro config.
 */
export function getDefaultConfig(entity?: string): GaugeCardProCardConfig {
  return {
    type: `custom:gauge-card-pro`,
    entity: entity,
    segments: [
      { pos: 0, color: "red" },
      { pos: 25, color: "#FFA500" },
      { pos: 50, color: "rgb(255, 255, 0)" },
      { pos: 100, color: "var(--green-color)" },
    ],
    needle: true,
    gradient: true,
    titles: {
      primary: {
        value: "{{ state_attr(entity, 'friendly_name') }}",
      },
    },
    round: "small",
  };
}
