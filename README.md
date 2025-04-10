# Gauge Card Pro

### Build beautiful Gauge cards using 🛠️ templates and 🌈 gradients!

## Description

This card is based on the default [Gauge card](https://www.home-assistant.io/dashboards/gauge/), but the majority of the fields can, independently, be set with a (templatable) value. Additionally, it is possible to have a different `value` and `valueText` and a _beautiful_ 🌈
**gradient** can be applied!

![image](https://github.com/user-attachments/assets/ccefe63d-6cdc-448f-97a8-98b32e926ff0)

![image](https://github.com/user-attachments/assets/85ea5f7b-6fdd-403d-8173-025637b812db)

## Configuration variables

| Name                 | Type               | Default  | Description                                                                                                                                                          | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :------------------- | :----------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `type`               | string             | `none`   | `custom:gauge-card-pro`                                                                                                                                              |
| `entity`             | string             | Optional | Entity for template and actions (e.g.: `{{ states(entity) }}`)                                                                                                       |                                                                             |
| `value`              | string             | Optional | Value for graph                                                                                                                                                      | ✔️ (`number`)                                                               |
| `valueText`          | string             | Optional | Text for graph                                                                                                                                                       | ✔️                                                                          |
| `name`               | string             | Optional | Name of gauge entity, displayed beneath graph                                                                                                                        | ✔️                                                                          |
| `min`                | number or string   | Optional | Minimum value for graph                                                                                                                                              | ✔️ (`number`)                                                               |
| `max`                | number or string   | Optional | Maximum value for graph                                                                                                                                              | ✔️ (`number`)                                                               |
| `needle`             | boolean            | `false`  | Show the gauge as a needle gauge. Required to be set to true, if using segments                                                                                      |                                                                             |
| `severity`           | map<sup>1</sup>    | Optional | Allows setting of colors for different numbers                                                                                                                       |                                                                             |
| `severityTemplate`   | string<sup>2</sup> | `false`  | Allows setting of colors for different numbers. SeverityTemplate will override the severity settings                                                                 | ✔️ (`severity map`)                                                         |
| `segments`           | list<sup>3</sup>   | `false`  | List of colors and their corresponding start values. Segments will override the severity and severityTemplate settings. Needle required to be true                   |                                                                             |
| `segmentsTemplate`   | string<sup>4</sup> | `false`  | List of colors and their corresponding start values. SegmentsTemplate will override the severity, severityTemplate and segments settings. Needle required to be true | ✔️ (`segments array`)                                                       |
| `gradient`           | boolean            | `false`  | Shows severity(Template) or segments(Template) as a beautiful gradient                                                                                               |                                                                             |
| `gradientResolution` | Optional           | `false`  | Level of detail for the gradient. Must be `low`, `medium` or `high` (default `medium`)                                                                               |                                                                             |
| `tap_action`         | action             | `none`   | Home assistant action to perform on tap                                                                                                                              |                                                                             |
| `hold_action`        | action             | `none`   | Home assistant action to perform on hold                                                                                                                             |                                                                             |
| `double_tap_action`  | action             | `none`   | Home assistant action to perform on double_tap                                                                                                                       |                                                                             |
| `entity_id`          | string or list     | Optional | Only reacts to the state changes of these entities. This can be used if the automatic analysis fails to find all relevant entities                                   |                                                                             |

### <sup>1</sup> `severity` example

```yaml
severity:
  green: 30
  yellow: 20
  red: 0
```

### <sup>2</sup> `severityTemplate` example

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

### <sup>3</sup> `segments`

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

### <sup>4</sup> `segmentsTemplate` example

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

Gauge Card Pro is not yet available in HACS. Soon a request to be accepted will be created. In the meantime, this repo can be added as [`custom repository`](https://www.hacs.xyz/docs/faq/custom_repositories/).

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
