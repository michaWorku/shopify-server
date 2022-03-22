import { NextFunction, Request, Response } from "express";

export function catchAsync(fn: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res);
    } catch (err) {
      next(err);
    }
  };
}