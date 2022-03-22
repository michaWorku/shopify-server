import { catchAsync } from '../helpers/catchAsync'
import {  Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config'
import { User } from '../@types/models/User';
import CryptoJS from 'crypto-js';
import UserModel from '../models/userModel';
import AppError from '../helpers/appError'
import { getUserWithToken } from '../helpers/jwtHelper'
import { RequestCustom } from '../@types'


// sign Token
const signToken = (id: string) => {
    const jwtSecret = config.get('JWT_SECRET') as string
    const expiresIn = config.get('JWT_EXPIRES') as string
    return jwt.sign({ id }, jwtSecret, { expiresIn });
  };

// Create Send Token
export const createSendToken = (
    user: User,
    statusCode: number,
    res: Response
  ) => {
    const token = signToken(user._id);
    const expirationInDays = Number(config.get('JWT_COOKIE_EXPIRES_IN') as string)
    
    const cookieOptions = {
      expires: new Date(Date.now() + expirationInDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    };
    const nodeEnv = config.get('NODE_ENV') as string
    if (nodeEnv) cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
  
    user.password = undefined;
    
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: { user },
    });
  };
  

//@desc Register a user
//@route POST '/api/auth/register'
//@access public
const register = catchAsync( async (req:RequestCustom, res: Response, _next:NextFunction)=>{
    const jwtSecret= config.get('JWT_SECRET') as string
    const userInfo = {
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          jwtSecret
        ).toString(),
      }

      const user = await UserModel.create(userInfo);
      createSendToken(user, 201, res);
})


//@desc Login a user
//@route POST '/api/auth/login'
//@access public
const login = catchAsync( async (req:RequestCustom, res: Response, _next:NextFunction)=>{
    let { token, email, password } = req.body;
    let user;

    if ((!email || !password) && !token)
      throw new AppError('User credentials needed', 400);

    if (token) {
      user = await getUserWithToken(token);
    } else {
      user = await UserModel.findOne({ email })

      if( user ){
        const jwtSecret = config.get('JWT_SECRET') as string
        const bytes = CryptoJS.AES.decrypt(user.password as string, jwtSecret);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        if(originalPassword !== req.body.password)
            throw new AppError(`Invalid email or password`, 401);
      } else{
        throw new AppError(`Invalid email or password`, 401);
      }
    }

    createSendToken(user, 201, res);
})

//TODO:
//@desc forgot password controller
//@route POST '/api/auth/forgotPassword'
//@access public
const forgotPassword = catchAsync( async (req:RequestCustom, res: Response, next:NextFunction)=>{

})

//TODO:
//@desc reset password controller
//@route POST '/api/auth/resetPassowrd'
//@access public
const resetPassword = catchAsync( async (req:RequestCustom, res: Response, next:NextFunction)=>{

})

export  {
    register,
    login,
    forgotPassword,
    resetPassword
}