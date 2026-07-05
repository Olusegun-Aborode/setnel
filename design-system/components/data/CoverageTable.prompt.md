**CoverageTable** — the risk-type × protocol coverage map. Shows, at a glance, which detectors cover which protocols and where the blind spots are. Cell states: `yes` (covered ●), `blocked` (blind spot ✕), `planned` (○), `na` (·).

```jsx
<CoverageTable
  protocols={['Aave v3', 'Sui Lending', 'SparkLend']}
  rows={[
    { risk: 'Utilization spike', cells: ['yes', 'yes', 'planned'] },
    { risk: 'Bad debt / underwater', cells: ['blocked', 'na', 'blocked'] },
  ]}
/>
```

Header row is sticky for long matrices; legend renders by default.
