import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from './interceptors/format-response/format-response.interceptor';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.useGlobalInterceptors(new FormatResponseInterceptor());
  await app.listen(3000);
}
bootstrap();
