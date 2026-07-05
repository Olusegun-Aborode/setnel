**NavItem** — a single row in the app-shell sidebar. Icon + label with hover and active states; optional trailing `count` (active-incident badge) or `dot`.

```jsx
<NavItem icon={<Icon name="layout-dashboard" />} label="Console" active />
<NavItem icon={<Icon name="siren" />} label="Incidents" count={3} />
<NavItem icon={<Icon name="map" />} label="Coverage" />
```

Pass Lucide SVGs as `icon` (16px). Use inside `Sidebar` / `SidebarSection`. `as="a"` for real links.
