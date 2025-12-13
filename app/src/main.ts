import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpAdapterHost } from '@nestjs/core';

import { AuthExceptionFilter } from './common/filters/auth-exception.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { TypeOrmExceptionFilter } from './common/filters/typeorm.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Global validation pipe setup
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TimeoutInterceptor(10_000),
    new TransformInterceptor()
  );

  app.useGlobalFilters(
    new AuthExceptionFilter(app.get(HttpAdapterHost)),
    new ValidationExceptionFilter(app.get(HttpAdapterHost)),
    new TypeOrmExceptionFilter(app.get(HttpAdapterHost)),
    new GlobalExceptionFilter(app.get(HttpAdapterHost)),
  );

  //Swagger set up
  const config = new DocumentBuilder()
    .setTitle('Project X API')
    .setDescription('API documentation for the Project X application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
  Logger.log(`📘 Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
