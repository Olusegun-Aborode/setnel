**MetricChart** — the interactive metric line for detail and drill-down views. Everything `Sparkline` lacks: hover crosshair + value/timestamp tooltip, the detector's **inline threshold line** (labeled, so chart and alert tell one story), the normal-range band, dashed mean, and fired markers. Responsive width.

```jsx
<MetricChart
  points={samples}            // [{ t: 'Jul 05 14:00', value: 91.2 }, …]
  unit="%"
  mean={82} band={{ lo: 73, hi: 91 }}
  threshold={{ value: 90, label: 'trigger 90%' }}
  fired={[52, 58]}
/>
```

Use `Sparkline` for compact tiles; use `MetricChart` when the user needs to read exact values or see the trigger.
