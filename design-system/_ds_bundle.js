/* @ds-bundle: {"format":4,"namespace":"SetnelDesignSystem_525d6e","components":[{"name":"CoverageTable","sourcePath":"components/data/CoverageTable.jsx"},{"name":"HeatStrip","sourcePath":"components/data/HeatStrip.jsx"},{"name":"MetricCard","sourcePath":"components/data/MetricCard.jsx"},{"name":"MetricChart","sourcePath":"components/data/MetricChart.jsx"},{"name":"Panel","sourcePath":"components/data/Panel.jsx"},{"name":"Sparkline","sourcePath":"components/data/Sparkline.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"LiveIndicator","sourcePath":"components/feedback/LiveIndicator.jsx"},{"name":"NowPill","sourcePath":"components/feedback/NowPill.jsx"},{"name":"StatusDot","sourcePath":"components/feedback/StatusDot.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Chip","sourcePath":"components/forms/Chip.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"TimeRange","sourcePath":"components/forms/TimeRange.jsx"},{"name":"CommandPalette","sourcePath":"components/navigation/CommandPalette.jsx"},{"name":"NavItem","sourcePath":"components/navigation/NavItem.jsx"},{"name":"SidebarSection","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"MenuItem","sourcePath":"components/overlay/Menu.jsx"},{"name":"MenuLabel","sourcePath":"components/overlay/Menu.jsx"},{"name":"MenuSeparator","sourcePath":"components/overlay/Menu.jsx"},{"name":"Menu","sourcePath":"components/overlay/Menu.jsx"}],"sourceHashes":{"components/data/CoverageTable.jsx":"cadc0d833beb","components/data/HeatStrip.jsx":"78755aff1ac8","components/data/MetricCard.jsx":"21d3d16b0702","components/data/MetricChart.jsx":"6cdd038c0403","components/data/Panel.jsx":"7dfff1c964fd","components/data/Sparkline.jsx":"b4249154630b","components/data/StatCard.jsx":"821539c903f1","components/feedback/Badge.jsx":"7ba7b41ce9bd","components/feedback/LiveIndicator.jsx":"edfbaca3bcf9","components/feedback/NowPill.jsx":"15bcf2a8ea03","components/feedback/StatusDot.jsx":"927ac8ed01e4","components/forms/Button.jsx":"09d02943e919","components/forms/Checkbox.jsx":"e1f1e923a94a","components/forms/Chip.jsx":"c0f95002f36d","components/forms/Input.jsx":"df75e95b440d","components/forms/SegmentedControl.jsx":"0f75b0224449","components/forms/Switch.jsx":"a4321caeefc6","components/forms/TimeRange.jsx":"d7fe379634ba","components/navigation/CommandPalette.jsx":"cb8b744bb42e","components/navigation/NavItem.jsx":"73e878238c74","components/navigation/Sidebar.jsx":"621c6dc70dfa","components/overlay/Menu.jsx":"04317fd0cdfe","ui_kits/console/Backtest.jsx":"57a358bb1a06","ui_kits/console/Console.jsx":"4fb4e5bb8994","ui_kits/console/Coverage.jsx":"4684ef21af0c","ui_kits/console/Dashboards.jsx":"ebc865e41112","ui_kits/console/Detectors.jsx":"e7ca89dee939","ui_kits/console/EmptyState.jsx":"d073b4577c6f","ui_kits/console/Escalation.jsx":"792c3d440d06","ui_kits/console/HealthMatrix.jsx":"f5e003649bc1","ui_kits/console/Inbox.jsx":"0a0f50df6212","ui_kits/console/IncidentDetail.jsx":"5db2e6a287d9","ui_kits/console/IncidentFeed.jsx":"7f1ab4969ce6","ui_kits/console/Login.jsx":"9a56b9677fc1","ui_kits/console/Metrics.jsx":"3220280b25d0","ui_kits/console/Mobile.jsx":"497c5db47180","ui_kits/console/Reports.jsx":"fd984f73e64d","ui_kits/console/Runbooks.jsx":"0e8498764fcd","ui_kits/console/Settings.jsx":"23b23eaef27b","ui_kits/console/Shell.jsx":"84429165cb62","ui_kits/console/TrendChart.jsx":"56d7c65b96e6","ui_kits/console/Wallboard.jsx":"8582fbd4fb6a","ui_kits/console/data.js":"41cf7d75be3f"},"inlinedExternals":[],"unexposedExports":[{"name":"heatLevel","sourcePath":"components/data/HeatStrip.jsx"},{"name":"nowLevel","sourcePath":"components/feedback/NowPill.jsx"}]} */

(() => {

const __ds_ns = (window.SetnelDesignSystem_525d6e = window.SetnelDesignSystem_525d6e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data/CoverageTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-coverage';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-cov-wrap { overflow-x: auto; }
  .sds-cov { border-collapse: collapse; width: 100%; font-size: var(--text-13); }
  .sds-cov th, .sds-cov td { padding: 7px 10px; border-bottom: 1px solid var(--border); text-align: center; }
  .sds-cov thead th { color: var(--muted); font-weight: var(--weight-semibold); font-size: var(--text-xs); position: sticky; top: 0; background: var(--panel); }
  .sds-cov__risk { text-align: left; font-weight: 550; white-space: nowrap; color: var(--ink); }
  .sds-cov__key { display: inline-block; width: 16px; text-align: center; font-weight: var(--weight-bold); font-family: var(--font-mono); }
  .sds-cov__yes     { color: var(--cov-yes); }
  .sds-cov__blocked { color: var(--cov-blocked); }
  .sds-cov__planned { color: var(--cov-planned); }
  .sds-cov__na      { color: var(--cov-na); }
  .sds-cov__legend { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 12px; font-size: var(--text-xs); color: var(--muted); }
  .sds-cov__legend span { display: inline-flex; align-items: center; gap: 6px; }
  `;
  document.head.appendChild(el);
}
const GLYPH = {
  yes: '\u25CF',
  blocked: '\u2715',
  planned: '\u25CB',
  na: '\u00B7'
};
const LEGEND = [['yes', 'covered'], ['blocked', 'blind spot'], ['planned', 'planned'], ['na', 'n/a']];

/**
 * CoverageTable — the risk-type × protocol coverage map. Each cell is a state:
 * `yes` (covered), `blocked` (blind spot), `planned`, or `na`.
 */
function CoverageTable({
  protocols,
  rows,
  legend = true,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `sds-cov-wrap ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("table", {
    className: "sds-cov"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "sds-cov__risk"
  }, "Risk type"), protocols.map(p => /*#__PURE__*/React.createElement("th", {
    key: p
  }, p)))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.risk
  }, /*#__PURE__*/React.createElement("td", {
    className: "sds-cov__risk"
  }, r.risk), r.cells.map((c, i) => /*#__PURE__*/React.createElement("td", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: `sds-cov__key sds-cov__${c}`,
    title: c
  }, GLYPH[c] || GLYPH.na))))))), legend ? /*#__PURE__*/React.createElement("div", {
    className: "sds-cov__legend"
  }, LEGEND.map(([k, l]) => /*#__PURE__*/React.createElement("span", {
    key: k
  }, /*#__PURE__*/React.createElement("span", {
    className: `sds-cov__key sds-cov__${k}`
  }, GLYPH[k]), l))) : null);
}
Object.assign(__ds_scope, { CoverageTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/CoverageTable.jsx", error: String((e && e.message) || e) }); }

// components/data/HeatStrip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-heatstrip';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-heat { display: inline-flex; gap: 3px; }
  .sds-heat__cell { width: 14px; height: 14px; border-radius: 3px; flex: none; }
  .sds-heat__cell--0 { background: var(--lvl0); }
  .sds-heat__cell--1 { background: var(--lvl1); }
  .sds-heat__cell--2 { background: var(--lvl2); }
  .sds-heat__cell--3 { background: var(--lvl3); }
  `;
  document.head.appendChild(el);
}

/** Map a raw check count to a 0–3 heat level (mirrors the app's ~288/day target). */
function heatLevel(checks) {
  if (checks <= 0) return 0;
  if (checks < 60) return 1;
  if (checks < 200) return 2;
  return 3;
}

/**
 * HeatStrip — a row of collection-heat cells (dashboard-health matrix). Pass
 * `levels` (0–3) directly, or raw `checks` counts to be bucketed.
 */
function HeatStrip({
  levels,
  checks,
  days,
  className = '',
  ...rest
}) {
  const cells = levels != null ? levels : (checks || []).map(c => heatLevel(c));
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `sds-heat ${className}`.trim()
  }, rest), cells.map((lvl, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `sds-heat__cell sds-heat__cell--${lvl}`,
    title: days && days[i] ? `${days[i]}: level ${lvl}` : `level ${lvl}`
  })));
}
Object.assign(__ds_scope, { heatLevel, HeatStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/HeatStrip.jsx", error: String((e && e.message) || e) }); }

// components/data/MetricChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MetricChart — the interactive metric line for detail/drill-down views. Adds
 * everything Sparkline lacks: hover crosshair + value/timestamp tooltip, an inline
 * detector threshold line (the actual trigger, labeled), the normal-range band,
 * dashed mean, and fired-point markers. Responsive width via a ResizeObserver.
 */
function MetricChart({
  points,
  // [{ t, value }] or [number]
  height = 220,
  band = null,
  // { lo, hi }
  mean = null,
  threshold = null,
  // { value, label } — inline trigger line
  fired = [],
  // indices
  unit = '',
  stroke = 'var(--ink)',
  className = '',
  ...rest
}) {
  const wrapRef = React.useRef(null);
  const [w, setW] = React.useState(720);
  const [hover, setHover] = React.useState(null);
  React.useEffect(() => {
    if (!wrapRef.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setW(Math.max(240, e.contentRect.width));
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);
  const data = points.map((p, i) => typeof p === 'number' ? {
    t: i,
    value: p
  } : p);
  const n = data.length;
  const padL = 46,
    padR = 14,
    padT = 12,
    padB = 24;
  const innerW = w - padL - padR,
    innerH = height - padT - padB;
  const vals = data.map(d => d.value);
  let lo = Math.min(...vals),
    hi = Math.max(...vals);
  if (band) {
    lo = Math.min(lo, band.lo);
    hi = Math.max(hi, band.hi);
  }
  if (threshold) {
    lo = Math.min(lo, threshold.value);
    hi = Math.max(hi, threshold.value);
  }
  const range = hi - lo || 1;
  const pad = range * 0.08;
  lo -= pad;
  hi += pad;
  const R = hi - lo;
  const x = i => padL + (n <= 1 ? 0 : i / (n - 1) * innerW);
  const y = v => padT + (1 - (v - lo) / R) * innerH;
  const line = vals.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => lo + R * f);
  const firedSet = new Set(fired);
  const fmt = v => {
    const s = Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(1);
    return unit === '$' ? `$${s}` : `${s}${unit}`;
  };
  const fmtT = d => d.label || (typeof d.t === 'string' ? d.t : `t${d.t}`);
  const onMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width * w;
    const i = Math.max(0, Math.min(n - 1, Math.round((px - padL) / innerW * (n - 1))));
    setHover(i);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: wrapRef,
    className: `sds-mchart ${className}`.trim(),
    style: {
      width: '100%'
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${height}`,
    width: "100%",
    height: height,
    style: {
      display: 'block'
    },
    onMouseMove: onMove,
    onMouseLeave: () => setHover(null),
    role: "img",
    "aria-label": "metric chart"
  }, ticks.map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: padL + innerW,
    y1: y(t),
    y2: y(t),
    stroke: "var(--border)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 8,
    y: y(t) + 3,
    textAnchor: "end",
    fontSize: "10.5",
    fill: "var(--faint)",
    fontFamily: "var(--font-mono)"
  }, fmt(t)))), band ? /*#__PURE__*/React.createElement("rect", {
    x: padL,
    y: y(band.hi),
    width: innerW,
    height: Math.max(1, y(band.lo) - y(band.hi)),
    fill: "var(--ink)",
    fillOpacity: "0.06"
  }) : null, mean != null ? /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: padL + innerW,
    y1: y(mean),
    y2: y(mean),
    stroke: "var(--faint)",
    strokeWidth: "0.8",
    strokeDasharray: "3 3"
  }) : null, threshold ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: padL + innerW,
    y1: y(threshold.value),
    y2: y(threshold.value),
    stroke: "var(--critical)",
    strokeWidth: "1.4",
    strokeDasharray: "5 3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: padL + innerW - 96,
    y: y(threshold.value) - 17,
    width: "96",
    height: "15",
    rx: "3",
    fill: "var(--critical)"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL + innerW - 48,
    y: y(threshold.value) - 6,
    textAnchor: "middle",
    fontSize: "9.5",
    fill: "#fff",
    fontFamily: "var(--font-mono)",
    fontWeight: "600"
  }, threshold.label || `trigger ${fmt(threshold.value)}`)) : null, /*#__PURE__*/React.createElement("polyline", {
    points: line,
    fill: "none",
    stroke: stroke,
    strokeWidth: "1.8",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), [...firedSet].map(i => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x(i),
    cy: y(vals[i]),
    r: "3",
    fill: "var(--critical)"
  })), hover != null ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: x(hover),
    x2: x(hover),
    y1: padT,
    y2: padT + innerH,
    stroke: "var(--ink)",
    strokeWidth: "1",
    strokeOpacity: "0.25"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: x(hover),
    cy: y(vals[hover]),
    r: "3.5",
    fill: "var(--ink)",
    stroke: "#fff",
    strokeWidth: "1.5"
  })) : null), hover != null ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: Math.min(w - 150, Math.max(0, x(hover) - 60)),
      top: -height + 6,
      background: 'var(--ink)',
      color: '#fff',
      borderRadius: 6,
      padding: '5px 8px',
      fontSize: 11,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-pop)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600
    }
  }, fmt(vals[hover])), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      opacity: 0.7,
      fontSize: 10
    }
  }, fmtT(data[hover])))) : null);
}
Object.assign(__ds_scope, { MetricChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MetricChart.jsx", error: String((e && e.message) || e) }); }

// components/data/Panel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-panel';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-panel { background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius-panel); }
  .sds-panel__head {
    display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
    padding: 14px 18px 0;
  }
  .sds-panel__head--divided { padding-bottom: 12px; border-bottom: 1px solid var(--border); }
  .sds-panel__titles { display: flex; align-items: baseline; gap: 12px; min-width: 0; flex-wrap: wrap; }
  .sds-panel__title { font: var(--font-heading); font-weight: 650; letter-spacing: var(--tracking-tight); color: var(--ink); }
  .sds-panel__note { font-size: var(--text-xs); color: var(--muted); }
  .sds-panel__aside { flex: none; font-size: var(--text-13); }
  .sds-panel__body { padding: 14px 18px 16px; }
  .sds-panel__body--flush { padding: 0; }
  `;
  document.head.appendChild(el);
}

/** Panel — the section container for every console view. */
function Panel({
  title,
  note,
  aside,
  children,
  flush = false,
  divided = false,
  className = '',
  ...rest
}) {
  const hasHead = title || note || aside;
  return /*#__PURE__*/React.createElement("section", _extends({
    className: `sds-panel ${className}`.trim()
  }, rest), hasHead ? /*#__PURE__*/React.createElement("div", {
    className: `sds-panel__head ${divided ? 'sds-panel__head--divided' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "sds-panel__titles"
  }, title ? /*#__PURE__*/React.createElement("h2", {
    className: "sds-panel__title"
  }, title) : null, note ? /*#__PURE__*/React.createElement("span", {
    className: "sds-panel__note"
  }, note) : null), aside ? /*#__PURE__*/React.createElement("div", {
    className: "sds-panel__aside"
  }, aside) : null) : null, /*#__PURE__*/React.createElement("div", {
    className: `sds-panel__body ${flush ? 'sds-panel__body--flush' : ''}`
  }, children));
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Panel.jsx", error: String((e && e.message) || e) }); }

// components/data/Sparkline.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Sparkline — the compact metric line used across Metrics, Backtest and incident
 * detail. Optionally shades a normal-range band (mean ±2σ), marks fired points,
 * and dots the latest value red when it sits out of band.
 */
function Sparkline({
  points,
  width = 300,
  height = 84,
  pad = 6,
  band = null,
  // { lo, hi } in value units — draws the grey normal-range band
  mean = null,
  // draws a dashed baseline
  fired = [],
  // indices to mark (backtest fires)
  stroke = 'var(--ink)',
  strokeWidth = 1.6,
  showLast = true,
  className = '',
  ...rest
}) {
  const vals = points.map(p => typeof p === 'number' ? p : p.value);
  const n = vals.length;
  if (n === 0) return /*#__PURE__*/React.createElement("svg", _extends({
    width: width,
    height: height,
    className: className
  }, rest));
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  if (band) {
    lo = Math.min(lo, band.lo);
    hi = Math.max(hi, band.hi);
  }
  const range = hi - lo || 1;
  const x = i => pad + (n <= 1 ? 0 : i / (n - 1) * (width - 2 * pad));
  const y = v => pad + (1 - (v - lo) / range) * (height - 2 * pad);
  const line = vals.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const last = vals[n - 1];
  const outOfBand = band ? last > band.hi || last < band.lo : false;
  const firedSet = new Set(fired);
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: `0 0 ${width} ${height}`,
    width: width,
    height: height,
    preserveAspectRatio: "none",
    className: `sds-spark ${className}`.trim(),
    role: "img",
    "aria-label": "metric sparkline"
  }, rest), band ? /*#__PURE__*/React.createElement("rect", {
    x: pad,
    y: y(band.hi),
    width: width - 2 * pad,
    height: Math.max(1, y(band.lo) - y(band.hi)),
    fill: "var(--ink)",
    fillOpacity: "0.06"
  }) : null, mean != null ? /*#__PURE__*/React.createElement("line", {
    x1: pad,
    x2: width - pad,
    y1: y(mean),
    y2: y(mean),
    stroke: "var(--faint)",
    strokeWidth: "0.8",
    strokeDasharray: "3 3"
  }) : null, /*#__PURE__*/React.createElement("polyline", {
    points: line,
    fill: "none",
    stroke: stroke,
    strokeWidth: strokeWidth,
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), [...firedSet].map(i => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x(i),
    cy: y(vals[i]),
    r: "2.6",
    fill: "var(--critical)"
  })), showLast ? /*#__PURE__*/React.createElement("circle", {
    cx: x(n - 1),
    cy: y(last),
    r: "3",
    fill: outOfBand ? 'var(--critical)' : stroke
  }) : null);
}
Object.assign(__ds_scope, { Sparkline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Sparkline.jsx", error: String((e && e.message) || e) }); }

// components/data/MetricCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-metriccard';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-metric { border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 12px; background: var(--panel); }
  .sds-metric__head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
  .sds-metric__key { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--muted); }
  .sds-metric__val { font-family: var(--font-mono); font-weight: var(--weight-semibold); font-size: var(--text-13); font-variant-numeric: tabular-nums; color: var(--ink); }
  .sds-metric__val--out { color: var(--critical); }
  .sds-metric__foot { font-size: 10.5px; color: var(--faint); margin-top: 4px; }
  `;
  document.head.appendChild(el);
}

/**
 * MetricCard — a single metric in the explorer: key + latest value + a Sparkline
 * with its normal-range band. Value turns red when the latest sample is out of band.
 */
function MetricCard({
  metricKey,
  value,
  points,
  mean,
  sd,
  band,
  foot,
  outOfBand,
  className = '',
  ...rest
}) {
  const resolvedBand = band || (mean != null && sd != null ? {
    lo: mean - 2 * sd,
    hi: mean + 2 * sd
  } : null);
  const last = points && points.length ? typeof points[points.length - 1] === 'number' ? points[points.length - 1] : points[points.length - 1].value : null;
  const out = outOfBand != null ? outOfBand : resolvedBand && last != null ? last > resolvedBand.hi || last < resolvedBand.lo : false;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `sds-metric ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sds-metric__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sds-metric__key"
  }, metricKey), /*#__PURE__*/React.createElement("span", {
    className: `sds-metric__val ${out ? 'sds-metric__val--out' : ''}`
  }, value)), /*#__PURE__*/React.createElement(__ds_scope.Sparkline, {
    points: points,
    mean: mean,
    band: resolvedBand,
    width: 300,
    height: 84
  }), foot ? /*#__PURE__*/React.createElement("div", {
    className: "sds-metric__foot"
  }, foot) : null);
}
Object.assign(__ds_scope, { MetricCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MetricCard.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-statcard';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-stat {
    display: flex; flex-direction: column; gap: 2px; padding: var(--pad-kpi);
    background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius); min-width: 0;
  }
  .sds-stat__label { font-size: var(--text-2xs); text-transform: uppercase; letter-spacing: var(--tracking-caps); color: var(--muted); }
  .sds-stat__value {
    font-family: var(--font-sans); font-weight: var(--weight-bold); font-size: var(--text-kpi);
    letter-spacing: var(--tracking-tighter); color: var(--ink); font-variant-numeric: tabular-nums;
    margin: 6px 0 2px; line-height: 1.05;
  }
  .sds-stat--good .sds-stat__value { color: var(--good); }
  .sds-stat--warn .sds-stat__value { color: var(--warning); }
  .sds-stat--bad  .sds-stat__value { color: var(--critical); }
  .sds-stat__sub { font-size: var(--text-xs); color: var(--faint); }
  `;
  document.head.appendChild(el);
}

/** StatCard (KPI) — console header metric. Tone tints the value only. */
function StatCard({
  label,
  value,
  sub,
  tone,
  className = '',
  ...rest
}) {
  const cls = ['sds-stat', tone ? `sds-stat--${tone}` : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sds-stat__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "sds-stat__value"
  }, value), sub ? /*#__PURE__*/React.createElement("div", {
    className: "sds-stat__sub"
  }, sub) : null);
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-badge';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-family: var(--font-sans); font-size: 10px; font-weight: var(--weight-bold);
    text-transform: uppercase; letter-spacing: var(--tracking-caps-sm); line-height: 1;
    padding: var(--pad-badge); border-radius: var(--radius-badge); white-space: nowrap;
    background: var(--panel-2); color: var(--muted);
  }
  .sds-badge--num { font-variant-numeric: tabular-nums; }
  .sds-badge--info      { background: var(--info-bg);      color: var(--info); }
  .sds-badge--warning   { background: var(--warning-bg);   color: var(--warning); }
  .sds-badge--critical  { background: var(--critical-bg);  color: var(--critical); }
  .sds-badge--emergency { background: var(--emergency-bg); color: var(--emergency); }
  .sds-badge--resolved  { background: var(--good-bg);      color: var(--good); }
  .sds-badge--exposure  { background: var(--exposure-bg);  color: var(--ink-2); }
  .sds-badge--count     { background: var(--panel-2);      color: var(--muted); }
  `;
  document.head.appendChild(el);
}

/**
 * Badge — uppercase, rectangular status pill. Severity labels
 * (info/warning/critical/emergency) + neutral states (resolved, exposure, count).
 */
function Badge({
  children,
  variant = 'neutral',
  className = '',
  ...rest
}) {
  const numeric = variant === 'exposure' || variant === 'count';
  const cls = ['sds-badge', variant !== 'neutral' ? `sds-badge--${variant}` : '', numeric ? 'sds-badge--num' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/LiveIndicator.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-live';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-live {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-sans); font-size: var(--text-sm); color: var(--muted);
    background: var(--white); border: 1px solid var(--border-control); border-radius: var(--radius-btn);
    padding: 6px 10px; cursor: pointer; transition: var(--transition-control);
    font-variant-numeric: tabular-nums; line-height: 1;
  }
  .sds-live__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--faint); }
  .sds-live--on { color: var(--ink); border-color: var(--ink); }
  .sds-live--on .sds-live__dot { background: var(--good); animation: setnel-pulse var(--pulse-period) var(--ease-in-out) infinite; }
  .sds-live:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  `;
  document.head.appendChild(el);
}

/** LiveIndicator — the console's auto-refresh toggle (ghost button, pulsing green dot when on). */
function LiveIndicator({
  live = true,
  seconds = 0,
  onToggle,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    className: `sds-live ${live ? 'sds-live--on' : ''} ${className}`.trim(),
    onClick: onToggle,
    title: live ? 'Auto-refresh on — click to pause' : 'Paused — click to resume'
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sds-live__dot"
  }), live ? `live · ${seconds}s` : 'paused');
}
Object.assign(__ds_scope, { LiveIndicator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/LiveIndicator.jsx", error: String((e && e.message) || e) }); }

// components/feedback/NowPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-nowpill';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-now {
    display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
    font-family: var(--font-sans); font-size: var(--text-13); font-weight: var(--weight-medium);
    padding: 5px 11px 5px 9px; border-radius: var(--radius-pill); border: 1px solid; line-height: 1;
    transition: var(--transition-control); background: var(--panel);
  }
  .sds-now__dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
  .sds-now__count { font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-weight: 600; }
  .sds-now--calm    { border-color: var(--good-bg);      color: var(--good); }
  .sds-now--calm .sds-now__dot { background: var(--good); }
  .sds-now--warn    { border-color: var(--sev-warn-border, #fcd9a3); color: var(--warning); background: var(--warning-bg); }
  .sds-now--warn .sds-now__dot { background: var(--warning); }
  .sds-now--alert   { border-color: transparent; color: #fff; background: var(--critical); }
  .sds-now--alert .sds-now__dot { background: #fff; animation: setnel-pulse var(--pulse-period) var(--ease-in-out) infinite; }
  .sds-now--emergency { border-color: transparent; color: #fff; background: var(--emergency); }
  .sds-now--emergency .sds-now__dot { background: #fff; animation: setnel-pulse var(--pulse-period) var(--ease-in-out) infinite; }
  .sds-now:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  `;
  document.head.appendChild(el);
}

/**
 * NowPill — the persistent global "is anything on fire right now?" indicator for
 * the header. Worst active severity drives color; shows the active count. Click to
 * jump to incidents.
 */
function NowPill({
  level = 'calm',
  count = 0,
  onClick,
  className = '',
  ...rest
}) {
  const label = level === 'calm' ? 'All clear' : level === 'emergency' ? 'Emergency' : level === 'alert' ? 'Critical' : 'Warnings';
  return /*#__PURE__*/React.createElement("button", _extends({
    className: `sds-now sds-now--${level} ${className}`.trim(),
    onClick: onClick,
    title: count ? `${count} active incident${count === 1 ? '' : 's'}` : 'No active incidents'
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sds-now__dot"
  }), label, count ? /*#__PURE__*/React.createElement("span", {
    className: "sds-now__count"
  }, count) : null);
}

/** Map a set of active incidents to a NowPill level. */
function nowLevel(incidents) {
  const active = incidents.filter(i => i.status === 'active');
  if (active.some(i => i.severity === 'emergency')) return 'emergency';
  if (active.some(i => i.severity === 'critical')) return 'alert';
  if (active.length) return 'warn';
  return 'calm';
}
Object.assign(__ds_scope, { NowPill, nowLevel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/NowPill.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusDot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-statusdot';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-status { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-sans);
    font-size: var(--text-13); color: var(--ink-2); line-height: 1; }
  .sds-status__dot { width: 9px; height: 9px; flex: none; display: inline-flex; align-items: center; justify-content: center; color: #fff; }
  .sds-status__dot svg { width: 9px; height: 9px; display: block; }
  .sds-status__dot--pulse { animation: setnel-pulse var(--pulse-period) var(--ease-in-out) infinite; }
  `;
  document.head.appendChild(el);
}
const LABELS = {
  healthy: 'healthy',
  stale: 'stale',
  down: 'down',
  idle: 'idle'
};
const COLOR = {
  healthy: 'var(--status-healthy)',
  stale: 'var(--status-stale)',
  down: 'var(--status-down)',
  idle: 'var(--status-idle)'
};

// Shape per status — colorblind redundancy: circle / diamond / square / hollow ring.
function Glyph({
  status
}) {
  const c = COLOR[status];
  if (status === 'healthy') return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 10 10"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "5",
    cy: "5",
    r: "4.5",
    fill: c
  }));
  if (status === 'stale') return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 10 10"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 0.5 9.5 5 5 9.5 0.5 5Z",
    fill: c
  }));
  if (status === 'down') return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 10 10"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.8",
    y: "0.8",
    width: "8.4",
    height: "8.4",
    rx: "1.2",
    fill: c
  }));
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 10 10"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "5",
    cy: "5",
    r: "3.7",
    fill: "none",
    stroke: c,
    strokeWidth: "1.6"
  }));
}

/** StatusDot — per-dashboard health. Shape encodes status (colorblind-safe): circle=healthy, diamond=stale, square=down, ring=idle. */
function StatusDot({
  status = 'idle',
  label,
  pulse = false,
  showLabel = false,
  className = '',
  ...rest
}) {
  const text = label != null ? label : LABELS[status];
  const dot = /*#__PURE__*/React.createElement("span", {
    className: `sds-status__dot ${pulse ? 'sds-status__dot--pulse' : ''}`
  }, /*#__PURE__*/React.createElement(Glyph, {
    status: status
  }));
  if (!showLabel) return /*#__PURE__*/React.createElement("span", _extends({
    className: `sds-status ${className}`.trim(),
    title: text
  }, rest), dot);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `sds-status ${className}`.trim()
  }, rest), dot, text);
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusDot.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-button';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    font-family: var(--font-sans); font-weight: var(--weight-medium); font-size: var(--text-13);
    line-height: 1; white-space: nowrap; cursor: pointer;
    border: 1px solid var(--border-control); background: var(--white); color: var(--ink-2);
    border-radius: var(--radius-btn); padding: var(--pad-btn); height: var(--control-h);
    transition: var(--transition-control); text-decoration: none;
  }
  .sds-btn:hover { border-color: var(--ink); color: var(--ink); }
  .sds-btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .sds-btn[disabled] { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
  .sds-btn--lg { height: var(--control-h-lg); padding: var(--pad-btn-lg); border-radius: var(--radius); font-size: var(--text-base); font-weight: var(--weight-semibold); }
  .sds-btn--sm { height: var(--control-h-sm); padding: 4px 9px; font-size: var(--text-sm); }

  .sds-btn--primary { background: var(--action); color: var(--action-text); border-color: var(--action); }
  .sds-btn--primary:hover { background: var(--action-hover); border-color: var(--action-hover); color: var(--action-text); }

  .sds-btn--ghost { background: transparent; border-color: transparent; color: var(--ink-2); }
  .sds-btn--ghost:hover { background: var(--surface-hover); border-color: transparent; color: var(--ink); }

  .sds-btn--danger:hover { border-color: var(--critical); color: var(--critical); }
  .sds-btn--danger:focus-visible { box-shadow: var(--focus-ring-danger); }
  `;
  document.head.appendChild(el);
}

/**
 * Setnel button. Ink-black is the one action color; secondary is a white outline.
 */
function Button({
  children,
  variant = 'secondary',
  size = 'md',
  type = 'button',
  disabled = false,
  iconLeft = null,
  iconRight = null,
  as = 'button',
  className = '',
  ...rest
}) {
  const cls = ['sds-btn', variant === 'primary' ? 'sds-btn--primary' : '', variant === 'ghost' ? 'sds-btn--ghost' : '', variant === 'danger' ? 'sds-btn--danger' : '', size === 'lg' ? 'sds-btn--lg' : '', size === 'sm' ? 'sds-btn--sm' : '', className].filter(Boolean).join(' ');
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    type: as === 'button' ? type : undefined,
    disabled: as === 'button' ? disabled : undefined
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-checkbox';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-check { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
  .sds-check__box {
    width: 16px; height: 16px; flex: none; border-radius: 4px; border: 1px solid var(--border-strong);
    background: #fff; display: inline-flex; align-items: center; justify-content: center;
    transition: var(--transition-control); color: #fff;
  }
  .sds-check__box svg { width: 11px; height: 11px; opacity: 0; }
  .sds-check--on .sds-check__box { background: var(--ink); border-color: var(--ink); }
  .sds-check--on .sds-check__box svg { opacity: 1; }
  .sds-check--indeterminate .sds-check__box { background: var(--ink); border-color: var(--ink); }
  .sds-check--indeterminate .sds-check__box::after { content: ""; width: 8px; height: 2px; background: #fff; border-radius: 1px; }
  .sds-check__label { font-size: var(--text-13); color: var(--ink-2); }
  .sds-check:focus-visible { outline: none; }
  .sds-check:focus-visible .sds-check__box { box-shadow: var(--focus-ring); }
  `;
  document.head.appendChild(el);
}

/** Checkbox — row selection for bulk actions, multi-select filters. */
function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  label,
  className = '',
  ...rest
}) {
  const state = indeterminate ? 'indeterminate' : checked ? 'on' : '';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "checkbox",
    "aria-checked": indeterminate ? 'mixed' : checked,
    className: `sds-check ${state ? 'sds-check--' + state : ''} ${className}`.trim(),
    onClick: () => onChange && onChange(!checked)
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sds-check__box"
  }, !indeterminate ? /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.2 5 8.5 9.5 3.5",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })) : null), label ? /*#__PURE__*/React.createElement("span", {
    className: "sds-check__label"
  }, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-chip';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-sans); font-size: var(--text-sm); color: var(--muted);
    background: var(--white); border: 1px solid var(--border-control);
    border-radius: var(--radius-pill); padding: var(--pad-chip); cursor: pointer;
    transition: var(--transition-control); white-space: nowrap; line-height: 1;
  }
  .sds-chip:hover { color: var(--ink); border-color: var(--ink); }
  .sds-chip:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .sds-chip--on { background: var(--ink); border-color: var(--ink); color: var(--white); font-weight: var(--weight-semibold); }
  .sds-chip--on:hover { color: var(--white); }
  .sds-chip__count { font-family: var(--font-mono); font-size: 10.5px; opacity: 0.65; font-variant-numeric: tabular-nums; }
  `;
  document.head.appendChild(el);
}

/** Filter chip — incident-feed filters. Active inverts to solid ink. */
function Chip({
  children,
  active = false,
  count,
  className = '',
  as = 'button',
  ...rest
}) {
  const cls = `sds-chip ${active ? 'sds-chip--on' : ''} ${className}`.trim();
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    "aria-pressed": as === 'button' ? active : undefined
  }, rest), children, count != null ? /*#__PURE__*/React.createElement("span", {
    className: "sds-chip__count"
  }, count) : null);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Chip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-input';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-field { display: inline-flex; flex-direction: column; gap: 6px; }
  .sds-field__label { font: var(--font-label); color: var(--ink-2); }
  .sds-input {
    font-family: var(--font-sans); font-size: var(--text-13); color: var(--ink);
    background: var(--white); border: 1px solid var(--border-control);
    border-radius: var(--radius-btn); padding: var(--pad-input); height: var(--control-h);
    transition: var(--transition-control); width: 100%;
  }
  .sds-input::placeholder { color: var(--faint); }
  .sds-input:focus { outline: none; border-color: var(--ink); }
  .sds-input--lg { height: var(--control-h-lg); padding: var(--pad-input-lg); border-radius: var(--radius); font-size: var(--text-base); }
  .sds-input--mono { font-family: var(--font-mono); }
  .sds-input[disabled] { opacity: 0.5; cursor: not-allowed; background: var(--panel-2); }
  .sds-input--invalid { border-color: var(--critical); }
  .sds-field__hint { font-size: var(--text-2xs); color: var(--muted); }
  .sds-field__hint--err { color: var(--critical); }
  `;
  document.head.appendChild(el);
}

/** Text input — actor name, incident notes, login. Focus darkens the border to ink. */
function Input({
  label,
  hint,
  invalid = false,
  mono = false,
  size = 'md',
  className = '',
  id,
  ...rest
}) {
  const inputCls = ['sds-input', size === 'lg' ? 'sds-input--lg' : '', mono ? 'sds-input--mono' : '', invalid ? 'sds-input--invalid' : '', className].filter(Boolean).join(' ');
  const field = /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    className: inputCls,
    "aria-invalid": invalid || undefined
  }, rest));
  if (!label && !hint) return field;
  return /*#__PURE__*/React.createElement("label", {
    className: "sds-field",
    htmlFor: id
  }, label ? /*#__PURE__*/React.createElement("span", {
    className: "sds-field__label"
  }, label) : null, field, hint ? /*#__PURE__*/React.createElement("span", {
    className: `sds-field__hint ${invalid ? 'sds-field__hint--err' : ''}`
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-segmented';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-seg { display: inline-flex; flex-wrap: wrap; gap: 4px; padding: 3px;
    background: var(--panel-2); border: 1px solid var(--border); border-radius: var(--radius); }
  .sds-seg__btn {
    font-family: var(--font-sans); font-size: var(--text-sm); color: var(--muted);
    background: transparent; border: none; cursor: pointer; padding: 5px 10px;
    border-radius: var(--radius-sm); transition: var(--transition-control); white-space: nowrap;
  }
  .sds-seg__btn:hover { color: var(--ink); }
  .sds-seg__btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .sds-seg__btn--on { background: var(--white); color: var(--ink); font-weight: var(--weight-semibold); box-shadow: var(--shadow-seg); }
  `;
  document.head.appendChild(el);
}

/** Segmented control — the trend-chart breakdown switcher. */
function SegmentedControl({
  options,
  value,
  onChange,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `sds-seg ${className}`.trim(),
    role: "tablist"
  }, rest), options.map(o => {
    const key = typeof o === 'string' ? o : o.value;
    const label = typeof o === 'string' ? o : o.label;
    const on = key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      role: "tab",
      "aria-selected": on,
      className: `sds-seg__btn ${on ? 'sds-seg__btn--on' : ''}`,
      onClick: () => onChange && onChange(key)
    }, label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-switch';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-switch { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; user-select: none; }
  .sds-switch[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; }
  .sds-switch__track {
    position: relative; width: 34px; height: 20px; flex: none; border-radius: 999px;
    background: var(--border-strong); transition: background-color var(--dur-fast) var(--ease-standard);
  }
  .sds-switch__track--on { background: var(--ink); }
  .sds-switch__thumb {
    position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 999px;
    background: #fff; box-shadow: var(--shadow-sm); transition: transform var(--dur-fast) var(--ease-standard);
  }
  .sds-switch__track--on .sds-switch__thumb { transform: translateX(14px); }
  .sds-switch__label { font-size: var(--text-13); color: var(--ink-2); }
  .sds-switch:focus-visible { outline: none; }
  .sds-switch:focus-visible .sds-switch__track { box-shadow: var(--focus-ring); }
  `;
  document.head.appendChild(el);
}

/** Switch — toggle a boolean (detector enable/disable, density, notification channels). */
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": checked,
    "aria-disabled": disabled || undefined,
    className: `sds-switch ${className}`.trim(),
    onClick: () => !disabled && onChange && onChange(!checked)
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: `sds-switch__track ${checked ? 'sds-switch__track--on' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "sds-switch__thumb"
  })), label ? /*#__PURE__*/React.createElement("span", {
    className: "sds-switch__label"
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/TimeRange.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-timerange';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-tr { display: inline-flex; align-items: center; border: 1px solid var(--border-strong); border-radius: var(--radius-btn); overflow: hidden; }
  .sds-tr__btn {
    font-family: var(--font-sans); font-size: var(--text-sm); color: var(--muted); background: var(--panel);
    border: none; border-left: 1px solid var(--border); cursor: pointer; padding: 6px 10px; transition: var(--transition-control); line-height: 1;
  }
  .sds-tr__btn:first-child { border-left: none; }
  .sds-tr__btn:hover { color: var(--ink); background: var(--panel-2); }
  .sds-tr__btn--on { background: var(--ink); color: #fff; }
  .sds-tr__btn--on:hover { background: var(--ink); color: #fff; }
  `;
  document.head.appendChild(el);
}
const PRESETS = [{
  value: '1h',
  label: '1h'
}, {
  value: '24h',
  label: '24h'
}, {
  value: '7d',
  label: '7d'
}, {
  value: '30d',
  label: '30d'
}];

/** TimeRange — global range picker every chart + feed respects. */
function TimeRange({
  value = '24h',
  onChange,
  presets = PRESETS,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `sds-tr ${className}`.trim(),
    role: "group",
    "aria-label": "Time range"
  }, rest), presets.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.value,
    className: `sds-tr__btn ${p.value === value ? 'sds-tr__btn--on' : ''}`,
    onClick: () => onChange && onChange(p.value)
  }, p.label)));
}
Object.assign(__ds_scope, { TimeRange });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TimeRange.jsx", error: String((e && e.message) || e) }); }

// components/navigation/CommandPalette.jsx
try { (() => {
const STYLE_ID = 'sds-cmdk';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-cmdk__scrim { position: fixed; inset: 0; z-index: 100; background: rgba(10,10,10,0.35); display: flex; align-items: flex-start; justify-content: center; padding-top: 12vh; }
  .sds-cmdk {
    width: 560px; max-width: 92vw; background: var(--panel); border: 1px solid var(--border);
    border-radius: var(--radius-card); box-shadow: var(--shadow-pop); overflow: hidden;
  }
  .sds-cmdk__input {
    width: 100%; border: none; outline: none; padding: 15px 18px; font-family: var(--font-sans);
    font-size: 15px; color: var(--ink); border-bottom: 1px solid var(--border);
  }
  .sds-cmdk__input::placeholder { color: var(--faint); }
  .sds-cmdk__list { max-height: 360px; overflow-y: auto; padding: 6px; }
  .sds-cmdk__group { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--faint); padding: 8px 10px 4px; font-weight: 600; }
  .sds-cmdk__item {
    display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; cursor: pointer;
    background: transparent; border: none; padding: 9px 10px; border-radius: 7px;
    font-family: var(--font-sans); font-size: var(--text-base); color: var(--ink-2);
  }
  .sds-cmdk__item--active { background: var(--panel-3); color: var(--ink); }
  .sds-cmdk__item kbd { margin-left: auto; font-family: var(--font-mono); font-size: 10.5px; color: var(--faint); background: var(--panel-2); border: 1px solid var(--border); border-radius: 4px; padding: 1px 5px; }
  .sds-cmdk__hint { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
  .sds-cmdk__empty { padding: 26px; text-align: center; color: var(--muted); font-size: 13px; }
  .sds-cmdk__foot { display: flex; gap: 14px; padding: 8px 14px; border-top: 1px solid var(--border); font-family: var(--font-mono); font-size: 10.5px; color: var(--faint); }
  `;
  document.head.appendChild(el);
}

/**
 * CommandPalette — ⌘K/Ctrl-K navigator. Fuzzy-filters a flat command list
 * (dashboards, detectors, incidents, metrics, actions) and runs the selected one.
 * Controlled via `open`/`onOpenChange`, or self-manages the ⌘K shortcut if you
 * pass `bindHotkey`.
 */
function CommandPalette({
  commands = [],
  open,
  onOpenChange,
  bindHotkey = true,
  placeholder = 'Search dashboards, detectors, incidents, metrics…'
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open != null ? open : internalOpen;
  const setOpen = v => {
    onOpenChange ? onOpenChange(v) : setInternalOpen(v);
  };
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (!bindHotkey) return;
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, bindHotkey]);
  React.useEffect(() => {
    if (isOpen) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 20);
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const ql = q.trim().toLowerCase();
  const filtered = ql ? commands.filter(c => (c.label + ' ' + (c.group || '') + ' ' + (c.hint || '')).toLowerCase().includes(ql)) : commands;
  const groups = [...new Set(filtered.map(c => c.group || 'Results'))];
  const run = c => {
    setOpen(false);
    c && c.run && c.run();
  };
  const onKey = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(filtered.length - 1, a + 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(0, a - 1));
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      run(filtered[active]);
    }
  };
  let idx = -1;
  return /*#__PURE__*/React.createElement("div", {
    className: "sds-cmdk__scrim",
    onClick: () => setOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "sds-cmdk",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    className: "sds-cmdk__input",
    placeholder: placeholder,
    value: q,
    onChange: e => {
      setQ(e.target.value);
      setActive(0);
    },
    onKeyDown: onKey
  }), /*#__PURE__*/React.createElement("div", {
    className: "sds-cmdk__list"
  }, filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "sds-cmdk__empty"
  }, "No matches for \u201C", q, "\u201D.") : null, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g
  }, /*#__PURE__*/React.createElement("div", {
    className: "sds-cmdk__group"
  }, g), filtered.filter(c => (c.group || 'Results') === g).map(c => {
    idx++;
    const me = idx;
    return /*#__PURE__*/React.createElement("button", {
      key: c.id || c.label,
      className: `sds-cmdk__item ${me === active ? 'sds-cmdk__item--active' : ''}`,
      onMouseEnter: () => setActive(me),
      onClick: () => run(c)
    }, c.icon ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        width: 16,
        color: 'var(--muted)'
      }
    }, c.icon) : null, /*#__PURE__*/React.createElement("span", null, c.label), c.hint ? /*#__PURE__*/React.createElement("span", {
      className: "sds-cmdk__hint"
    }, c.hint) : null, c.kbd ? /*#__PURE__*/React.createElement("kbd", null, c.kbd) : null);
  })))), /*#__PURE__*/React.createElement("div", {
    className: "sds-cmdk__foot"
  }, /*#__PURE__*/React.createElement("span", null, "\u2191\u2193 navigate"), /*#__PURE__*/React.createElement("span", null, "\u21B5 select"), /*#__PURE__*/React.createElement("span", null, "esc close"))));
}
Object.assign(__ds_scope, { CommandPalette });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/CommandPalette.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-navitem';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-nav {
    display: flex; align-items: center; gap: 9px; width: 100%;
    font-family: var(--font-sans); font-size: var(--text-13); font-weight: var(--weight-medium);
    color: var(--ink-2); background: transparent; border: none; cursor: pointer; text-align: left;
    padding: 6px 9px; border-radius: var(--radius-btn); transition: var(--transition-control);
    line-height: 1.2; text-decoration: none;
  }
  .sds-nav:hover { background: var(--surface-hover); color: var(--ink); }
  .sds-nav:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .sds-nav--active { background: var(--panel-3); color: var(--ink); font-weight: var(--weight-semibold); }
  .sds-nav__icon { width: 16px; height: 16px; flex: none; display: inline-flex; align-items: center; justify-content: center; color: currentColor; }
  .sds-nav__icon svg { width: 16px; height: 16px; }
  .sds-nav__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sds-nav__count {
    flex: none; font-family: var(--font-mono); font-size: 10.5px; font-weight: var(--weight-semibold);
    font-variant-numeric: tabular-nums; padding: 1px 6px; border-radius: var(--radius-pill);
    background: var(--critical-bg); color: var(--critical);
  }
  .sds-nav__count--muted { background: var(--panel-2); color: var(--muted); }
  .sds-nav__dot { flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--critical); }
  `;
  document.head.appendChild(el);
}

/** NavItem — a row in the app-shell sidebar. Icon + label, optional count/dot. */
function NavItem({
  icon,
  label,
  active = false,
  count,
  countTone = 'alert',
  dot = false,
  as = 'button',
  className = '',
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `sds-nav ${active ? 'sds-nav--active' : ''} ${className}`.trim(),
    "aria-current": active ? 'page' : undefined
  }, rest), icon != null ? /*#__PURE__*/React.createElement("span", {
    className: "sds-nav__icon"
  }, icon) : null, /*#__PURE__*/React.createElement("span", {
    className: "sds-nav__label"
  }, label), dot ? /*#__PURE__*/React.createElement("span", {
    className: "sds-nav__dot"
  }) : null, count != null ? /*#__PURE__*/React.createElement("span", {
    className: `sds-nav__count ${countTone === 'muted' ? 'sds-nav__count--muted' : ''}`
  }, count) : null);
}
Object.assign(__ds_scope, { NavItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sidebar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-sidebar';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-sidebar {
    width: var(--sidebar-w); flex: none; height: 100%; box-sizing: border-box;
    display: flex; flex-direction: column; background: var(--surface-sidebar);
    border-right: 1px solid var(--border);
  }
  .sds-sidebar__brand { display: flex; align-items: center; gap: 9px; padding: 14px 14px 10px; }
  .sds-sidebar__brand img { width: 26px; height: 26px; border-radius: 6px; display: block; }
  .sds-sidebar__brand-name { font-size: var(--text-15); font-weight: var(--weight-bold); letter-spacing: var(--tracking-tighter); color: var(--ink); }
  .sds-sidebar__brand-sub { font-size: 10.5px; color: var(--muted); }
  .sds-sidebar__nav { flex: 1; overflow-y: auto; padding: 6px 8px; display: flex; flex-direction: column; gap: 3px; }
  .sds-sidebar__foot { border-top: 1px solid var(--border); padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }

  .sds-navsec { display: flex; flex-direction: column; gap: 2px; margin-top: 10px; }
  .sds-navsec:first-child { margin-top: 0; }
  .sds-navsec__label {
    font-size: var(--text-2xs); text-transform: uppercase; letter-spacing: var(--tracking-caps);
    color: var(--faint); padding: 4px 9px 3px; font-weight: var(--weight-semibold);
  }
  `;
  document.head.appendChild(el);
}

/** SidebarSection — a labelled group of NavItems. */
function SidebarSection({
  label,
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `sds-navsec ${className}`.trim()
  }, rest), label ? /*#__PURE__*/React.createElement("div", {
    className: "sds-navsec__label"
  }, label) : null, children);
}

/**
 * Sidebar — the app-shell left rail: brand lockup, scrollable nav sections,
 * and a footer (actor + live indicator). Compose NavItem / SidebarSection inside.
 */
function Sidebar({
  brand,
  children,
  footer,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("aside", _extends({
    className: `sds-sidebar ${className}`.trim()
  }, rest), brand ? /*#__PURE__*/React.createElement("div", {
    className: "sds-sidebar__brand"
  }, brand) : null, /*#__PURE__*/React.createElement("nav", {
    className: "sds-sidebar__nav"
  }, children), footer ? /*#__PURE__*/React.createElement("div", {
    className: "sds-sidebar__foot"
  }, footer) : null);
}
Object.assign(__ds_scope, { SidebarSection, Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sidebar.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Menu.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'sds-menu';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-menu { position: relative; display: inline-flex; }
  .sds-menu__pop {
    position: absolute; z-index: 50; min-width: 180px; padding: 5px;
    background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius);
    box-shadow: var(--shadow-pop);
  }
  .sds-menu__pop--right { right: 0; } .sds-menu__pop--left { left: 0; }
  .sds-menu__pop--top { bottom: calc(100% + 6px); } .sds-menu__pop--bottom { top: calc(100% + 6px); }
  .sds-menu__label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--faint); padding: 6px 9px 4px; font-weight: 600; }
  .sds-menu__item {
    display: flex; align-items: center; gap: 9px; width: 100%; text-align: left;
    font-family: var(--font-sans); font-size: var(--text-13); color: var(--ink-2);
    background: transparent; border: none; cursor: pointer; padding: 7px 9px; border-radius: 6px;
  }
  .sds-menu__item:hover { background: var(--panel-3); color: var(--ink); }
  .sds-menu__item--danger { color: var(--critical); }
  .sds-menu__item--danger:hover { background: var(--critical-bg); }
  .sds-menu__sep { height: 1px; background: var(--border); margin: 4px 0; }
  .sds-menu__scrim { position: fixed; inset: 0; z-index: 40; }
  `;
  document.head.appendChild(el);
}

/** MenuItem — a row inside Menu. */
function MenuItem({
  children,
  onSelect,
  danger = false,
  icon,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: `sds-menu__item ${danger ? 'sds-menu__item--danger' : ''} ${className}`.trim(),
    onClick: onSelect
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 15
    }
  }, icon) : null, children);
}
function MenuLabel({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sds-menu__label"
  }, children);
}
function MenuSeparator() {
  return /*#__PURE__*/React.createElement("div", {
    className: "sds-menu__sep"
  });
}

/**
 * Menu — a dropdown popover anchored to a trigger. Used for mute-with-reason,
 * bulk-action menus, and row overflow actions.
 */
function Menu({
  trigger,
  children,
  align = 'left',
  side = 'bottom',
  className = '',
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `sds-menu ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(v => !v)
  }, trigger), open ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sds-menu__scrim",
    onClick: () => setOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: `sds-menu__pop sds-menu__pop--${align} sds-menu__pop--${side}`,
    onClick: () => setOpen(false)
  }, children)) : null);
}
Object.assign(__ds_scope, { MenuItem, MenuLabel, MenuSeparator, Menu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Menu.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Backtest.jsx
try { (() => {
// Backtest — replay the adaptive rule over stored history; red = would have fired.
function Backtest() {
  const {
    Panel,
    Sparkline
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const results = D.METRICS.map(m => ({
    m,
    fired: D.backtestFires(m.points)
  }));
  const fmt = n => n === 0 ? 'clean' : `${n} fire${n === 1 ? '' : 's'}`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Threshold backtest",
    note: "replaying |z|>3 & move>8% over stored history \xB7 red = would have fired",
    divided: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 14
    }
  }, results.map(({
    m,
    fired
  }) => {
    const tone = fired.length > 3 ? 'var(--critical)' : fired.length > 0 ? 'var(--warning)' : 'var(--good)';
    return /*#__PURE__*/React.createElement("div", {
      key: m.key,
      style: {
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '10px 12px',
        background: 'var(--panel)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--muted)'
      }
    }, m.key), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12.5,
        fontWeight: 600,
        color: tone
      }
    }, fmt(fired.length))), /*#__PURE__*/React.createElement(Sparkline, {
      points: m.points,
      fired: fired,
      showLast: false,
      width: 300,
      height: 84
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: 'var(--faint)',
        marginTop: 4
      }
    }, m.dashboard, " \xB7 ", m.points.length, " samples"));
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14,
      fontSize: 12,
      color: 'var(--muted)',
      lineHeight: 1.5
    }
  }, "Many fires on one metric \u21D2 the threshold is too sensitive for its volatility; zero across a known event \u21D2 too loose. Tune ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "SETNEL_BASELINE_Z"), " / ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "SETNEL_BASELINE_MIN_PCT"), " and re-check.")));
}
Object.assign(window, {
  Backtest
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Backtest.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Console.jsx
try { (() => {
// Console overview — KPI strip, SLA row, trends, health matrix, incident preview.
function Console({
  incidents,
  onOpen,
  onAck,
  onMute,
  onFp,
  onSeeAll
}) {
  const {
    StatCard,
    Panel,
    Button
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const healthy = D.DASHBOARDS.filter(d => d.status === 'healthy').length;
  const collecting = D.DASHBOARDS.filter(d => d.checksToday > 0).length;
  const total = D.DASHBOARDS.length;
  const activeCount = incidents.filter(i => i.status === 'active').length;
  const critical = incidents.filter(i => i.status === 'active' && ['critical', 'emergency'].includes(i.severity)).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Dashboards",
    value: String(total),
    sub: "monitored"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Collecting today",
    value: `${collecting}/${total}`,
    sub: "checked in",
    tone: collecting === total ? 'good' : 'warn'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Healthy",
    value: `${healthy}/${total}`,
    sub: "< 24h since last check",
    tone: healthy === total ? 'good' : 'warn'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Active incidents",
    value: String(activeCount),
    sub: "open now",
    tone: activeCount === 0 ? 'good' : 'warn'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Critical",
    value: String(critical),
    sub: "active",
    tone: critical === 0 ? 'good' : 'bad'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      flexWrap: 'wrap',
      padding: '12px 18px',
      background: 'var(--panel-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-panel)',
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, [[`${D.SLA.ackRate}%`, 'acknowledged'], [`${D.SLA.timeToAck}m`, 'avg time to ack'], [`${D.SLA.timeToResolve}m`, 'avg time to resolve'], [`${D.SLA.falsePositive}%`, 'false positives']].map(([v, l]) => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      color: 'var(--ink)',
      fontSize: 15
    }
  }, v), l)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--faint)'
    }
  }, "last 30 days \xB7 ", D.SLA.total, " incidents")), /*#__PURE__*/React.createElement(Panel, {
    title: "Trends",
    note: "Last 30 days \xB7 click the legend to toggle lines",
    divided: true
  }, /*#__PURE__*/React.createElement(window.TrendChart, {
    bundle: D.TREND,
    days: D.DAYS
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "Dashboard health",
    note: "Daily collection over 14 days \xB7 target ~288/day",
    divided: true,
    flush: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 18px 16px'
    }
  }, /*#__PURE__*/React.createElement(window.HealthMatrix, {
    dashboards: D.DASHBOARDS
  }))), /*#__PURE__*/React.createElement(Panel, {
    title: "Incidents",
    note: `${activeCount} active`,
    flush: true,
    divided: true,
    aside: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      onClick: onSeeAll
    }, "See all \u2192")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 18px'
    }
  }, /*#__PURE__*/React.createElement(window.IncidentFeed, {
    incidents: incidents.filter(i => i.status === 'active').slice(0, 4),
    onOpen: onOpen,
    onAck: onAck,
    onMute: onMute,
    onFp: onFp,
    compact: true
  }))));
}
Object.assign(window, {
  Console
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Console.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Coverage.jsx
try { (() => {
// Coverage map — risk × protocol matrix. Actionable: click a blind spot → propose a detector.
function Coverage({
  onOpenDetector
}) {
  const {
    Panel,
    Badge,
    Button,
    Menu,
    MenuItem,
    MenuLabel
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const [sel, setSel] = React.useState(null); // { risk, protocol, state }
  const cells = D.COVERAGE.rows.flatMap(r => r.cells);
  const covered = cells.filter(c => c === 'yes').length;
  const blind = cells.filter(c => c === 'blocked').length;
  const planned = cells.filter(c => c === 'planned').length;
  const GLYPH = {
    yes: '●',
    blocked: '✕',
    planned: '○',
    na: '·'
  };
  const COLOR = {
    yes: 'var(--good)',
    blocked: 'var(--critical)',
    planned: 'var(--warning)',
    na: 'var(--faint)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      flexWrap: 'wrap',
      padding: '12px 18px',
      background: 'var(--panel-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-panel)',
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--good)',
      fontFamily: 'var(--font-mono)',
      fontSize: 15
    }
  }, covered), " detectors live"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--warning)',
      fontFamily: 'var(--font-mono)',
      fontSize: 15
    }
  }, planned), " planned"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--critical)',
      fontFamily: 'var(--font-mono)',
      fontSize: 15
    }
  }, blind), " blind spots"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--faint)'
    }
  }, "click a cell to act")), /*#__PURE__*/React.createElement(Panel, {
    title: "Detector coverage",
    note: "know your gaps before an exploit finds them for you",
    divided: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      borderCollapse: 'collapse',
      width: '100%',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'left',
      padding: '7px 10px',
      borderBottom: '1px solid var(--border)',
      color: 'var(--muted)',
      fontSize: 12
    }
  }, "Risk type"), D.COVERAGE.protocols.map(p => /*#__PURE__*/React.createElement("th", {
    key: p,
    style: {
      padding: '7px 10px',
      borderBottom: '1px solid var(--border)',
      color: 'var(--muted)',
      fontSize: 12,
      fontWeight: 600
    }
  }, p)))), /*#__PURE__*/React.createElement("tbody", null, D.COVERAGE.rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.risk
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'left',
      padding: '7px 10px',
      borderBottom: '1px solid var(--border)',
      fontWeight: 550,
      whiteSpace: 'nowrap',
      color: 'var(--ink)'
    }
  }, r.risk), r.cells.map((c, i) => /*#__PURE__*/React.createElement("td", {
    key: i,
    style: {
      textAlign: 'center',
      padding: '4px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSel({
      risk: r.risk,
      protocol: D.COVERAGE.protocols[i],
      state: c
    }),
    title: `${c} — click to act`,
    style: {
      width: 28,
      height: 28,
      borderRadius: 6,
      border: '1px solid ' + (sel && sel.risk === r.risk && sel.protocol === D.COVERAGE.protocols[i] ? 'var(--ink)' : 'transparent'),
      background: c === 'blocked' ? 'var(--critical-bg)' : 'transparent',
      cursor: 'pointer',
      color: COLOR[c],
      fontWeight: 700,
      fontFamily: 'var(--font-mono)',
      fontSize: 13
    }
  }, GLYPH[c])))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 12,
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, [['yes', 'covered'], ['blocked', 'blind spot'], ['planned', 'planned'], ['na', 'n/a']].map(([k, l]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLOR[k],
      fontFamily: 'var(--font-mono)',
      fontWeight: 700
    }
  }, GLYPH[k]), l)))), sel ? /*#__PURE__*/React.createElement(Panel, {
    divided: true,
    title: `${sel.risk} · ${sel.protocol}`,
    note: sel.state === 'blocked' ? 'blind spot — no detector watches this' : sel.state === 'planned' ? 'planned — not yet live' : sel.state === 'yes' ? 'covered' : 'not applicable',
    aside: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      onClick: () => setSel(null)
    }, "Close")
  }, sel.state === 'blocked' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "critical"
  }, "blind spot"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-2)',
      flex: 1,
      minWidth: 200
    }
  }, "Nothing fires if ", /*#__PURE__*/React.createElement("b", null, sel.risk.toLowerCase()), " happens on ", /*#__PURE__*/React.createElement("b", null, sel.protocol), ". Propose a detector to close the gap."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: /*#__PURE__*/React.createElement(window.Icon, {
      name: "plus",
      size: 14,
      color: "#fff"
    }),
    onClick: () => onOpenDetector && onOpenDetector(D.DETECTORS[0])
  }, "Propose detector")) : sel.state === 'yes' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "resolved"
  }, "covered"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-2)',
      flex: 1
    }
  }, "A live detector watches this. Open its config to tune the threshold."), /*#__PURE__*/React.createElement(Button, {
    onClick: () => onOpenDetector && onOpenDetector(D.DETECTORS[0])
  }, "Open detector")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: sel.state === 'planned' ? 'warning' : 'neutral'
  }, sel.state === 'planned' ? 'planned' : 'n/a'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-2)'
    }
  }, sel.state === 'planned' ? 'On the roadmap — not yet collecting.' : 'This risk doesn’t apply to this protocol.'))) : null);
}
Object.assign(window, {
  Coverage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Coverage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Dashboards.jsx
try { (() => {
// Dashboards — list + per-dashboard drill-down (metrics, incidents, detectors, collection).
function Dashboards({
  onOpen
}) {
  const {
    Panel,
    StatusDot,
    HeatStrip,
    Badge
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  return /*#__PURE__*/React.createElement(Panel, {
    title: "Dashboards",
    note: `${D.DASHBOARDS.length} monitored · click one to drill in`,
    divided: true,
    flush: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '210px 1fr 90px 70px 70px',
      gap: 12,
      padding: '10px 18px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Dashboard"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "14-day collection"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      textAlign: 'right'
    }
  }, "Last"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      textAlign: 'right'
    }
  }, "Today"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      textAlign: 'right'
    }
  }, "Incidents")), D.DASHBOARDS.map(d => {
    const inc = D.INCIDENTS.filter(i => i.dashboardId === d.id && i.status === 'active').length;
    return /*#__PURE__*/React.createElement("button", {
      key: d.id,
      onClick: () => onOpen(d),
      style: {
        display: 'grid',
        gridTemplateColumns: '210px 1fr 90px 70px 70px',
        gap: 12,
        alignItems: 'center',
        padding: '11px 18px',
        borderBottom: '1px solid var(--border)',
        background: 'none',
        border: 'none',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        fontSize: 13,
        fontWeight: 550,
        color: 'var(--ink)'
      }
    }, /*#__PURE__*/React.createElement(StatusDot, {
      status: d.status
    }), d.name), /*#__PURE__*/React.createElement(HeatStrip, {
      levels: d.heat
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: d.status === 'down' ? 'var(--critical)' : 'var(--muted)',
        textAlign: 'right'
      }
    }, d.lastCheck), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--ink)',
        textAlign: 'right'
      }
    }, d.checksToday), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right'
      }
    }, inc ? /*#__PURE__*/React.createElement(Badge, {
      variant: "critical"
    }, inc, " active") : /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--faint)',
        fontSize: 12
      }
    }, "\u2014")));
  })));
}
function DashboardDetail({
  dash,
  onBack,
  onOpenIncident,
  onOpenDetector
}) {
  const {
    Panel,
    Badge,
    StatCard,
    HeatStrip,
    MetricChart,
    Button
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const metrics = D.METRICS.filter(m => m.dashboard === dash.name);
  const incidents = D.INCIDENTS.filter(i => i.dashboardId === dash.id);
  const detectors = D.DETECTORS.filter(d => d.dashboard === dash.name);
  const activeInc = incidents.filter(i => i.status === 'active');
  const fmt = m => m.unit === '%' ? m.latest.toFixed(1) + '%' : m.unit === '$M' ? '$' + m.latest.toFixed(1) + 'M' : m.unit === '$B' ? '$' + m.latest.toFixed(2) + 'B' : String(m.latest);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      alignSelf: 'flex-start',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 13,
      color: 'var(--muted)',
      padding: '2px 0',
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "arrow-left",
    size: 14
  }), " Dashboards"), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(window.StatusFull, {
    status: dash.status
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--ink)'
    }
  }, dash.name), activeInc.length ? /*#__PURE__*/React.createElement(Badge, {
    variant: "critical"
  }, activeInc.length, " active") : /*#__PURE__*/React.createElement(Badge, {
    variant: "resolved"
  }, "all clear"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "#",
    variant: "ghost",
    onClick: e => e.preventDefault(),
    style: {
      marginLeft: 'auto'
    }
  }, "Open source \u2197"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Checks today",
    value: String(dash.checksToday),
    sub: "target ~288",
    tone: dash.checksToday > 200 ? 'good' : dash.checksToday > 0 ? 'warn' : 'bad'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Last check",
    value: dash.lastCheck,
    tone: dash.status === 'down' ? 'bad' : dash.status === 'stale' ? 'warn' : 'good'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Metrics",
    value: String(metrics.length),
    sub: "tracked"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Detectors",
    value: String(detectors.length),
    sub: detectors.filter(d => d.enabled).length + ' enabled'
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "Collection",
    note: "14 days \xB7 target ~288/day",
    divided: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(HeatStrip, {
    levels: dash.heat
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, "last check ", dash.lastCheck))), metrics.length ? /*#__PURE__*/React.createElement(Panel, {
    title: "Metrics",
    note: "against learned baseline",
    divided: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: metrics.length > 1 ? '1fr 1fr' : '1fr',
      gap: 16
    }
  }, metrics.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.key
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, m.key), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, fmt(m))), /*#__PURE__*/React.createElement(MetricChart, {
    points: m.ts,
    unit: m.unit === '%' ? '%' : '',
    mean: m.mean,
    band: {
      lo: m.mean - 2 * m.sd,
      hi: m.mean + 2 * m.sd
    },
    height: 150
  }))))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Incidents",
    note: `${activeInc.length} active`,
    divided: true,
    flush: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 0'
    }
  }, incidents.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      color: 'var(--good)',
      fontSize: 13
    }
  }, "No incidents on this dashboard.") : incidents.map(i => /*#__PURE__*/React.createElement("button", {
    key: i.id,
    onClick: () => onOpenIncident(i),
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      background: 'none',
      border: 'none',
      borderBottom: '1px solid var(--border)',
      cursor: 'pointer',
      padding: '10px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7,
      alignItems: 'center',
      marginBottom: 3
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: i.severity
  }, i.severity), i.status === 'resolved' ? /*#__PURE__*/React.createElement(Badge, {
    variant: "resolved"
  }, "resolved") : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--faint)',
      marginLeft: 'auto'
    }
  }, i.last)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-2)',
      lineHeight: 1.4
    }
  }, i.message))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Detectors",
    note: `${detectors.length} on this dashboard`,
    divided: true,
    flush: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 0'
    }
  }, detectors.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.id,
    onClick: () => onOpenDetector(d),
    style: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      gap: 10,
      textAlign: 'left',
      background: 'none',
      border: 'none',
      borderBottom: '1px solid var(--border)',
      cursor: 'pointer',
      padding: '10px 18px',
      opacity: d.enabled ? 1 : 0.55
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--ink)',
      flex: 1
    }
  }, d.id), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--muted)'
    }
  }, d.z != null ? `z>${d.z}` : d.cadence), /*#__PURE__*/React.createElement(Badge, {
    variant: d.severity
  }, d.severity)))))));
}

// tiny helper: big status label with the shape glyph
function StatusFull({
  status
}) {
  const {
    StatusDot
  } = window.SetnelDesignSystem_525d6e;
  const c = {
    healthy: 'var(--good)',
    stale: 'var(--warning)',
    down: 'var(--critical)',
    idle: 'var(--faint)'
  }[status];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      color: c,
      fontSize: 13,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    status: status
  }), status);
}
Object.assign(window, {
  Dashboards,
  DashboardDetail,
  StatusFull
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Dashboards.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Detectors.jsx
try { (() => {
// Detectors — list + config surface. Tune thresholds, enable/disable, mute, wired to backtest.
function Detectors({
  onOpen
}) {
  const {
    Panel,
    Badge,
    Switch
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const [dets, setDets] = React.useState(D.DETECTORS);
  const toggle = id => setDets(xs => xs.map(d => d.id === id ? {
    ...d,
    enabled: !d.enabled
  } : d));
  const live = dets.filter(d => d.enabled).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      flexWrap: 'wrap',
      padding: '12px 18px',
      background: 'var(--panel-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-panel)',
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--ink)',
      fontFamily: 'var(--font-mono)',
      fontSize: 15
    }
  }, dets.length), " detectors"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--good)',
      fontFamily: 'var(--font-mono)',
      fontSize: 15
    }
  }, live), " enabled"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--muted)',
      fontFamily: 'var(--font-mono)',
      fontSize: 15
    }
  }, dets.length - live), " disabled"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--faint)'
    }
  }, "thresholds live here \u2014 no more env-var edits")), /*#__PURE__*/React.createElement(Panel, {
    title: "Detectors",
    note: "click a rule to view or tune",
    divided: true,
    flush: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 130px 120px 90px 54px',
      gap: 12,
      padding: '10px 18px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Detector"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Rule"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "30d fires / FP"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Severity"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      textAlign: 'right'
    }
  }, "On")), dets.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 130px 120px 90px 54px',
      gap: 12,
      alignItems: 'center',
      padding: '11px 18px',
      borderBottom: '1px solid var(--border)',
      opacity: d.enabled ? 1 : 0.55
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpen(d),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: 'var(--ink)',
      fontWeight: 500
    }
  }, d.id), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      marginTop: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, d.dashboard, " \xB7 ", d.desc)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--ink-2)'
    }
  }, d.z != null ? `z>${d.z} · ${d.minPct}%` : 'no-data ' + d.cadence), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--ink)'
    }
  }, d.fires30d), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--faint)'
    }
  }, "/ ", d.fp30d, " fp")), /*#__PURE__*/React.createElement(Badge, {
    variant: d.severity
  }, d.severity), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: d.enabled,
    onChange: () => toggle(d.id)
  })))))));
}

// Single detector config — the biggest gap the audit named.
function DetectorConfig({
  det,
  onBack
}) {
  const {
    Panel,
    Badge,
    Button,
    Input,
    Switch,
    MetricChart
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const metric = D.METRICS.find(m => m.key === det.metric);
  const [z, setZ] = React.useState(det.z ?? 3);
  const [pct, setPct] = React.useState(det.minPct ?? 8);
  const [win, setWin] = React.useState(det.window ?? 40);
  const [enabled, setEnabled] = React.useState(det.enabled);

  // recompute would-fire count from the current threshold (tune-from-backtest loop)
  const fires = React.useMemo(() => {
    if (!metric) return [];
    const vals = metric.points;
    const out = [];
    for (let i = win; i < vals.length; i++) {
      const hist = vals.slice(i - win, i);
      const m = hist.reduce((a, b) => a + b, 0) / hist.length;
      const sd = Math.sqrt(hist.reduce((a, b) => a + (b - m) ** 2, 0) / hist.length) || 1;
      const zz = Math.abs((vals[i] - m) / sd);
      const pp = Math.abs((vals[i] - m) / Math.abs(m)) * 100;
      if (zz > z && pp > pct) out.push(i);
    }
    return out;
  }, [metric, z, pct, win]);
  const mean = metric ? metric.mean : 0;
  const trigger = metric ? mean + z * metric.sd : 0;
  const field = (label, val, set, min, max, step, suffix) => /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-label)',
      color: 'var(--ink-2)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    step: step,
    value: val,
    onChange: e => set(Number(e.target.value)),
    style: {
      flex: 1,
      accentColor: 'var(--ink)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink)',
      width: 56,
      textAlign: 'right'
    }
  }, val, suffix)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      alignSelf: 'flex-start',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 13,
      color: 'var(--muted)',
      padding: '2px 0',
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "arrow-left",
    size: 14
  }), " Detectors"), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, det.id), /*#__PURE__*/React.createElement(Badge, {
    variant: det.severity
  }, det.severity), /*#__PURE__*/React.createElement(Badge, {
    variant: enabled ? 'resolved' : 'neutral'
  }, enabled ? 'enabled' : 'disabled'), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: enabled,
    onChange: setEnabled,
    label: "Enabled"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--ink-2)',
      marginBottom: 4
    }
  }, det.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, det.dashboard, " \xB7 metric ", det.metric, " \xB7 cadence ", det.cadence)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '340px 1fr',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Threshold",
    note: "tune the rule",
    divided: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, field('z-score >', z, setZ, 1, 5, 0.1, 'σ'), field('min move >', pct, setPct, 1, 30, 1, '%'), field('baseline window', win, setWin, 10, 60, 5, ' smp'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Save threshold"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      setZ(det.z ?? 3);
      setPct(det.minPct ?? 8);
      setWin(det.window ?? 40);
    }
  }, "Reset")))), /*#__PURE__*/React.createElement(Panel, {
    title: "Backtest preview",
    note: "replaying the current threshold over stored history \xB7 red = would fire",
    divided: true,
    aside: /*#__PURE__*/React.createElement(Badge, {
      variant: fires.length > 4 ? 'critical' : fires.length > 0 ? 'warning' : 'resolved'
    }, fires.length, " would fire")
  }, metric ? /*#__PURE__*/React.createElement(MetricChart, {
    points: metric.ts,
    unit: metric.unit === '%' ? '%' : '',
    mean: mean,
    band: {
      lo: mean - 2 * metric.sd,
      hi: mean + 2 * metric.sd
    },
    threshold: {
      value: trigger,
      label: `trigger ${trigger.toFixed(1)}${metric.unit === '%' ? '%' : ''}`
    },
    fired: fires,
    height: 220
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--muted)',
      fontSize: 13,
      padding: 20
    }
  }, "No metric bound (no-data detector)."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 12,
      fontSize: 12.5,
      color: 'var(--muted)',
      lineHeight: 1.5
    }
  }, "Drag the sliders and watch the fire count change \u2014 ", /*#__PURE__*/React.createElement("b", null, "this is the tune-from-backtest loop the audit called for."), fires.length > 4 ? ' Too sensitive: raise z or the min move.' : fires.length === 0 ? ' Nothing fires — this may be too loose.' : ' Looks balanced.'))));
}
Object.assign(window, {
  Detectors,
  DetectorConfig
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Detectors.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/EmptyState.jsx
try { (() => {
// Empty / loading / error states — meaningful in a monitoring tool.
function EmptyState({
  kind = 'calm'
}) {
  const MAP = {
    calm: {
      icon: 'shield-check',
      tone: 'var(--good)',
      bg: 'var(--good-bg)',
      title: 'No active incidents',
      body: 'Every monitored dashboard is inside its normal range.'
    },
    nofilter: {
      icon: 'search-x',
      tone: 'var(--muted)',
      bg: 'var(--panel-2)',
      title: 'Nothing matches this filter',
      body: 'Try clearing a filter or widening the time range.'
    },
    loading: {
      icon: 'loader',
      tone: 'var(--muted)',
      bg: 'var(--panel-2)',
      title: 'Loading…',
      body: 'Fetching the latest samples.'
    },
    sourcedown: {
      icon: 'plug-zap',
      tone: 'var(--critical)',
      bg: 'var(--critical-bg)',
      title: 'Source unreachable',
      body: 'The dashboard’s data source isn’t responding — collection is paused.'
    },
    muted: {
      icon: 'bell-off',
      tone: 'var(--warning)',
      bg: 'var(--warning-bg)',
      title: 'Detector muted',
      body: 'Alerts are suppressed here until the mute expires.'
    }
  };
  const s = MAP[kind] || MAP.calm;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 8,
      padding: '34px 20px',
      background: s.bg,
      borderRadius: 'var(--radius)',
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: s.icon,
    size: 19,
    color: s.tone
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--muted)',
      maxWidth: 320
    }
  }, s.body));
}
Object.assign(window, {
  EmptyState
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/EmptyState.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Escalation.jsx
try { (() => {
// Escalation & on-call — policy per severity + on-call schedule + notification channels.
function Escalation() {
  const {
    Panel,
    Badge,
    Switch,
    Button
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const [channels, setChannels] = React.useState(D.CHANNELS);
  const toggle = n => setChannels(xs => xs.map(c => c.name === n ? {
    ...c,
    on: !c.on
  } : c));
  const CHIC = {
    slack: 'message-square',
    pagerduty: 'phone',
    email: 'mail',
    webhook: 'webhook'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "On-call",
    note: "who gets paged right now",
    divided: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      background: 'var(--ink)',
      color: '#fff',
      fontSize: 14,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, D.ONCALL.now.avatar), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, D.ONCALL.now.name, " ", /*#__PURE__*/React.createElement(Badge, {
    variant: "resolved"
  }, "on-call")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--muted)',
      marginTop: 3
    }
  }, "@", D.ONCALL.now.handle, " \xB7 until ", D.ONCALL.now.until))), /*#__PURE__*/React.createElement(window.Icon, {
    name: "arrow-right",
    size: 16
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 999,
      background: 'var(--panel-3)',
      color: 'var(--ink)',
      fontSize: 12,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, D.ONCALL.next.avatar), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, D.ONCALL.next.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--muted)'
    }
  }, "next \xB7 from ", D.ONCALL.next.from))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    style: {
      marginLeft: 'auto'
    },
    iconLeft: /*#__PURE__*/React.createElement(window.Icon, {
      name: "repeat",
      size: 13
    })
  }, "Override")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 16
    }
  }, D.ONCALL.schedule.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.day,
    style: {
      flex: 1,
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '9px 10px',
      background: s.who === D.ONCALL.now.name ? 'var(--panel-2)' : 'var(--panel)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--faint)'
    }
  }, s.day), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink)',
      marginTop: 3,
      fontWeight: 500
    }
  }, s.who.split(' ')[0]))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Escalation policy",
    note: "who is notified, when, per severity",
    divided: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, D.ESCALATION.map(e => /*#__PURE__*/React.createElement("div", {
    key: e.sev,
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      flex: 'none',
      paddingTop: 2
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: e.sev
  }, e.sev)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      alignItems: 'center'
    }
  }, e.steps.map((s, k) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: k
  }, k > 0 ? /*#__PURE__*/React.createElement(window.Icon, {
    name: "chevron-right",
    size: 13,
    color: "var(--faint)"
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      border: '1px solid var(--border)',
      borderRadius: 999,
      padding: '5px 11px',
      fontSize: 12.5,
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--muted)'
    }
  }, s.after), s.to))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    iconLeft: /*#__PURE__*/React.createElement(window.Icon, {
      name: "plus",
      size: 13
    })
  }, "Step")))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Notification channels",
    note: "where alerts are delivered",
    divided: true,
    flush: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 0'
    }
  }, channels.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 18px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: 'var(--panel-2)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: CHIC[c.kind],
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13.5,
      color: 'var(--ink)'
    }
  }, c.name), /*#__PURE__*/React.createElement(Switch, {
    checked: c.on,
    onChange: () => toggle(c.name)
  }))))));
}
Object.assign(window, {
  Escalation
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Escalation.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/HealthMatrix.jsx
try { (() => {
// Dashboard health matrix — per-dashboard collection heat over 14 days.
function HealthMatrix({
  dashboards
}) {
  const {
    HeatStrip,
    StatusDot
  } = window.SetnelDesignSystem_525d6e;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '200px 1fr 92px 56px',
      gap: 14,
      alignItems: 'center',
      padding: '0 0 10px',
      borderBottom: '1px solid var(--border)',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Dashboard"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Last 14 days"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      textAlign: 'right'
    }
  }, "Last check"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      textAlign: 'right'
    }
  }, "Today")), dashboards.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    style: {
      display: 'grid',
      gridTemplateColumns: '200px 1fr 92px 56px',
      gap: 14,
      alignItems: 'center',
      padding: '7px 0',
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      fontSize: 13,
      fontWeight: 550,
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    status: d.status
  }), d.name), /*#__PURE__*/React.createElement(HeatStrip, {
    levels: d.heat
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: d.status === 'down' ? 'var(--critical)' : 'var(--muted)',
      textAlign: 'right'
    }
  }, d.lastCheck), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--ink)',
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums'
    }
  }, d.checksToday))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 14,
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, [['lvl3', 'full'], ['lvl2', 'partial'], ['lvl1', 'low'], ['lvl0', 'none']].map(([v, l]) => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: `var(--${v})`
    }
  }), l))));
}
Object.assign(window, {
  HealthMatrix
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/HealthMatrix.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Inbox.jsx
try { (() => {
// Inbox — the audit log / activity feed: everything that changed, and who changed it.
function Inbox({
  onOpenIncident
}) {
  const {
    Panel,
    Chip
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const [filter, setFilter] = React.useState('all');
  const ICON = {
    ack: 'check',
    open: 'siren',
    resolve: 'circle-check',
    mute: 'bell-off',
    fp: 'x',
    config: 'sliders-horizontal',
    oncall: 'user-round'
  };
  const TONE = {
    ack: 'var(--good)',
    open: 'var(--critical)',
    resolve: 'var(--good)',
    mute: 'var(--muted)',
    fp: 'var(--muted)',
    config: 'var(--info)',
    oncall: 'var(--ink-2)'
  };
  const rows = filter === 'all' ? D.AUDIT : D.AUDIT.filter(a => filter === 'incidents' ? ['ack', 'open', 'resolve', 'fp'].includes(a.kind) : a.kind === filter);
  return /*#__PURE__*/React.createElement(Panel, {
    title: "Activity & audit log",
    note: "every change, attributed",
    divided: true,
    flush: true,
    aside: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Chip, {
      active: filter === 'all',
      onClick: () => setFilter('all')
    }, "All"), /*#__PURE__*/React.createElement(Chip, {
      active: filter === 'incidents',
      onClick: () => setFilter('incidents')
    }, "Incidents"), /*#__PURE__*/React.createElement(Chip, {
      active: filter === 'config',
      onClick: () => setFilter('config')
    }, "Config"))
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: '4px 0'
    }
  }, rows.map((a, k) => /*#__PURE__*/React.createElement("li", {
    key: k,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 18px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      background: 'var(--panel-2)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      color: TONE[a.kind]
    }
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: ICON[a.kind] || 'dot',
    size: 14,
    color: TONE[a.kind]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("b", null, a.actor), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-2)'
    }
  }, a.action), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)'
    }
  }, a.target))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--faint)',
      flex: 'none'
    }
  }, a.time)))));
}
Object.assign(window, {
  Inbox
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Inbox.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/IncidentDetail.jsx
try { (() => {
// Incident detail — evidence ("why it fired" + cross-source provenance), actions, runbook, chart, activity.
function IncidentDetail({
  i,
  onBack,
  onAck,
  onMute,
  onFp,
  onOpenDetector
}) {
  const {
    Panel,
    Badge,
    Button,
    Input,
    MetricChart
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const metric = D.METRICS.find(m => i.detector.startsWith(m.key.split('.').slice(0, 2).join('.'))) || D.METRICS[0];
  const detector = D.DETECTORS.find(d => d.id === i.detector);
  const prov = D.PROVENANCE[i.id];
  const trigger = metric ? metric.mean + (detector ? detector.z : 3) * metric.sd : null;
  const firedIdx = metric ? metric.ts.map((p, k) => k).filter(k => metric.points[k] > (trigger || Infinity)) : [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      alignSelf: 'flex-start',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 13,
      color: 'var(--muted)',
      padding: '2px 0',
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "arrow-left",
    size: 14
  }), " All incidents \xB7 #", i.id), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, i.dashboard), /*#__PURE__*/React.createElement(Badge, {
    variant: i.severity
  }, i.severity), /*#__PURE__*/React.createElement(Badge, {
    variant: i.status === 'active' ? 'neutral' : 'resolved'
  }, i.status), i.ackedBy ? /*#__PURE__*/React.createElement(Badge, {
    variant: "resolved"
  }, "ack by ", i.ackedBy) : null, i.exposure ? /*#__PURE__*/React.createElement(Badge, {
    variant: "exposure"
  }, D.fmtExposure(i.exposure), " at risk") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      lineHeight: 1.45,
      color: 'var(--ink)',
      marginBottom: 10
    }
  }, i.message), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--muted)',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => detector && onOpenDetector && onOpenDetector(detector),
    style: {
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: detector ? 'pointer' : 'default',
      color: 'var(--text-link)',
      fontFamily: 'var(--font-mono)',
      fontSize: 12
    }
  }, i.detector), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "opened Jul 05 \xB7 13:41"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "\xD7", i.count, " events")), i.status === 'active' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, !i.ackedBy ? /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => onAck(i)
  }, "Acknowledge") : null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => onMute(i)
  }, "Mute 1h"), /*#__PURE__*/React.createElement(Button, null, "Resolve"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    onClick: () => onFp(i)
  }, "False positive"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "#",
    variant: "ghost",
    onClick: e => e.preventDefault()
  }, "Open dashboard \u2197")) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, "Resolved ", i.resolvedAt, " by ", i.resolvedBy, ".")), prov ? /*#__PURE__*/React.createElement(Panel, {
    title: "Why this fired",
    note: "the rule, the baseline, and the cross-source evidence",
    divided: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "Rule & baseline"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Row, {
    k: "Rule",
    v: prov.rule
  }), /*#__PURE__*/React.createElement(Row, {
    k: "Baseline window",
    v: prov.window
  }), /*#__PURE__*/React.createElement(Row, {
    k: "Baseline",
    v: prov.baseline
  }), prov.z != null ? /*#__PURE__*/React.createElement(Row, {
    k: "Deviation",
    v: `z = +${prov.z}  ·  +${prov.movePct}pt vs mean`,
    strong: true
  }) : null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "Cross-source confirmation"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, prov.sources.map((s, k) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 11px',
      borderRadius: 8,
      border: '1px solid var(--border)',
      background: s.kind === 'primary' ? 'var(--panel-2)' : 'var(--panel)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: s.kind === 'primary' ? 'var(--ink)' : 'var(--good)',
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-2)',
      flex: 1
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, s.value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--faint)',
      width: 92,
      textAlign: 'right'
    }
  }, s.at))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--muted)',
      marginTop: 2
    }
  }, "Independent sources agree within tolerance \u2014 this is a real move, not a reporting glitch."))))) : null, /*#__PURE__*/React.createElement(Panel, {
    title: metric.key,
    note: "normal range shaded \xB7 dashed = trigger \xB7 red = threshold crossings",
    divided: true
  }, /*#__PURE__*/React.createElement(MetricChart, {
    points: metric.ts,
    unit: metric.unit === '%' ? '%' : '',
    mean: metric.mean,
    band: {
      lo: metric.mean - 2 * metric.sd,
      hi: metric.mean + 2 * metric.sd
    },
    threshold: trigger != null ? {
      value: trigger,
      label: `trigger ${trigger.toFixed(1)}${metric.unit === '%' ? '%' : ''}`
    } : null,
    fired: firedIdx,
    height: 220
  })), /*#__PURE__*/React.createElement(Panel, {
    title: `Runbook · ${D.RUNBOOK.title}`,
    divided: true,
    aside: /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => e.preventDefault(),
      style: {
        color: 'var(--muted)'
      }
    }, "all runbooks \u2192")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--muted)',
      marginBottom: 10
    }
  }, D.RUNBOOK.when), /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      paddingLeft: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontSize: 13.5,
      color: 'var(--ink-2)',
      lineHeight: 1.5
    }
  }, D.RUNBOOK.steps.map((s, n) => /*#__PURE__*/React.createElement("li", {
    key: n
  }, s)))), /*#__PURE__*/React.createElement(Panel, {
    title: "Activity",
    note: "events + notes",
    divided: true
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => e.preventDefault(),
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Add a note\u2026",
    maxLength: 1000
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    type: "submit"
  }, "Note")), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, D.NOTES.map((n, k) => /*#__PURE__*/React.createElement("li", {
    key: 'n' + k,
    style: {
      display: 'flex',
      gap: 10,
      paddingLeft: 12,
      borderLeft: '2px solid var(--info)',
      fontSize: 13.5,
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--faint)',
      flex: 'none',
      width: 96
    }
  }, n.time), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, n.author), ": ", n.body))), D.EVENTS.map((e, k) => /*#__PURE__*/React.createElement("li", {
    key: 'e' + k,
    style: {
      display: 'flex',
      gap: 10,
      paddingLeft: 12,
      borderLeft: '2px solid var(--border)',
      fontSize: 13.5,
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--faint)',
      flex: 'none',
      width: 96
    }
  }, e.time), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5
    }
  }, e.body))))));
}
function Row({
  k,
  v,
  strong
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      width: 120,
      flex: 'none'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: strong ? 'var(--critical)' : 'var(--ink)',
      fontWeight: strong ? 600 : 400
    }
  }, v));
}
Object.assign(window, {
  IncidentDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/IncidentDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/IncidentFeed.jsx
try { (() => {
// Incident feed + card. Bulk select, mute-with-reason, keyboard ops (j/k/a/m/e), empty states.
const SEV_COLOR = {
  info: 'var(--info)',
  warning: 'var(--warning)',
  critical: 'var(--critical)',
  emergency: 'var(--emergency)'
};
function IncidentCard({
  i,
  onOpen,
  onAck,
  onMute,
  onFp,
  selectable,
  selected,
  onSelect,
  focused
}) {
  const {
    Badge,
    Button,
    Checkbox,
    Menu,
    MenuItem,
    MenuLabel,
    MenuSeparator
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  return /*#__PURE__*/React.createElement("li", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'stretch',
      justifyContent: 'space-between',
      background: focused ? 'var(--panel-2)' : 'var(--panel)',
      border: '1px solid ' + (focused ? 'var(--border-strong)' : 'var(--border)'),
      borderLeft: `3px solid ${SEV_COLOR[i.severity]}`,
      borderRadius: 'var(--radius)',
      padding: '12px 14px'
    }
  }, selectable ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: selected,
    onChange: () => onSelect(i.id)
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, i.dashboard), /*#__PURE__*/React.createElement(Badge, {
    variant: i.severity
  }, i.severity), i.status === 'resolved' ? /*#__PURE__*/React.createElement(Badge, {
    variant: "resolved"
  }, "resolved") : null, i.ackedBy ? /*#__PURE__*/React.createElement(Badge, {
    variant: "resolved"
  }, "ack ", i.ackedBy) : null, i.muted ? /*#__PURE__*/React.createElement(Badge, null, "muted", i.muteReason ? ' · ' + i.muteReason : '') : null, i.fp ? /*#__PURE__*/React.createElement(Badge, null, "false positive") : null, i.count > 1 ? /*#__PURE__*/React.createElement(Badge, {
    variant: "count"
  }, "\xD7", i.count) : null, i.exposure ? /*#__PURE__*/React.createElement(Badge, {
    variant: "exposure"
  }, D.fmtExposure(i.exposure), " at risk") : null), /*#__PURE__*/React.createElement("a", {
    onClick: e => {
      e.preventDefault();
      onOpen(i);
    },
    href: "#",
    style: {
      display: 'block',
      fontSize: 14,
      lineHeight: 1.45,
      color: 'var(--ink-2)',
      textDecoration: 'none',
      maxWidth: 660
    }
  }, i.message), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      flexWrap: 'wrap',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--faint)',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, i.detector), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, i.last), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("a", {
    onClick: e => {
      e.preventDefault();
      onOpen(i);
    },
    href: "#",
    style: {
      color: 'var(--muted)',
      fontFamily: 'var(--font-sans)'
    }
  }, "details \u2192"))), i.status === 'active' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flex: 'none',
      alignSelf: 'center'
    }
  }, !i.ackedBy ? /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: () => onAck(i)
  }, "Ack") : null, /*#__PURE__*/React.createElement(Menu, {
    align: "right",
    trigger: /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "Mute \u25BE")
  }, /*#__PURE__*/React.createElement(MenuLabel, null, "Mute \xB7 pick a reason"), /*#__PURE__*/React.createElement(MenuItem, {
    onSelect: () => onMute(i, '1h')
  }, "1 hour"), /*#__PURE__*/React.createElement(MenuItem, {
    onSelect: () => onMute(i, '24h · indexer reorg')
  }, "24h \xB7 indexer reorg"), /*#__PURE__*/React.createElement(MenuItem, {
    onSelect: () => onMute(i, 'until resolved')
  }, "Until resolved"), /*#__PURE__*/React.createElement(MenuSeparator, null), /*#__PURE__*/React.createElement(MenuItem, {
    danger: true,
    onSelect: () => onFp(i)
  }, "Mark false positive"))) : null);
}
function IncidentFeed({
  incidents,
  onOpen,
  onAck,
  onMute,
  onFp,
  compact = false
}) {
  const {
    Chip,
    Checkbox,
    Menu,
    MenuItem,
    MenuLabel,
    Button,
    Badge
  } = window.SetnelDesignSystem_525d6e;
  const [filter, setFilter] = React.useState('active');
  const [dash, setDash] = React.useState(null);
  const [sel, setSel] = React.useState(new Set());
  const [focus, setFocus] = React.useState(0);
  let rows = incidents;
  if (!compact) {
    if (filter === 'active') rows = rows.filter(i => i.status === 'active');
    if (['critical', 'emergency'].includes(filter)) rows = rows.filter(i => i.severity === filter);
    if (dash) rows = rows.filter(i => i.dashboardId === dash);
  }
  const active = rows.filter(i => i.status === 'active');
  const resolved = rows.filter(i => i.status === 'resolved');
  const dashes = [...new Map(incidents.map(i => [i.dashboardId, i.dashboard])).entries()];

  // keyboard ops: j/k move, a ack, m mute, e (open/expand)
  React.useEffect(() => {
    if (compact) return;
    const onKey = e => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      const cur = active[focus];
      if (e.key === 'j') {
        e.preventDefault();
        setFocus(f => Math.min(active.length - 1, f + 1));
      } else if (e.key === 'k') {
        e.preventDefault();
        setFocus(f => Math.max(0, f - 1));
      } else if (e.key === 'a' && cur && !cur.ackedBy) {
        e.preventDefault();
        onAck(cur);
      } else if (e.key === 'm' && cur) {
        e.preventDefault();
        onMute(cur, '1h');
      } else if (e.key === 'x' && cur) {
        e.preventDefault();
        toggle(cur.id);
      } else if (e.key === 'Enter' && cur) {
        e.preventDefault();
        onOpen(cur);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, focus, compact]);
  const toggle = id => setSel(p => {
    const n = new Set(p);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const allSel = active.length > 0 && active.every(i => sel.has(i.id));
  const someSel = active.some(i => sel.has(i.id));
  const selectAll = () => setSel(allSel ? new Set() : new Set(active.map(i => i.id)));
  const bulk = (fn, ...args) => {
    active.filter(i => sel.has(i.id)).forEach(i => fn(i, ...args));
    setSel(new Set());
  };
  return /*#__PURE__*/React.createElement("div", null, !compact ? /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      flexWrap: 'wrap',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    active: filter === 'active',
    onClick: () => setFilter('active')
  }, "Active"), /*#__PURE__*/React.createElement(Chip, {
    active: filter === 'all',
    onClick: () => setFilter('all')
  }, "All"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 16,
      background: 'var(--border-strong)',
      margin: '0 3px'
    }
  }), /*#__PURE__*/React.createElement(Chip, {
    active: filter === 'critical',
    onClick: () => setFilter(filter === 'critical' ? 'all' : 'critical')
  }, "Critical"), /*#__PURE__*/React.createElement(Chip, {
    active: filter === 'emergency',
    onClick: () => setFilter(filter === 'emergency' ? 'all' : 'emergency')
  }, "Emergency"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 16,
      background: 'var(--border-strong)',
      margin: '0 3px'
    }
  }), dashes.map(([id, name]) => /*#__PURE__*/React.createElement(Chip, {
    key: id,
    active: dash === id,
    onClick: () => setDash(dash === id ? null : id)
  }, name)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--faint)'
    }
  }, "j/k move \xB7 a ack \xB7 m mute \xB7 \u21B5 open")) : null, !compact && active.length > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 12px',
      marginBottom: 10,
      background: someSel ? 'var(--panel-2)' : 'transparent',
      border: '1px solid ' + (someSel ? 'var(--border-strong)' : 'transparent'),
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: allSel,
    indeterminate: someSel && !allSel,
    onChange: selectAll
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: someSel ? 'var(--ink)' : 'var(--muted)'
    }
  }, someSel ? `${sel.size} selected` : 'Select all'), someSel ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginLeft: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary",
    onClick: () => bulk(onAck)
  }, "Ack selected"), /*#__PURE__*/React.createElement(Menu, {
    align: "left",
    trigger: /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "Mute selected \u25BE")
  }, /*#__PURE__*/React.createElement(MenuLabel, null, "Mute ", sel.size), /*#__PURE__*/React.createElement(MenuItem, {
    onSelect: () => bulk(onMute, '1h')
  }, "1 hour"), /*#__PURE__*/React.createElement(MenuItem, {
    onSelect: () => bulk(onMute, '24h · indexer reorg')
  }, "24h \xB7 indexer reorg")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "danger",
    onClick: () => bulk(onFp)
  }, "False positive")) : null) : null, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, active.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    kind: filter === 'active' ? 'calm' : 'nofilter'
  }) : active.map((i, idx) => /*#__PURE__*/React.createElement(IncidentCard, {
    key: i.id,
    i: i,
    onOpen: onOpen,
    onAck: onAck,
    onMute: onMute,
    onFp: onFp,
    selectable: !compact,
    selected: sel.has(i.id),
    onSelect: toggle,
    focused: !compact && idx === focus
  }))), !compact && resolved.length > 0 ? /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: 'pointer',
      fontSize: 13,
      color: 'var(--muted)',
      padding: '6px 0'
    }
  }, "Resolved (", resolved.length, ")"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '10px 0 0',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      opacity: 0.85
    }
  }, resolved.map(i => /*#__PURE__*/React.createElement(IncidentCard, {
    key: i.id,
    i: i,
    onOpen: onOpen,
    onAck: onAck,
    onMute: onMute,
    onFp: onFp
  })))) : null);
}
Object.assign(window, {
  IncidentCard,
  IncidentFeed,
  SEV_COLOR
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/IncidentFeed.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Login.jsx
try { (() => {
// Login gate — matches the real product: white card, logo, ink button.
function Login({
  onEnter
}) {
  const {
    Button
  } = window.SetnelDesignSystem_525d6e;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onEnter();
    },
    style: {
      width: 340,
      padding: '32px 28px',
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "./logo.png",
    width: "48",
    height: "48",
    style: {
      borderRadius: 10,
      display: 'block'
    },
    alt: "Datum Labs"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--ink)'
    }
  }, "Setnel"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--muted)',
      fontSize: 13,
      marginBottom: 8
    }
  }, "A Datum Labs product \xB7 risk monitoring"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Team password",
    defaultValue: "setnel-demo",
    autoFocus: true,
    style: {
      padding: '11px 13px',
      background: 'var(--white)',
      border: '1px solid var(--border-strong)',
      borderRadius: 8,
      color: 'var(--ink)',
      fontSize: 14,
      outline: 'none',
      fontFamily: 'var(--font-sans)'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    type: "submit",
    style: {
      width: '100%'
    }
  }, "Enter")));
}
Object.assign(window, {
  Login
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Login.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Metrics.jsx
try { (() => {
// Metrics explorer — per-dashboard band charts via MetricCard.
function Metrics() {
  const {
    Panel,
    MetricCard
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const byDash = [...new Map(D.METRICS.map(m => [m.dashboard, D.METRICS.filter(x => x.dashboard === m.dashboard)])).entries()];
  const fmt = m => {
    if (m.unit === '%') return m.latest.toFixed(1) + '%';
    if (m.unit === '$M') return '$' + m.latest.toFixed(1) + 'M';
    if (m.unit === '$B') return '$' + m.latest.toFixed(2) + 'B';
    return String(m.latest);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--panel-gap)'
    }
  }, byDash.map(([name, list]) => /*#__PURE__*/React.createElement(Panel, {
    key: name,
    title: name,
    note: `${list.length} metrics · grey band = normal range (mean ±2σ)`,
    divided: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 14
    }
  }, list.map(m => /*#__PURE__*/React.createElement(MetricCard, {
    key: m.key,
    metricKey: m.key,
    value: fmt(m),
    points: m.points,
    mean: m.mean,
    sd: m.sd,
    foot: `${m.dashboard} · ${m.points.length} samples`
  }))))));
}
Object.assign(window, {
  Metrics
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Metrics.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Mobile.jsx
try { (() => {
// Mobile at-a-glance status — phone-width surface for off-hours checks.
function Mobile({
  incidents,
  onOpen
}) {
  const {
    Badge,
    StatusDot,
    HeatStrip
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const active = incidents.filter(i => i.status === 'active');
  const critical = active.filter(i => ['critical', 'emergency'].includes(i.severity)).length;
  const healthy = D.DASHBOARDS.filter(d => d.status === 'healthy').length;
  const worst = critical > 0 ? 'bad' : active.length > 0 ? 'warn' : 'good';
  const bannerBg = worst === 'bad' ? 'var(--critical-bg)' : worst === 'warn' ? 'var(--warning-bg)' : 'var(--good-bg)';
  const bannerFg = worst === 'bad' ? 'var(--critical)' : worst === 'warn' ? 'var(--warning)' : 'var(--good)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--white)',
      height: '100%',
      overflowY: 'auto',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '14px 16px',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "./logo.png",
    width: "24",
    height: "24",
    style: {
      borderRadius: 6
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--ink)'
    }
  }, "Setnel"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: 'var(--good)',
      animation: 'setnel-pulse var(--pulse-period) var(--ease-in-out) infinite'
    }
  }), "live")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: bannerBg,
      borderRadius: 'var(--radius-panel)',
      padding: '16px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: bannerFg,
      fontVariantNumeric: 'tabular-nums'
    }
  }, active.length, " active"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-2)',
      marginTop: 2
    }
  }, critical, " critical \xB7 ", healthy, "/", D.DASHBOARDS.length, " dashboards healthy")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "Active incidents"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, active.map(i => /*#__PURE__*/React.createElement("button", {
    key: i.id,
    onClick: () => onOpen && onOpen(i),
    style: {
      textAlign: 'left',
      cursor: 'pointer',
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${window.SEV_COLOR[i.severity]}`,
      borderRadius: 'var(--radius)',
      padding: '11px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7,
      alignItems: 'center',
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, i.dashboard), /*#__PURE__*/React.createElement(Badge, {
    variant: i.severity
  }, i.severity), i.exposure ? /*#__PURE__*/React.createElement(Badge, {
    variant: "exposure"
  }, D.fmtExposure(i.exposure)) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-2)',
      lineHeight: 1.4
    }
  }, i.message), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--faint)',
      marginTop: 6
    }
  }, i.detector, " \xB7 ", i.last))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "Dashboard health"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, D.DASHBOARDS.slice(0, 6).map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    status: d.status
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink)',
      flex: 1
    }
  }, d.name), /*#__PURE__*/React.createElement(HeatStrip, {
    levels: d.heat.slice(-7)
  })))))));
}
Object.assign(window, {
  Mobile
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Mobile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Reports.jsx
try { (() => {
// Reports — incident trends, MTTA/MTTR, false-positive rate, noisiest detectors.
function Bars({
  data,
  labels,
  unit = '',
  color = 'var(--ink)',
  height = 90
}) {
  const max = Math.max(...data) * 1.1 || 1;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 6,
      height
    }
  }, data.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 4
    },
    title: `${labels[i]}: ${v}${unit}`
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9.5,
      color: 'var(--faint)'
    }
  }, v, unit), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: `${v / max * (height - 18)}px`,
      background: color,
      borderRadius: '3px 3px 0 0',
      minHeight: 2
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 5
    }
  }, labels.map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      color: 'var(--faint)'
    }
  }, l.split(' ')[1]))));
}
function Reports() {
  const {
    Panel,
    StatCard,
    Badge,
    Button
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const R = D.REPORT;
  const last = a => a[a.length - 1];
  const trend = a => {
    const d = last(a) - a[a.length - 2];
    return d;
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, "8-week window \xB7 through Jun 30"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    style: {
      marginLeft: 'auto'
    },
    iconLeft: /*#__PURE__*/React.createElement(window.Icon, {
      name: "download",
      size: 14
    })
  }, "Export weekly report")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Incidents / wk",
    value: String(last(R.opened)),
    sub: `${trend(R.opened) >= 0 ? '+' : ''}${trend(R.opened)} vs prior`,
    tone: trend(R.opened) > 0 ? 'warn' : 'good'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Time to ack",
    value: `${last(R.mtta)}m`,
    sub: `${trend(R.mtta) <= 0 ? '' : '+'}${trend(R.mtta)}m`,
    tone: last(R.mtta) <= 10 ? 'good' : 'warn'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Time to resolve",
    value: `${last(R.mttr)}m`,
    sub: `${trend(R.mttr) <= 0 ? '' : '+'}${trend(R.mttr)}m`,
    tone: last(R.mttr) <= 40 ? 'good' : 'warn'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "False-positive rate",
    value: `${last(R.fpRate)}%`,
    sub: `${trend(R.fpRate) <= 0 ? '' : '+'}${trend(R.fpRate)}pt`,
    tone: last(R.fpRate) <= 12 ? 'good' : 'warn'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Incidents opened",
    note: "per week",
    divided: true
  }, /*#__PURE__*/React.createElement(Bars, {
    data: R.opened,
    labels: R.weeks
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "False-positive rate",
    note: "per week",
    divided: true
  }, /*#__PURE__*/React.createElement(Bars, {
    data: R.fpRate,
    labels: R.weeks,
    unit: "%",
    color: "var(--warning)"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "Mean time to acknowledge",
    note: "minutes",
    divided: true
  }, /*#__PURE__*/React.createElement(Bars, {
    data: R.mtta,
    labels: R.weeks,
    unit: "m",
    color: "var(--info)"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "Mean time to resolve",
    note: "minutes",
    divided: true
  }, /*#__PURE__*/React.createElement(Bars, {
    data: R.mttr,
    labels: R.weeks,
    unit: "m",
    color: "var(--good)"
  }))), /*#__PURE__*/React.createElement(Panel, {
    title: "Noisiest detectors",
    note: "30 days \xB7 fires and false positives by rule",
    divided: true,
    flush: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 0'
    }
  }, R.noisiest.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.detector,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 120px 80px',
      gap: 12,
      alignItems: 'center',
      padding: '9px 18px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: 'var(--ink)'
    }
  }, d.detector), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 6,
      background: 'var(--panel-3)',
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${d.fires / R.noisiest[0].fires * 100}%`,
      height: '100%',
      background: 'var(--ink)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--ink)'
    }
  }, d.fires)), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, d.fp ? /*#__PURE__*/React.createElement(Badge, {
    variant: "warning"
  }, d.fp, " fp") : /*#__PURE__*/React.createElement(Badge, {
    variant: "resolved"
  }, "clean")))))));
}
Object.assign(window, {
  Reports
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Reports.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Runbooks.jsx
try { (() => {
// Runbooks — what to do when each alert fires.
function Runbooks() {
  const {
    Panel
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  return /*#__PURE__*/React.createElement(Panel, {
    title: "Runbooks",
    note: "every detector links to what to do when it fires",
    divided: true,
    flush: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 18px 8px'
    }
  }, D.RUNBOOKS.map((b, k) => /*#__PURE__*/React.createElement("div", {
    key: b.title,
    style: {
      padding: '16px 0',
      borderTop: k === 0 ? 'none' : '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 4px',
      fontSize: 15,
      fontWeight: 650,
      color: 'var(--ink)',
      letterSpacing: '-0.01em'
    }
  }, b.title), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--muted)',
      fontSize: 13,
      marginBottom: 10
    }
  }, b.when), /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      paddingLeft: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      fontSize: 13.5,
      color: 'var(--ink-2)',
      lineHeight: 1.5
    }
  }, b.steps.map((s, n) => /*#__PURE__*/React.createElement("li", {
    key: n
  }, s)))))));
}
Object.assign(window, {
  Runbooks
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Runbooks.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Settings.jsx
try { (() => {
// Settings — dashboards registry, integrations, members/roles.
function Settings({
  dense,
  onDense
}) {
  const {
    Panel,
    Badge,
    Switch,
    Button,
    StatusDot,
    Input
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Preferences",
    divided: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(SetRow, {
    label: "Dense mode",
    hint: "Tighter spacing across the console"
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: dense,
    onChange: onDense
  })), /*#__PURE__*/React.createElement(SetRow, {
    label: "Default time range",
    hint: "Applied on load"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--ink)'
    }
  }, "24h")), /*#__PURE__*/React.createElement(SetRow, {
    label: "Colorblind-safe status",
    hint: "Shape + color on status dots"
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: true,
    onChange: () => {}
  })))), /*#__PURE__*/React.createElement(Panel, {
    title: "Dashboards registry",
    note: `${D.DASHBOARDS.length} sources`,
    divided: true,
    flush: true,
    aside: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(window.Icon, {
        name: "plus",
        size: 13
      })
    }, "Add dashboard")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 0'
    }
  }, D.DASHBOARDS.slice(0, 6).map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 140px 90px 70px',
      gap: 12,
      alignItems: 'center',
      padding: '10px 18px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      fontSize: 13,
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    status: d.status
  }), d.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--muted)'
    }
  }, d.id), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--muted)'
    }
  }, "~288/day"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: true,
    onChange: () => {}
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--panel-gap)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Integrations",
    divided: true,
    flush: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 0'
    }
  }, D.CHANNELS.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '11px 18px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13,
      color: 'var(--ink)'
    }
  }, c.name), c.on ? /*#__PURE__*/React.createElement(Badge, {
    variant: "resolved"
  }, "connected") : /*#__PURE__*/React.createElement(Badge, {
    variant: "neutral"
  }, "off"))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Members & roles",
    divided: true,
    flush: true,
    aside: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost"
    }, "Invite")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 0'
    }
  }, D.MEMBERS.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.handle,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '11px 18px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      background: m.role === 'System' ? 'var(--panel-3)' : 'var(--ink)',
      color: m.role === 'System' ? 'var(--ink)' : '#fff',
      fontSize: 11,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, m.avatar), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink)',
      fontWeight: 500
    }
  }, m.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--muted)'
    }
  }, "@", m.handle)), /*#__PURE__*/React.createElement(Badge, {
    variant: "neutral"
  }, m.role)))))));
}
function SetRow({
  label,
  hint,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--ink)',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      marginTop: 1
    }
  }, hint)), children);
}
Object.assign(window, {
  Settings
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Settings.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Shell.jsx
try { (() => {
// App shell — sidebar + topbar (now-state, time range, ⌘K, wallboard, density) + content.
function Icon({
  name,
  size = 16,
  color = 'currentColor'
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const host = ref.current;
    if (!host || !window.lucide) return;
    host.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    host.appendChild(i);
    window.lucide.createIcons({
      attrs: {
        width: size,
        height: size,
        stroke: color
      }
    });
  }, [name, size, color]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      width: size,
      height: size
    }
  });
}
const NAV = [{
  section: 'Monitor',
  items: [{
    id: 'console',
    icon: 'layout-dashboard',
    label: 'Console'
  }, {
    id: 'incidents',
    icon: 'siren',
    label: 'Incidents'
  }, {
    id: 'dashboards',
    icon: 'layout-grid',
    label: 'Dashboards'
  }]
}, {
  section: 'Analyze',
  items: [{
    id: 'metrics',
    icon: 'activity',
    label: 'Metrics'
  }, {
    id: 'coverage',
    icon: 'grid-3x3',
    label: 'Coverage'
  }, {
    id: 'backtest',
    icon: 'history',
    label: 'Backtest'
  }, {
    id: 'reports',
    icon: 'bar-chart-3',
    label: 'Reports'
  }]
}, {
  section: 'Configure',
  items: [{
    id: 'detectors',
    icon: 'radar',
    label: 'Detectors'
  }, {
    id: 'escalation',
    icon: 'bell-ring',
    label: 'Escalation'
  }, {
    id: 'settings',
    icon: 'settings',
    label: 'Settings'
  }]
}];
const TITLES = {
  console: ['Console', 'Live risk overview across all monitored dashboards'],
  incidents: ['Incidents', 'Every alert — filter, triage, act'],
  detail: ['Incident', 'Evidence, runbook, and workflow'],
  dashboards: ['Dashboards', 'All monitored surfaces and their health'],
  dashboard: ['Dashboard', 'Metrics, incidents, detectors, and collection'],
  metrics: ['Metrics explorer', 'Per-metric values against their learned baseline'],
  coverage: ['Coverage map', 'Which risks are watched per protocol — and the blind spots'],
  backtest: ['Threshold backtest', 'Replay detector rules over stored history'],
  reports: ['Reports', 'Incident trends, response times, and detector quality'],
  detectors: ['Detectors', 'The rules that fire incidents — view, tune, enable'],
  detector: ['Detector', 'Rule, baseline, threshold, and history'],
  escalation: ['Escalation & on-call', 'Who gets paged, when, and how'],
  settings: ['Settings', 'Dashboards registry, integrations, and members'],
  inbox: ['Inbox', 'Everything that changed, and who changed it']
};
function Shell({
  active,
  onNav,
  live,
  seconds,
  onToggleLive,
  onSignOut,
  actor,
  onActor,
  activeCount,
  nowLevel,
  range,
  onRange,
  dense,
  onDense,
  onWallboard,
  onOpenPalette,
  onInbox,
  children
}) {
  const {
    Sidebar,
    SidebarSection,
    NavItem,
    LiveIndicator,
    NowPill,
    TimeRange
  } = window.SetnelDesignSystem_525d6e;
  const key = ['detail', 'dashboard', 'detector', 'inbox'].includes(active) ? {
    detail: 'incidents',
    dashboard: 'dashboards',
    detector: 'detectors',
    inbox: 'console'
  }[active] : active;
  const [title, subtitle] = TITLES[active] || TITLES.console;
  const brand = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
    src: "./logo.png",
    width: "26",
    height: "26",
    style: {
      borderRadius: 6,
      display: 'block'
    },
    alt: "Datum Labs"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--ink)'
    }
  }, "Setnel"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: 'var(--muted)',
      marginTop: 3
    }
  }, "Datum Labs")));
  const footer = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: onInbox,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      font: '13px var(--font-sans)',
      color: 'var(--ink-2)',
      padding: '6px 9px',
      borderRadius: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "inbox",
    size: 15
  }), " Inbox ", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--muted)',
      background: 'var(--panel-2)',
      border: '1px solid var(--border)',
      borderRadius: 999,
      padding: '1px 6px'
    }
  }, "7")), /*#__PURE__*/React.createElement(LiveIndicator, {
    live: live,
    seconds: seconds,
    onToggle: onToggleLive
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: 999,
      background: 'var(--ink)',
      color: '#fff',
      fontSize: 10.5,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, "OA"), /*#__PURE__*/React.createElement("input", {
    value: actor,
    onChange: e => onActor(e.target.value),
    style: {
      flex: 1,
      minWidth: 0,
      font: '12px var(--font-sans)',
      color: 'var(--ink)',
      background: 'var(--white)',
      border: '1px solid var(--border-strong)',
      borderRadius: 6,
      padding: '5px 8px',
      outline: 'none'
    }
  })));
  const iconBtn = (icon, label, onClick, extra) => /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: label,
    "aria-label": label,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: '13px var(--font-sans)',
      color: 'var(--muted)',
      background: 'none',
      border: '1px solid var(--border-strong)',
      borderRadius: 7,
      padding: '6px 9px',
      cursor: 'pointer',
      ...(extra || {})
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 14
  }), label ? /*#__PURE__*/React.createElement("span", null, label) : null);
  const pad = dense ? '14px 18px 48px' : '20px 22px 60px';
  const gap = dense ? 12 : 16;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    brand: brand,
    footer: footer
  }, NAV.map(sec => /*#__PURE__*/React.createElement(SidebarSection, {
    key: sec.section,
    label: sec.section
  }, sec.items.map(it => /*#__PURE__*/React.createElement(NavItem, {
    key: it.id,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: it.icon
    }),
    label: it.label,
    active: key === it.id,
    onClick: () => onNav(it.id),
    count: it.id === 'incidents' && activeCount ? activeCount : undefined
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 14,
      minHeight: 'var(--topbar-h)',
      padding: '8px 22px',
      borderBottom: '1px solid var(--border)',
      flex: 'none',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-page-title)',
      letterSpacing: '-0.01em',
      color: 'var(--ink)',
      lineHeight: 1.1
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      marginTop: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flex: 'none',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(NowPill, {
    level: nowLevel,
    count: activeCount,
    onClick: () => onNav('incidents')
  }), /*#__PURE__*/React.createElement(TimeRange, {
    value: range,
    onChange: onRange
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenPalette,
    title: "Search (\u2318K)",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      font: '13px var(--font-sans)',
      color: 'var(--muted)',
      background: 'var(--panel-2)',
      border: '1px solid var(--border-strong)',
      borderRadius: 7,
      padding: '6px 10px',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14
  }), " Search ", /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: '0 4px'
    }
  }, "\u2318K")), iconBtn('tv', '', onWallboard, {
    padding: '7px 8px'
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => onDense(!dense),
    title: "Toggle density",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      background: dense ? 'var(--ink)' : 'none',
      color: dense ? '#fff' : 'var(--muted)',
      border: '1px solid ' + (dense ? 'var(--ink)' : 'var(--border-strong)'),
      borderRadius: 7,
      padding: '7px 8px',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "rows-3",
    size: 14,
    color: dense ? '#fff' : 'currentColor'
  })), iconBtn('log-out', '', onSignOut, {
    padding: '7px 8px'
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflowY: 'auto',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      padding: pad,
      display: 'flex',
      flexDirection: 'column',
      gap
    }
  }, children))));
}
Object.assign(window, {
  Icon,
  Shell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/TrendChart.jsx
try { (() => {
// Multi-line trend chart — replicates the app's TrendChart (breakdown switcher +
// toggleable legend). Uses the design-system series palette.
const TREND_PALETTE = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)', 'var(--series-5)', 'var(--series-6)', 'var(--series-7)', 'var(--series-8)', 'var(--series-9)', 'var(--series-10)'];
function niceCeil(v) {
  if (v <= 10) return 10;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / mag;
  const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nf * mag;
}
function abbrev(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : String(n);
}
function fmtDay(iso) {
  return iso ? new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  }) : '';
}
function MultiLine({
  days,
  series,
  allSeries
}) {
  const W = 900,
    H = 240,
    padL = 46,
    padR = 14,
    padT = 14,
    padB = 28;
  const innerW = W - padL - padR,
    innerH = H - padT - padB;
  let max = 1;
  for (const s of series) for (const v of s.values) if (v > max) max = v;
  max = niceCeil(max);
  const n = days.length;
  const x = i => padL + (n <= 1 ? 0 : i / (n - 1) * innerW);
  const y = v => padT + innerH - v / max * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(max * f));
  const xLabels = [0, Math.floor((n - 1) / 2), n - 1];
  const colorFor = (key, i) => TREND_PALETTE[(allSeries.findIndex(s => s.key === key) + i * 0) % TREND_PALETTE.length] || TREND_PALETTE[i % TREND_PALETTE.length];
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: '100%',
      height: 'auto',
      display: 'block'
    },
    role: "img",
    "aria-label": "Trend"
  }, ticks.map(t => /*#__PURE__*/React.createElement("g", {
    key: t
  }, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: padL + innerW,
    y1: y(t),
    y2: y(t),
    stroke: "var(--border-hairline)",
    strokeWidth: 1
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 8,
    y: y(t) + 3,
    textAnchor: "end",
    fontSize: 11,
    fill: "var(--text-faint)",
    fontFamily: "var(--font-mono)"
  }, abbrev(t)))), xLabels.map(i => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: x(i),
    y: H - 9,
    textAnchor: "middle",
    fontSize: 11,
    fill: "var(--text-faint)",
    fontFamily: "var(--font-mono)"
  }, fmtDay(days[i]))), series.map(s => /*#__PURE__*/React.createElement("polyline", {
    key: s.key,
    points: s.values.map((v, i) => `${x(i)},${y(v)}`).join(' '),
    fill: "none",
    stroke: colorFor(s.key),
    strokeWidth: 2,
    strokeLinejoin: "round",
    strokeLinecap: "round"
  })));
}
function TrendChart({
  bundle,
  days
}) {
  const {
    SegmentedControl
  } = window.SetnelDesignSystem_525d6e;
  const DIMS = [{
    value: 'collectionByDashboard',
    label: 'Collection · by dashboard'
  }, {
    value: 'alertsByCategory',
    label: 'Alerts · by category'
  }];
  const [dim, setDim] = React.useState('collectionByDashboard');
  const [hidden, setHidden] = React.useState(new Set());
  const series = bundle[dim];
  const colorFor = (key, i) => TREND_PALETTE[series.findIndex(s => s.key === key) % TREND_PALETTE.length];
  const toggle = key => setHidden(prev => {
    const nx = new Set(prev);
    nx.has(key) ? nx.delete(key) : nx.add(key);
    return nx;
  });
  const visible = series.filter(s => !hidden.has(s.key));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    value: dim,
    onChange: k => {
      setDim(k);
      setHidden(new Set());
    },
    options: DIMS
  })), /*#__PURE__*/React.createElement(MultiLine, {
    days: days,
    series: visible,
    allSeries: series
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 14,
      marginTop: 12
    }
  }, series.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    onClick: () => toggle(s.key),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      font: 'var(--font-body-sm)',
      color: 'var(--text-secondary)',
      opacity: hidden.has(s.key) ? 0.35 : 1,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 11,
      borderRadius: 3,
      background: colorFor(s.key, i)
    }
  }), s.label))));
}
Object.assign(window, {
  TrendChart
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/TrendChart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Wallboard.jsx
try { (() => {
// Wallboard — read-only, big-screen NOC view. Auto-rotates through panels, dark canvas.
function Wallboard({
  incidents,
  onClose
}) {
  const {
    HeatStrip
  } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const [tick, setTick] = React.useState(0);
  const [clock, setClock] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 6000);
    const c = setInterval(() => setClock(new Date()), 1000);
    return () => {
      clearInterval(t);
      clearInterval(c);
    };
  }, []);
  const active = incidents.filter(i => i.status === 'active');
  const critical = active.filter(i => ['critical', 'emergency'].includes(i.severity)).length;
  const healthy = D.DASHBOARDS.filter(d => d.status === 'healthy').length;
  const worst = critical > 0 ? '#dc2626' : active.length > 0 ? '#d97706' : '#16a34a';
  const worstLabel = critical > 0 ? 'CRITICAL' : active.length > 0 ? 'DEGRADED' : 'ALL CLEAR';
  const SEV = {
    info: '#3b82f6',
    warning: '#d97706',
    critical: '#dc2626',
    emergency: '#f43f5e'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      padding: '28px 34px'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "./logo.png",
    width: "34",
    height: "34",
    style: {
      borderRadius: 8
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    }
  }, "Setnel"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: '#9aa3af'
    }
  }, "risk wallboard"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      padding: '7px 16px',
      borderRadius: 999,
      background: worst,
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: '0.04em'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 999,
      background: '#fff',
      animation: 'setnel-pulse 2s ease-in-out infinite'
    }
  }), worstLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 20,
      fontWeight: 600
    }
  }, clock.toLocaleTimeString('en-US', {
    hour12: false
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: '#fff',
      borderRadius: 8,
      padding: '8px 14px',
      cursor: 'pointer',
      fontSize: 14
    }
  }, "Exit"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 20,
      marginTop: 28
    }
  }, [[String(D.DASHBOARDS.length), 'DASHBOARDS', '#fff'], [`${healthy}/${D.DASHBOARDS.length}`, 'HEALTHY', '#22c55e'], [String(active.length), 'ACTIVE INCIDENTS', active.length ? '#f59e0b' : '#22c55e'], [String(critical), 'CRITICAL', critical ? '#f43f5e' : '#22c55e']].map(([v, l, c]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding: '22px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 52,
      fontWeight: 700,
      letterSpacing: '-0.03em',
      color: c,
      lineHeight: 1
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: '0.08em',
      color: '#9aa3af',
      marginTop: 10
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 20,
      marginTop: 20,
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding: '20px 24px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      letterSpacing: '0.08em',
      color: '#9aa3af',
      marginBottom: 16
    }
  }, "ACTIVE INCIDENTS"), active.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#22c55e',
      fontSize: 20,
      paddingTop: 20
    }
  }, "No active incidents. All systems nominal.") : active.map(i => /*#__PURE__*/React.createElement("div", {
    key: i.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '13px 0',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 999,
      background: SEV[i.severity],
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 600
    }
  }, i.dashboard, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: SEV[i.severity],
      fontSize: 12,
      letterSpacing: '0.05em',
      marginLeft: 6
    }
  }, i.severity.toUpperCase())), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: '#c4cad3',
      marginTop: 3,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, i.message)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: '#9aa3af'
    }
  }, i.last)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding: '20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      letterSpacing: '0.08em',
      color: '#9aa3af',
      marginBottom: 16
    }
  }, "DASHBOARD HEALTH"), D.DASHBOARDS.slice(0, 8).map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '9px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 999,
      background: {
        healthy: '#22c55e',
        stale: '#f59e0b',
        down: '#f43f5e',
        idle: '#6b7280'
      }[d.status],
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      flex: 1,
      color: '#e5e7eb'
    }
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 3
    }
  }, d.heat.slice(-10).map((lv, k) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      width: 11,
      height: 11,
      borderRadius: 2,
      background: ['rgba(255,255,255,0.08)', '#166534', '#22c55e', '#4ade80'][lv]
    }
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: '#4b5563'
    }
  }, "auto-refresh \xB7 read-only \xB7 cycle ", tick % 3 + 1, "/3"));
}
Object.assign(window, {
  Wallboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Wallboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/data.js
try { (() => {
// Setnel console — demo dataset. Mirrors Datum Labs' real DeFi dashboards
// (Aave v3, Sui Lending, Stablecoin Wars, Multichain TVL, …) and the app's
// incident / detector / metric / health vocabulary. Assigned to window.
(function () {
  const DASHBOARDS = [{
    id: 'aave-v3',
    name: 'Aave v3',
    status: 'healthy',
    lastCheck: '3m ago',
    checksToday: 271
  }, {
    id: 'sui-lending',
    name: 'Sui Lending',
    status: 'stale',
    lastCheck: '31h ago',
    checksToday: 44
  }, {
    id: 'stablecoin-wars',
    name: 'Stablecoin Wars',
    status: 'down',
    lastCheck: '2d ago',
    checksToday: 0
  }, {
    id: 'multichain-tvl',
    name: 'Multichain TVL',
    status: 'healthy',
    lastCheck: '5m ago',
    checksToday: 268
  }, {
    id: 'navi',
    name: 'Navi',
    status: 'healthy',
    lastCheck: '2m ago',
    checksToday: 284
  }, {
    id: 'sparklend',
    name: 'SparkLend',
    status: 'healthy',
    lastCheck: '4m ago',
    checksToday: 279
  }, {
    id: 'fast-pair',
    name: 'Fast Pair',
    status: 'healthy',
    lastCheck: '6m ago',
    checksToday: 262
  }, {
    id: 'curators',
    name: 'Curators Comparison',
    status: 'stale',
    lastCheck: '27h ago',
    checksToday: 51
  }];

  // 14-day collection heat per dashboard (0–3).
  function heat(seed) {
    const out = [];
    let v = seed;
    for (let i = 0; i < 14; i++) {
      v = (v * 9301 + 49297) % 233280;
      out.push(Math.min(3, Math.floor(v / 233280 * 4)));
    }
    return out;
  }
  DASHBOARDS.forEach((d, i) => {
    if (d.status === 'down') d.heat = [1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0];else if (d.status === 'stale') d.heat = [2, 2, 1, 2, 2, 1, 1, 2, 2, 1, 2, 1, 1, 0];else d.heat = heat(i * 37 + 11).map(x => Math.max(2, x));
  });
  const INCIDENTS = [{
    id: 4821,
    dashboard: 'Aave v3',
    dashboardId: 'aave-v3',
    severity: 'critical',
    status: 'active',
    message: 'USDC utilization spiked to 94.2% — 8.1pt above its 30-day mean in under 20 minutes.',
    detector: 'aave.v3.utilization_spike',
    count: 6,
    exposure: 1_240_000_000,
    ackedBy: null,
    last: '4m ago',
    muted: false,
    fp: false
  }, {
    id: 4820,
    dashboard: 'Stablecoin Wars',
    dashboardId: 'stablecoin-wars',
    severity: 'emergency',
    status: 'active',
    message: 'Collection stalled — no samples ingested in 2d 4h against a ~5-min cadence.',
    detector: 'ingest.collection_stalled',
    count: 1,
    exposure: null,
    ackedBy: null,
    last: '11m ago',
    muted: false,
    fp: false
  }, {
    id: 4818,
    dashboard: 'Sui Lending',
    dashboardId: 'sui-lending',
    severity: 'warning',
    status: 'active',
    message: 'suiUSDT supply concentration (HHI) drifted to 3,140 — top wallet now 38% of supply.',
    detector: 'sui.concentration_hhi',
    count: 3,
    exposure: 42_700_000,
    ackedBy: 'olusegun',
    last: '52m ago',
    muted: false,
    fp: false
  }, {
    id: 4805,
    dashboard: 'Navi',
    dashboardId: 'navi',
    severity: 'info',
    status: 'active',
    message: 'New market listed: haSUI — baseline will calibrate over the next ~40 samples.',
    detector: 'navi.market_added',
    count: 1,
    exposure: null,
    ackedBy: null,
    last: '3h ago',
    muted: true,
    fp: false
  }, {
    id: 4790,
    dashboard: 'Aave v3',
    dashboardId: 'aave-v3',
    severity: 'critical',
    status: 'resolved',
    message: 'WETH borrow rate jumped to 11.4% APR — resolved after utilization normalized.',
    detector: 'aave.v3.rate_spike',
    count: 9,
    exposure: 380_000_000,
    ackedBy: 'joel',
    last: '6h ago',
    muted: false,
    fp: false,
    resolvedBy: 'joel',
    resolvedAt: 'Jul 05 · 08:12'
  }, {
    id: 4781,
    dashboard: 'Multichain TVL',
    dashboardId: 'multichain-tvl',
    severity: 'warning',
    status: 'resolved',
    message: 'Base TVL dropped 6.2% in one interval — traced to an indexer reorg, not real outflow.',
    detector: 'tvl.step_drop',
    count: 2,
    exposure: null,
    ackedBy: 'olusegun',
    last: '1d ago',
    muted: false,
    fp: true,
    resolvedBy: 'olusegun',
    resolvedAt: 'Jul 04 · 19:40'
  }];

  // Multi-line trend data — 30 days.
  const DAYS = Array.from({
    length: 30
  }, (_, i) => {
    const d = new Date('2026-06-06T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
  function series(seed, base, amp) {
    let v = seed;
    const out = [];
    for (let i = 0; i < 30; i++) {
      v = (v * 1103515245 + 12345) % 2147483648;
      out.push(Math.max(0, Math.round(base + Math.sin(i / 4 + seed) * amp + v / 2147483648 * amp * 0.6)));
    }
    return out;
  }
  const TREND = {
    collectionByDashboard: [{
      key: 'aave-v3',
      label: 'Aave v3',
      values: series(3, 280, 12)
    }, {
      key: 'navi',
      label: 'Navi',
      values: series(7, 275, 14)
    }, {
      key: 'sparklend',
      label: 'SparkLend',
      values: series(11, 270, 16)
    }, {
      key: 'sui-lending',
      label: 'Sui Lending',
      values: series(15, 120, 60)
    }],
    alertsByCategory: [{
      key: 'utilization',
      label: 'Utilization',
      values: series(2, 4, 3)
    }, {
      key: 'concentration',
      label: 'Concentration',
      values: series(5, 2, 2)
    }, {
      key: 'collection',
      label: 'Collection',
      values: series(9, 1, 2)
    }, {
      key: 'rates',
      label: 'Rates',
      values: series(13, 3, 3)
    }]
  };

  // Per-metric samples for Metrics / Backtest / spark.
  function samples(seed, base, amp, spikeAt) {
    let v = seed;
    const out = [];
    for (let i = 0; i < 60; i++) {
      v = (v * 1103515245 + 12345) % 2147483648;
      let val = base + Math.sin(i / 5) * amp + (v / 2147483648 - 0.5) * amp;
      if (spikeAt != null && i >= spikeAt) val += (i - spikeAt) * amp * 0.5;
      out.push(Math.max(0, val));
    }
    return out;
  }
  const METRICS = [{
    dashboard: 'Aave v3',
    key: 'aave.v3.usdc_utilization',
    unit: '%',
    latest: 94.2,
    mean: 82,
    sd: 4.5,
    points: samples(3, 82, 5, 50)
  }, {
    dashboard: 'Aave v3',
    key: 'aave.v3.weth_borrow_apr',
    unit: '%',
    latest: 5.8,
    mean: 6.1,
    sd: 1.1,
    points: samples(7, 6, 1.2)
  }, {
    dashboard: 'Sui Lending',
    key: 'sui.tvl_total',
    unit: '$M',
    latest: 42.7,
    mean: 45,
    sd: 3.2,
    points: samples(11, 45, 4)
  }, {
    dashboard: 'Sui Lending',
    key: 'sui.suiusdt_hhi',
    unit: '',
    latest: 3140,
    mean: 2600,
    sd: 220,
    points: samples(15, 2600, 260, 44)
  }, {
    dashboard: 'Navi',
    key: 'navi.util_weighted',
    unit: '%',
    latest: 61.4,
    mean: 60,
    sd: 3.0,
    points: samples(19, 60, 3.4)
  }, {
    dashboard: 'Multichain TVL',
    key: 'tvl.base_total',
    unit: '$B',
    latest: 3.12,
    mean: 3.2,
    sd: 0.14,
    points: samples(23, 3.2, 0.15)
  }];
  const NOTES = [{
    time: 'Jul 05 · 14:32',
    author: 'olusegun',
    body: 'Watching — if util crosses 96% we page the on-call.'
  }, {
    time: 'Jul 05 · 14:20',
    author: 'setnel',
    body: 'Acknowledged'
  }];
  const EVENTS = [{
    time: 'Jul 05 · 14:18',
    body: 'USDC utilization 94.2% (z=+3.4, +8.1pt vs mean)'
  }, {
    time: 'Jul 05 · 14:03',
    body: 'USDC utilization 91.0% (z=+2.1)'
  }, {
    time: 'Jul 05 · 13:41',
    body: 'USDC utilization 88.4% — first breach of warning band'
  }];
  const RUNBOOK = {
    title: 'Utilization spike',
    when: 'Fires when a market\u2019s utilization moves >2σ and >8% above its rolling mean.',
    steps: ['Open the dashboard and confirm the move is real (not an indexer reorg).', 'Check whether a single wallet is driving the borrow — cross-reference concentration.', 'If organic and sustained, notify the protocol channel; else mute the detector 24h and note why.', 'Log the resolution so the backtest can re-tune the threshold.']
  };
  const RUNBOOKS = [RUNBOOK, {
    title: 'Collection stalled',
    when: 'No samples ingested within 3× the expected cadence.',
    steps: ['Check the GitHub Actions run log for the dashboard\u2019s ping workflow.', 'Confirm the source API is reachable and not rate-limiting.', 'If the source is down, mute the detector and note the upstream incident.', 'Re-run the workflow; verify samples resume on the next tick.']
  }, {
    title: 'Data integrity divergence',
    when: 'Dashboard value diverges >5% from an independent source (DeFiLlama / chain).',
    steps: ['Read both values on the incident card — dashboard vs cross-source.', 'Determine which is stale: check each source\u2019s last-updated time.', 'If the dashboard is wrong, file a bug against the dashboard repo.', 'Mark false-positive only if the divergence is a known reporting difference.']
  }, {
    title: 'Oracle deviation',
    when: 'Oracle price deviates from market price beyond N bps.',
    steps: ['Confirm the deviation against a second price source.', 'Check whether liquidations are pending on the affected market.', 'Escalate to emergency if deviation persists >10 min with open exposure.']
  }];
  const COVERAGE = {
    protocols: ['Aave v3', 'Sui Lending', 'SparkLend', 'Navi', 'Multichain'],
    rows: [{
      risk: 'Utilization spike',
      cells: ['yes', 'yes', 'planned', 'yes', 'na']
    }, {
      risk: 'Borrow-rate spike',
      cells: ['yes', 'planned', 'planned', 'yes', 'na']
    }, {
      risk: 'Collection stalled',
      cells: ['yes', 'yes', 'yes', 'yes', 'yes']
    }, {
      risk: 'Data integrity (x-source)',
      cells: ['yes', 'planned', 'yes', 'planned', 'yes']
    }, {
      risk: 'Wallet concentration',
      cells: ['planned', 'yes', 'blocked', 'planned', 'na']
    }, {
      risk: 'Oracle deviation',
      cells: ['blocked', 'blocked', 'na', 'blocked', 'na']
    }, {
      risk: 'Bad debt / underwater',
      cells: ['blocked', 'na', 'blocked', 'blocked', 'na']
    }, {
      risk: 'Stablecoin depeg',
      cells: ['planned', 'na', 'na', 'na', 'yes']
    }]
  };
  const SLA = {
    ackRate: 86,
    timeToAck: 7,
    timeToResolve: 34,
    falsePositive: 12,
    total: 41
  };

  // Simple backtest: mark indices where a rolling z-score would have fired.
  function backtestFires(points) {
    const vals = points.map(p => typeof p === 'number' ? p : p.value);
    const fired = [];
    for (let i = 20; i < vals.length; i++) {
      const hist = vals.slice(Math.max(0, i - 40), i);
      const m = hist.reduce((a, b) => a + b, 0) / hist.length;
      const sd = Math.sqrt(hist.reduce((a, b) => a + (b - m) ** 2, 0) / hist.length);
      if (sd <= 0) continue;
      const z = (vals[i] - m) / sd;
      const pct = (vals[i] - m) / Math.abs(m) * 100;
      if (Math.abs(z) > 3 && Math.abs(pct) > 8) fired.push(i);
    }
    return fired;
  }

  // Per-metric time-series with timestamps (for MetricChart hover).
  function tseries(m) {
    const start = new Date('2026-07-05T02:00:00Z');
    return m.points.map((v, i) => {
      const d = new Date(start.getTime() + i * 20 * 60000);
      return {
        t: d.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        }),
        value: Number(v.toFixed(2))
      };
    });
  }
  METRICS.forEach(m => {
    m.ts = tseries(m);
  });

  // Detectors — the rules that fire incidents. Thresholds tunable here (today: env vars).
  const DETECTORS = [{
    id: 'aave.v3.utilization_spike',
    dashboard: 'Aave v3',
    metric: 'aave.v3.usdc_utilization',
    enabled: true,
    z: 3.0,
    minPct: 8,
    window: 40,
    cadence: '5m',
    severity: 'critical',
    fires30d: 6,
    fp30d: 1,
    desc: 'Utilization moves >z and >min% above rolling mean.',
    muted: null
  }, {
    id: 'aave.v3.rate_spike',
    dashboard: 'Aave v3',
    metric: 'aave.v3.weth_borrow_apr',
    enabled: true,
    z: 3.5,
    minPct: 12,
    window: 40,
    cadence: '5m',
    severity: 'critical',
    fires30d: 9,
    fp30d: 0,
    desc: 'Borrow APR jumps beyond threshold.',
    muted: null
  }, {
    id: 'sui.concentration_hhi',
    dashboard: 'Sui Lending',
    metric: 'sui.suiusdt_hhi',
    enabled: true,
    z: 2.5,
    minPct: 15,
    window: 30,
    cadence: '10m',
    severity: 'warning',
    fires30d: 3,
    fp30d: 0,
    desc: 'Supply concentration (HHI) drifts up.',
    muted: null
  }, {
    id: 'ingest.collection_stalled',
    dashboard: 'All',
    metric: '—',
    enabled: true,
    z: null,
    minPct: null,
    window: null,
    cadence: '5m',
    severity: 'emergency',
    fires30d: 4,
    fp30d: 0,
    desc: 'No samples ingested within 3× the expected cadence.',
    muted: null
  }, {
    id: 'tvl.step_drop',
    dashboard: 'Multichain TVL',
    metric: 'tvl.base_total',
    enabled: true,
    z: 3.0,
    minPct: 6,
    window: 40,
    cadence: '5m',
    severity: 'warning',
    fires30d: 2,
    fp30d: 1,
    desc: 'TVL drops sharply in one interval.',
    muted: null
  }, {
    id: 'navi.util_drift',
    dashboard: 'Navi',
    metric: 'navi.util_weighted',
    enabled: false,
    z: 3.0,
    minPct: 8,
    window: 40,
    cadence: '5m',
    severity: 'warning',
    fires30d: 0,
    fp30d: 0,
    desc: 'Weighted utilization drift.',
    muted: 'disabled — too noisy, retuning'
  }];

  // Cross-source provenance for incident "why it fired" — the two numbers side by side.
  const PROVENANCE = {
    4821: {
      rule: 'z > 3.0 AND move > 8% vs 40-sample mean',
      window: '40 samples · ~3h 20m',
      z: 3.4,
      movePct: 8.1,
      sources: [{
        name: 'Setnel dashboard',
        value: '94.2%',
        at: 'Jul 05 · 14:18',
        kind: 'primary'
      }, {
        name: 'On-chain (RPC)',
        value: '94.0%',
        at: 'Jul 05 · 14:18',
        kind: 'confirm'
      }, {
        name: 'DeFiLlama',
        value: '93.8%',
        at: 'Jul 05 · 14:15',
        kind: 'confirm'
      }],
      baseline: '82.0% mean · σ 3.6 · trigger 90.8%'
    },
    4820: {
      rule: 'no samples within 3× cadence (15m)',
      window: 'since Jul 03 · 10:02',
      z: null,
      movePct: null,
      sources: [{
        name: 'Setnel dashboard',
        value: 'no data 2d 4h',
        at: 'Jul 03 · 10:02',
        kind: 'primary'
      }, {
        name: 'GitHub Actions',
        value: 'workflow failing',
        at: 'Jul 03 · 10:05',
        kind: 'confirm'
      }],
      baseline: 'expected 1 sample / 5m'
    }
  };

  // On-call & escalation policy (Phase 5).
  const ONCALL = {
    now: {
      name: 'Olusegun A.',
      handle: 'olusegun',
      until: 'Mon 09:00',
      avatar: 'OA'
    },
    next: {
      name: 'Joel M.',
      handle: 'joel',
      from: 'Mon 09:00',
      avatar: 'JM'
    },
    schedule: [{
      day: 'Fri Jul 04',
      who: 'Olusegun A.'
    }, {
      day: 'Sat Jul 05',
      who: 'Olusegun A.'
    }, {
      day: 'Sun Jul 06',
      who: 'Olusegun A.'
    }, {
      day: 'Mon Jul 07',
      who: 'Joel M.'
    }, {
      day: 'Tue Jul 08',
      who: 'Joel M.'
    }]
  };
  const ESCALATION = [{
    sev: 'warning',
    steps: [{
      after: '0m',
      to: '#setnel-alerts (Slack)'
    }, {
      after: '30m',
      to: 'on-call — email'
    }]
  }, {
    sev: 'critical',
    steps: [{
      after: '0m',
      to: '#setnel-alerts (Slack)'
    }, {
      after: '5m',
      to: 'on-call — PagerDuty'
    }, {
      after: '20m',
      to: 'secondary + #incidents'
    }]
  }, {
    sev: 'emergency',
    steps: [{
      after: '0m',
      to: 'on-call — PagerDuty (page)'
    }, {
      after: '0m',
      to: '#incidents + @here'
    }, {
      after: '10m',
      to: 'escalate to lead'
    }]
  }];
  const CHANNELS = [{
    name: 'Slack · #setnel-alerts',
    kind: 'slack',
    on: true
  }, {
    name: 'PagerDuty · Setnel service',
    kind: 'pagerduty',
    on: true
  }, {
    name: 'Email · risk@datumlab.xyz',
    kind: 'email',
    on: true
  }, {
    name: 'Webhook · ops-bridge',
    kind: 'webhook',
    on: false
  }];

  // Audit log / inbox feed.
  const AUDIT = [{
    time: 'Jul 05 · 14:22',
    actor: 'olusegun',
    action: 'acknowledged',
    target: '#4818 · Sui concentration',
    kind: 'ack'
  }, {
    time: 'Jul 05 · 14:03',
    actor: 'setnel',
    action: 'opened',
    target: '#4821 · Aave USDC utilization',
    kind: 'open'
  }, {
    time: 'Jul 05 · 13:20',
    actor: 'joel',
    action: 'resolved',
    target: '#4790 · WETH borrow rate',
    kind: 'resolve'
  }, {
    time: 'Jul 05 · 11:48',
    actor: 'olusegun',
    action: 'muted 24h',
    target: 'navi.util_drift · too noisy',
    kind: 'mute'
  }, {
    time: 'Jul 04 · 19:40',
    actor: 'olusegun',
    action: 'marked false positive',
    target: '#4781 · Base TVL drop',
    kind: 'fp'
  }, {
    time: 'Jul 04 · 16:12',
    actor: 'joel',
    action: 'edited threshold',
    target: 'aave.v3.rate_spike z 3.2 → 3.5',
    kind: 'config'
  }, {
    time: 'Jul 04 · 09:00',
    actor: 'setnel',
    action: 'on-call handoff',
    target: 'joel → olusegun',
    kind: 'oncall'
  }];

  // Reporting — 8-week incident history + per-detector stats.
  const WEEKS = ['May 12', 'May 19', 'May 26', 'Jun 02', 'Jun 09', 'Jun 16', 'Jun 23', 'Jun 30'];
  const REPORT = {
    weeks: WEEKS,
    opened: [9, 12, 7, 14, 8, 11, 6, 41 / 4 | 0].map((v, i) => [9, 12, 7, 14, 8, 11, 6, 10][i]),
    mtta: [12, 9, 14, 8, 11, 7, 9, 7],
    // minutes
    mttr: [48, 41, 55, 38, 44, 34, 39, 34],
    // minutes
    fpRate: [18, 14, 22, 12, 16, 11, 13, 12],
    // percent
    noisiest: [{
      detector: 'aave.v3.rate_spike',
      fires: 9,
      fp: 0
    }, {
      detector: 'aave.v3.utilization_spike',
      fires: 6,
      fp: 1
    }, {
      detector: 'ingest.collection_stalled',
      fires: 4,
      fp: 0
    }, {
      detector: 'sui.concentration_hhi',
      fires: 3,
      fp: 0
    }, {
      detector: 'tvl.step_drop',
      fires: 2,
      fp: 1
    }]
  };
  const MEMBERS = [{
    name: 'Olusegun A.',
    handle: 'olusegun',
    role: 'Owner',
    avatar: 'OA'
  }, {
    name: 'Joel M.',
    handle: 'joel',
    role: 'Responder',
    avatar: 'JM'
  }, {
    name: 'Data bot',
    handle: 'setnel',
    role: 'System',
    avatar: 'S'
  }];
  window.SETNEL_DATA = {
    DASHBOARDS,
    INCIDENTS,
    DAYS,
    TREND,
    METRICS,
    NOTES,
    EVENTS,
    RUNBOOK,
    RUNBOOKS,
    COVERAGE,
    SLA,
    backtestFires,
    DETECTORS,
    PROVENANCE,
    ONCALL,
    ESCALATION,
    CHANNELS,
    AUDIT,
    REPORT,
    MEMBERS,
    fmtExposure(n) {
      if (n == null) return '—';
      const a = Math.abs(n);
      if (a >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
      if (a >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
      if (a >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
      return `$${n.toFixed(0)}`;
    }
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/data.js", error: String((e && e.message) || e) }); }

__ds_ns.CoverageTable = __ds_scope.CoverageTable;

__ds_ns.HeatStrip = __ds_scope.HeatStrip;

__ds_ns.MetricCard = __ds_scope.MetricCard;

__ds_ns.MetricChart = __ds_scope.MetricChart;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.Sparkline = __ds_scope.Sparkline;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.LiveIndicator = __ds_scope.LiveIndicator;

__ds_ns.NowPill = __ds_scope.NowPill;

__ds_ns.StatusDot = __ds_scope.StatusDot;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TimeRange = __ds_scope.TimeRange;

__ds_ns.CommandPalette = __ds_scope.CommandPalette;

__ds_ns.NavItem = __ds_scope.NavItem;

__ds_ns.SidebarSection = __ds_scope.SidebarSection;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.MenuItem = __ds_scope.MenuItem;

__ds_ns.MenuLabel = __ds_scope.MenuLabel;

__ds_ns.MenuSeparator = __ds_scope.MenuSeparator;

__ds_ns.Menu = __ds_scope.Menu;

})();
