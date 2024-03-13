import { Starships } from 'src/entities/starships.entity';
import { DataSource } from 'typeorm';

export const starshipsProviders = [
  {
    provide: 'STARSHIPS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Starships),
    inject: ['DATA_SOURCE'],
  },
];
