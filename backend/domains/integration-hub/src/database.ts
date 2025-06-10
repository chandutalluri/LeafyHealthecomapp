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
  decimal
} from 'drizzle-orm/pg-core';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });

// Integrations Table
export const integrations = pgTable('integrations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // stripe, paypal, shopify, etc
  integrationType: varchar('integration_type', { length: 30 }).notNull(), // payment, shipping, crm, analytics
  status: varchar('status', { length: 20 }).default('active').notNull(), // active, inactive, error
  configuration: jsonb('configuration').notNull(),
  credentials: jsonb('credentials'), // encrypted
  webhookUrl: varchar('webhook_url', { length: 500 }),
  apiVersion: varchar('api_version', { length: 20 }),
  lastSyncAt: timestamp('last_sync_at'),
  isEnabled: boolean('is_enabled').default(true),
  createdBy: integer('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Integration Logs Table
export const integrationLogs = pgTable('integration_logs', {
  id: serial('id').primaryKey(),
  integrationId: integer('integration_id').notNull(),
  operation: varchar('operation', { length: 50 }).notNull(),
  direction: varchar('direction', { length: 10 }).notNull(), // inbound, outbound
  status: varchar('status', { length: 20 }).notNull(), // success, failed, pending
  requestData: jsonb('request_data'),
  responseData: jsonb('response_data'),
  errorMessage: text('error_message'),
  processingTime: integer('processing_time'), // milliseconds
  retryCount: integer('retry_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Data Sync Jobs Table
export const dataSyncJobs = pgTable('data_sync_jobs', {
  id: serial('id').primaryKey(),
  integrationId: integer('integration_id').notNull(),
  jobType: varchar('job_type', { length: 50 }).notNull(), // full_sync, incremental, real_time
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  recordsProcessed: integer('records_processed').default(0),
  recordsFailed: integer('records_failed').default(0),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  lastProcessedId: varchar('last_processed_id', { length: 100 }),
  errorLog: text('error_log'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Webhook Events Table
export const webhookEvents = pgTable('webhook_events', {
  id: serial('id').primaryKey(),
  integrationId: integer('integration_id').notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  eventId: varchar('event_id', { length: 100 }),
  payload: jsonb('payload').notNull(),
  headers: jsonb('headers'),
  signature: varchar('signature', { length: 500 }),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  processedAt: timestamp('processed_at'),
  retryCount: integer('retry_count').default(0),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// API Keys Table
export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  keyHash: varchar('key_hash', { length: 255 }).unique().notNull(),
  integrationId: integer('integration_id'),
  permissions: jsonb('permissions'),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = typeof integrations.$inferInsert;
export type IntegrationLog = typeof integrationLogs.$inferSelect;
export type InsertIntegrationLog = typeof integrationLogs.$inferInsert;
export type DataSyncJob = typeof dataSyncJobs.$inferSelect;
export type InsertDataSyncJob = typeof dataSyncJobs.$inferInsert;

console.log('🔗 Integration Hub database connected to PostgreSQL');