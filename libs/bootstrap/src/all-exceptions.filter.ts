import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

interface ErrorPayload {
  statusCode: number;
  message: string;
  response: unknown;
  path?: string;
  success: false;
}

/**
 * Default filter wired in by `bootstrapHttpApp`. Handles both Fastify
 * (`.send()`) and Express (`.json()`) responses to stay portable while the
 * codebase migrates between adapters.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<{ url?: string }>();
    const response = ctx.getResponse<{
      status: (code: number) => {
        send?: (body: unknown) => void;
        json?: (body: unknown) => void;
      };
    }>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      isHttp && status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message
        : 'Internal server error';

    const exceptionResponse =
      isHttp && typeof exception.getResponse === 'function'
        ? exception.getResponse()
        : {};

    if (status >= 500) {
      this.logger.error(
        `${request?.url ?? 'unknown'} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const payload: ErrorPayload = {
      statusCode: status,
      message,
      response: exceptionResponse,
      path: request?.url,
      success: false,
    };

    const sender = response.status(status);
    if (typeof sender.send === 'function') {
      sender.send(payload);
    } else if (typeof sender.json === 'function') {
      sender.json(payload);
    }
  }
}
