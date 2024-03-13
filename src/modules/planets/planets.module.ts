import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { planetProviders } from '../database/providers/planets.providers';
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
    ...planetProviders,
    PlanetsService
  ],
  controllers: [PlanetsController]
})
export class PlanetsModule {}

