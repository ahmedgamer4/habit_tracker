import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';
import { sql } from 'drizzle-orm';

export const activity = sqliteTable('activity', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  colorCode: text('color_code', { length: 7 }),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
