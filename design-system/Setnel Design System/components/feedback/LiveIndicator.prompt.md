**LiveIndicator** — the console's realtime toggle. Pulsing green dot + `live · Ns` counter when active; muted grey when paused. A signature Setnel element — every console view carries one in the topbar.

```jsx
<LiveIndicator live seconds={12} onToggle={toggle} />
<LiveIndicator live={false} onToggle={toggle} />
```

Drive `seconds` from a 1s interval and reset it on refresh.
