import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';

export const session = sqliteTable('session', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  sessionToken: text('session_token').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  expires: text('expires').notNull(),
});
