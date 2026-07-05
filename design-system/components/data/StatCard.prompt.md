**StatCard** — KPI tile for the console header strip. Value is always mono/tabular; `tone` tints the value and a left accent rule.

```jsx
<StatCard label="Active incidents" value="3" sub="open now" tone="warn" />
<StatCard label="Healthy" value="18/20" sub="< 24h since last check" tone="good" />
<StatCard label="Dashboards" value="20" sub="monitored" />
```

Tone maps to health: `good`/`warn`/`bad`. Lay several out in a CSS grid for the KPI strip.
