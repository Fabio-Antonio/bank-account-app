import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ITransaction } from 'src/account/domain/interfaces/account.interfaces';

export class TransactionDto implements ITransaction {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type!: 'deposit' | 'withdraw';

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  date!: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  balanceAfterTransaction!: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}