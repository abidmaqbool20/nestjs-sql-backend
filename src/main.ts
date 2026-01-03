import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './config/http-exception.filter';
import { CustomLoggerService } from './modules/global/logger/logger.service';
import { config as loadDotEnv } from 'dotenv';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';

/**
 * Load base .env
 */
loadDotEnv();

/**
 * Load environment-specific .env file
 */
function loadEnv(): void {
  const env = process.env.NODE_ENV || 'development';
  loadDotEnv({ path: `.env.${env}` });
}

async function bootstrap(): Promise<void> {
  loadEnv();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  /**
   * Global exception handling
   */
  app.useGlobalFilters(
    new HttpExceptionFilter(new CustomLoggerService()),
  );

  /**
   * Register Fastify plugins on raw Fastify instance
   * (required to avoid Fastify type collisions)
   */
  const fastify = app.getHttpAdapter().getInstance();

  await fastify.register(helmet, {
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: [
          `'self'`,
          'data:',
          'apollo-server-landing-page.cdn.apollographql.com',
        ],
        scriptSrc: [
          `'self'`,
          `https: 'unsafe-inline'`,
        ],
        manifestSrc: [
          `'self'`,
          'apollo-server-landing-page.cdn.apollographql.com',
        ],
        frameSrc: [
          `'self'`,
          'sandbox.embed.apollographql.com',
        ],
      },
    },
  });

  /**
   * Global validation
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  /**
   * Swagger setup
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  /**
   * Start server
   */
  const port = process.env.PORT || 5001;
  await app.listen(port, '0.0.0.0');

  new Logger('Bootstrap').log(
    `Application running on http://localhost:${port}`,
  );
}

bootstrap();
