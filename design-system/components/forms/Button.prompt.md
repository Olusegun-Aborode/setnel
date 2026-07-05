**Button** — the workhorse action control. Ink-black is Setnel's single action color; secondary is a white outline that darkens its border on hover. Use `primary` for the one confirming action, `danger` for destructive (False positive), `ghost` for low-emphasis, `lg` for login/submit.

```jsx
<Button variant="primary">Acknowledge</Button>
<Button>Mute 1h</Button>
<Button variant="danger">False positive</Button>
<Button as="a" href="#" variant="ghost">Open dashboard ↗</Button>
<Button variant="primary" size="lg">Enter</Button>
```

Variants: `primary` · `secondary` (default) · `ghost` · `danger`. Sizes: `sm` · `md` · `lg`. Supports `iconLeft`/`iconRight`, `disabled`, `as="a"`.
