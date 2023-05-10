import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../../../../../../libs/shared/src/infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '../../../../../../libs/shared/src/infrastructure/config/environment-config/environment-config.service';
import { join } from 'path';

export const getTypeOrmModuleOptions = (
  config: EnvironmentConfigService,
): TypeOrmModuleOptions =>
  ({
    type: 'mysql',
    host: config.getDatabaseHost(),
    port: config.getDatabasePort(),
    username: config.getDatabaseUser(),
    password: config.getDatabasePassword(),
    database: config.getDatabaseName(),
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    // apps/assignment/src/infrastructure/entities/posts.entity.ts
    synchronize: false,
    migrationsRun: true,
    migrations: [join(__dirname + '/migrations/**/*{.ts,.js}')],
    autoLoadEntities: true,
  } as TypeOrmModuleOptions);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: getTypeOrmModuleOptions,
    }),
  ],
})
export class TypeOrmConfigModule {}
