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

// Marketplace Vendors Table
export const marketplaceVendors = pgTable('marketplace_vendors', {
  id: serial('id').primaryKey(),
  vendorCode: varchar('vendor_code', { length: 20 }).unique().notNull(),
  businessName: varchar('business_name', { length: 200 }).notNull(),
  contactName: varchar('contact_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }),
  businessType: varchar('business_type', { length: 50 }).notNull(),
  taxId: varchar('tax_id', { length: 50 }),
  businessAddress: jsonb('business_address'),
  bankDetails: jsonb('bank_details'),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, approved, suspended, terminated
  approvedAt: timestamp('approved_at'),
  approvedBy: integer('approved_by'),
  totalSales: decimal('total_sales', { precision: 12, scale: 2 }).default('0'),
  totalCommission: decimal('total_commission', { precision: 10, scale: 2 }).default('0'),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  totalReviews: integer('total_reviews').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Vendor Products Table
export const vendorProducts = pgTable('vendor_products', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').notNull(),
  productId: integer('product_id').notNull(),
  vendorSku: varchar('vendor_sku', { length: 50 }),
  vendorPrice: decimal('vendor_price', { precision: 10, scale: 2 }).notNull(),
  marketPrice: decimal('market_price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0),
  minOrderQuantity: integer('min_order_quantity').default(1),
  maxOrderQuantity: integer('max_order_quantity'),
  isActive: boolean('is_active').default(true),
  approvalStatus: varchar('approval_status', { length: 20 }).default('pending'),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Commission Tracking Table
export const commissionTracking = pgTable('commission_tracking', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').notNull(),
  orderId: integer('order_id').notNull(),
  orderItemId: integer('order_item_id').notNull(),
  productId: integer('product_id').notNull(),
  saleAmount: decimal('sale_amount', { precision: 10, scale: 2 }).notNull(),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).notNull(),
  commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, confirmed, paid
  paidAt: timestamp('paid_at'),
  paymentReference: varchar('payment_reference', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Vendor Reviews Table
export const vendorReviews = pgTable('vendor_reviews', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').notNull(),
  customerId: integer('customer_id').notNull(),
  orderId: integer('order_id').notNull(),
  rating: integer('rating').notNull(), // 1-5
  reviewTitle: varchar('review_title', { length: 200 }),
  reviewText: text('review_text'),
  isVerifiedPurchase: boolean('is_verified_purchase').default(true),
  isVisible: boolean('is_visible').default(true),
  vendorResponse: text('vendor_response'),
  respondedAt: timestamp('responded_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Marketplace Analytics Table
export const marketplaceAnalytics = pgTable('marketplace_analytics', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id'),
  metricDate: date('metric_date').notNull(),
  totalOrders: integer('total_orders').default(0),
  totalRevenue: decimal('total_revenue', { precision: 12, scale: 2 }).default('0'),
  totalCommission: decimal('total_commission', { precision: 10, scale: 2 }).default('0'),
  avgOrderValue: decimal('avg_order_value', { precision: 10, scale: 2 }),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 2 }),
  productViews: integer('product_views').default(0),
  newCustomers: integer('new_customers').default(0),
  returningCustomers: integer('returning_customers').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type MarketplaceVendor = typeof marketplaceVendors.$inferSelect;
export type InsertMarketplaceVendor = typeof marketplaceVendors.$inferInsert;
export type VendorProduct = typeof vendorProducts.$inferSelect;
export type InsertVendorProduct = typeof vendorProducts.$inferInsert;
export type CommissionTracking = typeof commissionTracking.$inferSelect;
export type InsertCommissionTracking = typeof commissionTracking.$inferInsert;

console.log('🔗 Marketplace Management database connected to PostgreSQL');