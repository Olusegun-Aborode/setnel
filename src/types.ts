import { z } from 'zod';

export const AlertRuleSchema = z.object({
  // Relative change vs. last snapshot. e.g. 15 = fire if |Δ%| > 15%.
  percentChange: z.number().positive().optional(),
  // Hard floor — fire if extracted value < this.
  absoluteMin: z.number().optional(),
  // Hard ceiling — fire if extracted value > this.
  absoluteMax: z.number().optional(),
  // Compare to snapshot from N hours ago instead of the most recent one.
  // Useful for "drop vs 24h ago" rules. Default: compare to previous run.
  windowHours: z.number().positive().optional(),
  // Flag the alert as high-severity in the notifier. Same threshold, louder message.
  critical: z.boolean().optional(),
});

export const MetricSpecSchema = z.object({
  id: z.string(),
  label: z.string(),
  path: z.string(),
  // Dot path into the JSON response. Supports array index: "pools[0].totalSupplyUsd".
  extract: z.string(),
  // How to render in notifications.
  unit: z.enum(['usd', 'percent', 'count', 'raw']).default('raw'),
  // Optional: treat absent/null as zero instead of a technical error.
  allowMissing: z.boolean().optional(),
  alert: AlertRuleSchema.optional(),
});

export const DashboardSpecSchema = z.object({
  id: z.string(),
  name: z.string(),
  baseUrl: z.string().url(),
  healthPath: z.string().default('/api/health'),
  enabled: z.boolean().default(true),
  metrics: z.array(MetricSpecSchema).default([]),
});

export const ConfigSchema = z.object({
  dashboards: z.array(DashboardSpecSchema),
  notifications: z
    .object({
      telegram: z.object({ enabled: z.boolean() }).default({ enabled: true }),
      email: z
        .object({
          enabled: z.boolean(),
          digestOnly: z.boolean().default(true),
        })
        .default({ enabled: true, digestOnly: true }),
    })
    .default({}),
});

export type AlertRule = z.infer<typeof AlertRuleSchema>;
export type MetricSpec = z.infer<typeof MetricSpecSchema>;
export type DashboardSpec = z.infer<typeof DashboardSpecSchema>;
export type Config = z.infer<typeof ConfigSchema>;

export type FetchResult =
  | { ok: true; status: number; data: unknown; latencyMs: number }
  | { ok: false; status: number | null; error: string; latencyMs: number };

export type MetricSample = {
  dashboardId: string;
  dashboardName: string;
  metricId: string;
  label: string;
  unit: MetricSpec['unit'];
  value: number | null;
  // Previous value fetched from storage (null on first run).
  previousValue: number | null;
  previousTimestamp: number | null;
  timestamp: number;
};

export type Alert =
  | {
      kind: 'technical';
      dashboardId: string;
      dashboardName: string;
      metricId?: string;
      label?: string;
      message: string;
      critical: boolean;
      timestamp: number;
    }
  | {
      kind: 'metric';
      dashboardId: string;
      dashboardName: string;
      metricId: string;
      label: string;
      unit: MetricSpec['unit'];
      current: number;
      previous: number;
      deltaPct: number;
      rule: string;
      critical: boolean;
      timestamp: number;
    };
