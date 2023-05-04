import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@app/shared/domain/enums/Roles.enum';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  id: number;
  @ApiProperty()
  @IsString()
  email: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  password: string;
  @ApiProperty()
  @IsEnum([Role.PowerUser, Role.User, Role.SupportDesk])
  role: Role;
}

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}

export class PlaceOrderDto {
  @ApiProperty()
  @IsString()
  itemName: string;
  @ApiProperty()
  @IsNumber()
  amount: number;
}
