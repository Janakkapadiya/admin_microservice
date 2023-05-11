import { IException } from '@app/shared';
import { UserRepository } from '../../domain/interface/UserRepository';
import { UserWithoutPassword, UserM } from '../../domain/model/UserM';

export class IsAuthenticatedUseCases {
  constructor(
    private readonly adminUserRepo: UserRepository,
    private readonly exception: IException,
  ) {}

  async execute(email: string): Promise<UserWithoutPassword> {
    const user: UserM = await this.adminUserRepo.findByEmail(email);
    if (!user) {
      this.exception.UnauthorizedException({
        message: 'this user is not authorized',
        code_error: 401,
      });
    }
    const { password, ...info } = user;
    console.log(info);
    return info;
  }
}
