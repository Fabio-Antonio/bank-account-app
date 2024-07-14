import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IContact } from 'src/account/domain/interfaces/account.interfaces';

export class ContactDto implements IContact {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountNumber!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;
}