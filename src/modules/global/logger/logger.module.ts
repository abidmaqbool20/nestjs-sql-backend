// src/logger/logger.module.ts
import { Module,Global } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';
@Global()
@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
