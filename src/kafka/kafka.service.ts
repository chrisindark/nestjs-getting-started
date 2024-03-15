import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  logLevel,
  RecordMetadata,
} from '@nestjs/microservices/external/kafka.interface';
import { Producer, Kafka, Consumer, Admin } from 'kafkajs';

import Utils from 'src/utils';

@Injectable()
export class KafkaService implements OnApplicationShutdown {
  client: Kafka;
  producer: Producer;
  consumer: Consumer;
  admin: Admin;

  constructor(private configService: ConfigService) {
    // both functions are necessary
    this.connect();
    this.connectProducer();
    this.connectConsumer();
    this.adminConnect();
  }

  // this function is to connect to kafka client
  connect() {
    const brokerStr = this.configService.get('kafka.brokers');
    // brokers will give comma separated string, so we need to split with comma to get list of brokers
    const brokers = brokerStr.split(',');

    try {
      this.client = new Kafka({
        brokers: brokers,
        connectionTimeout: 3000,
        requestTimeout: 30000,
        retry: {
          maxRetryTime: 30000,
          initialRetryTime: 300,
          retries: 5,
        },
        logLevel: logLevel.ERROR,
      });
    } catch (e) {
      Logger.error(e, '', `KAFKA`);
    }
  }

  // this function is to connect to kafka producer
  private async retryConnection() {
    try {
      this.connect();
      // await this.connectProducer();
    } catch (e) {
      Logger.error('Failed to connect', '', 'KAFKA');
    }
  }

  // connects admin
  async adminConnect() {
    this.admin = this.client.admin();
    this.admin.connect();
    console.log(await this.admin.fetchTopicOffsets('firstTopic'));
  }

  // connects consumer
  async connectConsumer() {
    this.consumer = this.client.consumer({ groupId: 'posts-consumer' });
    this.getConsumer();
  }

  async getConsumer() {
    // const response = null;
    try {
      await this.consumer.connect();
      return this.consumer;
    } catch (e) {
      Logger.error(e, '', `KAFKA`);
    }
  }

  // consumes a failed offset
  async consumeOffset(offset, partition) {
    console.log(offset, partition);

    await this.consumer.subscribe({ topic: 'firstTopic' });

    this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        console.log(message);
        this.consumer.stop();
        return;
      },
    });
    this.consumer.seek({
      topic: 'firstTopic',
      partition: partition,
      offset: '' + offset,
    });
  }

  // this function is to connect to kafka producer
  async connectProducer() {
    this.producer = this.client.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      retry: {
        maxRetryTime: 30000,
        initialRetryTime: 300,
        retries: 5,
      },
    });
    // connect to producer on app start
    await this.getProducer();

    // this.producer.on("producer.connect", (...args) => {
    //   console.log("producer.disconnect", args);
    // });

    // this.producer.on("producer.disconnect", (...args) => {
    //   console.log("producer.disconnect", args);
    // });
  }

  async getProducer(): Promise<Producer> {
    // const response = null;
    try {
      await this.producer.connect();
      return this.producer;
    } catch (e) {
      Logger.error(e, '', `KAFKA`);
    }
  }

  async publishMessage(topic, message) {
    let response = null;
    try {
      const fn = async (): Promise<RecordMetadata[]> =>
        await this.producer.send({
          topic: topic,
          messages: [message],
        });
      response = await this.retry(fn, 1);
      // console.log(response);
    } catch (e) {
      Logger.error(e, '', 'KAFKA');
      const options = {
        custom: {
          event: 'ERROR',
          error: e,
        },
      };
      Utils.catchWithApm(e, options);
    }
    return response;
  }

  private async retry(fn: () => Promise<any>, retries: number) {
    try {
      return await fn();
    } catch (e) {
      if (retries) {
        await this.retryConnection();
        return await this.retry(fn, retries - 1);
      } else {
        throw e;
      }
    }
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
}
