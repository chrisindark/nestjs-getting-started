import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Staging = 'staging',
  Production = 'prod',
}

/**
 * Whitelist of environment variables understood by every service.
 * Each service can extend this class for its own keys, or read raw
 * variables off `ConfigService.get(...)` as a fallback.
 */
export class EnvSchema {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsString()
  @IsNotEmpty()
  APP_NAME = 'nestjs-getting-started';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  APP_PORT = 3000;

  @IsString()
  @IsNotEmpty()
  APP_ADDRESS = '0.0.0.0';

  @IsOptional()
  @IsString()
  CORS_ORIGIN_WHITELIST?: string;

  @IsOptional()
  @IsString()
  CORS_ALLOW_METHODS?: string = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';

  @IsOptional()
  @IsString()
  CORS_ALLOW_HEADERS?: string = '*';

  @IsOptional()
  @IsString()
  BULL_QUEUE_HOST?: string = '127.0.0.1';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  BULL_QUEUE_PORT?: number = 6379;

  @IsOptional()
  @IsString()
  BULL_QUEUE_PASSWORD?: string;
}
