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

// Content Items Table
export const contentItems = pgTable('content_items', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 250 }).unique().notNull(),
  contentType: varchar('content_type', { length: 50 }).notNull(), // article, page, product_description, banner
  status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, published, archived
  content: text('content'),
  excerpt: text('excerpt'),
  featuredImage: varchar('featured_image', { length: 500 }),
  metadata: jsonb('metadata'),
  seoTitle: varchar('seo_title', { length: 200 }),
  seoDescription: text('seo_description'),
  authorId: integer('author_id').notNull(),
  categoryId: integer('category_id'),
  tags: jsonb('tags'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Content Categories Table
export const contentCategories = pgTable('content_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 120 }).unique().notNull(),
  description: text('description'),
  parentId: integer('parent_id'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Media Library Table
export const mediaLibrary = pgTable('media_library', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: integer('file_size').notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  uploadedBy: integer('uploaded_by').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  caption: text('caption'),
  metadata: jsonb('metadata'),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Content Revisions Table
export const contentRevisions = pgTable('content_revisions', {
  id: serial('id').primaryKey(),
  contentId: integer('content_id').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content'),
  changes: jsonb('changes'),
  revisionType: varchar('revision_type', { length: 20 }).notNull(), // auto, manual, published
  createdBy: integer('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Content Templates Table
export const contentTemplates = pgTable('content_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  templateType: varchar('template_type', { length: 50 }).notNull(),
  template: jsonb('template').notNull(),
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = typeof contentItems.$inferInsert;
export type ContentCategory = typeof contentCategories.$inferSelect;
export type InsertContentCategory = typeof contentCategories.$inferInsert;
export type MediaFile = typeof mediaLibrary.$inferSelect;
export type InsertMediaFile = typeof mediaLibrary.$inferInsert;

console.log('🔗 Content Management database connected to PostgreSQL');