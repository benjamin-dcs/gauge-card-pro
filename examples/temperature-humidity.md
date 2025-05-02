![image](https://github.com/user-attachments/assets/f0b0a576-3144-4b51-9acb-31459037e89a)


```yaml
type: custom:gauge-card-pro
entity: sensor.temperature
entity2: sensor.humidity
needle: true
min: "18"
max: "21"
segments:
  - from: 18
    color: var(--blue-color)
  - from: 18.5
    color: var(--light-blue-color)
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
  mode: needle
  gradient: true
  gradient_resolution: high
  segments:
    - from: 0
      color: var(--red-color)
    - from: 40
      color: var(--light-blue-color)
    - from: 60
      color: var(--light-blue-color)
    - from: 100
      color: var(--dark-blue-color)
gradient: true
gradient_resolution: high
value_texts:
  primary: "{{ states(entity) | float | round(1) }}°C"
  secondary: "{{ states(entity2) | float | round(0) }}%"
  secondary_color: '#aaa'
titles:
  primary: Living room
```
