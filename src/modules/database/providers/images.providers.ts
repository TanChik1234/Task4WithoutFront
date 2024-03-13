
import { Images } from 'src/entities/images.entity';
import { DataSource } from 'typeorm';

export const imageProviders = [
  {
    provide: 'IMAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Images),
    inject: ['DATA_SOURCE'],
  },
];
