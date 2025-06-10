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
  integer,
  jsonb,
  boolean,
  date
} from 'drizzle-orm/pg-core';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });

// Chart of Accounts
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  accountCode: varchar('account_code', { length: 10 }).unique().notNull(),
  accountName: varchar('account_name', { length: 100 }).notNull(),
  accountType: varchar('account_type', { length: 20 }).notNull(), // Asset, Liability, Equity, Revenue, Expense
  parentAccountId: integer('parent_account_id'),
  isActive: boolean('is_active').default(true),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Journal Entries
export const journalEntries = pgTable('journal_entries', {
  id: serial('id').primaryKey(),
  entryNumber: varchar('entry_number', { length: 20 }).unique().notNull(),
  transactionDate: date('transaction_date').notNull(),
  description: text('description').notNull(),
  reference: varchar('reference', { length: 50 }),
  totalDebit: decimal('total_debit', { precision: 15, scale: 2 }).notNull(),
  totalCredit: decimal('total_credit', { precision: 15, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, posted, reversed
  createdBy: integer('created_by').notNull(),
  approvedBy: integer('approved_by'),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Journal Entry Line Items
export const journalEntryLines = pgTable('journal_entry_lines', {
  id: serial('id').primaryKey(),
  journalEntryId: integer('journal_entry_id').notNull(),
  accountId: integer('account_id').notNull(),
  description: text('description'),
  debitAmount: decimal('debit_amount', { precision: 15, scale: 2 }).default('0').notNull(),
  creditAmount: decimal('credit_amount', { precision: 15, scale: 2 }).default('0').notNull(),
  reference: varchar('reference', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Financial Periods
export const financialPeriods = pgTable('financial_periods', {
  id: serial('id').primaryKey(),
  periodName: varchar('period_name', { length: 50 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isClosed: boolean('is_closed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tax Records
export const taxRecords = pgTable('tax_records', {
  id: serial('id').primaryKey(),
  transactionId: integer('transaction_id').notNull(),
  transactionType: varchar('transaction_type', { length: 20 }).notNull(), // sale, purchase
  taxType: varchar('tax_type', { length: 20 }).notNull(), // GST, VAT, etc
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull(),
  taxableAmount: decimal('taxable_amount', { precision: 15, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 15, scale: 2 }).notNull(),
  taxNumber: varchar('tax_number', { length: 50 }),
  filingPeriod: varchar('filing_period', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Budget Planning
export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  budgetName: varchar('budget_name', { length: 100 }).notNull(),
  accountId: integer('account_id').notNull(),
  budgetPeriod: varchar('budget_period', { length: 20 }).notNull(), // monthly, quarterly, yearly
  budgetYear: integer('budget_year').notNull(),
  budgetMonth: integer('budget_month'), // null for yearly budgets
  plannedAmount: decimal('planned_amount', { precision: 15, scale: 2 }).notNull(),
  actualAmount: decimal('actual_amount', { precision: 15, scale: 2 }).default('0'),
  variance: decimal('variance', { precision: 15, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Account Balances (for fast reporting)
export const accountBalances = pgTable('account_balances', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').notNull(),
  balanceDate: date('balance_date').notNull(),
  debitBalance: decimal('debit_balance', { precision: 15, scale: 2 }).default('0'),
  creditBalance: decimal('credit_balance', { precision: 15, scale: 2 }).default('0'),
  runningBalance: decimal('running_balance', { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;
export type JournalEntryLine = typeof journalEntryLines.$inferSelect;
export type InsertJournalEntryLine = typeof journalEntryLines.$inferInsert;
export type TaxRecord = typeof taxRecords.$inferSelect;
export type InsertTaxRecord = typeof taxRecords.$inferInsert;
export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = typeof budgets.$inferInsert;

console.log('🔗 Accounting Management database connected to PostgreSQL');