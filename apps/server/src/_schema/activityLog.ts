import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { activity } from './activity';
import { InferSelectModel } from 'drizzle-orm';

export const activityLog = sqliteTable('activity_log', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  activityId: integer('activity_id', { mode: 'number' })
    .notNull()
    .references(() => activity.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  date: text('date'),
  count: integer('count'),
});

export type ActivityLog = InferSelectModel<typeof activityLog>;
