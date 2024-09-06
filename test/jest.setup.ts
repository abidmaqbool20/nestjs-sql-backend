// jest.setup.ts
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' }); // Ensure this points to your test environment file

import { DataSource } from 'typeorm';
import { AppTestDataSource } from '../src/config/ormconfig.test';

let dataSource: DataSource;

beforeAll(async () => {
  try {
    dataSource = await AppTestDataSource.initialize();
    await dataSource.runMigrations();
    await dataSource.synchronize(true);
  } catch (error) {
    console.log('Error setting up DataSource:', error);
    throw error;
  }
});

afterAll(async () => {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }
});
