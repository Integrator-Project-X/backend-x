import { NestFactory, HttpAdapterHost, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  Logger,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';

// Imported global interceptors
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// Imported global filters
import { AuthExceptionFilter } from './common/filters/auth-exception.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { TypeOrmExceptionFilter } from './common/filters/typeorm.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe setup
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Implemented global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TimeoutInterceptor(10_000),
    new TransformInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // Implemented global filters
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AuthExceptionFilter(httpAdapterHost),
    new ValidationExceptionFilter(httpAdapterHost),
    new TypeOrmExceptionFilter(httpAdapterHost),
    new GlobalExceptionFilter(httpAdapterHost),
  );

  // Enable CORS
  // In Render, FRONT_URL may not be set at first. Use `true` to allow all during initial testing.
  const frontUrl = process.env.FRONT_URL?.trim();
  app.enableCors({
    origin: frontUrl ? [frontUrl] : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Swagger set up
  const config = new DocumentBuilder()
    .setTitle('Project X API')
    .setDescription('API documentation for the Project X application')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Render provides process.env.PORT
  const port =
    Number(process.env.PORT) || Number(process.env.APP_PORT) || 3001;

  await app.listen(port, '0.0.0.0');

  const baseUrl = process.env.RENDER_EXTERNAL_URL
    ? process.env.RENDER_EXTERNAL_URL
    : `http://localhost:${port}`;

  Logger.log(`🚀 Application is running on: ${baseUrl}`);
  Logger.log(`📘 Swagger docs available at ${baseUrl}/api/docs`);
}

bootstrap();
