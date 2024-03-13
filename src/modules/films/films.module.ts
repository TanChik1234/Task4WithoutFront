import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { filmsProviders } from '../database/providers/films.providers';
import { MulterModule } from '@nestjs/platform-express';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // specify the directory where files will be saved
    }), 
    DatabaseModule,
  FileModule],
  providers: [
    ...filmsProviders,
    FilmsService],
  controllers: [FilmsController]
})
export class FilmsModule {}
