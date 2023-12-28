import { Module } from '@nestjs/common';
import { ActivityLogsService } from './activityLogs.service';
import { ActivityLogsController } from './activityLogs.controller';

@Module({
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
})
export class ActivityLogsModule {}
