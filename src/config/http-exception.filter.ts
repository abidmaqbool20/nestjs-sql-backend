import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { CustomLoggerService } from '../modules/global/logger/logger.service';

@Catch(HttpException, QueryFailedError)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: CustomLoggerService,
  ) { }

  catch(
    exception: HttpException | QueryFailedError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    /**
     * Resolve HTTP status
     */
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST;

    /**
     * Resolve message
     */
    let message = 'Unknown error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        (exceptionResponse as any).message
      ) {
        message = (exceptionResponse as any).message;
      }
    } else if (exception instanceof QueryFailedError) {
      message = exception.message;
    }

    /**
     * Log error
     */
    this.logger.error('HTTP Exception', {
      statusCode: status,
      message,
      path: request?.url,
      method: request?.method,
      timestamp: new Date().toISOString(),
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    /**
     * Send response
     * (works for Fastify & Express)
     */
    response.status(status).send({
      statusCode: status,
      message,
    });
  }
}
