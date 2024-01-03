import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  Req,
  UnauthorizedException,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ActivityLogsService } from './activityLogs.service';
import { CreateActivityLogDto } from './dto/create-activityLog.dto';
import { ok } from 'src/utils/response.util';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import JWTGuard from 'src/auth/guards/jwt.guard';
import FindLogsQueryDto from './dto/find-activities-query.dto';

@UseGuards(JWTGuard)
@ApiBearerAuth()
@ApiTags('ActivityLogs')
@Controller('activities/:activityId/activityLogs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Post()
  @ApiCreatedResponse()
  async create(
    @Param('activityId', ParseIntPipe) activityId: number,
    @Body() createActivityLogDto: CreateActivityLogDto,
  ) {
    const data = await this.activityLogsService.create(
      createActivityLogDto,
      activityId,
    );

    return ok('created activity log successfully', data, true);
  }

  @Get()
  async findAll(
    @Param('activityId', ParseIntPipe) activityId: number,
    @Query() query: FindLogsQueryDto,
  ) {
    const data = await this.activityLogsService.findAll(
      activityId,
      query.type,
      { from: query.from, to: query.to },
    );
    return ok('Found activity logs successfully', data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const activityId = (await this.activityLogsService.findOne(id))?.activityId;
    if (!activityId)
      throw new NotFoundException('No activity log with this id');

    if (!this.activityLogsService.checkIfCreator(req.user.sub, activityId))
      throw new UnauthorizedException('You are not the creator');

    const data = await this.activityLogsService.delete(id);
    return ok('Deleted activity log successfully', data);
  }

  @Get('/getStreak')
  async getStreak(
    @Param('activityId', ParseIntPipe) activityId: number,
    @Query() query: FindLogsQueryDto,
  ) {
    const data = await this.activityLogsService.getStreak(
      activityId,
      query.type,
    );
    return ok('Found activity logs successfully', data);
  }
}
