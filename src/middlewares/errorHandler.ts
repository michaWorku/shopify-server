import { NextFunction, Response, Request } from 'express';
import { Error } from 'mongoose';;
import  AppError  from '../helpers/appError';
import { RequestCustom } from '../@types'

const handleCastErrorDB = (err: Error.CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any): AppError => {
  const message = `Duplicated field value: ${err.keyValue.name}. Please use another value`;
  return new AppError(message, 400);
};

const handleMultipleMongooseErrors = (err: any): AppError => {
  const allErrors = Object.values(err.errors);

  const startingMessage = `${
    allErrors.length > 1 ? 'Multiple' : 'A'
  } Validation Error${allErrors.length > 1 ? 's' : ''} Found:`;

  const message = allErrors.reduce(
    (prev: string, el: any) => `${prev} | ${el.path}: ${el.message}`,
    startingMessage
  );

  return new AppError(message, err.statusCode);
};

const handleJWTError = () =>
  new AppError('Invalid token, please login again!', 401);

const handleJWTExpired = () =>
  new AppError('Your token has expired" Please login again!', 401);

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

const errorHandler = (
  err: any,
  _req: RequestCustom,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? 'error';
  if (process.env.NODE_ENV === 'development') return sendErrorDev(err, res);

  let error;
  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err?.errors) error = handleMultipleMongooseErrors(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpired();
  if (error === undefined) return sendErrorProd(err, res);
  sendErrorProd(error, res);
};

export default errorHandler