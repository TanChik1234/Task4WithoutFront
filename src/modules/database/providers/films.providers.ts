import { Films } from 'src/entities/films.entity';
import { DataSource } from 'typeorm';

export const filmsProviders = [
  {
    provide: 'FILMS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Films),
    inject: ['DATA_SOURCE'],
  },
];
