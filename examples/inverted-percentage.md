# Inverted percentage

```yaml
type: custom:gauge-card-pro
entity: sensor.percentage
value: "{{ 100 - states(entity) | float }}"
value_text: "{{ 100 - states(entity) | float }}"
```
