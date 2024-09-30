import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { config } from 'dotenv';
config();
dotenv.config({ path: `.env.test` });



export const AppTestDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [join(__dirname, '/../modules/**/*.entity.{js,ts}')],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: true,
});
