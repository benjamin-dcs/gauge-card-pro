# Energy Grid Neutrality Gauge

![image](https://github.com/user-attachments/assets/a2ec069d-fd1f-4437-b755-21e87e43ffc8)

```yaml
type: custom:gauge-card-pro
name: |-
  {% set consumedFromGrid =
    states('sensor.p1_meter_energy_import_tariff_1_daily') | float
    +
    states('sensor.p1_meter_energy_import_tariff_2_daily') | float
  %}

  {% set returnedToGrid =
    states('sensor.p1_meter_energy_export_tariff_1_daily') | float
    +
    states('sensor.p1_meter_energy_export_tariff_2_daily') | float
  %}

  {% if returnedToGrid > consumedFromGrid %}
    Returned
  {% else %}
    Consumed
  {% endif %}
value: |-
  {% set consumedFromGrid =
    states('sensor.p1_meter_energy_import_tariff_1_daily') | float
    +
    states('sensor.p1_meter_energy_import_tariff_2_daily') | float
  %}

  {% set returnedToGrid =
    states('sensor.p1_meter_energy_export_tariff_1_daily') | float
    +
    states('sensor.p1_meter_energy_export_tariff_2_daily') | float
  %}

  {% if returnedToGrid > consumedFromGrid %}
    {{ 1 - consumedFromGrid / returnedToGrid }}
  {% else %}
    {{ (1 - returnedToGrid / consumedFromGrid) * -1 }}
  {% endif %}
valueText: |-
  {% set consumedFromGrid =
    states('sensor.p1_meter_energy_import_tariff_1_daily') | float
    +
    states('sensor.p1_meter_energy_import_tariff_2_daily') | float
  %}

  {% set returnedToGrid =
    states('sensor.p1_meter_energy_export_tariff_1_daily') | float
    +
    states('sensor.p1_meter_energy_export_tariff_2_daily') | float
  %}
  {{ (returnedToGrid - consumedFromGrid) | abs | round(1) | replace('.', ',') }} kWh
min: "-1"
max: "1"
needle: true
segments:
  - from: -1
    color: var(--error-color)
  - from: 0
    color: var(--warning-color)
  - from: 1
    color: var(--success-color)
gradient: true
gradientResolution: medium
```
