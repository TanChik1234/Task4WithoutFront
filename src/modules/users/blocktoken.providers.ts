import { Blocktoken } from 'src/entities/blocktoken.entity';
import { DataSource } from 'typeorm';

export const blocktokenProviders = [
  {
    provide: 'BLOCKTOKEN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Blocktoken),
    inject: ['DATA_SOURCE'],
  },
];
