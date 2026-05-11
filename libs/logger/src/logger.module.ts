import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { CorrelationService } from './correlation.service';
import { PinoFactoryOptions, createPinoOptions } from './pino.factory';

/**
 * Single import for every app's root module:
 *
 *   imports: [AppLoggerModule.forRoot({ appName: 'api' })]
 *
 * Provides:
 *   - `Logger` (from nestjs-pino) as the Nest `LoggerService`
 *   - `CorrelationService` for explicit ALS access
 *
 * Apps still need to do `app.useLogger(app.get(Logger))` in their main
 * file so Nest's built-in logs flow through pino. The bootstrap
 * helpers do that automatically.
 */
@Global()
@Module({})
export class AppLoggerModule {
  static forRoot(options: PinoFactoryOptions): DynamicModule {
    return {
      module: AppLoggerModule,
      imports: [PinoLoggerModule.forRoot(createPinoOptions(options))],
      providers: [CorrelationService],
      exports: [PinoLoggerModule, CorrelationService],
    };
  }
}
