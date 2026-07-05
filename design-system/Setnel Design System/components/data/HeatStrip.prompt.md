**HeatStrip** — the collection-density row in the dashboard-health matrix (14 days of data-collection intensity). Green ramp: none → low → partial → full.

```jsx
<HeatStrip levels={[3,3,2,3,1,0,3,3,2,3,3,3,2,3]} />
<HeatStrip checks={[288,240,55,0,300]} days={days} />
```

Pass `levels` (0–3) directly, or raw `checks` counts — `heatLevel(count)` buckets them against the ~288/day target (0, <60, <200, ≥200).
