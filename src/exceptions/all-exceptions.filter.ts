import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // const args = host.getArgs();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    // console.error("exception", exception);
    // console.log("request", request.url, request.params, request.body);
    // console.log("response", response);

    // Send error to apm
    // apm.captureError(
    //   exception,
    //   {
    //     request: request,
    //     custom: {
    //       url: request.url,
    //       headers: request.headers,
    //       body: request.body,
    //       params: request.params,
    //     },
    //   },
    //   (err, id) => {
    //     // console.debug(err, id);
    //   },
    // );

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // This parameter is only set to show message for client side
    const message =
      exception instanceof HttpException
        ? exception.getStatus() !== 500
          ? exception.message
          : 'Internal server error'
        : 'Internal server error';

    const exceptionResponse = exception.response ? exception.response : {};

    // response.status(status).json({
    //   statusCode: status,
    //   message,
    //   response: exceptionResponse,
    //   path: request.url,
    //   success: false,
    // });
    response.status(status).send({
      statusCode: status,
      message,
      response: exceptionResponse,
      path: request.url,
      success: false,
    });
  }
}
