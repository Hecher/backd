import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Увеличиваем лимит размера файла до 50MB
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  // Включаем CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  await app.listen(3003, '0.0.0.0');
}
bootstrap();