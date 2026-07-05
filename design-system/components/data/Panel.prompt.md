**Panel** — the section container used throughout the console (Trends, Dashboard health, Incidents, Metrics). Title + inline note on the left, optional `aside` (link or control) on the right.

```jsx
<Panel title="Dashboard health" note="Last 14 days · target ~288/day"
       aside={<a href="/coverage">coverage →</a>}>
  …matrix…
</Panel>

<Panel title="Incidents" note="4 opened in the last 24h" flush>
  …feed…
</Panel>
```

Pass `flush` for edge-to-edge content (tables, matrices).
