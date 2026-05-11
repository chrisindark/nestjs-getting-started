/**
 * Header used to read/write the correlation id over HTTP.
 *
 * Lower-cased on purpose: Node http parses headers as lower-case, and
 * downstream proxies (nginx, GCLB) normalise the same way.
 */
export const CORRELATION_ID_HEADER = 'x-correlation-id' as const;

/**
 * Header used to read/write the correlation id on Kafka messages. Same
 * key as the HTTP header for consistency across hops.
 */
export const CORRELATION_ID_KAFKA_HEADER = 'x-correlation-id' as const;

/**
 * Attribute key used to read/write the correlation id on Google Cloud
 * Pub/Sub messages. Pub/Sub attributes are camelCase by convention.
 */
export const CORRELATION_ID_PUBSUB_ATTRIBUTE = 'correlationId' as const;

/**
 * Reserved field name on Bull job data used to tunnel correlation
 * metadata without polluting the user's typed payload contract.
 */
export const CORRELATION_BULL_META_FIELD = '__meta' as const;
