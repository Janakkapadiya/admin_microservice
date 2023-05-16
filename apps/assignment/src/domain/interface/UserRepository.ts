import { UserM } from '../model/UserM';

export abstract class UserRepository {
  abstract register(user: UserM): Promise<UserM>;
  abstract createUser(user: UserM): Promise<UserM>;
  abstract findById(id: number): Promise<UserM>;
  abstract findByEmail(email: string): Promise<UserM | null>;
  abstract findAll(): Promise<UserM[]>;
  abstract resetPassword(email: string, password: string): Promise<void>;
}
