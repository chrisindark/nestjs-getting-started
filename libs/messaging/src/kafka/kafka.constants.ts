/**
 * Injection token for the Nest microservices Kafka client.
 *
 *   constructor(@Inject(KAFKA_CLIENT) private readonly client: ClientKafka) {}
 *
 * Don't expose `ClientKafka` outside the messaging boundary directly — go
 * through `PublisherService.toKafka(...)` so producers and consumers stay
 * decoupled from the transport.
 */
export const KAFKA_CLIENT = 'KAFKA_CLIENT' as const;
