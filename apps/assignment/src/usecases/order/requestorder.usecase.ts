import { ExceptionsService } from '@app/shared';
import { UserRepository } from '../../domain/interface/UserRepository';

export class RequestOrderUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(itemName: string, amount: number): Promise<any> {
    this.exceptionsService.internalServerErrorException({
      message: '',
      code_error: 401,
    });
  }
}
