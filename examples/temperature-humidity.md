<img width="305" alt="Screenshot 2025-04-25 at 14 53 57" src="https://github.com/user-attachments/assets/4a336051-e1d3-4400-a073-0840a2854ca2" />

```yaml
type: custom:gauge-card-pro
entity: sensor.temperature
entity2: sensor.humidity
needle: true
min: "18"
max: "21"
segments:
  - from: 18
    color: var(--red-color)
  - from: 18.5
    color: var(--orange-color)
  - from: 19
    color: var(--light-green-color)
  - from: 20
    color: var(--light-green-color)
  - from: 20.5
    color: var(--orange-color)
  - from: 21
    color: var(--red-color)
inner:
  min: 0
  max: 100
  value_text: "{{ states(entity2) | float | round(0) }}%"
  value_text_color: "#aaa"
  segments:
    - from: 0
      color: var(--energy-grid-consumption-color)
gradient: true
gradient_resolution: high
value_texts:
  primary: "{{ states(entity) | float | round(1) }}°C"
  secondary: "{{ states(entity2) | float | round(0) }}%"
  secondary_color: "#aaa"
titles:
  primary: Living room
```
