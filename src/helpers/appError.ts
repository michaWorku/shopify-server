export default class AppError extends Error {
    public status: string;
    public isOperational: boolean;
    constructor(message: string, public statusCode: number) {
      super(message);
      this.status = `${statusCode}`.charAt(0) === '4' ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }