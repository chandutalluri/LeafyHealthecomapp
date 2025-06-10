import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';

export const languagesTable = pgTable(
  'languages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    code: varchar('code', { length: 10 }).notNull().unique(), // e.g., 'hi', 'ta', 'bn'
    name: varchar('name', { length: 100 }).notNull(), // e.g., 'Hindi', 'Tamil'
    nativeName: varchar('native_name', { length: 100 }).notNull(), // e.g., 'हिंदी', 'தமிழ்'
    isActive: boolean('is_active').default(true),
    isDefault: boolean('is_default').default(false),
    direction: varchar('direction', { length: 3 }).default('ltr'), // 'ltr' or 'rtl'
    region: varchar('region', { length: 50 }), // e.g., 'North India', 'South India'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: index('language_code_idx').on(table.code),
    activeIdx: index('language_active_idx').on(table.isActive),
    regionIdx: index('language_region_idx').on(table.region),
  }),
);

export const translationsTable = pgTable(
  'translations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    key: varchar('key', { length: 255 }).notNull(), // e.g., 'product.name', 'category.vegetables'
    languageCode: varchar('language_code', { length: 10 }).notNull(),
    value: text('value').notNull(),
    context: varchar('context', { length: 100 }), // e.g., 'product', 'category', 'ui'
    isApproved: boolean('is_approved').default(false),
    translatedBy: varchar('translated_by', { length: 100 }),
    metadata: jsonb('metadata'), // Additional context for translators
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    keyLanguageIdx: index('translation_key_language_idx').on(table.key, table.languageCode),
    contextIdx: index('translation_context_idx').on(table.context),
    approvedIdx: index('translation_approved_idx').on(table.isApproved),
  }),
);

export type Language = typeof languagesTable.$inferSelect;
export type InsertLanguage = typeof languagesTable.$inferInsert;
export type Translation = typeof translationsTable.$inferSelect;
export type InsertTranslation = typeof translationsTable.$inferInsert;