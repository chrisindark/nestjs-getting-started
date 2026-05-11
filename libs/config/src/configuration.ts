export const configuration = () => ({
  server: {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    address: process.env.APP_ADDRESS ?? '0.0.0.0',
  },
  cors: {
    origins: (process.env.CORS_ORIGIN_WHITELIST ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    methods: (
      process.env.CORS_ALLOW_METHODS ?? 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    )
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    allowedHeaders: (process.env.CORS_ALLOW_HEADERS ?? '*')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKER_URLS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  },
});

export type AppConfig = ReturnType<typeof configuration>;
