**Menu** — dropdown popover anchored to a trigger. Manages its own open state and closes on outside-click. Use for mute-with-reason, bulk-action menus, and row overflow.

```jsx
<Menu align="right" trigger={<Button size="sm">Mute ▾</Button>}>
  <MenuLabel>Mute duration</MenuLabel>
  <MenuItem onSelect={() => mute('1h')}>1 hour</MenuItem>
  <MenuItem onSelect={() => mute('24h')}>24 hours</MenuItem>
  <MenuSeparator />
  <MenuItem danger onSelect={remove}>Disable detector</MenuItem>
</Menu>
```

Exports `Menu`, `MenuItem`, `MenuLabel`, `MenuSeparator`.
