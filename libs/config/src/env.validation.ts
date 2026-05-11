import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { EnvSchema } from './env.schema';

export function validateEnv(raw: Record<string, unknown>): EnvSchema {
  const parsed = plainToInstance(EnvSchema, raw, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(parsed, {
    skipMissingProperties: false,
    whitelist: false,
    forbidNonWhitelisted: false,
  });
  if (errors.length > 0) {
    const message = errors
      .map(
        (e) =>
          `${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`,
      )
      .join('; ');
    throw new Error(`Invalid environment variables: ${message}`);
  }
  return parsed;
}
