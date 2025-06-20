import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import * as fs from 'fs';

async function bootstrap() {
  let httpsOptions = null;
  try {
    httpsOptions = {
      key: fs.readFileSync('/etc/letsencrypt/live/apidiplom.duckdns.org/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/apidiplom.duckdns.org/fullchain.pem'),
    };
  } catch (error) {
    console.log('SSL сертификаты не найдены, запускаем HTTP сервер');
  }

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  
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