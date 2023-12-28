import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateActivityDto {
  @ApiProperty()
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  name: string;

  @ApiProperty()
  @MinLength(3)
  @IsString()
  description: string;

  @ApiProperty()
  @Length(7)
  @IsString()
  colorCode: string;
}
