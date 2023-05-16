import { UserRepository } from '../../domain/interface/UserRepository';
import { UserM } from '../../domain/model/UserM';
import { IException } from '@app/shared';

export class getUserByEmailUseCases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsService: IException,
  ) {}
  async execute(email: string): Promise<UserM> {
    const result = await this.userRepository.findByEmail(email);
    if (!result) {
      this.exceptionsService.forbiddenException({
        message: 'no user with this email',
        code_error: 403,
      });
    }
    return result;
  }
}
