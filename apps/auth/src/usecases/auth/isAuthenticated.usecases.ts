import { UserRepository } from 'apps/assignment/src/domain/interface/UserRepository';
import {
  UserM,
  UserWithoutPassword,
} from 'apps/assignment/src/domain/model/UserM';

export class IsAuthenticatedUseCases {
  constructor(private readonly adminUserRepo: UserRepository) {}

  async execute(email: string): Promise<UserWithoutPassword> {
    const user: UserM = await this.adminUserRepo.findByEmail(email);
    console.log('*****************************************', user);
    const { password, ...info } = user;
    return info;
  }
}
