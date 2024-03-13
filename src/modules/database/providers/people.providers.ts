import { People } from 'src/entities/people.entity';
import { DataSource } from 'typeorm';

export const peopleProviders = [
  {
    provide: 'PEOPLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(People),
    inject: ['DATA_SOURCE'],
  },
];
