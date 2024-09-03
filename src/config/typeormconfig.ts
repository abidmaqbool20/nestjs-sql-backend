import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';  
import { config } from 'dotenv';
import { getDBConfig } from './dbConfig'; 
config(); 

let dbConfig = getDBConfig();  
export default registerAs('typeormconfig', () => dbConfig); 
export const connectionSource = new DataSource( dbConfig as DataSourceOptions );
