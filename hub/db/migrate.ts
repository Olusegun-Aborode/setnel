// Tracked, ordered migrations. Unlike push.ts (which re-applies the whole
// schema.sql baseline idempotently), this applies each db/migrations/NNNN_*.sql
// exactly once, in filename order, inside a transaction, and records it in
// schema_migrations. Safe to run repeatedly — already-applied files are skipped.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set.');
  process.exit(1);
}

const pool = new Pool({ connectionString: url });
const dir = join(process.cwd(), 'db', 'migrations');

(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);

  const applied = new Set(
    (await pool.query('SELECT name FROM schema_migrations')).rows.map((r: { name: string }) => r.name),
  );
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  let ran = 0;
  for (const f of files) {
    if (applied.has(f)) continue;
    const sql = readFileSync(join(dir, f), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [f]);
      await client.query('COMMIT');
      console.log(`applied ${f}`);
      ran++;
    } catch (e) {
      await client.query('ROLLBACK');
      console.error(`failed ${f}:`, e);
      throw e;
    } finally {
      client.release();
    }
  }
  await pool.end();
  console.log(ran ? `db:migrate done (${ran} applied).` : 'db:migrate: nothing to apply.');
})().catch(() => process.exit(1));
