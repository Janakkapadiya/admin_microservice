import { IBcryptService } from '../../../../../libs/shared/src/domain/adepters/bcrypt.interface';
import { IException } from '../../../../../libs/shared/src/domain/exceptions/exceptions.interface';
import { UserRepository } from '../../domain/interface/UserRepository';

export class UpdateUserPasswordUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly exception: IException,
    private readonly bcrypt: IBcryptService,
  ) {}

  async execute(email: string, password: string) {
    const user = this.userRepo.findByEmail(email);
    if (!user) {
      this.exception.badRequestException({
        message: "user is't present can't reset password",
        code_error: 400,
      });
    } else {
      const hashedPassword = await this.bcrypt.hash(password);
      return this.userRepo.resetPassword(email, hashedPassword);
    }
  }
}
