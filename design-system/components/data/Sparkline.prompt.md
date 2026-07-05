**Sparkline** — the compact metric line used on Metrics, Backtest and incident detail. Shade a normal-range band, dash the mean, and mark backtest fires.

```jsx
<Sparkline points={series} />
<Sparkline points={series} mean={mean} band={{ lo: mean - 2*sd, hi: mean + 2*sd }} />
<Sparkline points={series} fired={[12, 40, 41]} />
```

The last point auto-dots red when it falls outside `band`. Stretches to its container via `preserveAspectRatio="none"` — size it with the `width`/`height` props.
