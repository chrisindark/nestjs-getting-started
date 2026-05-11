/**
 * Single source of truth for every Bull queue + job name in the system.
 * Producers and consumers must both import these constants so a typo in
 * one place is caught by TypeScript instead of silently dropping jobs.
 */
export enum QueueName {
  Reports = 'ReportsQueue',
}

export enum JobName {
  GenerateReport = 'generateReport',
}

/**
 * Strongly-typed payload contract per queue + job. Add new shapes here
 * and the producer/consumer signatures pick them up automatically.
 */
export interface ReportsQueueJobs {
  [JobName.GenerateReport]: {
    reportId: string;
    triggeredAt: string;
    actor?: string;
  };
}

export interface QueueJobPayloadMap {
  [QueueName.Reports]: ReportsQueueJobs;
}

export type QueueJobName<Q extends QueueName> = Extract<
  keyof QueueJobPayloadMap[Q],
  string
>;

export type QueueJobPayload<
  Q extends QueueName,
  J extends QueueJobName<Q>,
> = QueueJobPayloadMap[Q][J];

/**
 * Redis key prefix applied to every queue. Must stay stable across
 * deploys; changing it strands existing jobs.
 */
export const QUEUE_PREFIX = 'rqc';

/**
 * Bull queue settings shared by every consumer. Tweak here to update
 * stalled-detection / lock behaviour across the system.
 */
export const QUEUE_SETTINGS = {
  maxStalledCount: 1,
  lockDuration: 30 * 1000,
  lockRenewTime: 15 * 1000,
} as const;

export const DEFAULT_JOB_OPTIONS = {
  removeOnComplete: true,
  removeOnFail: false,
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 5_000 },
} as const;
