import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDate, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IMovement } from 'src/account/domain/interfaces/account.interfaces';
//6693844f8b78bdede9aadae8  dany
//6693856e8b78bdede9aadaf6  Fabio
export class MovementDto implements IMovement {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type!: 'createAccount' | 'updateAccount';

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  date!: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  balanceAfterMovement!: number;

}