import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTConfig } from '../../../domain/config/jwt.interface';
import { DatabaseConfig } from '@app/shared/domain/config/DatabaseConfig';
import { EmailConfig } from '@app/shared/domain/config/EmailConfig';

@Injectable()
export class EnvironmentConfigService
  implements DatabaseConfig, JWTConfig, EmailConfig
{
  constructor(private configService: ConfigService) {}
  getEmailUser(): string {
    return this.configService.get<string>('EMAIL_USER');
  }
  getEmailHost(): string {
    return this.configService.get<string>('EMAIL_HOST');
  }
  getEmailPort(): number {
    return this.configService.get<number>('EMAIL_PORT');
  }
  getEmailSender(): string {
    return this.configService.get<string>('EMAIL_SENDER');
  }
  getEmailSecret(): string {
    return this.configService.get<string>('EMAIL_SECRET');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT');
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER');
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }

  getDatabaseSync(): boolean {
    return this.configService.get<boolean>('DATABASE_SYNCHRONIZE');
  }
}
