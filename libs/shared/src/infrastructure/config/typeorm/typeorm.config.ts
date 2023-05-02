import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

if (process.env.NODE_ENV === 'local') {
  dotenv.config({ path: '.env' });
}

dotenv.config({ path: '.env' });

const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: false,
  migrationsRun: true,
  migrationsTableName: 'migration_todo',
  migrations: ['dist/migrations/*.js'],
};

const dataSource = new DataSource(config);

export default dataSource;
