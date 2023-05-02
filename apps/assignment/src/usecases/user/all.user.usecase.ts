import { UserRepository } from '../../domain/interface/UserRepository';
import { UserM } from '../../domain/model/UserM';

export class getUsersUseCases {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(): Promise<UserM[]> {
    return await this.userRepository.findAll();
  }
}
