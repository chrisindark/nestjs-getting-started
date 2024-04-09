import { CloudTasksClient } from '@google-cloud/tasks';
// import { credentials } from '@grpc/grpc-js';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PRODUCTION_KEY, STAGING_KEY } from 'src/constants/constants';
// import { SentryService } from 'src/interceptors/sentry/sentry.service';

const LOCAL_GCLOUD_TASK_PORT = 8123;
const LOCAL_GCLOUD_TASK_HOST = 'gcloud-tasks-emulator';
const DEFAULT_TASK_QUEUE = '0';

@Injectable()
export class GCloudTaskService {
  client: CloudTasksClient;
  gcloudQueueCallbackTaskQueueBaseId: string;
  gcloudQueueCallbackTaskQueueMaxCount: number;
  gcloudVoicemailTranscriptionBaseId: string;
  gcloudVoicemailTranscriptionMaxCount: number;
  private readonly logger = new Logger(GCloudTaskService.name);

  constructor(
    // private readonly sentryService: SentryService,
    private readonly configService: ConfigService,
  ) {
    this.connect();
    this.gcloudQueueCallbackTaskQueueBaseId = this.configService.get(
      'GCLOUD_QUEUECALLBACK_TASKQUEUE_BASE_ID',
    );
    this.gcloudQueueCallbackTaskQueueMaxCount = this.configService.get(
      'GCLOUD_QUEUECALLBACK_TASKQUEUE_MAX_COUNT',
    );
    this.gcloudVoicemailTranscriptionBaseId = this.configService.get(
      'GCLOUD_VOICEMAIL_TRANSCRIPTION_TASKQUEUE_BASE_ID',
    );
    this.gcloudVoicemailTranscriptionMaxCount = this.configService.get(
      'GCLOUD_VOICEMAIL_TRANSCRIPTION_TASKQUEUE_MAX_COUNT',
    );
  }

  async connect() {
    const projectId = this.configService.get('GCLOUD_PROJECT_ID');
    if (
      process.env.NODE_ENV === PRODUCTION_KEY ||
      process.env.NODE_ENV === STAGING_KEY
    ) {
      this.client = new CloudTasksClient({ projectId: projectId });
    } else {
      this.client = new CloudTasksClient({
        projectId: projectId,
        port: LOCAL_GCLOUD_TASK_PORT,
        servicePath: LOCAL_GCLOUD_TASK_HOST,
        // sslCreds: credentials.createInsecure(),
      });
    }
  }

  async pushQueuCallbackRequestToTaskQueue(
    payload,
    delaySeconds: number,
    shardingId: number,
  ) {
    const queueName = `${this.gcloudQueueCallbackTaskQueueBaseId}-${
      shardingId % this.gcloudQueueCallbackTaskQueueMaxCount
    }`;
    const scheduleTime = Math.floor(Date.now() / 1000) + delaySeconds;
    try {
      const res = await this.client.createTask({
        parent: queueName,
        task: {
          httpRequest: {
            httpMethod: 'POST',
            url: `${this.configService.get(
              'BASE_URL',
            )}/v1/gcloudpub/publish/voice-queuecallback-request`,
            headers: {
              Authorization: `Bearer ${this.configService.get('JWT_API_KEY')}`,
              'Content-type': 'application/json',
            },
            body: Buffer.from(JSON.stringify(payload)),
          },
          scheduleTime: {
            seconds: scheduleTime,
          },
        },
      });

      return res;
    } catch (e) {
      this.logger.error(e.message, e.stack);

      const logObject = {
        topic: `${this.configService.get(
          'GCLOUD_PUBSUB_QUEUE_CALLBACK_REQUEST_TOPIC',
        )}`,
        payload,
        queueName,
      };
      this.logger.error(JSON.stringify(logObject));
    }
  }

  async pushVoicemailTranscriptionToTaskQueue(payload, delaySeconds: number) {
    const scheduleTime = Math.floor(Date.now() / 1000) + delaySeconds;
    const queueName = `${this.gcloudVoicemailTranscriptionBaseId}-${DEFAULT_TASK_QUEUE}`;
    try {
      const res = await this.client.createTask({
        parent: queueName,
        task: {
          httpRequest: {
            httpMethod: 'POST',
            url: `${this.configService.get(
              'BASE_URL',
            )}/v1/gcloudpub/publish/${this.configService.get(
              'GCLOUD_PUBSUB_VOICEMAIL_TRANSCRIPTION_TOPIC',
            )}`,
            headers: {
              Authorization: `Bearer ${this.configService.get('JWT_API_KEY')}`,
              'Content-type': 'application/json',
            },
            body: Buffer.from(JSON.stringify(payload)),
          },
          scheduleTime: {
            seconds: scheduleTime,
          },
        },
      });
      return res;
    } catch (e) {
      this.logger.error(e);

      const logObject = {
        topic: `${this.configService.get(
          'GCLOUD_PUBSUB_VOICEMAIL_TRANSCRIPTION_TOPIC',
        )}`,
        payload,
        queueName,
      };
      this.logger.error(JSON.stringify(logObject));
    }
  }

  async pushCallLogsReportToTaskQueue(payload, delaySeconds: number) {
    const scheduleTime = Math.floor(Date.now() / 1000) + delaySeconds;
    const queueName = ``;
    this.logger.debug(queueName);
    try {
      const res = await this.client.createTask({
        parent: queueName,
        task: {
          httpRequest: {
            httpMethod: 'POST',
            url: `${this.configService.get(
              'BASE_URL',
            )}/v1/gcloudpub/publish/${this.configService.get(
              'GCLOUD_PUBSUB_CALL_LOGS_REPORT_TOPIC',
            )}`,
            headers: {
              Authorization: `Bearer ${this.configService.get('JWT_API_KEY')}`,
              'Content-type': 'application/json',
            },
            body: Buffer.from(JSON.stringify(payload)),
          },
          scheduleTime: {
            seconds: scheduleTime,
          },
        },
      });
      return res;
    } catch (e) {
      this.logger.error(e);

      const logObject = {
        topic: `${this.configService.get(
          'GCLOUD_PUBSUB_CALL_LOGS_REPORT_TOPIC',
        )}`,
        payload,
        queueName,
      };
      this.logger.error(JSON.stringify(logObject));
    }
  }
}
