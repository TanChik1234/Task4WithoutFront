import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { peopleProviders } from '../database/providers/people.providers';
import { databaseProviders } from 'src/modules/database/database.providers';
import { DatabaseModule } from 'src/modules/database/database.module';
import { planetProviders } from '../database/providers/planets.providers';
import { DatabaseService } from 'src/modules/database/database.service';
import { filmsProviders } from 'src/modules/database/providers/films.providers';
import { speciesProviders } from 'src/modules/database/providers/species.providers';
import { starshipsProviders } from 'src/modules/database/providers/starships.providers';
import { vehicleProviders } from 'src/modules/database/providers/vehicles.providers';
import { MulterModule } from '@nestjs/platform-express';
import { imageProviders } from 'src/modules/database/providers/images.providers';
import { FileModule } from '../file/file.module';


@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // specify the directory where files will be saved
    }), 
    DatabaseModule,
    FileModule
  ],
  providers: [
    ...databaseProviders,
    ...peopleProviders,
    ...filmsProviders,
    ...planetProviders,
    ...speciesProviders,
    ...starshipsProviders,
    ...vehicleProviders,
    ...imageProviders,
    DatabaseService,
    PeopleService],
  controllers: [PeopleController]
})
export class PeopleModule {}
