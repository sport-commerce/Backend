export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeErrors(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  data: null;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      data: null,
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode = 400;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = 404;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class UnAuthorizedError extends CustomError {
  statusCode = 401;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class FileSizeError extends CustomError {
  statusCode = 403;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = 500;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}
