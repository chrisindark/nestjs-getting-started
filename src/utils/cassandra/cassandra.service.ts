import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, auth, mapping } from 'cassandra-driver';

@Injectable()
export class CassandraService {
  private readonly logger = new Logger(CassandraService.name);

  testClient: Client;
  mapper: mapping.Mapper;

  constructor(private readonly configService: ConfigService) {
    this.connect();
  }

  connect = () => {
    try {
      this.createClient();
    } catch (e) {
      this.logger.error(e.message, e.stack, `connect`);

      throw e;
    }
  };

  private createClient() {
    this.testClient = new Client({
      contactPoints: ['0.0.0.0'],
      keyspace: 'test',
      localDataCenter: 'datacenter1',
      authProvider: new auth.PlainTextAuthProvider('cassandra', 'cassandra'),
    });
  }

  getTestClient = () => {
    return this.testClient;
  };

  createMapper(client: Client, mappingOptions: mapping.MappingOptions) {
    this.createClient();
    return new mapping.Mapper(client, mappingOptions);
  }
}
