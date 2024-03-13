import { Vehicles } from 'src/entities/vehicles.entity';
import { DataSource } from 'typeorm';

export const vehicleProviders = [
  {
    provide: 'VEHICLES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Vehicles),
    inject: ['DATA_SOURCE'],
  },
];
