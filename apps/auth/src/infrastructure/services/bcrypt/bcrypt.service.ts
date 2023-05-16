import { Injectable } from '@nestjs/common';
import { IBcryptService } from 'apps/auth/src/domain/adepters/bcrypt.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements IBcryptService {
  rounds = 10;

  async hash(hashString: string): Promise<string> {
    return await bcrypt.hash(hashString, this.rounds);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
