import {  Response, NextFunction } from 'express';
import {catchAsync } from '../helpers/catchAsync'
import AppError from '../helpers/appError'
import { getUserWithToken } from '../helpers/jwtHelper'
import { RequestCustom } from '../@types'

export const verifyToken = catchAsync(
    async (req:RequestCustom, _res: Response, next: NextFunction) => {
      const bearer = req.headers.authorization;
      if (!bearer) throw new AppError('Please log in to get access', 401);
  
      const token = bearer?.split(' ')[1];
      const user = await getUserWithToken(token);
  
      req.user = user;
  
      next();
    }
  );

export const verifyTokenAndAuthorization = catchAsync(
  async (req:RequestCustom, _res: Response, next: NextFunction) =>{
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        throw new AppError("You are not alowed to do that!",403);
      }
    });
  
  
export const verifyTokenAndAdmin = catchAsync(
  async (req:RequestCustom, _res: Response, next: NextFunction) =>{
    verifyToken(req, _res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        throw new AppError("You are not alowed to do that!",403);
      }
    }
    )
  }
  )