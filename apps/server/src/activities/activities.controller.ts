import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-user.dto';
import { ok } from 'src/utils/response.util';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiCreatedResponse()
  async create(@Body() createActivityDto: CreateActivityDto) {
    const data = await this.activitiesService.create(createActivityDto);
    return ok('created activity successfully', data, true);
  }

  @Get(':userId')
  async findAll(@Param('userId', ParseIntPipe) userId: number) {
    const data = await this.activitiesService.findAll(userId);
    return ok('Found activities successfully', data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    const data = await this.activitiesService.update(id, updateActivityDto);
    return ok('Updated activity successfully', data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const data = await this.activitiesService.delete(id);
    return ok('Deleted activity successfully', data);
  }
}
