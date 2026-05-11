export type PubSubMessageHandler = (
  message: PubSubIncomingMessage,
) => Promise<void> | void;

/**
 * The subset of `@google-cloud/pubsub` `Message` we lean on. Typed locally
 * so we don't leak the gcloud client across module boundaries.
 */
export interface PubSubIncomingMessage {
  id: string;
  data: Buffer;
  attributes: Record<string, string>;
  publishTime?: Date | string;
  ack: () => void;
  nack: () => void;
  ackWithResponse?: () => Promise<unknown>;
}
