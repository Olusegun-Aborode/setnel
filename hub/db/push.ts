// Applies schema.sql + seed.sql to the database in DATABASE_URL.
// Usage: npm run db:push
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const pool = new Pool({ connectionString: url });

async function run(file: string) {
  const text = readFileSync(join(process.cwd(), 'db', file), 'utf8');
  // Run the whole file as one multi-statement query. Our DDL has no semicolons
  // inside string literals, so this is safe.
  await pool.query(text);
  console.log(`applied ${file}`);
}

(async () => {
  await run('schema.sql');
  await run('seed.sql');
  await pool.end();
  console.log('db:push done.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
