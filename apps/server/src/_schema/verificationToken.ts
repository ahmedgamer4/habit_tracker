import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const verificationToken = sqliteTable('verification_token', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  token: text('token').notNull(),
  expires: text('expires').notNull(),
});
