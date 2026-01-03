import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { buildDbConfig } from './db.config';

dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'development'}`,
});

import { DataSourceOptions } from 'typeorm';

export default new DataSource(
    buildDbConfig(process.env) as DataSourceOptions,
);
