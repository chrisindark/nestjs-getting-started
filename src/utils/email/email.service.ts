import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PubSubService } from '@app/messaging';

export interface EmailTemplateDataPayload {
  userName: string;
  reportName: string;
  downloadLink: string;
  fromDate: string;
  toDate: string;
}

export interface EmailPublishMessagePayload {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body?: string;
  template_id?: string;
  template_data?: EmailTemplateDataPayload;
}

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly pubsub: PubSubService,
  ) {}

  async publishEmailEvent(data: EmailPublishMessagePayload) {
    const payload = { event_type: 'EMAIL', data };
    const topic = this.configService.getOrThrow<string>(
      'GCLOUD_PUBSUB_EMAILS_TOPIC',
    );
    const messageId = await this.pubsub.publish(topic, payload);

    if (!messageId) {
      throw new Error(
        `Could not publish email event for: ${JSON.stringify(payload)}`,
      );
    }

    return { message: messageId, success: true };
  }
}
