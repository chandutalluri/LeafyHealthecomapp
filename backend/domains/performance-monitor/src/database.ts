import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  integer,
  boolean,
  jsonb,
  decimal,
  date
} from 'drizzle-orm/pg-core';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });

// Performance Metrics Table
export const performanceMetrics = pgTable('performance_metrics', {
  id: serial('id').primaryKey(),
  metricName: varchar('metric_name', { length: 100 }).notNull(),
  metricType: varchar('metric_type', { length: 30 }).notNull(), // system, business, custom
  value: decimal('value', { precision: 15, scale: 4 }).notNull(),
  unit: varchar('unit', { length: 20 }),
  tags: jsonb('tags'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  source: varchar('source', { length: 50 }),
  environment: varchar('environment', { length: 20 }).default('production'),
});

// System Health Table
export const systemHealth = pgTable('system_health', {
  id: serial('id').primaryKey(),
  serviceName: varchar('service_name', { length: 100 }).notNull(),
  healthStatus: varchar('health_status', { length: 20 }).notNull(), // healthy, warning, critical, down
  cpuUsage: decimal('cpu_usage', { precision: 5, scale: 2 }),
  memoryUsage: decimal('memory_usage', { precision: 5, scale: 2 }),
  diskUsage: decimal('disk_usage', { precision: 5, scale: 2 }),
  responseTime: integer('response_time'), // milliseconds
  errorRate: decimal('error_rate', { precision: 5, scale: 2 }),
  uptime: integer('uptime'), // seconds
  lastCheckAt: timestamp('last_check_at').defaultNow().notNull(),
  metadata: jsonb('metadata'),
});

// Alert Rules Table
export const alertRules = pgTable('alert_rules', {
  id: serial('id').primaryKey(),
  ruleName: varchar('rule_name', { length: 100 }).notNull(),
  description: text('description'),
  metricName: varchar('metric_name', { length: 100 }).notNull(),
  condition: varchar('condition', { length: 20 }).notNull(), // greater_than, less_than, equals
  threshold: decimal('threshold', { precision: 15, scale: 4 }).notNull(),
  severity: varchar('severity', { length: 20 }).notNull(), // info, warning, critical
  isActive: boolean('is_active').default(true),
  notificationChannels: jsonb('notification_channels'),
  cooldownPeriod: integer('cooldown_period').default(300), // seconds
  createdBy: integer('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Alerts Table
export const alerts = pgTable('alerts', {
  id: serial('id').primaryKey(),
  ruleId: integer('rule_id').notNull(),
  alertLevel: varchar('alert_level', { length: 20 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  triggerValue: decimal('trigger_value', { precision: 15, scale: 4 }),
  status: varchar('status', { length: 20 }).default('open').notNull(), // open, acknowledged, resolved
  acknowledgedBy: integer('acknowledged_by'),
  acknowledgedAt: timestamp('acknowledged_at'),
  resolvedAt: timestamp('resolved_at'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Performance Reports Table
export const performanceReports = pgTable('performance_reports', {
  id: serial('id').primaryKey(),
  reportName: varchar('report_name', { length: 100 }).notNull(),
  reportType: varchar('report_type', { length: 30 }).notNull(), // daily, weekly, monthly
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  metrics: jsonb('metrics').notNull(),
  insights: jsonb('insights'),
  recommendations: jsonb('recommendations'),
  status: varchar('status', { length: 20 }).default('generated').notNull(),
  generatedBy: integer('generated_by'),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

// API Performance Table
export const apiPerformance = pgTable('api_performance', {
  id: serial('id').primaryKey(),
  endpoint: varchar('endpoint', { length: 200 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  responseTime: integer('response_time').notNull(), // milliseconds
  statusCode: integer('status_code').notNull(),
  requestSize: integer('request_size'), // bytes
  responseSize: integer('response_size'), // bytes
  userId: integer('user_id'),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = typeof performanceMetrics.$inferInsert;
export type SystemHealth = typeof systemHealth.$inferSelect;
export type InsertSystemHealth = typeof systemHealth.$inferInsert;
export type AlertRule = typeof alertRules.$inferSelect;
export type InsertAlertRule = typeof alertRules.$inferInsert;

console.log('🔗 Performance Monitor database connected to PostgreSQL');