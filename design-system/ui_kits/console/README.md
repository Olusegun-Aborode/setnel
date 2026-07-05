# Console — Setnel UI kit

An interactive, high-fidelity recreation of the **Setnel** monitoring console, composed entirely from the design-system primitives (`Button`, `Badge`, `StatCard`, `Panel`, `Chip`, `SegmentedControl`, `HeatStrip`, `Sparkline`, `StatusDot`, `LiveIndicator`, `Input`).

Open `index.html` and click through:

1. **Login gate** — the "Enter" screen → click Enter.
2. **Console** — KPI strip, SLA row, filterable multi-line **Trends** chart, **Dashboard health** matrix (14-day collection heat), and the **Incidents** feed. Filter incidents by status / severity / dashboard; **Ack / Mute / FP** actions mutate state live; click any incident to open its detail.
3. **Incident detail** — header + actions, runbook, metric sparkline with normal-range band, and the events + notes timeline.
4. **Metrics** — per-dashboard band charts (mean ±2σ); values turn red when out of band. (Topbar's Backtest / Runbooks route here as a stand-in.)

The realtime **live** pill in the topbar counts up and can be paused.

## Files
- `index.html` — app shell + routing/state, load order, toast.
- `data.js` — demo dataset mirroring Datum Labs' real dashboards & vocabulary (`window.SETNEL_DATA`).
- `Login.jsx`, `Topbar.jsx`, `Console.jsx`, `TrendChart.jsx`, `HealthMatrix.jsx`, `IncidentFeed.jsx`, `IncidentDetail.jsx`, `MetricsView.jsx` — screens, each exporting to `window`.

## Notes
This is a cosmetic recreation of the existing product's structure (from the attached `setnel/` Next.js route code), not production logic. `TrendChart` and the band/spark charts reproduce the app's own SVG math. The current live product ships without a bundled design language — this kit demonstrates the upgraded system applied end-to-end.
