import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  BadRequestException,
  UseGuards,
  Req,
  ParseIntPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ok } from 'src/utils/response.util';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JWTGuard from 'src/auth/guards/jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const foundUser = await this.usersService.findByEmail(createUserDto.email);
    if (foundUser) throw new BadRequestException('Email already exists');
    const data = await this.usersService.create(createUserDto);
    return ok('created user successfully', data, true);
  }

  @UseGuards(JWTGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersService.findOne(id);
    return ok('Found user successfully', data);
  }

  @UseGuards(JWTGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (id !== req.user.sub)
      throw new UnprocessableEntityException('Not same user');

    return this.usersService.update(id, updateUserDto);
  }
}
