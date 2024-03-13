import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { speciesProviders } from '../database/providers/species.providers';
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
    ...speciesProviders,
    SpeciesService],
  controllers: [SpeciesController]
})
export class SpeciesModule {}
