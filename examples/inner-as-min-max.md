![image](https://github.com/user-attachments/assets/1b4a0078-7d0c-417c-a51a-f63ee8f0339d)

```yaml
inner:
  mode: static
  segments: |
    {% set min = states('sensor.min') | float %}
    {% set max = states('sensor.max') | float %}
    {{
      [
        { "from": 0, "color": "#eeeeee" },
        { "from": min, "color": "var(--info-color)" },
        { "from": max, "color":"#eeeeee"  }
      ]
    }}
```
