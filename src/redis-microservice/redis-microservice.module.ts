import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { RedisMicroserviceController } from './redis-microservice.controller';
import { RedisMicroserviceService } from './redis-microservice.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [RedisMicroserviceController],
  providers: [RedisMicroserviceService],
  exports: [],
})
export class RedisMicroserviceModule {}
