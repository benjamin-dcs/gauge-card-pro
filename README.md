# Gauge Card Pro

### Build beautiful Gauge cards using 🌈 gradients and 🛠️ templates!

## Description

Inspired by the idea to be able to recreate the Home Assistant native Energy Gauge Cards I created `Gauge Card Pro`. Built on top of the Home Assistant [Gauge card](https://www.home-assistant.io/dashboards/gauge/), but with many more features and beautiful look-and-feel!

- 🌈 Native gradient support for `segments`
- ✌️ Two gauges in one
- 🛠️ Use templates for the majority of the fields
- 🎨 Every element in the card can have its colour defined. This can be a single colour or two colours for light- or darkmode. Of course, allows templating!
- 👬 Set `value` and `value_text` independently
- 👀 Two labels underneath the gauge
- 😶‍🌫️ Native ability to hide the background

#### Basic customization examples

![image](https://github.com/user-attachments/assets/f8942a79-ab47-4f38-9741-efae6dbe8f4e)

#### Advanced customization examples

![image](https://github.com/user-attachments/assets/f1208185-ec93-4499-ba05-119300df90f8)

## Configuration variables

> [!IMPORTANT]
> When using the Visual Editor to empty one or more of the parameters, there often is some yaml-code left which prevents the default value of working. For example, when emptying `value`, in yaml there's `value: ""` left. In this case the default will not work. Please delete the line entirely from your yaml-code

| Name                  | Type                                                 | Default                                  | Description                                                                                                                        | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :-------------------- | :--------------------------------------------------- | :--------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `type`                | string                                               |                                          | `custom:gauge-card-pro`                                                                                                            |                                                                             |
| `entity`              | string                                               | Optional                                 | Entity for template and actions (e.g.: `{{ states(entity) }}`)                                                                     |                                                                             |
| `entity2`             | string                                               | Optional                                 | Entity for template and actions (e.g.: `{{ states(entity2) }}`)                                                                    |                                                                             |
| `value`               | template                                             | [Template<sup>1</sup>](#1-value-default) | Value for graph                                                                                                                    | ✔️                                                                          |
| `min`                 | number                                               | 0                                        | Minimum value for graph                                                                                                            | ✔️                                                                          |
| `max`                 | number                                               | 100                                      | Maximum value for graph                                                                                                            | ✔️                                                                          |
| `titles`              | [text object](#text-configuration-variables)         |                                          | Configuration for the titles beneath the gauge                                                                                     |                                                                             |
| `value_texts`         | [text object](#text-configuration-variables)         |                                          | Configuration for the value texts inside the gauge                                                                                 |                                                                             |
| `needle`              | boolean                                              | `false`                                  | Show the gauge as a needle gauge                                                                                                   |                                                                             |
| `needle_color`        | [string or map<sup>5</sup>](#5-color-examples)       | `var(--primary-text-color)`              | Color of the needle                                                                                                                | ✔️                                                                          |
| `segments`            | [string or list<sup>6</sup>](#6-segments-examples)   | Optional                                 | List of colors and their corresponding start values. Segments will override the severity settings                                  | ✔️                                                                          |
| `gradient`            | boolean                                              | `false`                                  | Shows severity or segments as a beautiful gradient. Requires needle                                                                |                                                                             |
| `gradient_resolution` | string                                               | `medium`                                 | Level of detail for the gradient. Must be `low`, `medium` or `high`                                                                |                                                                             |
| `color_interpolation` | boolean                                              | `false`                                  | Interpolate colors for severity or segments. Requires needle to be off                                                             |                                                                             |
| `inner`               | [inner object](#inner-gauge-configuration-variables) |                                          | Configuration for the inner gauge. Use `inner: {}` to use all defaults for the inner gauge                                         |                                                                             |
| `setpoint`            | [setpoint object](#setpoint-configuration-variables) |                                          | Configuration for the setpoint needle                                                                                              |                                                                             |
| `hide_background`     | boolean                                              | `false`                                  | Hides the background and border of the card                                                                                        |                                                                             |
| `tap_action`          | action                                               | `more-info`                              | Home assistant action to perform on tap                                                                                            |                                                                             |
| `hold_action`         | action                                               | `none`                                   | Home assistant action to perform on hold                                                                                           |                                                                             |
| `double_tap_action`   | action                                               | `none`                                   | Home assistant action to perform on double_tap                                                                                     |                                                                             |
| `entity_id`           | string or list                                       | Optional                                 | Only reacts to the state changes of these entities. This can be used if the automatic analysis fails to find all relevant entities |                                                                             |

### Text Configuration variables

| Name              | Type                                           | Default                     | Description          | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :---------------- | :--------------------------------------------- | :-------------------------- | :------------------- | :-------------------------------------------------------------------------- |
| `primary`         | string                                         | Optional                    | Primary text         | ✔️                                                                          |
| `primary_color`   | [string or map<sup>5</sup>](#5-color-examples) | `var(--primary-text-color)` | Primary text color   | ✔️                                                                          |
| `secondary`       | string                                         | Optional                    | Secondary text       | ✔️                                                                          |
| `secondary_color` | [string or map<sup>5</sup>](#5-color-examples) | `var(--primary-text-color)` | Secondary text color | ✔️                                                                          |

### Inner Gauge Configuration variables

| Name                  | Type                                               | Default                     | Description                                                                                       | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :-------------------- | :------------------------------------------------- | :-------------------------- | :------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------- |
| `value`               | template                                           | 0                           | Value for graph                                                                                   | ✔️                                                                          |
| `min`                 | number                                             | `min` of main gauge         | Minimum value for graph                                                                           | ✔️                                                                          |
| `max`                 | number                                             | `max` of main gauge         | Maximum value for graph                                                                           | ✔️                                                                          |
| `mode`                | string                                             | `severity`                  | Sets the mode of the inner gauge                                                                  |                                                                             |
|                       |                                                    |                             | • `severity`: Shows the inner gauge as a rotating single color                                    |                                                                             |
|                       |                                                    |                             | • `static`: Shows all the segments without any further indications                                |                                                                             |
|                       |                                                    |                             | • `needle`: Shows all the segments with a needle                                                  |                                                                             |
| `needle_color`        | [string or map<sup>5</sup>](#5-color-examples)     | `var(--primary-text-color)` | Color of the needle                                                                               | ✔️                                                                          |
| `segments`            | [string or list<sup>6</sup>](#6-segments-examples) | Optional                    | List of colors and their corresponding start values. Segments will override the severity settings | ✔️                                                                          |
| `gradient`            | boolean                                            | `false`                     | Shows severity or segments as a beautiful gradient. Requires needle                               |                                                                             |
| `gradient_resolution` | string                                             | `medium`                    | Level of detail for the gradient. Must be `low`, `medium` or `high`                               |                                                                             |
| `color_interpolation` | boolean                                            | `false`                     | Interpolate colors for severity or segments                                                       |                                                                             |

### Setpoint Configuration variables

| Name    | Type                                           | Default              | Description         | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :------ | :--------------------------------------------- | :------------------- | :------------------ | :-------------------------------------------------------------------------- |
| `value` | template                                       | Required             | Value of the needle | ✔️                                                                          |
| `color` | [string or map<sup>5</sup>](#5-color-examples) | `var(--error-color)` | Color of the needle | ✔️                                                                          |

### Configuration defaults

#### <sup>1</sup> `value` default

```yaml
'{{ states(entity) | float(0) }}'
```

#### <sup>2</sup> `primary value_text` default

```yaml
'{{ states(entity) | float(0) | round(1) }}'
```

#### <sup>3</sup> inner `value` default

```yaml
'{{ states(entity2) | float(0) }}'
```

#### <sup>4</sup> `secondary value_text` default

```yaml
'{{ states(entity2) | float(0) | round(1) }}'
```

### <sup>5</sup> Color examples

#### Fixed single value

```yaml
primary_color: var(--info-color)
```

#### Single template value

```yaml
primary_color: "{{ 'var(--info-color)' }}"
```

#### Light/Dark Mode fixed values

```yaml
primary_color:
  light_mode: '#FF00FF'
  dark_mode: '#00FF00'
```

#### Light/Dark Mode template values

```yaml
primary_color: |-
  {{ 
    {
      "light_mode": "#FF00FF",
      "dark_mode": "#00FF00"
    }
  }}
```

### <sup>6</sup> `segments` examples

#### Fixed list

```yaml
segments:
  - from: 0
    color: '#4caf50'
  - from: 25
    color: '#8bc34a'
  - from: 50
    color: '#ffeb3b'
  - from: 75
    color: '#ff9800'
  - from: 100
    color: '#f44336'
  - from: 125
    color: '#926bc7'
  - from: 150
    color: '#795548'
```

#### Template list

```yaml
segments: |-
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

## [Examples](examples)

- [Energy Grid Neutrality Card](examples/energy-grid-neutrality-gauge.md) - Just like the official `Energy Grid Neutrality Gauge`, but **live** and **custom**!
- [Temperature and Humidity Gauge](examples/temperature-humidity.md)

## Installation

### HACS

Gauge Card Pro is not yet available in HACS, a [request](https://github.com/hacs/default/pull/3281) is pending. In the meantime, this repo can be added as [`custom repository`](https://www.hacs.xyz/docs/faq/custom_repositories/).

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
