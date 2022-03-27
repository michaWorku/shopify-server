import { NextFunction, Request, Response } from "express";
import { RequestCustom } from "../@types";

export function catchAsync(fn: any) {
  return async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
