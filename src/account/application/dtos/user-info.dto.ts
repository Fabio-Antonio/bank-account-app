import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  street!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  zipCode!: string;
}

export class UserInfoDto {
  @ApiProperty({ type: AddressDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone!: string;
}
