// Reports — incident trends, MTTA/MTTR, false-positive rate, noisiest detectors.
function Bars({ data, labels, unit = '', color = 'var(--ink)', height = 90 }) {
  const max = Math.max(...data) * 1.1 || 1;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height }}>
        {data.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }} title={`${labels[i]}: ${v}${unit}`}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--faint)' }}>{v}{unit}</span>
            <div style={{ width: '100%', height: `${(v / max) * (height - 18)}px`, background: color, borderRadius: '3px 3px 0 0', minHeight: 2 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
        {labels.map((l, i) => <span key={i} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--faint)' }}>{l.split(' ')[1]}</span>)}
      </div>
    </div>
  );
}

function Reports() {
  const { Panel, StatCard, Badge, Button } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const R = D.REPORT;
  const last = (a) => a[a.length - 1];
  const trend = (a) => { const d = last(a) - a[a.length - 2]; return d; };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--panel-gap)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>8-week window · through Jun 30</div>
        <Button size="sm" style={{ marginLeft: 'auto' }} iconLeft={<window.Icon name="download" size={14} />}>Export weekly report</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Incidents / wk" value={String(last(R.opened))} sub={`${trend(R.opened) >= 0 ? '+' : ''}${trend(R.opened)} vs prior`} tone={trend(R.opened) > 0 ? 'warn' : 'good'} />
        <StatCard label="Time to ack" value={`${last(R.mtta)}m`} sub={`${trend(R.mtta) <= 0 ? '' : '+'}${trend(R.mtta)}m`} tone={last(R.mtta) <= 10 ? 'good' : 'warn'} />
        <StatCard label="Time to resolve" value={`${last(R.mttr)}m`} sub={`${trend(R.mttr) <= 0 ? '' : '+'}${trend(R.mttr)}m`} tone={last(R.mttr) <= 40 ? 'good' : 'warn'} />
        <StatCard label="False-positive rate" value={`${last(R.fpRate)}%`} sub={`${trend(R.fpRate) <= 0 ? '' : '+'}${trend(R.fpRate)}pt`} tone={last(R.fpRate) <= 12 ? 'good' : 'warn'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--panel-gap)' }}>
        <Panel title="Incidents opened" note="per week" divided><Bars data={R.opened} labels={R.weeks} /></Panel>
        <Panel title="False-positive rate" note="per week" divided><Bars data={R.fpRate} labels={R.weeks} unit="%" color="var(--warning)" /></Panel>
        <Panel title="Mean time to acknowledge" note="minutes" divided><Bars data={R.mtta} labels={R.weeks} unit="m" color="var(--info)" /></Panel>
        <Panel title="Mean time to resolve" note="minutes" divided><Bars data={R.mttr} labels={R.weeks} unit="m" color="var(--good)" /></Panel>
      </div>

      <Panel title="Noisiest detectors" note="30 days · fires and false positives by rule" divided flush>
        <div style={{ padding: '4px 0' }}>
          {R.noisiest.map((d) => (
            <div key={d.detector} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', gap: 12, alignItems: 'center', padding: '9px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink)' }}>{d.detector}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: 'var(--panel-3)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${(d.fires / R.noisiest[0].fires) * 100}%`, height: '100%', background: 'var(--ink)' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink)' }}>{d.fires}</span>
              </div>
              <span style={{ textAlign: 'right' }}>{d.fp ? <Badge variant="warning">{d.fp} fp</Badge> : <Badge variant="resolved">clean</Badge>}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, { Reports });
