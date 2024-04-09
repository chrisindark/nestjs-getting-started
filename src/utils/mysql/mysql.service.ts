import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class MysqlService implements OnApplicationShutdown {
  private readonly logger = new Logger(MysqlService.name);

  constructor(
    @InjectDataSource('test')
    private readonly test: DataSource,
    // @InjectDataSource('ds1')
    // private readonly dataSource1: DataSource,
    // @InjectDataSource('ds2')
    // private readonly dataSource2: DataSource,
  ) {}

  getTestWriteClient = () => {
    return this.test;
  };

  // getDS1WriteClient() {
  //   return this.dataSource1;
  // }

  // getDS2WriteClient() {
  //   return this.dataSource2;
  // }

  async testWrite(query, queryParams = []) {
    let response = null;
    try {
      response = await this.getTestWriteClient().query(query, queryParams);
    } catch (e) {
      this.logger.error(`error in write db: ${e}`);
      throw new Error(e.message);
    }
    return response;
  }

  // async ds1Write(query, queryParams = []) {
  //   let response = null;
  //   try {
  //     response = await this.getDS1WriteClient().query(query, queryParams);
  //   } catch (e) {
  //     this.logger.error(`error in write db: ${e}`);
  //     throw new Error(e.message);
  //   }
  //   return response;
  // }

  // async ds2Write(query, queryParams = []) {
  //   let response = null;
  //   try {
  //     response = await this.getDS2WriteClient().query(query, queryParams);
  //   } catch (e) {
  //     this.logger.error(`error in write db: ${e}`);
  //     throw new HttpException(e, 500);
  //   }
  //   return response;
  // }

  async onApplicationShutdown(signal: string) {
    // this.logger.error('closing db connections...');
    return Promise.resolve();
  }

  async createTestWriteQueryRunner(): Promise<QueryRunner> {
    return this.getTestWriteClient().createQueryRunner();
  }

  // async createDS1WriteQueryRunner(): Promise<QueryRunner> {
  //   return this.getDS1WriteClient().createQueryRunner();
  // }

  // async createDS2WriteQueryRunner(): Promise<QueryRunner> {
  //   return this.getDS2WriteClient().createQueryRunner();
  // }
}
