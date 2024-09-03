import { join } from 'path';
import { config } from 'dotenv';
 
config();

export function getDBConfig() {
  const activeDB = process.env.ACTIVE_DB || 'postgres';

  const dbConfig: Record<string, any> = {};

  if (activeDB === 'postgres') {
    dbConfig.type = 'postgres';
    dbConfig.host = process.env.POSTGRES_HOST;
    dbConfig.port = parseInt(process.env.POSTGRES_PORT, 5432);
    dbConfig.username = process.env.POSTGRES_USER;
    dbConfig.password = process.env.POSTGRES_PASSWORD;
    dbConfig.database = process.env.POSTGRES_DATABASE;
  } else if (activeDB === 'mysql') {
    dbConfig.type = 'mysql';
    dbConfig.host = process.env.MYSQL_HOST;
    dbConfig.port = parseInt(process.env.MYSQL_PORT, 8081);
    dbConfig.username = process.env.MYSQL_USER;
    dbConfig.password = process.env.MYSQL_PASSWORD;
    dbConfig.database = process.env.MYSQL_DATABASE;
  }

  return {
    type: dbConfig.type,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [join(__dirname, '/../modules/**/*.entity.{js,ts}')],
    migrations: ['src/migrations/**/*.ts'],
    cli: {
      migrationsDir: 'src/migrations'
    },
    extra : {
		// connectionLimit: 10,
    },
    synchronize: false, // Set to false in production
    logging: false,
  };
}
