import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { CustomLoggerService } from '../modules/global/logger/logger.service';
import { QueryFailedError } from 'typeorm';
import { FastifyReply } from 'fastify'; // Import FastifyReply
import { Request } from 'express'; // Import Request if needed for context logging

@Catch(HttpException, QueryFailedError)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: HttpException | QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>(); // Get FastifyReply
    const request = ctx.getRequest<Request>(); // Get the request for logging purposes

    // Determine the HTTP status
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.BAD_REQUEST;

    // Extract the response message
    const exceptionResponse = exception instanceof HttpException
      ? exception.getResponse()
      : exception.message;

    const message = typeof exceptionResponse === 'string'
      ? exceptionResponse
      : (exceptionResponse as any).message || 'Unknown error';

    // Log the error
    this.logger.error(`HTTP Exception: ${message}`, {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url, // Log the request path
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // Send the response using Fastify's send() method
    response.status(status).send({
      statusCode: status,
      message,
    });
  }
}
