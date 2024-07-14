import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IAccount } from 'src/account/domain/interfaces/account.interfaces';
import { TransactionDto } from './transaction.dto';
import { ContactDto } from './contact.dto';
import { MovementDto } from './movement.dto';
import { AuditLogDto } from './audit.dto';
import { UserInfoDto } from './user-info.dto';

export class CreateAccountDto implements IAccount {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountNumber!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  owner!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  balance!: number;

  @ApiProperty({ type: [TransactionDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TransactionDto)
  transactions?: TransactionDto[];

  @ApiProperty({ type: [ContactDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts?: ContactDto[];

  @ApiProperty({ type: [MovementDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MovementDto)
  movements?: MovementDto[];

  @ApiProperty({ type: [AuditLogDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AuditLogDto)
  auditLogs?: AuditLogDto[];

  @ApiProperty({ type: UserInfoDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo!: UserInfoDto;
}