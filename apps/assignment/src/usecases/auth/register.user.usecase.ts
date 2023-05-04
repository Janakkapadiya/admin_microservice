import { IException, BcryptService } from '@app/shared';
import { UserRepository } from '../../domain/interface/UserRepository';
import { UserM } from '../../domain/model/UserM';

export class RegisterUseCases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exception: IException,
    private readonly bcrypt: BcryptService,
  ) {}

  async execute(user: UserM): Promise<UserM> {
    const hashedPassword = await this.bcrypt.hash(user.password);
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      this.exception.forbiddenException({
        message: 'can not create use as user with is name already exists',
        code_error: 403,
      });
    }
    return await this.userRepository.register({
      ...user,
      password: hashedPassword,
    });
  }
}
