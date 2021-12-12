export default () => ({
  server: {
    port: parseInt(process.env.SERVER_PORT, 10) || 4000,
  },
  kafka: {
    brokers: process.env.KAFKA_BROKER_URLS,
  },
});
