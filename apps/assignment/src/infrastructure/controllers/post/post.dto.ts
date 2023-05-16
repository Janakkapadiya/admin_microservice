import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  id: number;
  user_Id: number;
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  content: string;
}
