import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IAudit } from 'src/account/domain/interfaces/account.interfaces';

export class AuditLogDto implements IAudit {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  action!: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  date?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  details!: string;
}