**NowPill** — the always-visible header answer to "is anything on fire right now?" Worst active severity sets the color (calm → warn → alert → emergency); shows the active count and pulses when critical. Click to jump to Incidents.

```jsx
<NowPill level={nowLevel(incidents)} count={activeCount} onClick={() => nav('incidents')} />
```

Put it in the app-shell topbar on every screen. `nowLevel(incidents)` derives the level for you.
