**TimeRange** — the global range control that lives in the header; every chart and the incident feed reads the selected window. Presets 1h/24h/7d/30d by default.

```jsx
<TimeRange value={range} onChange={setRange} />
```

Keep one instance in the topbar and thread `range` into your data queries.
