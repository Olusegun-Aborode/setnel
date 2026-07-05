**Input** — single-line text field for actor name, incident notes, and login. Pass `mono` for ID/numeric entry, `invalid` + `hint` for validation.

```jsx
<Input placeholder="your name" maxLength={40} />
<Input label="Add a note" hint="Visible to the whole team" />
<Input mono placeholder="detector id" />
<Input invalid hint="Required" />
```

Renders bare (no wrapper) when neither `label` nor `hint` is set, so it drops into inline action forms cleanly.
