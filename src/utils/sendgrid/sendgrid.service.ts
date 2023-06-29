import { Global, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as SendGrid from "@sendgrid/mail";
import { SentryService } from "src/interceptors/sentry/sentry.service";

@Global()
@Injectable()
export class SendgridService {
  constructor(
    private readonly configService: ConfigService,
    private readonly sentryService: SentryService,
  ) {
    SendGrid.setApiKey(this.configService.get<string>("SEND_GRID_KEY"));
  }

  async send(mail: SendGrid.MailDataRequired) {
    try {
      const transport = await SendGrid.send(mail);
      return transport;
    } catch (e) {
      Logger.error(e);

      const exceptionContextdata = {
        tags: {},
        extras: {
          custom: mail,
        },
      };
      this.sentryService.catchWithSentry(e, {}, exceptionContextdata);
    }
  }
}
