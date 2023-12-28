import { Injectable } from '@nestjs/common';
import { CreateActivityLogDto } from './dto/create-activityLog.dto';
import { Inject } from '@nestjs/common/decorators';
import { DB, DBType } from 'src/global/providers/db.provider';
import { eq, sql } from 'drizzle-orm';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { activity } from 'src/_schema/activity';
import { activityLog } from 'src/_schema/activityLog';

@Injectable()
export class ActivityLogsService {
  constructor(@Inject(DB) private readonly db: DBType) {}

  async findAll(activiyId: number) {
    try {
      const res = await this.db
        .select()
        .from(activityLog)
        .where(eq(activityLog.activityId, activiyId));
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
}
