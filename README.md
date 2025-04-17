# Gauge Card Pro

### Build beautiful Gauge cards using 🌈 gradients and 🛠️ templates!

## Description

This card is based on the default [Gauge card](https://www.home-assistant.io/dashboards/gauge/), but the majority of the fields can, independently, be set with a (templatable) value. Additionally, it is possible to have a different `value` and `value_text` and a _beautiful_ 🌈
**gradient** can be applied!

![image](https://github.com/user-attachments/assets/d8230f03-4034-47af-a18a-81d9069309b8)

## Configuration variables

| Name                  | Type                       | Default  | Description                                                                                                                        | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :-------------------- | :------------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `type`                | string                     | `none`   | `custom:gauge-card-pro`                                                                                                            |
| `entity`              | string                     | Optional | Entity for template and actions (e.g.: `{{ states(entity) }}`)                                                                     |                                                                             |
| `value`               | string                     | Optional | Value for graph                                                                                                                    | ✔️ (`number`)                                                               |
| `value_text`          | string                     | Optional | Text for graph                                                                                                                     | ✔️                                                                          |
| `name`                | string                     | Optional | Name of gauge entity, displayed beneath graph                                                                                      | ✔️                                                                          |
| `min`                 | number or string           | Optional | Minimum value for graph                                                                                                            | ✔️ (`number`)                                                               |
| `max`                 | number or string           | Optional | Maximum value for graph                                                                                                            | ✔️ (`number`)                                                               |
| `needle`              | boolean                    | `false`  | Show the gauge as a needle gauge. Required to be set to true, if using segments                                                    |                                                                             |
| `needle_color`        | string or map<sup>1</sup>  | Optional | Allows customizing color of the needle                                                                                             | ✔️ (`string` or `needle color map`)                                         |
| `severity`            | string or map<sup>2</sup>  | Optional | Allows setting of colors for different numbers                                                                                     | ✔️ (`severity map`)                                                         |
| `segments`            | string or list<sup>3</sup> | `false`  | List of colors and their corresponding start values. Segments will override the severity settings. Needle required to be true      | ✔️ (`segments array`)                                                       |
| `gradient`            | boolean                    | `false`  | Shows severity(Template) or segments(Template) as a beautiful gradient                                                             |                                                                             |
| `gradient_resolution` | string                     | `medium` | Level of detail for the gradient. Must be `low`, `medium` or `high`                                                                |                                                                             |
| `tap_action`          | action                     | `none`   | Home assistant action to perform on tap                                                                                            |                                                                             |
| `hold_action`         | action                     | `none`   | Home assistant action to perform on hold                                                                                           |                                                                             |
| `double_tap_action`   | action                     | `none`   | Home assistant action to perform on double_tap                                                                                     |                                                                             |
| `entity_id`           | string or list             | Optional | Only reacts to the state changes of these entities. This can be used if the automatic analysis fails to find all relevant entities |                                                                             |

### <sup>1</sup> `needle_color` examples

#### Fixed single value

```yaml
needle_color: var(--info-color)
```

#### Single template value

```yaml
needle_color: "{{ 'var(--info-color)' }}"
```

#### Light/Dark Mode fixed values

```yaml
needle_color:
  light_mode: "#FF00FF"
  dark_mode: "#00FF00"
```

#### Light/Dark Mode template values

```yaml
needle_color: |-
  {{ 
    {
      "light_mode": "#FF00FF",
      "dark_mode": "#00FF00"
    }
  }}
```

### <sup>2</sup> `severity` examples

#### Fixed map

```yaml
severity:
  green: 30
  yellow: 20
  red: 0
```

#### Template map

```yaml
severityTemplate: |-
  {{
    { 
      "red": 0, 
      "yellow": 20, 
      "green": 30
    }
  }}
```

### <sup>3</sup> `segments` examples

#### Fixed list

```yaml
segments:
  - from: 0
    color: "#4caf50"
  - from: 25
    color: "#8bc34a"
  - from: 50
    color: "#ffeb3b"
  - from: 75
    color: "#ff9800"
  - from: 100
    color: "#f44336"
  - from: 125
    color: "#926bc7"
  - from: 150
    color: "#795548"
```

#### Template list

```yaml
segmentsTemplate: |-
  {{
    [
      { "from": 0, "color": "#4caf50" },
      { "from": 25, "color": "#8bc34a" },
      { "from": 50, "color": "#ffeb3b" },
      { "from": 75, "color": "#ff9800" },
      { "from": 100, "color": "#f44336" },
      { "from": 125, "color": "#926bc7" },
      { "from": 150, "color":"#795548"  }
    ]
  }}
```

## Examples

- [Energy Grid Neutrality Card](examples/energy-grid-neutrality-gauge.md)

## Installation

### HACS

Gauge Card Pro is not yet available in HACS, a request is pending. In the meantime, this repo can be added as [`custom repository`](https://www.hacs.xyz/docs/faq/custom_repositories/).

Use `https://github.com/benjamin-dcs/gauge-card-pro` as **Repository** and `Dashboard` as **Type**

### Manual

1. Download `gauge-card-pro.js` file from the [latest release][release-url].
2. Put `gauge-card-pro.js` file into your `config/www` folder.
3. Add reference to `gauge-card-pro.js` in Dashboard. There's two way to do that:
   - **Using UI:** _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_ as `/local/gauge-card-pro.js` → Set _Resource type_ as `JavaScript Module`.
     **Note:** If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_
   - **Using YAML:** Add following code to `lovelace` section.
     ```yaml
     resources:
       - url: /local/gauge-card-pro.js
         type: module
     ```

### Translations

If you want to help translating Template Gauge Card, feel free to create an [issue](https://github.com/benjamin-dcs/gauge-card-pro/issues) or fork this repo and create an pull-request.

## Support

<a href="https://www.buymeacoffee.com/benjamindcs" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Credits

This card uses some of the core functionality from [Mushroom](https://github.com/piitaya/lovelace-mushroom/)

Gradient are generated using my [up-to-date version](https://github.com/benjamin-dcs/gradient-path-updated) of [Gradient Path](https://github.com/cereallarceny/gradient-path).
