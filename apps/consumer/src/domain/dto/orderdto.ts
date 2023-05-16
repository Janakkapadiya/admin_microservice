import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class OrderDto {
  @ApiProperty()
  @IsString()
  itemName: string;
  @ApiProperty()
  @IsNumber()
  amount: number;
}
