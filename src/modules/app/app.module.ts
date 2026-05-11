import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppConfigModule } from '@app/config';
import { PublisherModule } from '@app/publisher';
import { QueueName } from '@app/queue';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingModule } from '../../modules/ping/ping.module';
import { UtilsModule } from '../../utils/utils.module';
// import { WebsocketAppModule } from '../../apps/websocketApp/websocketApp.module';
// import { MysqlModule } from '../../utils/mysql/mysql.module';
// import { PersonModule } from '../person/person.module';
// import { CassandraModule } from '../../utils/cassandra/cassandra.module';
// import { EmployeeModule } from '../employee/employee.module';
import { MongoModule } from '../../utils/mongo/mongo.module';
import { CatsModule } from '../../cats/cats.module';

// import { KafkaMicroserviceModule } from "src/kafka-microservice/kafka-microservice.module";
// import { KafkaConsumerModule } from "src/kafka-consumer/kafka-consumer.module";
// import { RedisMicroserviceModule } from "src/redis-microservice/redis-microservice.module";
// import { CronModule } from "src/cron/cron.module";
// import { QueueModule } from "src/queue/queue.module";

// import { MyLibraryModule } from "@christopherpaul/my-library";
// import { MyOtherLibraryModule } from "@christopherpaul/my-other-library";

@Module({
  imports: [
    AppConfigModule.forRoot(),
    PublisherModule.forRoot({
      withKafka: true,
      withPubSub: true,
      queues: [QueueName.Reports],
      kafkaClientId: 'api',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'dist', 'client'),
    }),
    PingModule,
    UtilsModule,
    // MysqlModule,
    // PersonModule,
    // KafkaMicroserviceModule,
    // KafkaConsumerModule,
    // RedisMicroserviceModule,
    // QueueModule,
    // CronModule,
    // MyLibraryModule,
    // MyOtherLibraryModule,
    // WebsocketAppModule,
    // CassandraModule,
    // EmployeeModule,
    MongoModule,
    CatsModule,
  ],
  providers: [AppService],
  controllers: [AppController],
  exports: [],
})
export class AppModule {}
