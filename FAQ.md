# Frequently asked questions

## Is it possible to template segments?
Yes, as explained in the [readme](https://github.com/benjamin-dcs/gauge-card-pro?tab=readme-ov-file) [here](https://github.com/benjamin-dcs/gauge-card-pro?tab=readme-ov-file#template-list)


```yaml
segments: |-
  {% set max = states('sensor.max_sensor') | float %}
  {{
    [
      { "from": 0, "color": "#4caf50" },
      { "from": 25, "color": "#8bc34a" },
      { "from": 50, "color": "#ffeb3b" },
      { "from": 75, "color": "#ff9800" },
      { "from": 100, "color": "#f44336" },
      { "from": 125, "color": "#926bc7" },
      { "from": max, "color":"#795548"  }
    ]
  }}
```

## Is it possible to change the icon?
Yes, as explained in the [readme](https://github.com/benjamin-dcs/gauge-card-pro?tab=readme-ov-file) [here](https://github.com/benjamin-dcs/gauge-card-pro?tab=readme-ov-file#icon-configuration-variables)

You need to use `type: template` and return an 'object' as described [here]([readme](https://github.com/benjamin-dcs/gauge-card-pro?tab=readme-ov-file)), for example:

```yaml
icon:
  type: template
  value: |-
    {% if is_state('binary_sensor.pump', 'on') %}
      {{ { "icon": 'mdi:your_icon', "color": "#00ff00" } }}
    {% endif %}
```
