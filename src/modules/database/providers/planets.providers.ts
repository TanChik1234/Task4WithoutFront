import { Planets } from 'src/entities/planets.entity';
import { DataSource } from 'typeorm';

export const planetProviders = [
  {
    provide: 'PLANETS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Planets),
    inject: ['DATA_SOURCE'],
  },
];
