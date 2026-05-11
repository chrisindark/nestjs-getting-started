import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration } from './configuration';
import { validateEnv } from './env.validation';

export interface AppConfigOptions {
  /**
   * Extra `.env` file paths to load in addition to the env-specific one.
   * Already resolved files (e.g. `.env.local`, `.env.staging`, `.env.production`)
   * are loaded automatically based on `NODE_ENV`.
   */
  envFilePath?: string | string[];
  /** Whether to register `ConfigModule` globally. Defaults to `true`. */
  isGlobal?: boolean;
}

function resolveEnvFile(): string {
  switch (process.env.NODE_ENV) {
    case 'prod':
    case 'production':
      return '.env.production';
    case 'staging':
      return '.env.staging';
    default:
      return '.env.local';
  }
}

@Module({})
export class AppConfigModule {
  static forRoot(options: AppConfigOptions = {}): DynamicModule {
    const { isGlobal = true, envFilePath } = options;
    const envFiles = [
      ...(Array.isArray(envFilePath)
        ? envFilePath
        : envFilePath
          ? [envFilePath]
          : []),
      resolveEnvFile(),
    ];

    return {
      module: AppConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal,
          cache: true,
          envFilePath: envFiles,
          load: [configuration],
          validate: validateEnv,
        }),
      ],
      exports: [ConfigModule],
    };
  }
}
