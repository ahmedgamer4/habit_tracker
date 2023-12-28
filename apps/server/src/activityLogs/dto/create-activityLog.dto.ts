import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateActivityLogDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  count: number;
}
