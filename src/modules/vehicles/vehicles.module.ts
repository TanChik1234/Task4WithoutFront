import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { vehicleProviders } from '../database/providers/vehicles.providers';
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
    ...vehicleProviders,
    VehiclesService],
  controllers: [VehiclesController]
})
export class VehiclesModule {}
