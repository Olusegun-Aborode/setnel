**StatusDot** — dashboard health at a glance. **Shape encodes status** (colorblind-safe, not hue alone): `healthy` = green circle, `stale` = amber diamond (>24h since last check), `down` = red square, `idle` = grey ring.

```jsx
<StatusDot status="healthy" showLabel />
<StatusDot status="down" pulse />
<StatusDot status="stale" label="last check 31h ago" showLabel />
```

Dot-only by default (with a `title`); pass `showLabel` inside matrix rows. Reserve `pulse` for a state that just changed.
