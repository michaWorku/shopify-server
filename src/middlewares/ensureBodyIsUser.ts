import {  Response, NextFunction } from 'express';
import {catchAsync } from '../helpers/catchAsync'
import AppError from '../helpers/appError'
import { RequestCustom } from '../@types'

export const ensureBodyIsUser = catchAsync(
    async (req:RequestCustom, _res: Response, next: NextFunction) =>{
        if (req.user.id === req.params.id || req.user.isAdmin) {
          next();
        } else {
          throw new AppError("You are not alowed to do that!",403);
        }
    }
);