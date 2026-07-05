**Sidebar** — the app-shell left rail introduced in the v2 rework: brand lockup on top, scrollable `SidebarSection` groups of `NavItem`s in the middle, and a footer (actor + `LiveIndicator` + sign-out).

```jsx
<Sidebar
  brand={<><img src="logo.png" /><div><div className="name">Setnel</div></div></>}
  footer={<LiveIndicator live seconds={12} />}>
  <SidebarSection label="Monitor">
    <NavItem icon={<Icon name="layout-dashboard" />} label="Console" active />
    <NavItem icon={<Icon name="siren" />} label="Incidents" count={3} />
  </SidebarSection>
  <SidebarSection label="Analyze">
    <NavItem icon={<Icon name="activity" />} label="Metrics" />
    <NavItem icon={<Icon name="map" />} label="Coverage" />
  </SidebarSection>
</Sidebar>
```

Fixed `--sidebar-w` (216px). Pair with a `min-width:0` content column that scrolls independently.
