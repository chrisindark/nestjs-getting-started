import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsocketAppModule } from 'src/apps/websocketApp/websocketApp.module';
import { PingModule } from 'src/modules/ping/ping.module';

import configuration from '../../config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
          ? '.production.env'
          : process.env.NODE_ENV === 'staging'
            ? '.staging.env'
            : '.development.env',
      load: [configuration],
    }),
    // KafkaMicroserviceModule,
    // KafkaConsumerModule,
    // RedisMicroserviceModule,
    // QueueModule,
    // CronModule,
    // MyLibraryModule,
    // MyOtherLibraryModule,
    PingModule,
    WebsocketAppModule,
  ],
  providers: [AppService],
  controllers: [AppController],
  exports: [],
})
export class AppModule {}
