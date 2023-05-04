import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../domain/interface/UserRepository';
import { UserM } from '../../domain/model/UserM';
import { User } from '../entities/user.entity';

@Injectable()
export class DatabaseUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  async register(user: UserM): Promise<UserM> {
    const result = await this.userEntityRepository.save(user);
    return this.toUserM(result);
  }

  async findById(id: number): Promise<UserM> {
    const found = await this.userEntityRepository.findOne({
      where: {
        id,
      },
    });
    return this.toUserM(found);
  }

  async createUser(user: UserM): Promise<UserM> {
    const result = await this.userEntityRepository.save(user);
    return this.toUserM(result);
  }

  async findAll(): Promise<UserM[]> {
    const users = await this.userEntityRepository.find();
    return users.map((adminUserEntity) => this.toUserM(adminUserEntity));
  }

  async findByEmail(email: string): Promise<UserM> {
    const adminUserEntity = await this.userEntityRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!adminUserEntity) {
      return null;
    }
    return adminUserEntity;
  }

  async resetPassword(email: string, password: string): Promise<void> {
    await this.userEntityRepository.update(
      {
        email: email,
      },
      {
        password: password,
      },
    );
  }

  private toUserM(adminUserEntity: User): UserM {
    const adminUser: UserM = new UserM();

    adminUser.id = adminUserEntity.id;
    adminUser.email = adminUserEntity.email;
    adminUser.name = adminUserEntity.name;
    adminUser.password = adminUserEntity.password;
    adminUser.role = adminUserEntity.role;

    return adminUser;
  }
}
