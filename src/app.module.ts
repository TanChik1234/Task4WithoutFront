import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './modules/database/database.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { FilmsModule } from './modules/films/films.module';
import { PeopleModule } from './modules/people/people.module';
import { PlanetsModule } from './modules/planets/planets.module';
import { SpeciesModule } from './modules/species/species.module';
import { StarshipsModule } from './modules/starships/starships.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { FileService } from './modules/file/file.service';
import { FileModule } from './modules/file/file.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
     PeopleModule, FilmsModule, PlanetsModule, 
    SpeciesModule, StarshipsModule, VehiclesModule, FileModule, AuthModule, UsersModule
  ],
  controllers: [AppController],
  providers: [AppService,
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },
  FileService
  ],
})
export class AppModule {}
