import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ClickHouseClient, createClient } from '@clickhouse/client';
import { ConfigService } from '@nestjs/config';
import { InsertResult } from '@clickhouse/client-common';

import { ServiceResponseStatus } from 'src/constants/enums';

@Injectable()
export class ClickhouseService implements OnApplicationShutdown {
  private readonly logger = new Logger(ClickhouseService.name);

  firstClickhouse: ClickHouseClient;

  constructor(private readonly configService: ConfigService) {
    this.connect();
  }

  connect() {
    try {
      this.firstClickhouse = createClient({
        host: `${this.configService.get(
          'CLICKHOUSE_DB_PROTOCOL',
        )}${this.configService.get(
          'CLICKHOUSE_DB_HOST',
        )}:${this.configService.get('CLICKHOUSE_DB_PORT')}`,
        request_timeout: 30000,
        username: `${this.configService.get('CLICKHOUSE_DB_USERNAME')}`,
        password: `${this.configService.get('CLICKHOUSE_DB_PASSWORD')}`,
        application: 'voice-tools-clickhouse-js',
        database: `${this.configService.get('CLICKHOUSE_DB_DATABASE')}`,
        clickhouse_settings: {},
        max_open_connections: parseInt(
          this.configService.get('CLICKHOUSE_DB_MAX_CONNECTIONS'),
          10,
        ),
        keep_alive: {
          enabled: true,
          socket_ttl: 2500,
          retry_on_expired_socket: true,
        },
      });
    } catch (e) {
      this.logger.error(e.message, e.stack, `connect`);

      throw e;
    }
  }

  select = async (
    clickhouseClient: ClickHouseClient,
    query: string,
    queryParams?: Record<string, unknown>,
  ) => {
    try {
      const resultSet = await clickhouseClient.query({
        query,
        format: 'JSONEachRow',
        query_params: queryParams,
      });
      const dataset: Array<any> = await resultSet.json();
      return dataset;
    } catch (e) {
      // this.logger.error(e.message, e.stack, 'select');

      // const logObject = {
      //   query,
      // };
      // this.logger.error(JSON.stringify(logObject));

      throw new Error(e.message);
    }
  };

  selectFirst = async (
    query: string,
    queryParams?: Record<string, unknown>,
  ) => {
    const response = await this.select(
      this.firstClickhouse,
      query,
      queryParams,
    );
    return response;
  };

  insert = async (
    clickhouseClient: ClickHouseClient,
    table: string,
    values: any[],
  ): Promise<InsertResult> => {
    try {
      const insertResult = await clickhouseClient.insert({
        table,
        values,
        format: 'JSONEachRow',
      });

      return insertResult;
    } catch (e) {
      // this.logger.error(e.message, e.stack, 'insert');

      // const logObject = {
      //   table,
      //   values,
      // };
      // this.logger.error(JSON.stringify(logObject));

      throw new Error(e.message);
    }
  };

  insertFirst = async (table: string, values: any[]) => {
    const response = await this.insert(this.firstClickhouse, table, values);
    return response;
  };

  command = async (
    clickhouseClient: ClickHouseClient,
    query: string,
    queryParams?: Record<string, unknown>,
  ) => {
    try {
      const commandResult = await clickhouseClient.command({
        query,
        query_params: queryParams,
      });

      return commandResult;
    } catch (e) {
      // this.logger.error(e.message, e.stack, 'command');

      // const logObject = {
      //   query,
      // };
      // this.logger.error(JSON.stringify(logObject));

      throw new Error(e.message);
    }
  };

  commandFirst = async (
    query: string,
    queryParams?: Record<string, unknown>,
  ) => {
    const response = await this.command(
      this.firstClickhouse,
      query,
      queryParams,
    );
    return response;
  };

  exec = async (clickhouseClient: ClickHouseClient, query: string) => {
    try {
      const execResult = await clickhouseClient.exec({
        query,
      });

      return execResult;
    } catch (e) {
      this.logger.error(e.message, e.stack);

      // const logObject = {
      //   query,
      // };
      // this.logger.error(JSON.stringify(logObject));

      throw new Error(e.message);
    }
  };

  executeSelect = async (
    query: string,
    queryParams?: Record<string, unknown>,
  ) => {
    try {
      const response = await this.selectFirst(query, queryParams);

      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      this.logger.warn(query);
      this.logger.warn(JSON.stringify(queryParams));
      throw new Error(e.message);
    }
  };

  executeInsert = async (table: string, values: any[]) => {
    try {
      const response = await this.insertFirst(table, values);

      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      this.logger.warn(table);
      this.logger.warn(JSON.stringify(values));
      throw new Error(e.message);
    }
  };

  executeCommand = async (
    query: string,
    queryParams?: Record<string, unknown>,
  ) => {
    try {
      const response = await this.commandFirst(query, queryParams);

      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      this.logger.warn(query);
      this.logger.warn(JSON.stringify(queryParams));
      throw new Error(e.message);
    }
  };

  onApplicationShutdown() {
    // this.logger.error('closing clickhouse connection...');
  }
}
