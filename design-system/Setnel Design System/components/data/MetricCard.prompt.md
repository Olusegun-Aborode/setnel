**MetricCard** — one tile in the Metrics explorer: a metric key, its latest value, and a `Sparkline` with the normal-range band (mean ±2σ). The value flips red when the latest sample sits outside the band.

```jsx
<MetricCard metricKey="aave.v3.usdc_utilization" value="94.2%"
            points={series} mean={82} sd={4.5} foot="Aave v3 · 60 samples" />
```

Pass `mean` + `sd` (band computed automatically) or an explicit `band={{ lo, hi }}`. Lay several in a `repeat(auto-fill, minmax(280px, 1fr))` grid.
