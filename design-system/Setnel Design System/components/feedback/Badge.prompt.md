**Badge** — small uppercase, rectangular status pill (10px, bold, 5px radius). Severity family (`info`, `warning`, `critical`, `emergency` — each a 10–12% tint of its hue) and neutral states (`resolved`, `exposure`, `count`, plain `neutral` for muted).

```jsx
<Badge variant="critical">critical</Badge>
<Badge variant="emergency">emergency</Badge>
<Badge variant="resolved">resolved</Badge>
<Badge variant="count">×12</Badge>
<Badge variant="exposure">$1.2M at risk</Badge>
```

Text renders uppercase automatically. `exposure`/`count` use tabular figures for numbers.
