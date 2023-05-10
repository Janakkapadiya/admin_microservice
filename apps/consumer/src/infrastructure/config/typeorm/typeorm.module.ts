import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../../../../../../libs/shared/src/infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '../../../../../../libs/shared/src/infrastructure/config/environment-config/environment-config.service';

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
    entities: [__dirname, '**', '*.entity.{ts,js}'],
    // apps/consumer/src/infrastructure/entity/product.ts
    synchronize: false,
    migrationsRun: true,
    dropSchema: true,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
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
