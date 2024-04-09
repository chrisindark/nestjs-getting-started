import { createLogger, format, transports } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const winstonLogger = createLogger({
  level: 'debug',
  exitOnError: false,
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.ms(),
        nestWinstonModuleUtilities.format.nestLike('Nest', {
          colors: true,
          prettyPrint: true,
        }),
      ),
      handleExceptions: true,
    }),
  ],
});

export default winstonLogger;
