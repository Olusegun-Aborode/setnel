// Incident detail — evidence ("why it fired" + cross-source provenance), actions, runbook, chart, activity.
function IncidentDetail({ i, onBack, onAck, onMute, onFp, onOpenDetector }) {
  const { Panel, Badge, Button, Input, MetricChart } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const metric = D.METRICS.find((m) => i.detector.startsWith(m.key.split('.').slice(0, 2).join('.'))) || D.METRICS[0];
  const detector = D.DETECTORS.find((d) => d.id === i.detector);
  const prov = D.PROVENANCE[i.id];
  const trigger = metric ? metric.mean + (detector ? detector.z : 3) * metric.sd : null;
  const firedIdx = metric ? metric.ts.map((p, k) => k).filter((k) => metric.points[k] > (trigger || Infinity)) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--panel-gap)' }}>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', padding: '2px 0', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        <window.Icon name="arrow-left" size={14} /> All incidents · #{i.id}
      </button>

      <Panel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{i.dashboard}</span>
          <Badge variant={i.severity}>{i.severity}</Badge>
          <Badge variant={i.status === 'active' ? 'neutral' : 'resolved'}>{i.status}</Badge>
          {i.ackedBy ? <Badge variant="resolved">ack by {i.ackedBy}</Badge> : null}
          {i.exposure ? <Badge variant="exposure">{D.fmtExposure(i.exposure)} at risk</Badge> : null}
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.45, color: 'var(--ink)', marginBottom: 10 }}>{i.message}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
          <button onClick={() => detector && onOpenDetector && onOpenDetector(detector)} style={{ background: 'none', border: 'none', padding: 0, cursor: detector ? 'pointer' : 'default', color: 'var(--text-link)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{i.detector}</button>
          <span>·</span><span>opened Jul 05 · 13:41</span><span>·</span><span>×{i.count} events</span>
        </div>
        {i.status === 'active' ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {!i.ackedBy ? <Button variant="primary" onClick={() => onAck(i)}>Acknowledge</Button> : null}
            <Button onClick={() => onMute(i)}>Mute 1h</Button>
            <Button>Resolve</Button>
            <Button variant="danger" onClick={() => onFp(i)}>False positive</Button>
            <Button as="a" href="#" variant="ghost" onClick={(e) => e.preventDefault()}>Open dashboard ↗</Button>
          </div>
        ) : <div style={{ fontSize: 13, color: 'var(--muted)' }}>Resolved {i.resolvedAt} by {i.resolvedBy}.</div>}
      </Panel>

      {/* WHY IT FIRED — the evidence panel the audit called for */}
      {prov ? (
        <Panel title="Why this fired" note="the rule, the baseline, and the cross-source evidence" divided>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Rule & baseline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Row k="Rule" v={prov.rule} />
                <Row k="Baseline window" v={prov.window} />
                <Row k="Baseline" v={prov.baseline} />
                {prov.z != null ? <Row k="Deviation" v={`z = +${prov.z}  ·  +${prov.movePct}pt vs mean`} strong /> : null}
              </div>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Cross-source confirmation</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {prov.sources.map((s, k) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 11px', borderRadius: 8, border: '1px solid var(--border)', background: s.kind === 'primary' ? 'var(--panel-2)' : 'var(--panel)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: s.kind === 'primary' ? 'var(--ink)' : 'var(--good)', flex: 'none' }} />
                    <span style={{ fontSize: 12.5, color: 'var(--ink-2)', flex: 1 }}>{s.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{s.value}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--faint)', width: 92, textAlign: 'right' }}>{s.at}</span>
                  </div>
                ))}
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>Independent sources agree within tolerance — this is a real move, not a reporting glitch.</div>
              </div>
            </div>
          </div>
        </Panel>
      ) : null}

      <Panel title={metric.key} note="normal range shaded · dashed = trigger · red = threshold crossings" divided>
        <MetricChart points={metric.ts} unit={metric.unit === '%' ? '%' : ''} mean={metric.mean}
          band={{ lo: metric.mean - 2 * metric.sd, hi: metric.mean + 2 * metric.sd }}
          threshold={trigger != null ? { value: trigger, label: `trigger ${trigger.toFixed(1)}${metric.unit === '%' ? '%' : ''}` } : null}
          fired={firedIdx} height={220} />
      </Panel>

      <Panel title={`Runbook · ${D.RUNBOOK.title}`} divided aside={<a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--muted)' }}>all runbooks →</a>}>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>{D.RUNBOOK.when}</div>
        <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          {D.RUNBOOK.steps.map((s, n) => <li key={n}>{s}</li>)}
        </ol>
      </Panel>

      <Panel title="Activity" note="events + notes" divided>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1 }}><Input placeholder="Add a note…" maxLength={1000} /></div>
          <Button variant="primary" type="submit">Note</Button>
        </form>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {D.NOTES.map((n, k) => (
            <li key={'n' + k} style={{ display: 'flex', gap: 10, paddingLeft: 12, borderLeft: '2px solid var(--info)', fontSize: 13.5, color: 'var(--ink-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--faint)', flex: 'none', width: 96 }}>{n.time}</span>
              <span><b>{n.author}</b>: {n.body}</span>
            </li>
          ))}
          {D.EVENTS.map((e, k) => (
            <li key={'e' + k} style={{ display: 'flex', gap: 10, paddingLeft: 12, borderLeft: '2px solid var(--border)', fontSize: 13.5, color: 'var(--ink-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--faint)', flex: 'none', width: 96 }}>{e.time}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>{e.body}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Row({ k, v, strong }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
      <span style={{ fontSize: 12, color: 'var(--muted)', width: 120, flex: 'none' }}>{k}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: strong ? 'var(--critical)' : 'var(--ink)', fontWeight: strong ? 600 : 400 }}>{v}</span>
    </div>
  );
}

Object.assign(window, { IncidentDetail });
