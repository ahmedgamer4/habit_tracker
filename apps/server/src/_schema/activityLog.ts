import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { activity } from './activity';

export const activityLog = sqliteTable('activity_log', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  activityId: integer('activityLog', { mode: 'number' })
    .notNull()
    .references(() => activity.id),
  date: text('date'),
  count: integer('count'),
});
