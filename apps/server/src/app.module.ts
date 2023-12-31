import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './global/global.module';
import { ConfigModule } from '@nestjs/config';
import { DBConfig, JWTConfig } from './config';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { AuthModule } from './auth/auth.module';
import { ActivityLogsModule } from './activityLogs/activityLogs.module';

@Module({
  imports: [
    GlobalModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DBConfig, JWTConfig],
    }),
    UsersModule,
    ActivitiesModule,
    AuthModule,
    ActivityLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
