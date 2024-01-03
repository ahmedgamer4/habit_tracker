import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Inject } from '@nestjs/common/decorators';
import { DB, DBType } from 'src/global/providers/db.provider';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { Activity, activity } from 'src/_schema/activity';
import { activityLog } from 'src/_schema/activityLog';

@Injectable()
export class ActivitiesService {
  constructor(@Inject(DB) private readonly db: DBType) {}

  async findAll(userId: number) {
    try {
      const res = await this.db
        .selectDistinct({
          id: sql<number>`activity.id`,
          name: sql<string>`name`,
          description: sql<string>`description`,
          colorCode: sql<string>`color_code`,
        })
        .from(activity)
        .where(eq(activity.userId, userId));
      return res;
    } catch (e) {
      throw new InternalServerErrorException(`Cannot find activities. ${e}`);
    }
  }

  async findWithDateRange(
    userId: number,
    dateRange: { from: string; to: string },
  ) {
    try {
      const res = await this.db
        .selectDistinct({
          id: sql<number>`activity.id`,
          name: sql<string>`name`,
          description: sql<string>`description`,
          colorCode: sql<string>`color_code`,
        })
        .from(activity)
        .leftJoin(activityLog, eq(activityLog.activityId, activity.id))
        .where(
          and(
            eq(activity.userId, userId),
            gte(activityLog.date, dateRange.from),
            lte(activityLog.date, dateRange.to),
          ),
        );
      return res;
    } catch (e) {
      throw new InternalServerErrorException(`Cannot find activities. ${e}`);
    }
  }

  async create(createActivityDto: CreateActivityDto, userId: number) {
    try {
      const res = await this.db
        .insert(activity)
        .values({ ...createActivityDto, userId })
        .returning({
          id: sql<number>`id`,
        });

      return res[0];
    } catch (e) {
      throw new InternalServerErrorException(`Cannot create activity. ${e}`);
    }
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    try {
      const res = await this.db
        .update(activity)
        .set(updateActivityDto)
        .where(eq(activity.id, id))
        .returning({
          id: sql<number>`id`,
        });

      return res[0];
    } catch (e) {
      throw new InternalServerErrorException(`Cannot update activity. ${e}`);
    }
  }

  async delete(id: number) {
    try {
      const res = await this.db.delete(activity).where(eq(activity.id, id));

      return res[0];
    } catch (e) {
      throw new InternalServerErrorException(`Cannot delete activity. ${e}`);
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

  async getMostLogged(userId: number) {
    try {
      const activitiesWithLogsCount = this.db.all<
        Activity & { no_logs: number }
      >(sql`select DISTINCT 
a.*,
	COUNT(a.id) as logs_num
from
	activity a
left join activity_log al on
	a.id = al.activity_id
where
	a.user_id = ${userId}
GROUP BY
	a.id
order by
	logs_num desc`);
      return {
        activityName: activitiesWithLogsCount[0].name,
      };
    } catch (e) {
      throw new InternalServerErrorException(
        `Cannot get the most logged activity. ${e}`,
      );
    }
  }
}
