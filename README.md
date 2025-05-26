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
- ✨ Additional icon indicator next to the gauge
- 🎨 Automatic color interpolation for `severity` gauges
- 😶‍🌫️ Native ability to hide the background

#### Basic customization examples

![image](https://github.com/user-attachments/assets/f8942a79-ab47-4f38-9741-efae6dbe8f4e)

#### Advanced customization examples

![image](https://github.com/user-attachments/assets/f554ee20-5ca4-4883-a7cb-fb6e59a2ac97)

## ☕ Support This Project

If you find **Gauge Card Pro** useful, consider supporting its development:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/benjamindcs)
[![GitHub Sponsors](https://img.shields.io/badge/Sponsor%20on%20GitHub-30363d?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sponsors/benjamin-dcs)

## Configuration variables

> [!IMPORTANT]
> When using the Visual Editor to empty one or more of the parameters, there often is some yaml-code left which prevents the default value of working. For example, when emptying `value`, in yaml there's `value: ""` left. In this case the default will not work. Please delete the line entirely from your yaml-code

| Name                  | Type                                                       | Default                     | Description                                                                                                                        | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :-------------------- | :--------------------------------------------------------- | :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `type`                | string                                                     |                             | `custom:gauge-card-pro`                                                                                                            |                                                                             |
| `entity`              | string                                                     | Optional                    | Entity for template and actions (e.g.: `{{ states(entity) }}`)                                                                     |                                                                             |
| `entity2`             | string                                                     | Optional                    | Entity for template and actions (e.g.: `{{ states(entity2) }}`)                                                                    |                                                                             |
| `min`                 | number                                                     | 0                           | Minimum value for graph                                                                                                            | ✔️ (only templatable in code-editor/yaml)                                   |
| `max`                 | number                                                     | 100                         | Maximum value for graph                                                                                                            | ✔️ (only templatable in code-editor/yaml)                                   |
| `needle`              | boolean                                                    | `false`                     | Show the gauge as a needle gauge                                                                                                   |                                                                             |
| `needle_color`        | [string or map<sup>5</sup>](#1-color-examples)             | `var(--primary-text-color)` | Color of the needle                                                                                                                | ✔️                                                                          |
| `segments`            | [string or list<sup>6</sup>](#2-segments-examples)         | Optional                    | List of colors and their corresponding start values. Segments will override the severity settings                                  | ✔️                                                                          |
| `gradient`            | boolean                                                    | `false`                     | Shows segments as a beautiful gradient (requires needle). Interpolates severity colors according to gradient for non-needle gauge  |                                                                             |
| `gradient_resolution` | string                                                     | `medium`                    | Level of detail for the gradient. Must be `low`, `medium` or `high`                                                                |                                                                             |
| `value`               | template                                                   | state of `entity`           | Value for graph                                                                                                                    | ✔️ (only available in code-editor/yaml)                                     |
| `inner`               | [inner object](#inner-gauge-configuration-variables)       |                             | Configuration for the inner gauge. Use `inner: {}` to use all defaults for the inner gauge                                         |                                                                             |
| `hide_background`     | boolean                                                    | `false`                     | Hides the background and border of the card                                                                                        |                                                                             |
| `setpoint`            | [setpoint object](#setpoint-configuration-variables)       |                             | Configuration for the setpoint needle                                                                                              |                                                                             |
| `titles`              | [titles object](#titles-configuration-variables)           |                             | Configuration for the titles beneath the gauge                                                                                     |                                                                             |
| `value_texts`         | [value_texts object](#value-texts-configuration-variables) |                             | Configuration for the value texts inside the gauge                                                                                 |                                                                             |
| `icon`                | [icon object](#icon-configuration-variables)               |                             | Configuration of the icon (in the upper-right corner of the card)                                                                  |                                                                             |
| `tap_action`          | action                                                     | `more-info`                 | Home assistant action to perform on tap                                                                                            |                                                                             |
| `hold_action`         | action                                                     | `none`                      | Home assistant action to perform on hold                                                                                           |                                                                             |
| `double_tap_action`   | action                                                     | `none`                      | Home assistant action to perform on double_tap                                                                                     |                                                                             |
| `entity_id`           | string or list                                             | Optional                    | Only reacts to the state changes of these entities. This can be used if the automatic analysis fails to find all relevant entities |                                                                             |

### Titles Configuration variables

| Name                  | Type                                           | Default                     | Description               | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :-------------------- | :--------------------------------------------- | :-------------------------- | :------------------------ | :-------------------------------------------------------------------------- |
| `primary`             | string                                         | Optional                    | Primary title             | ✔️                                                                          |
| `primary_color`       | [string or map<sup>5</sup>](#1-color-examples) | `var(--primary-text-color)` | Primary title color       | ✔️                                                                          |
| `primary_font_size`   | string                                         | `15px`                      | Primary title font-size   | ✔️                                                                          |
| `secondary`           | string                                         | Optional                    | Secondary title           | ✔️                                                                          |
| `secondary_color`     | [string or map<sup>5</sup>](#1-color-examples) | `var(--primary-text-color)` | Secondary title color     | ✔️                                                                          |
| `secondary_font_size` | string                                         | `14px`                      | Secondary title font-size | ✔️                                                                          |

### Value-Texts Configuration variables

| Name                          | Type                                           | Default                             | Description                                      | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :---------------------------- | :--------------------------------------------- | :---------------------------------- | :----------------------------------------------- | :-------------------------------------------------------------------------- |
| `primary`                     | string                                         | `value` or state of `entity`        | Primary value-text                               | ✔️                                                                          |
| `primary_color`               | [string or map<sup>5</sup>](#1-color-examples) | `var(--primary-text-color)`         | Primary value-text color                         | ✔️                                                                          |
| `primary_unit`                | string                                         | `unit of measurement` of `entity`   | Primary value-text unit of measurement           | ✔️                                                                          |
| `primary_font_size_reduction` | number [0-15]                                  | `0`                                 | Value by which the primary value-text is reduced | ✔️ (only templatable in code-editor/yaml)                                   |
| `secondary`                   | string                                         | `inner.value` or state of `entity2` | Secondary value-text                             | ✔️                                                                          |
| `secondary_color`             | [string or map<sup>5</sup>](#1-color-examples) | `var(--primary-text-color)`         | Secondary value-text color                       | ✔️                                                                          |
| `secondary_unit`              | string                                         | `unit of measurement` of `entity`   | Secondary value-text unit of measurement         | ✔️                                                                          |

> [!NOTE]
>
> - Both `primary` and `secondary` value-texts can be an icon. Icons are activated for texts formatted as: `icon(...)`. For example: `icon(mdi:gauge)`. Icons cannot be combined with text.
> - Use `primary_unit: ""` and/or `secondary_unit: ""` to overwrite/disable the entity unit
> - No unit is added for non-numeric value_texts.

### Inner Gauge Configuration variables

| Name                  | Type                                               | Default                     | Description                                                                                                                                    | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :-------------------- | :------------------------------------------------- | :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `min`                 | number                                             | `min` of main gauge         | Minimum value for graph                                                                                                                        | ✔️ (only templatable in code-editor/yaml)                                   |
| `max`                 | number                                             | `max` of main gauge         | Maximum value for graph                                                                                                                        | ✔️ (only templatable in code-editor/yaml)                                   |
| `mode`                | string                                             | `severity`                  | Sets the mode of the inner gauge                                                                                                               |                                                                             |
|                       |                                                    |                             | • `severity`: Shows the inner gauge as a rotating single color                                                                                 |                                                                             |
|                       |                                                    |                             | • `static`: Shows all the segments without any further indications                                                                             |                                                                             |
|                       |                                                    |                             | • `needle`: Shows all the segments with a needle                                                                                               |                                                                             |
|                       |                                                    |                             | • `on_main`: Shows a needle on the **main**-gauge. `min` and/or `max` of the inner-gauge can still be used                                     |                                                                             |
| `needle_color`        | [string or map<sup>5</sup>](#1-color-examples)     | `var(--primary-text-color)` | Color of the needle                                                                                                                            | ✔️                                                                          |
| `segments`            | [string or list<sup>6</sup>](#2-segments-examples) | Optional                    | List of colors and their corresponding start values. Segments will override the severity settings                                              | ✔️                                                                          |
| `gradient`            | boolean                                            | `false`                     | Shows segments as a beautiful gradient (for mode `static` or `needle`). Interpolates severity colors according to gradient for mode `severity` |                                                                             |
| `gradient_resolution` | string                                             | `medium`                    | Level of detail for the gradient. Must be `low`, `medium` or `high`                                                                            |                                                                             |
| `value`               | template                                           | state of `entity2`          | Value for graph                                                                                                                                | ✔️ (only available in code-editor/yaml)                                     |

### Setpoint Configuration variables

| Name    | Type                                           | Default              | Description         | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :------ | :--------------------------------------------- | :------------------- | :------------------ | :-------------------------------------------------------------------------- |
| `value` | number                                         | Required             | Value of the needle | ✔️ (only in code-editor/yaml)                                               |
| `color` | [string or map<sup>5</sup>](#1-color-examples) | `var(--error-color)` | Color of the needle | ✔️                                                                          |

### Icon Configuration variables

| Name    | Type   | Default  | Description                                                                            | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :------ | :----- | :------- | :------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `type`  | string | Required | `battery` or `template`                                                                |                                                                             |
| `value` | string | Required | value corresponding to the type                                                        |                                                                             |
|         |        |          | • `battery`: Battery entity_id                                                         | ✔️                                                                          |
|         |        |          | • `template`: Template that returns an [`Icon Template object`](#icon-template-object) | ✔️                                                                          |

#### Icon Template object

| Name    | Type   | Default  | Description                      | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :------ | :----- | :------- | :------------------------------- | :-------------------------------------------------------------------------- |
| `icon`  | string | Required | Icon                             |                                                                             |
| `color` | string | Optional | Color of the icon                |                                                                             |
| `label` | string | Optional | Label displayed beneath the icon |                                                                             |

### YAML structure (not showing segment template)

```yaml
type: custom:gauge-card-pro
entity: sensor.sensor
entity2: sensor.sensor
min: 0 | template
max: 100 | template
needle: true | false
needle_color: "#aaa" | template | light-dark-mode object
segments:
  - from: 0
    color: red
  - from: 25
    color: "#FFA500"
  - from: 50
    color: rgb(255, 255, 0)
  - from: 100
    color: var(--green-color)
gradient: true | false
gradient_resolution: medium
value: "{{ value_template }}"
inner:
  min: 0 | template
  max: 100 | template
  mode: severity | static | needle | on_main
  needle_color: "#aaa" | template | light-dark-mode object
  segments:
    - from: 0
      color: red
    - from: 25
      color: "#FFA500"
    - from: 50
      color: rgb(255, 255, 0)
    - from: 100
      color: var(--green-color)
  gradient: true | false
  gradient_resolution: medium
  value: "{{ value_template }}"
setpoint:
  value: 20 | template
  color: "#aaa" | template | light-dark-mode object
titles:
  primary: Primary Title | template
  secondary: Secondary Title | template
  primary_color: "#aaa" | template
  secondary_color: "#aaa" | template
  primary_font_size: 15px | template
  secondary_font_size: 14px | template
value_texts:
  primary: "{{ states(entity) }}"
  secondary: "{{ states(entity2) }}"
  primary_color: "#aaa"
  secondary_color: "#aaa"
  primary_unit: mm
  secondary_unit: mm
  primary_font_size_reduction: 15
icon:
  type: battery | template
  value: sensor.battery
hide_background: true | false
tap_action:
  action: more-info
hold_action:
  action: more-info
double_tap_action:
  action: more-info
```

### <sup>1</sup> Color examples

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
  light_mode: "#FF00FF"
  dark_mode: "#00FF00"
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

### <sup>2</sup> `segments` examples

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

## Credits

This card uses some of the core functionality from [Mushroom](https://github.com/piitaya/lovelace-mushroom/)

Gradient are generated using my [up-to-date version](https://github.com/benjamin-dcs/gradient-path-updated) of [Gradient Path](https://github.com/cereallarceny/gradient-path).
