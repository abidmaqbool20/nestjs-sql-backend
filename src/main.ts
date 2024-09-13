import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './config/http-exception.filter';
import { CustomLoggerService } from './modules/global/logger/logger.service';
import { config } from 'dotenv';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';

config();

function loadEnv() {
  const env = process.env.NODE_ENV || 'development';
  config({ path: `.env.${env}` });
}

async function bootstrap() {
  loadEnv();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Enable CORS if needed
  // app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter(new CustomLoggerService()));

  await initHelmet(app);
  await initValidationPipes(app);
  await initSwagger(app);
  await initApp(app);
}

async function initValidationPipes(app: NestFastifyApplication) {
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
}

async function initHelmet(app: NestFastifyApplication) {
  // Using Fastify-specific helmet middleware
  await app.register(fastifyHelmet, {
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
        frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
      },
    },
  });
}

async function initSwagger(app: NestFastifyApplication) {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function initApp(app: NestFastifyApplication) {
  const port = process.env.PORT || 5001;
  await app.listen(port, '0.0.0.0');  // Listen on 0.0.0.0 for Fastify to work properly
  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
