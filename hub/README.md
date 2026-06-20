# Setnel — by Datum Labs

Risk monitoring for DeFi lending dashboards. Each dashboard runs its own
detectors on a 5-minute cron and posts findings to the **Setnel Hub**, which
stores history, deduplicates, routes alerts to Telegram, and renders a private
console at **https://setnel.datumlab.xyz**.

> This `hub/` directory is the Setnel Hub app. The repo root also holds the
> legacy `datum-monitor` v1 scripts + the shared GitHub Actions heartbeat
> (`.github/workflows/setnel-ping.yml`) that pings each dashboard's cron.

## Layout

```
hub/
├── src/app/                  Next.js app (App Router)
│   ├── (app)/setnel/         the private console (KPIs, health chart, incidents)
│   ├── login/                shared-password gate
│   └── api/v1/events/        signed ingest endpoint
├── src/lib/                  db, ingest+dedup, notify (Telegram), queries, auth
├── db/                       schema.sql + seed.sql + push.ts
├── docs/ONBOARD_A_DASHBOARD.md   how a dashboard owner wires their dashboard in
└── templates/                copy-paste runtime + detector example + cron route
```

## Run locally

```bash
cd hub
npm install
cp .env.example .env   # fill in DATABASE_URL, TELEGRAM_*, SETNEL_PASSWORD, secrets
npm run db:push        # apply schema + seed
npm run dev
```

## Deploy

Hosted on Vercel (project `setnel-hub`, aliased to `setnel.datumlab.xyz`).
Env vars are set in the Vercel project, not committed.

## Onboarding a new dashboard

See [docs/ONBOARD_A_DASHBOARD.md](docs/ONBOARD_A_DASHBOARD.md). Short version:
register the dashboard + a shared secret on the Hub, the owner copies the
`templates/` files into their repo and writes detectors, sets 3 env vars,
deploys, and sends their cron URL to add to the heartbeat.

## Monitored today

- **Aave V3** — 10 detectors
- **State of SUI** — 6 detectors across 5 Sui lending protocols (Navi, Suilend,
  Scallop, AlphaLend, Bucket)
