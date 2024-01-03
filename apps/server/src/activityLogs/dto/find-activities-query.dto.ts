import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export default class FindLogsQueryDto {
  @ApiProperty({ enum: ['activity', 'user'] })
  @IsString({ groups: ['activity', 'user'] })
  type: 'user' | 'activity';

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  to?: string;
}
