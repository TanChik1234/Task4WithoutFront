import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/modules/database/database.module';
import { databaseProviders } from 'src/modules/database/database.providers';
import { userProviders } from './user.providers';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './users.guard';
import { blocktokenProviders } from './blocktoken.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...databaseProviders,
    ...userProviders,
    ...blocktokenProviders,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },],
  exports: [UsersService]
})
export class UsersModule {}
