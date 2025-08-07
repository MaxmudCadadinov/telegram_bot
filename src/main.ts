import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path';


async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  app.enableCors()

  app.useGlobalPipes(new ValidationPipe({
    transform: true,              // Преобразует типы (например, строку в число)
    whitelist: true,              // Удаляет лишние поля, которых нет в DTO
    forbidNonWhitelisted: true,   // Ошибка, если лишние поля всё-таки есть
  }));

  await app.listen(3000);
}
bootstrap();
