import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import {
  IsOptional,
  MinLength,
  MaxLength,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @ApiProperty()
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @MinLength(3)
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Length(7)
  @IsString()
  @IsOptional()
  colorCode?: string;
}
