import {  Response, NextFunction } from 'express';
import { RequestCustom } from '../@types'

export const getMe = (
    req: RequestCustom,
    _res: Response,
    next: NextFunction
  ) => {
    req.params.id = req.user.id;
    next();
  };