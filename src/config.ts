import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { ConfigSchema, type Config } from './types.js';

export function loadConfig(configPath?: string): Config {
  const resolved = configPath
    ? path.resolve(configPath)
    : path.resolve(process.cwd(), 'config/dashboards.yaml');

  if (!fs.existsSync(resolved)) {
    throw new Error(`Config not found at ${resolved}`);
  }

  const raw = fs.readFileSync(resolved, 'utf8');
  const parsed = yaml.load(raw);
  const result = ConfigSchema.safeParse(parsed);
  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid config ${resolved}:\n${formatted}`);
  }
  return result.data;
}

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

export function optionalEnv(name: string, fallback: string): string {
  const v = process.env[name];
  return v && v.trim() !== '' ? v : fallback;
}
