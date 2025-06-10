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

// Shipping Methods Table
export const shippingMethods = pgTable('shipping_methods', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).unique().notNull(),
  description: text('description'),
  carrierName: varchar('carrier_name', { length: 100 }).notNull(),
  serviceType: varchar('service_type', { length: 50 }).notNull(), // standard, express, overnight
  baseCost: decimal('base_cost', { precision: 8, scale: 2 }).notNull(),
  costPerKg: decimal('cost_per_kg', { precision: 6, scale: 2 }),
  costPerKm: decimal('cost_per_km', { precision: 6, scale: 4 }),
  estimatedDays: integer('estimated_days').notNull(),
  maxWeight: decimal('max_weight', { precision: 8, scale: 2 }),
  maxDimensions: jsonb('max_dimensions'),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Shipments Table
export const shipments = pgTable('shipments', {
  id: serial('id').primaryKey(),
  shipmentNumber: varchar('shipment_number', { length: 30 }).unique().notNull(),
  orderId: integer('order_id').notNull(),
  shippingMethodId: integer('shipping_method_id').notNull(),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, picked, transit, delivered, failed
  originAddress: jsonb('origin_address').notNull(),
  destinationAddress: jsonb('destination_address').notNull(),
  packageDetails: jsonb('package_details'),
  weight: decimal('weight', { precision: 8, scale: 3 }),
  dimensions: jsonb('dimensions'),
  shippingCost: decimal('shipping_cost', { precision: 8, scale: 2 }),
  insuranceValue: decimal('insurance_value', { precision: 10, scale: 2 }),
  specialInstructions: text('special_instructions'),
  pickedUpAt: timestamp('picked_up_at'),
  estimatedDeliveryAt: timestamp('estimated_delivery_at'),
  deliveredAt: timestamp('delivered_at'),
  deliveredBy: varchar('delivered_by', { length: 100 }),
  recipientName: varchar('recipient_name', { length: 100 }),
  signatureRequired: boolean('signature_required').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tracking Events Table
export const trackingEvents = pgTable('tracking_events', {
  id: serial('id').primaryKey(),
  shipmentId: integer('shipment_id').notNull(),
  eventType: varchar('event_type', { length: 30 }).notNull(), // picked_up, in_transit, out_for_delivery, delivered
  eventDescription: text('event_description').notNull(),
  location: varchar('location', { length: 200 }),
  coordinates: jsonb('coordinates'),
  eventTime: timestamp('event_time').notNull(),
  carrierEventId: varchar('carrier_event_id', { length: 100 }),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Delivery Routes Table
export const deliveryRoutes = pgTable('delivery_routes', {
  id: serial('id').primaryKey(),
  routeName: varchar('route_name', { length: 100 }).notNull(),
  driverId: integer('driver_id').notNull(),
  vehicleId: varchar('vehicle_id', { length: 50 }),
  routeDate: date('route_date').notNull(),
  status: varchar('status', { length: 20 }).default('planned').notNull(), // planned, in_progress, completed
  totalStops: integer('total_stops').default(0),
  completedStops: integer('completed_stops').default(0),
  totalDistance: decimal('total_distance', { precision: 8, scale: 2 }),
  estimatedDuration: integer('estimated_duration'), // minutes
  actualDuration: integer('actual_duration'), // minutes
  routeOptimization: jsonb('route_optimization'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Delivery Attempts Table
export const deliveryAttempts = pgTable('delivery_attempts', {
  id: serial('id').primaryKey(),
  shipmentId: integer('shipment_id').notNull(),
  attemptNumber: integer('attempt_number').notNull(),
  attemptDate: timestamp('attempt_date').notNull(),
  status: varchar('status', { length: 20 }).notNull(), // successful, failed, rescheduled
  failureReason: varchar('failure_reason', { length: 100 }),
  notes: text('notes'),
  driverId: integer('driver_id'),
  location: jsonb('location'),
  photoProof: varchar('photo_proof', { length: 500 }),
  signatureImage: varchar('signature_image', { length: 500 }),
  rescheduleDate: timestamp('reschedule_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Shipping Zones Table
export const shippingZones = pgTable('shipping_zones', {
  id: serial('id').primaryKey(),
  zoneName: varchar('zone_name', { length: 100 }).notNull(),
  zoneCode: varchar('zone_code', { length: 20 }).unique().notNull(),
  coverage: jsonb('coverage').notNull(), // postal codes, cities, regions
  shippingRates: jsonb('shipping_rates'),
  serviceAvailability: jsonb('service_availability'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ShippingMethod = typeof shippingMethods.$inferSelect;
export type InsertShippingMethod = typeof shippingMethods.$inferInsert;
export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;
export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type InsertTrackingEvent = typeof trackingEvents.$inferInsert;

console.log('🔗 Shipping Delivery database connected to PostgreSQL');