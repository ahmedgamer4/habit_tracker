import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export default class FindActivitiesQueryDto {
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  to?: string;
}
