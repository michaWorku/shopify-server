import {  Response, NextFunction } from 'express';
import AppError from '../helpers/appError'
import { RequestCustom } from '../@types'
import { UserRoles } from '../helpers/helpers';

type roles =
| UserRoles.ADMIN
| UserRoles.USER;

export const restrictTo = (...roles: roles[]) => {
return (req: RequestCustom, _res: Response, next: NextFunction) => {
  if (!roles.includes(req.user.role))
    throw new AppError(
      'You do not have permission to perform this action.',
      403
    );

  next();
};
};