import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-user.dto';
import { Inject } from '@nestjs/common/decorators';
import { DB, DBType } from 'src/global/providers/db.provider';
import { eq, sql } from 'drizzle-orm';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { activity } from 'src/_schema/activity';

@Injectable()
export class ActivitiesService {
  constructor(@Inject(DB) private readonly db: DBType) {}

  async findAll(userId: number) {
    try {
      const res = await this.db
        .select({
          id: sql<number>`id`,
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

  async create(createActivityDto: CreateActivityDto) {
    try {
      const res = await this.db
        .insert(activity)
        .values(createActivityDto)
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
}
