import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { users } from '../schema';

export const userApiKeys = pgTable('user_api_keys', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull().default('openai'), // 'openai', 'anthropic', etc.
  apiKey: text('api_key').notNull(), // Will be encrypted
  isActive: boolean('is_active').notNull().default(true),
  lastUsed: timestamp('last_used'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type UserApiKey = typeof userApiKeys.$inferSelect;
export type NewUserApiKey = typeof userApiKeys.$inferInsert;