import {  Response, NextFunction } from 'express';
import {catchAsync } from '../helpers/catchAsync'
import AppError from '../helpers/appError'
import { getUserWithToken } from '../helpers/jwtHelper'
import { RequestCustom } from '../@types'


export const ensureAuth = catchAsync(
    async (req:RequestCustom, _res: Response, next: NextFunction) => {
      const bearer = req.headers.authorization;
      if (!bearer) throw new AppError('Please log in to get access', 401);
  
      const [, token] = bearer.split(' ');
      const user = await getUserWithToken(token);
  
      req.user = user;
  
      next();
    }
  );
