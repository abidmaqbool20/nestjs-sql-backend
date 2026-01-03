import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class ResponseService {

  sendResponse(res: any, message: string, data?: any) {
    const status = res.statusCode;

    switch (status) {
      case HttpStatus.OK:
        return this.sendSuccess(res, message || 'Successful', data);
      case HttpStatus.CREATED:
        return this.sendCreated(res, message || 'Created Successfully', data);
      case HttpStatus.BAD_REQUEST:
        return this.sendBadRequest(res, message || 'Unsuccessful', data);
      case HttpStatus.UNAUTHORIZED:
        return this.sendUnauthorized(res, message || 'Unauthorized');
      case HttpStatus.FORBIDDEN:
        return this.sendForbidden(res, message || 'This action is forbidden');
      case HttpStatus.NOT_FOUND:
        return this.sendNotFound(res, message || 'Not found!');
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return this.sendInternalError(res, message || 'Error occurred.', data);
      default:
        return res.status(status).send({ message: message || 'Response' });
    }
  }

  sendSuccess(res: any, message: string, data?: any) {
    return res.status(HttpStatus.OK).send({ message, data });
  }

  sendCreated(res: any, message: string, data?: any) {
    return res.status(HttpStatus.CREATED).send({ message, data });
  }

  sendBadRequest(res: any, message: string, errors?: any) {
    return res.status(HttpStatus.BAD_REQUEST).send({ message, errors });
  }

  sendUnauthorized(res: any, message: string) {
    return res.status(HttpStatus.UNAUTHORIZED).send({ message });
  }

  sendForbidden(res: any, message: string) {
    return res.status(HttpStatus.FORBIDDEN).send({ message });
  }

  sendNotFound(res: any, message: string) {
    return res.status(HttpStatus.NOT_FOUND).send({ message });
  }

  sendInternalError(res: any, message: string, error?: any) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message, error });
  }
}
