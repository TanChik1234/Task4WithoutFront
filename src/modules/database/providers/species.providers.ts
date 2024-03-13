import { Species } from 'src/entities/species.entity';
import { DataSource } from 'typeorm';

export const speciesProviders = [
  {
    provide: 'SPECIES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Species),
    inject: ['DATA_SOURCE'],
  },
];
