import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

/**
 * Example Kafka consumer controller. Each `@EventPattern` listens to a
 * topic and receives the parsed payload + Kafka context (partition,
 * offset, headers). Add one method per topic — or one controller per
 * domain (users.controller.ts, orders.controller.ts, etc.).
 *
 * Topics consumed here MUST be subscribed to in the
 * `KafkaConsumerAppModule.subscribeTo` list, or via auto-subscription
 * which Nest does automatically on `app.listen()` for `@EventPattern`s
 * discovered at startup.
 */
@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  @EventPattern('demo.first-topic')
  async onFirstTopic(@Payload() payload: unknown, @Ctx() ctx: KafkaContext) {
    const topic = ctx.getTopic();
    const partition = ctx.getPartition();
    const message = ctx.getMessage();
    this.logger.log(
      `received ${topic} partition=${partition} offset=${message.offset} payload=${JSON.stringify(payload)}`,
    );
    // TODO: do the work. Throw to nack — kafka will retry per the
    //       consumer's configuration.
  }

  @MessagePattern('demo.request-reply')
  async onRequestReply(@Payload() payload: unknown, @Ctx() ctx: KafkaContext) {
    this.logger.log(
      `request-reply on ${ctx.getTopic()} payload=${JSON.stringify(payload)}`,
    );
    return { received: true, echo: payload };
  }
}
