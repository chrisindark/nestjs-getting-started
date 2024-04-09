import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingWebhook } from '@slack/webhook';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);
  private readonly callQualityLogsChannel: IncomingWebhook;

  constructor(private readonly configService: ConfigService) {
    this.callQualityLogsChannel = new IncomingWebhook(
      this.configService.get('SLACK_CALL_NETWORK_LOGS_URL'),
    );
  }

  async sendToCallQualityLogsChannel(text: string) {
    try {
      return await this.callQualityLogsChannel.send(text);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
