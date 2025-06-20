import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import * as fs from 'fs';
import { NestApplicationOptions } from '@nestjs/common';

async function bootstrap() {
  let httpsOptions: any = undefined;
  try {
    httpsOptions = {
      key: fs.readFileSync('./ssl/private-key.pem'),
      cert: fs.readFileSync('./ssl/certificate.pem'),
    };
  } catch (error) {
    console.log('SSL сертификаты не найдены, запускаем HTTP сервер');
    console.log('Ошибка:', error.message);
  }

  const options: NestApplicationOptions = {};
  if (httpsOptions) {
    options.httpsOptions = httpsOptions;
  }

  const app = await NestFactory.create(AppModule, options);
  
  // Увеличиваем лимит размера файла до 50MB
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  // Включаем CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  const port = httpsOptions ? 443 : 3003;
  await app.listen(port, '0.0.0.0');
  console.log(`Сервер запущен на ${httpsOptions ? 'HTTPS' : 'HTTP'}://apidiplom.duckdns.org${httpsOptions ? '' : ':3003'}`);
}
bootstrap();