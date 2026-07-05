---
name: setnel-design
description: Use this skill to generate well-branded interfaces and assets for Setnel (by Datum Labs) — a DeFi risk-monitoring console — either for production or throwaway prototypes/mocks. Contains design guidelines, colors, type, fonts, assets, and app-shell UI-kit components for prototyping monitoring/observability UIs.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `styles.css` — link this one file to get all tokens + fonts.
- `tokens/` — colors, typography, spacing, elevation, motion, base.
- `components/{forms,feedback,data,navigation,overlay}/` — 23 React primitives: Button, Input, SegmentedControl, Chip, Switch, Checkbox, TimeRange, Badge, StatusDot, LiveIndicator, NowPill, StatCard, Panel, HeatStrip, Sparkline, MetricCard, MetricChart, CoverageTable, Sidebar, SidebarSection, NavItem, CommandPalette, Menu. Namespace: `window.SetnelDesignSystem_525d6e`.
- `guidelines/cards/` — foundation specimen cards.
- `ui_kits/console/` — the full interactive app-shell recreation (13+ surfaces, ⌘K, wallboard, mobile).
- `assets/logo.png` — the real Datum Labs mark.

## The one-paragraph brief (v2)
Setnel is an "institutional monitor": bright white workspace, **persistent left sidebar app-shell**, slim content topbar, hairline-framed panels. **Ink black `#0A0A0A` is the single action color** (no blue primary). Severity is a 4-step tint scale (info→warning→critical→emergency); collection uses a green heat ramp; brand blue `#4F6EF2` is logo-only. **Geist + Geist Mono**, all data mono + tabular. Tight radii (8px base), restrained cool shadows, flat white backgrounds (no gradients/images), fast functional motion with one signature green live-pulse. Icons: **Lucide** in the sidebar; otherwise glyph/dot/heat-driven. Voice: terse on-call engineer — quantified, uppercase badges, no emoji, numbers lead. Density: very dense, maximize signal per screen.
