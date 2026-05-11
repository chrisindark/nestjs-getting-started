import type { Job } from 'bull';

import {
  CORRELATION_BULL_META_FIELD,
  CORRELATION_ID_KAFKA_HEADER,
  CORRELATION_ID_PUBSUB_ATTRIBUTE,
} from './correlation.constants';

/**
 * Extract a correlation id from incoming kafka headers. Kafka headers
 * come over the wire as `Buffer | string | (Buffer | string)[]`.
 */
export function correlationFromKafkaHeaders(
  headers: Record<string, unknown> | undefined,
): string | undefined {
  if (!headers) return undefined;
  const raw = headers[CORRELATION_ID_KAFKA_HEADER];
  if (raw == null) return undefined;
  if (Array.isArray(raw)) {
    const first = raw[0];
    return decode(first);
  }
  return decode(raw);
}

/** Extract from Google Cloud Pub/Sub attributes (string -> string map). */
export function correlationFromPubSubAttributes(
  attributes: Record<string, string> | undefined,
): string | undefined {
  return attributes?.[CORRELATION_ID_PUBSUB_ATTRIBUTE];
}

/**
 * Extract correlation from a Bull job. We tunnel meta through a
 * reserved field on `job.data` so the typed payload contract stays
 * clean for callers.
 */
export function correlationFromBullJob(job: Job): string | undefined {
  const data = job.data as Record<string, unknown> | undefined;
  if (!data) return undefined;
  const meta = data[CORRELATION_BULL_META_FIELD] as
    | { correlationId?: string }
    | undefined;
  return meta?.correlationId;
}

/**
 * Build the kafka message envelope expected by Nest's default
 * `KafkaRequestSerializer` so headers / key are forwarded over the wire.
 *
 * The serializer treats any object containing a `value` key as a
 * pre-built message; otherwise it wraps the raw value automatically.
 */
export function withKafkaCorrelation<T>(
  value: T,
  correlationId: string | undefined,
  extraHeaders: Record<string, string> = {},
): {
  value: T;
  headers: Record<string, string>;
} {
  const headers: Record<string, string> = { ...extraHeaders };
  if (correlationId) headers[CORRELATION_ID_KAFKA_HEADER] = correlationId;
  return { value, headers };
}

/** Inject correlation into a Pub/Sub attributes map. */
export function withPubSubCorrelation(
  attributes: Record<string, string> | undefined,
  correlationId: string | undefined,
): Record<string, string> {
  const out = { ...(attributes ?? {}) };
  if (correlationId) out[CORRELATION_ID_PUBSUB_ATTRIBUTE] = correlationId;
  return out;
}

/**
 * Wrap a Bull job payload with the reserved meta envelope. The shape
 * the consumer sees becomes:
 *
 *   { ...userPayload, __meta: { correlationId, ... } }
 *
 * `__meta` is intentionally not part of the typed payload contract so
 * consumers don't have to acknowledge it.
 */
export function withBullCorrelation<T extends Record<string, unknown>>(
  payload: T,
  correlationId: string | undefined,
): T {
  if (!correlationId) return payload;
  return {
    ...payload,
    [CORRELATION_BULL_META_FIELD]: { correlationId },
  };
}

function decode(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (Buffer.isBuffer(value)) return value.toString('utf8');
  if (typeof value === 'string') return value;
  return undefined;
}
