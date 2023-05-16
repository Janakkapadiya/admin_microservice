import { UserRepository } from 'apps/assignment/src/domain/interface/UserRepository';
import {
  UserM,
  UserWithoutPassword,
} from 'apps/assignment/src/domain/model/UserM';

export class IsAuthenticatedUseCases {
  constructor(private readonly adminUserRepo: UserRepository) {}

  async execute(email: string): Promise<UserWithoutPassword> {
    const user: UserM = await this.adminUserRepo.findByEmail(email);
    const { password, ...info } = user;
    console.log(info);
    return info;
  }
}
