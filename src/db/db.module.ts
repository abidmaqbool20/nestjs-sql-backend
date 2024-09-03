import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from '@/config/typeormconfig';
import { join } from 'path';
import { getDBConfig } from '@/config/dbConfig'; 
const dbConfig = getDBConfig();
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [typeOrmConfig],
      envFilePath: `.${process.env.NODE_ENV || 'development'}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: dbConfig.type,
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        entities: dbConfig.entities,
        synchronize: dbConfig.synchronize, 
        logging: dbConfig.logging,
        extra: dbConfig.extra,
        cli: dbConfig.cli,
      }),
    }),
  ],
})
export class DBModule {}
