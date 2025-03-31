import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { Readable } from 'stream';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FileService {
  constructor(private readonly httpService: HttpService) {}

  async sendToMicroservice(file: Express.Multer.File): Promise<any> {
    const form = new FormData();
    
    // Создаем поток из буфера файла
    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null);

    // Добавляем файл в форму
    form.append('file', readableStream, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    // Отправляем запрос к микросервису
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://127.0.0.1:8000/detect-anomaly', form, {
          headers: {
            ...form.getHeaders(),
            // Добавьте дополнительные заголовки при необходимости
          },
        })
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send file to microservice: ${error.message}`);
    }
  }
}