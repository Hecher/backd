import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { FileService } from './file/file.service';
import { FileController } from './file/file.controller';
;

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }),],
  controllers: [AppController, FileController],
  providers: [AppService, FileService],
})
export class AppModule {}
