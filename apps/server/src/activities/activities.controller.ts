import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-user.dto';
import { ok } from 'src/utils/response.util';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import JWTGuard from 'src/auth/guards/jwt.guard';

@UseGuards(JWTGuard)
@ApiBearerAuth()
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
    @Req() req: any,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    if (!this.activitiesService.checkIfCreator(req.user.sub, id))
      throw new UnauthorizedException('You are not the creator');

    const data = await this.activitiesService.update(id, updateActivityDto);
    return ok('Updated activity successfully', data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    if (!this.activitiesService.checkIfCreator(req.user.sub, id))
      throw new UnauthorizedException('You are not the creator');

    const data = await this.activitiesService.delete(id);
    return ok('Deleted activity successfully', data);
  }
}
