**Chip** — toggle filter over the incident feed (status, severity, per-dashboard). Selected state inverts to solid ink for a clear on/off read.

```jsx
<Chip active>Active</Chip>
<Chip>All</Chip>
<Chip count={12}>Aave v3</Chip>
<Chip as="a" href="?severity=critical">Critical</Chip>
```

Use `as="a"` when the filter is URL-driven (matches the app's `FilterLink`). `count` renders a mono tabular number.
