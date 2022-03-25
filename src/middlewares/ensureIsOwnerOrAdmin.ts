import {  Response, NextFunction } from 'express';
import {catchAsync } from '../helpers/catchAsync'
import AppError from '../helpers/appError'
import { RequestCustom } from '../@types'

export const ensureIsOwnerOrAdmin = catchAsync(
  async (req:RequestCustom, _res: Response, next: NextFunction) =>{

    const isOwner = req.user._id === req.params.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) throw new AppError("Access denied: not owner.!",403);
    
    next()
  }
  )