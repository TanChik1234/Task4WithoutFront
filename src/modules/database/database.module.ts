import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { DatabaseService } from './database.service';
import { peopleProviders } from 'src/modules/database/providers/people.providers';
import { planetProviders } from 'src/modules/database/providers/planets.providers';
import { filmsProviders } from 'src/modules/database/providers/films.providers';
import { starshipsProviders } from 'src/modules/database/providers/starships.providers';
import { vehicleProviders } from 'src/modules/database/providers/vehicles.providers';
import { speciesProviders } from './providers/species.providers';
import { imageProviders } from './providers/images.providers';

@Module({
    imports:[
    ],
    providers: [
        ...databaseProviders,
        ...imageProviders,
        ...peopleProviders,
        ... planetProviders,
        ... filmsProviders,
        ... starshipsProviders,
        ... vehicleProviders,
        ...speciesProviders,
        DatabaseService], 
    exports: [...databaseProviders, DatabaseService] 
})
export class DatabaseModule {}

