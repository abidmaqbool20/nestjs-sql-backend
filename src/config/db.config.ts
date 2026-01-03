import { join } from 'path';

export type SupportedDB = 'postgres' | 'mysql';

export function buildDbConfig(env: NodeJS.ProcessEnv, synchronize = false, logging = false) {
  const activeDB = (env.ACTIVE_DB || 'postgres') as SupportedDB;

  if (activeDB === 'postgres') {
    return {
      type: 'postgres',
      host: env.POSTGRES_HOST,
      port: Number(env.POSTGRES_PORT),
      username: env.POSTGRES_USERNAME,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DB,
      entities: [join(__dirname, '/../modules/**/*.entity.{ts,js}')],
      migrations: [join(__dirname, '/../migrations/**/*.{ts,js}')],
      synchronize,
      logging,
    };
  }

  // MySQL
  return {
    type: 'mysql',
    host: env.MYSQL_HOST,
    port: Number(env.MYSQL_PORT),
    username: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    entities: [join(__dirname, '/../modules/**/*.entity.{ts,js}')],
    migrations: [join(__dirname, '/../migrations/**/*.{ts,js}')],
    synchronize,
    logging,
  };
}
