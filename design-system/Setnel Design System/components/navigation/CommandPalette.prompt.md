**CommandPalette** — the ⌘K/Ctrl-K navigator. Fuzzy-filters a flat command list (dashboards, detectors, incidents, metric keys, actions) with full keyboard control. Binds the global hotkey itself by default.

```jsx
<CommandPalette commands={[
  { group: 'Go to', label: 'Console', icon: <Icon name="layout-dashboard" />, run: () => nav('console') },
  { group: 'Dashboards', label: 'Aave v3', hint: '271 checks today', run: () => openDash('aave-v3') },
  { group: 'Detectors', label: 'aave.v3.utilization_spike', hint: 'z>3 · >8%', run: () => openDetector('…') },
  { group: 'Incidents', label: 'USDC utilization spike', hint: '#4821', run: () => openIncident(4821) },
]} />
```

Mount once at app root. ↑↓ navigate, ↵ select, esc close.
