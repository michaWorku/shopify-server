import { Response, NextFunction } from "express";
import { NotReachableError } from "../@types/errors/NotReachableError";
import { RequestCustom } from '../@types'

export const notReachableRouteHandler = (req: RequestCustom, _res: Response, next: NextFunction) => {
  const error = new NotReachableError(req.originalUrl);

  next(error);
}