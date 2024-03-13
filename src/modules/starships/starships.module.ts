import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsController } from './starships.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { starshipsProviders } from '../database/providers/starships.providers';
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
    ...starshipsProviders,
    StarshipsService],
  controllers: [StarshipsController]
})
export class StarshipsModule {}
