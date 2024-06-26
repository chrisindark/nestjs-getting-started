import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PRODUCTION_KEY } from 'src/constants/constants';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: 'testMongo',
      useFactory: (configService: ConfigService) => {
        if (process.env.NODE_ENV === PRODUCTION_KEY) {
          return {
            type: 'mongodb',
            name: 'test',
            // useNewUrlParser: true,
            host: configService.get('MONGO_DB_HOST'),
            port: parseInt(configService.get('MONGO_DB_PORT'), 10),
            username: configService.get('MONGO_DB_USERNAME'),
            password: configService.get('MONGO_DB_PASSWORD'),
            authSource: configService.get('MONGO_DB_DATABASE_AUTH_SOURCE'),
            database: configService.get('MONGO_DB_DATABASE'),
            entities: [],
            autoLoadEntities: true,
            useUnifiedTopology: true,
            connectionLimit: 4,
            extra: {
              connectionLimit: 4,
            },
            logging: true,
            synchronize: false,
            multipleStatements: true,
            keepConnectionAlive: true,
          };
        } else {
          return {
            type: 'mongodb',
            name: 'testMongo',
            // useNewUrlParser: true,
            url: configService.get('MONGO_DB_URL'),
            entities: [],
            autoLoadEntities: true,
            useUnifiedTopology: true,
            database: configService.get('MONGO_DB_DATABASE'),
            connectionLimit: 2,
            extra: {
              connectionLimit: 2,
            },
            logging: true,
            synchronize: false,
            multipleStatements: true,
            keepConnectionAlive: true,
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class MongoModule {}
