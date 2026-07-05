**SegmentedControl** — mutually-exclusive view switcher, used above trend charts to pick the breakdown dimension.

```jsx
<SegmentedControl
  value={dim}
  onChange={setDim}
  options={[
    { value: 'collection', label: 'Collection · by dashboard' },
    { value: 'alerts', label: 'Alerts · by category' },
  ]}
/>
```

Keep labels short; for many/long options prefer a Select. Pill sits in a sunken track with the active segment raised on white.
