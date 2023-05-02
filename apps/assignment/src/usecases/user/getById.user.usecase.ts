import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { UserRepository } from '../../domain/interface/UserRepository';
import { UserM } from '../../domain/model/UserM';

export class getUserByIdUseCases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}
  async execute(id: number): Promise<UserM> {
    const result = await this.userRepository.findById(id);
    if (!result) {
      this.exceptionsService.badRequestException({
        message: 'user with this id not found',
        code_error: 400,
      });
    }
    return result;
  }
}
