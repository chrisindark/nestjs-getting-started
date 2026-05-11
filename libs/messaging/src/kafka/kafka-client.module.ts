import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KAFKA_CLIENT } from './kafka.constants';
import { kafkaBrokersFromEnv } from './kafka.transport';

export interface KafkaClientModuleOptions {
  /** Kafka client id; defaults to `process.env.APP_NAME` or 'nestjs-app'. */
  clientId?: string;
  /**
   * Consumer group id for the `ClientKafka` reply listener. Even when the
   * client is used only as a producer, Nest's `ClientKafka` opens a
   * consumer to receive request/response replies, so a unique groupId per
   * service avoids cross-app collisions.
   */
  groupId?: string;
}

/**
 * Provides a `ClientKafka` (under the `KAFKA_CLIENT` token) backed by
 * Nest's microservices Kafka transport. The publisher facade
 * (`PublisherService.toKafka`) delegates to this client.
 *
 * Producers should never inject `ClientKafka` directly — go through
 * `PublisherService` so the publish surface is uniform across transports.
 */
@Global()
@Module({})
export class KafkaClientModule {
  static forRoot(options: KafkaClientModuleOptions = {}): DynamicModule {
    return {
      module: KafkaClientModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: KAFKA_CLIENT,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
              const clientId =
                options.clientId ??
                config.get<string>('APP_NAME') ??
                'nestjs-app';
              const groupId = options.groupId ?? `${clientId}-publisher`;
              const brokers = kafkaBrokersFromEnv();
              return {
                transport: Transport.KAFKA,
                options: {
                  client: {
                    clientId,
                    brokers,
                  },
                  consumer: {
                    groupId,
                    allowAutoTopicCreation: true,
                  },
                  producer: {
                    allowAutoTopicCreation: true,
                  },
                },
              };
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
