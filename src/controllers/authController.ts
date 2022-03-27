import { catchAsync } from '../helpers/catchAsync'
import {  Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config'
import { User } from '../@types/models/User';
import { createHash } from 'crypto';
import UserModel from '../models/userModel';
import AppError from '../helpers/appError'
import { getUserWithToken } from '../helpers/jwtHelper'
import { RequestCustom } from '../@types'
import { filterObj } from '../helpers/helpers';
import { sendEmail } from '../helpers/sendEmail';


// sign Token
const signToken = (id: string) => {
    const jwtSecret = config.get('JWT_SECRET') as string
    const expiresIn = config.get('JWT_EXPIRES') as string
    return jwt.sign({ id }, jwtSecret, { expiresIn });
  };

// Create Send Token
export const createSendToken = (
    user: any,
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
    user.passwordChangedAt = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: { user },
    });
  };
  

//@desc Singup a user
//@route POST '/api/auth/signup'
//@access public
const signup = catchAsync( async (req:RequestCustom, res: Response, _next:NextFunction)=>{
    const jwtSecret= config.get('JWT_SECRET') as string
    
    const userInfo = filterObj(
      req.body,
      'name',
      'email',
      'password',
      'passwordConfirm',
      'role'
    );

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
      user = await getUserWithToken(token)
    } else {
      user = await UserModel.findOne({ email }).select("+password");

      if (!user || !(await user.correctPassword(password, user.password as string)))
        throw new AppError(`Invalid email or password`, 401);
      
    }

    createSendToken(user, 201, res);
})

const signout = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const cookieOptions = {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    };
    res.cookie("jwt", "chawchaw", cookieOptions);
    res.status(200).json({ status: "success" });
  }
);

//@desc forgot password controller
//@route POST '/api/auth/forgotPassword'
//@access public
const forgotPassword = catchAsync( async (req:RequestCustom, res: Response, next:NextFunction)=>{
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user)
    throw new AppError('There is no user with that email address', 404);

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and an passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      message,
      subject: 'Reset Password',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError(
      'There was an error sending the email, please try again!',
      500
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!',
  });
})

//@desc reset password controller
//@route POST '/api/auth/resetPassowrd/:token'
//@access public
const resetPassword = catchAsync( async (req:RequestCustom, res: Response, next:NextFunction)=>{
  const hashedToken = createHash('sha256')
  .update(req.params.token)
  .digest('hex');

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    throw new AppError(
      'Token invalid or expired, please issue a new one.',
      403
    );

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
})

//@desc update password controller
//@route POST '/api/auth/updatePassword/:token'
//@access public
const updatePassword = catchAsync(
  async (req: RequestCustom, res: Response, _next: NextFunction) => {
    const user = await UserModel.findById(req.user.id).select('+password');

    if (!user?.correctPassword(req.body.password, user.password as string))
      throw new AppError('Password is wrong, try again.', 401);

    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
    });
  }
);

export  {
    signup,
    login,
    signout,
    forgotPassword,
    resetPassword,
    updatePassword
}