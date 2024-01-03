import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';
import { InferSelectModel, sql } from 'drizzle-orm';

export const activity = sqliteTable('activity', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  colorCode: text('color_code', { length: 7 }),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export type Activity = InferSelectModel<typeof activity>;
