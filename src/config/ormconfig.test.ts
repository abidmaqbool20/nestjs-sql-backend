import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { buildDbConfig } from '../config/db.config';

dotenv.config({ path: '.env.test' });

import { DataSourceOptions } from 'typeorm';

export const AppTestDataSource = new DataSource(
  buildDbConfig(process.env, true, false) as DataSourceOptions,
);
