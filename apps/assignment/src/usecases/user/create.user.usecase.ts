import { IEmailService, IException } from '@app/shared';
import { UserRepository } from '../../domain/interface/UserRepository';
import { UserM } from '../../domain/model/UserM';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsService: IException,
    private readonly emailSendService: IEmailService,
  ) {}

  async execute(user: UserM): Promise<UserM> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      this.exceptionsService.forbiddenException({
        message: 'can not create use as user with is name already exists',
        code_error: 403,
      });
    } else {
      await this.emailSendService.sendEmail(
        user.email,
        'please change your password',
        `hey ${user.name} please change to your new custom password`,
      );
      const create = await this.userRepository.createUser(user);
      return create;
    }
  }
}
