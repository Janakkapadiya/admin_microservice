import { ApiProperty } from '@nestjs/swagger';
import { UserM } from 'apps/assignment/src/domain/model/UserM';

export class UserPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;

  constructor(user: Partial<UserM>) {
    Object.assign(this, user);
  }
}
