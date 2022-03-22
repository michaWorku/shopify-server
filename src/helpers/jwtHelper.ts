import jwt from 'jsonwebtoken'
import { promisify } from 'util';
import {JWTLoginType} from '../@types/JWTLoginType/JWTLoginType'
import UserModel from '../models/userModel';
import AppError from './appError'
import config from 'config'

export const getTokenInfo = async <T>(token: string): Promise<T> => {
    const jwtSecret = config.get('JWT_SECRET') as string
    return (await promisify(jwt.verify)(
      token,
      // @ts-ignore
      jwtSecret
    )) as unknown as T;
  };
  
export const getUserWithToken = async (token: string) => {
const tokenInfo = await getTokenInfo<JWTLoginType>(token);
const user = await UserModel.findOne({ _id: tokenInfo.id });

if (!user) throw new AppError(`User no longer exists!`, 401);
return user;
};