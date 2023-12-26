import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Inject } from '@nestjs/common/decorators';
import { DB, DBType } from 'src/global/providers/db.provider';
import { user } from 'src/_schema/user';
import { eq, sql } from 'drizzle-orm';
import { InternalServerErrorException } from '@nestjs/common/exceptions';

@Injectable()
export class UsersService {
  constructor(@Inject(DB) private readonly db: DBType) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashed = createUserDto.password;

      const res = await this.db
        .insert(user)
        .values({
          ...createUserDto,
          password: hashed,
        })
        .returning({
          id: sql<number>`id`,
          name: sql<number>`name`,
          email: sql<string>`email`,
        });

      return res[0];
    } catch (e) {
      throw new InternalServerErrorException(`Cannot create user. ${e}`);
    }
  }

  async findOne(id: number) {
    try {
      const resUser = await this.db
        .select({
          name: sql<string>`name`,
          email: sql<string>`email`,
          emailVerified: sql<string>`email_verified`,
          image: sql<string>`image`,
        })
        .from(user)
        .where(eq(user.id, id));
      return resUser[0];
    } catch (e) {
      throw new InternalServerErrorException(`Cannot find user. ${e}`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const valuesToUpdate = {
        ...updateUserDto,
        updatedAt: new Date().toISOString(),
      };
      if (updateUserDto.password) {
        const hashed = updateUserDto.password;
        valuesToUpdate.password = hashed;
      }

      const res = await this.db
        .update(user)
        .set(valuesToUpdate)
        .where(eq(user.id, id))
        .returning();

      return res[0];
    } catch (e) {
      throw new InternalServerErrorException(`Cannot update user. ${e}`);
    }
  }

  async findByEmail(email: string) {
    try {
      const resUser = await this.db
        .select()
        .from(user)
        .where(eq(user.email, email));
      return resUser[0];
    } catch (e) {
      throw new InternalServerErrorException(`Cannot find user. ${e}`);
    }
  }
}
