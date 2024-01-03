import { Injectable } from '@nestjs/common';
import { CreateActivityLogDto } from './dto/create-activityLog.dto';
import { Inject } from '@nestjs/common/decorators';
import { DB, DBType } from 'src/global/providers/db.provider';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { activity } from 'src/_schema/activity';
import { ActivityLog, activityLog } from 'src/_schema/activityLog';

@Injectable()
export class ActivityLogsService {
  constructor(@Inject(DB) private readonly db: DBType) {}

  async findAll(
    id: number,
    type: 'user' | 'activity',
    dateRange: { from: string; to: string },
  ) {
    try {
      let res: ActivityLog[];
      if (type === 'activity') {
        res = await this.db
          .select()
          .from(activityLog)
          .where(
            and(
              eq(activityLog.activityId, id),
              gte(activityLog.date, dateRange.from),
              lte(activityLog.date, dateRange.to),
            ),
          );
      } else {
        res = await this.db
          .select({
            date: sql<string>`activity_log.date`,
            id: sql<number>`activity_log.id`,
            activityId: sql<number>`activity_log.activity_id`,
            count: sql<number>`activity_log.count`,
          })
          .from(activityLog)
          .leftJoin(activity, eq(activity.id, activityLog.activityId))
          .where(
            and(
              eq(activity.userId, id),
              gte(activityLog.date, dateRange.from),
              lte(activityLog.date, dateRange.to),
            ),
          );
      }
      return res;
    } catch (e) {
      throw new InternalServerErrorException(`Cannot find activity logs. ${e}`);
    }
  }

  async findOne(activiyLogId: number) {
    try {
      const res = await this.db
        .select()
        .from(activityLog)
        .where(eq(activityLog.id, activiyLogId));
      return res[0];
    } catch (e) {
      throw new InternalServerErrorException(`Cannot find activity log. ${e}`);
    }
  }

  async create(createActivityDto: CreateActivityLogDto, activityId: number) {
    try {
      const res = await this.db
        .insert(activityLog)
        .values({ ...createActivityDto, activityId })
        .returning({
          id: sql<number>`id`,
        });

      return res[0];
    } catch (e) {
      throw new InternalServerErrorException(
        `Cannot create activity log. ${e}`,
      );
    }
  }

  async delete(id: number) {
    try {
      await this.db.delete(activityLog).where(eq(activityLog.id, id));
    } catch (e) {
      throw new InternalServerErrorException(
        `Cannot delete activity log. ${e}`,
      );
    }
  }

  async checkIfCreator(userId: number, activityId: number) {
    try {
      const res = await this.db
        .select()
        .from(activity)
        .where(eq(activity.id, activityId));

      return res[0].userId === userId;
    } catch (e) {
      throw new InternalServerErrorException(`Cannot find activity. ${e}`);
    }
  }

  async getStreak(activityOrUserId: number, type: 'user' | 'activity') {
    const logs: ActivityLog[] =
      type === 'activity'
        ? await this.db
            .select()
            .from(activityLog)
            .where(eq(activityLog.activityId, activityOrUserId))
        : await this.db
            .select({
              date: sql<string>`activity_log.date`,
              id: sql<number>`activity_log.id`,
              activityId: sql<number>`activity_log.activity_id`,
              count: sql<number>`activity_log.count`,
            })
            .from(activityLog)
            .leftJoin(activity, eq(activity.id, activityLog.activityId))
            .where(eq(activity.userId, activityOrUserId));

    if (logs.length === 0) return { currentStreak: 0, longestStreak: 0 };

    // One day in milliseconds
    const oneDay = 60 * 60 * 24 * 1000;

    let currentStreak = 0,
      longestStreak = 0;

    for (let i = 0; i < logs.length - 1; i++) {
      const latestDate = new Date(logs[i].date).getTime();
      const nextDate = new Date(logs[i].date).getTime();

      const timeDiff = Math.abs(latestDate - nextDate);
      if (timeDiff <= oneDay) {
        currentStreak++;
      } else {
        if (currentStreak > longestStreak) longestStreak = currentStreak;
        currentStreak = 1;
      }

      // Reset if user is inactive
      const currentDate = new Date().getTime();
      const lastLogDate = new Date(logs[i - 1 >= 0 ? i - 1 : 0].date).getTime();

      const secTimeDiff = Math.abs(currentDate - lastLogDate);

      if (secTimeDiff > oneDay * 2) {
        currentStreak = 0;
      }

      return { currentStreak, longestStreak };
    }
  }
}
