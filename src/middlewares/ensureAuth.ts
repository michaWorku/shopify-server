import {  Response, NextFunction } from 'express';
import {catchAsync } from '../helpers/catchAsync'
import AppError from '../helpers/appError'
import { getTokenInfo, getUserWithToken } from '../helpers/jwtHelper'
import { RequestCustom } from '../@types'
import { JWTLoginType } from '../@types/JWTLoginType/JWTLoginType';

export const ensureAuth = catchAsync(
    async (req:RequestCustom, _res:Response, next:NextFunction) => {
      
      const bearer = req.headers.authorization;
      if (!bearer) throw new AppError('Please log in to get access', 401);
  
      const [, token] = bearer.split(' ');
      const user = await getUserWithToken(token);

      const { iat } = await getTokenInfo<JWTLoginType>(token);

      if (user.changedPasswordAfter(iat))
        throw new AppError('Token expired, please login again!', 401);
  
      req.user = user;
  
      next();
    }
  );
