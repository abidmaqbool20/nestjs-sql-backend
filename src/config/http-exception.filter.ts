import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { CustomLoggerService } from '@/logger/logger.service';
import { QueryFailedError } from 'typeorm';

@Catch(HttpException, QueryFailedError)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: HttpException | QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.BAD_REQUEST;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : exception.message;

    // Extract message from exception response
    const message = typeof exceptionResponse === 'string'
      ? exceptionResponse
      : (exceptionResponse as any).message || 'Unknown error';

    // Log the exception details
    this.logger.error(`HTTP Exception: ${message}`, {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // Send the response to the client
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
