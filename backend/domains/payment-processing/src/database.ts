import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import {
  pgTable,
  serial,
  varchar,
  decimal,
  timestamp,
  text,
  boolean,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });

// Payment Transactions Table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  customerId: integer('customer_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // UPI, card, wallet, etc
  paymentStatus: varchar('payment_status', { length: 20 }).default('pending').notNull(),
  transactionId: varchar('transaction_id', { length: 100 }),
  gatewayReference: varchar('gateway_reference', { length: 100 }),
  gatewayProvider: varchar('gateway_provider', { length: 50 }), // Razorpay, Paytm, etc
  failureReason: text('failure_reason'),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payment Methods Table (saved cards, UPI IDs, etc)
export const paymentMethods = pgTable('payment_methods', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull(),
  methodType: varchar('method_type', { length: 20 }).notNull(), // card, upi, wallet
  isDefault: boolean('is_default').default(false),
  details: jsonb('details').notNull(), // encrypted card details, UPI ID, etc
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Refunds Table
export const refunds = pgTable('refunds', {
  id: serial('id').primaryKey(),
  paymentId: integer('payment_id').notNull(),
  orderId: integer('order_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  reason: text('reason').notNull(),
  refundStatus: varchar('refund_status', { length: 20 }).default('pending').notNull(),
  refundReference: varchar('refund_reference', { length: 100 }),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payment Gateway Logs Table
export const paymentLogs = pgTable('payment_logs', {
  id: serial('id').primaryKey(),
  paymentId: integer('payment_id'),
  action: varchar('action', { length: 50 }).notNull(),
  requestData: jsonb('request_data'),
  responseData: jsonb('response_data'),
  statusCode: integer('status_code'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;
export type Refund = typeof refunds.$inferSelect;
export type InsertRefund = typeof refunds.$inferInsert;

console.log('🔗 Payment Processing database connected to PostgreSQL');