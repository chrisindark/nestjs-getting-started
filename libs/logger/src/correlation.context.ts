/**
 * Per-unit-of-work context carried through AsyncLocalStorage. Add new
 * fields here when you want them attached to every downstream log line
 * automatically (e.g. tenant id, user id).
 */
export interface CorrelationContext {
  /** Stable identifier tying every log line of one unit of work together. */
  correlationId: string;
  /** Where the unit of work originated (e.g. 'http', 'cron:tick', 'kafka:demo.topic'). */
  source?: string;
}
