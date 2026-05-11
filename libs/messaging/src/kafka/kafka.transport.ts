import type { KafkaOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';

export interface KafkaTransportConfig {
  clientId: string;
  groupId: string;
  brokers: string[];
  /** Override the default `fromBeginning: false` consumer behaviour. */
  fromBeginning?: boolean;
  /** Allow auto-creating topics that consumers subscribe to. */
  allowAutoTopicCreation?: boolean;
}

/**
 * Builds the `MicroserviceOptions` block used by both:
 *  - `NestFactory.createMicroservice<MicroserviceOptions>(module, options)` in consumer apps
 *  - `ClientsModule.register([...])` / `KafkaClientModule.forRoot(...)` for the publisher
 *
 * Reading env vars happens at the call site so each app can decide how
 * to source its broker list (env directly, ConfigService, secret manager,
 * etc.) without forcing a single pattern.
 */
export function buildKafkaTransport(
  config: KafkaTransportConfig,
): KafkaOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.clientId,
        brokers: config.brokers,
      },
      consumer: {
        groupId: config.groupId,
        allowAutoTopicCreation: config.allowAutoTopicCreation ?? true,
      },
      subscribe: {
        fromBeginning: config.fromBeginning ?? false,
      },
      producer: {
        allowAutoTopicCreation: config.allowAutoTopicCreation ?? true,
      },
    },
  };
}

export function kafkaBrokersFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): string[] {
  return (env.KAFKA_BROKER_URLS ?? '')
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean);
}
