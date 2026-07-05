**Checkbox** — row selection for bulk ack/mute and multi-select filters. Supports an `indeterminate` header state.

```jsx
<Checkbox checked={sel.has(id)} onChange={() => toggle(id)} />
<Checkbox indeterminate={someSelected} checked={allSelected} onChange={selectAll} label="Select all" />
```
