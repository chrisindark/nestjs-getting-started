import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import configuration from '../../config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingModule } from '../../modules/ping/ping.module';
import { UtilsModule } from '../../utils/utils.module';
import { WebsocketAppModule } from '../../apps/websocketApp/websocketApp.module';
// import { CassandraModule } from '../../utils/cassandra/cassandra.module';
// import { EmployeeModule } from '../employee/employee.module';
// import { MongoModule } from '../../utils/mongo/mongo.module';
// import { CatsModule } from '../../cats/cats.module';

// import { KafkaMicroserviceModule } from "src/kafka-microservice/kafka-microservice.module";
// import { KafkaConsumerModule } from "src/kafka-consumer/kafka-consumer.module";
// import { RedisMicroserviceModule } from "src/redis-microservice/redis-microservice.module";
// import { CronModule } from "src/cron/cron.module";
// import { QueueModule } from "src/queue/queue.module";

// import { MyLibraryModule } from "@christopherpaul/my-library";
// import { MyOtherLibraryModule } from "@christopherpaul/my-other-library";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : process.env.NODE_ENV === 'staging'
            ? '.env.staging'
            : '.env.development',
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'dist', 'client'),
    }),
    PingModule,
    UtilsModule,
    // KafkaMicroserviceModule,
    // KafkaConsumerModule,
    // RedisMicroserviceModule,
    // QueueModule,
    // CronModule,
    // MyLibraryModule,
    // MyOtherLibraryModule,
    WebsocketAppModule,
    // CassandraModule,
    // EmployeeModule,
    // MongoModule,
    // CatsModule,
  ],
  providers: [AppService],
  controllers: [AppController],
  exports: [],
})
export class AppModule {}
