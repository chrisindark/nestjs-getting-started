import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MysqlService } from './mysql.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: 'test',
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          name: 'test',
          host: configService.get('MYSQL_DB_HOST'),
          port: configService.get('MYSQL_DB_PORT'),
          username: configService.get('MYSQL_DB_USERNAME'),
          password: configService.get('MYSQL_DB_PASSWORD'),
          database: configService.get('MYSQL_DB_DATABASE'),
          logging: false,
          synchronize: false,
          multipleStatements: true,
          keepConnectionAlive: true,
          connectionLimit:
            parseInt(configService.get('MYSQL_DB_MAX_CONNECTIONS'), 10) || 2,
          extra: {
            connectionLimit:
              parseInt(configService.get('MYSQL_DB_MAX_CONNECTIONS'), 10) || 2,
          },
          entities: [],
          autoLoadEntities: true,
          // charset: 'utf8mb4_unicode_ci',
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MysqlService],
  exports: [MysqlService],
})
export class MysqlModule {}
