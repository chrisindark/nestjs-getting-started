import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GCloudPubSubService } from 'src/utils/gcloudPubSub/gcloudPubSub.service';

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
    private readonly gCloudPubSubService: GCloudPubSubService,
  ) {}

  async publishMessageToJustcallEmailsTopic(data: EmailPublishMessagePayload) {
    const payload = {
      event_type: 'EMAIL',
      data,
    };
    const response = await this.gCloudPubSubService.publishMessageTopic(
      this.configService.getOrThrow('GCLOUD_PUBSUB_EMAILS_TOPIC'),
      payload,
    );

    if (!response.message) {
      const errorMessage = `Could not publish justcall email message for: ${JSON.stringify(
        payload,
      )}`;
      throw Error(errorMessage);
    }

    return response;
  }
}
