import {
  HttpException,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class MysqlService implements OnApplicationShutdown {
  constructor(
    @InjectDataSource('ds1')
    private readonly dataSource1: DataSource,
    @InjectDataSource('ds2')
    private readonly dataSource2: DataSource,
  ) {}

  getDS1WriteClient() {
    return this.dataSource1;
  }

  getDS2WriteClient() {
    return this.dataSource2;
  }

  async ds1Write(query, queryParams = []) {
    let response = null;
    try {
      response = await this.getDS1WriteClient().query(query, queryParams);
    } catch (e) {
      // Logger.error(`error in write db: ${e}`);
      // throw new HttpException(e, 500);
    }
    return response;
  }

  async ds2Write(query, queryParams = []) {
    let response = null;
    try {
      response = await this.getDS2WriteClient().query(query, queryParams);
    } catch (e) {
      // Logger.error(`error in write db: ${e}`);
      // throw new HttpException(e, 500);
    }
    return response;
  }

  async onApplicationShutdown(signal: string) {
    // Logger.error('closing db connections...');
    return Promise.resolve();
  }

  async createDS1WriteQueryRunner(): Promise<QueryRunner> {
    return this.getDS1WriteClient().createQueryRunner();
  }

  async createDS2WriteQueryRunner(): Promise<QueryRunner> {
    return this.getDS2WriteClient().createQueryRunner();
  }
}
