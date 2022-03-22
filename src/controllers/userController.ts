import { catchAsync } from '../helpers/catchAsync'
import {  Response, NextFunction } from 'express';
import { RequestCustom } from '../@types'
import UserModel from '../models/userModel';
import AppError from '../helpers/appError'
import CryptoJS from 'crypto-js'
import config from 'config'

//@desc Update User 
//@route PUT '/api/users/:id'
//@access private
const updateUser = catchAsync(async ( req: RequestCustom, res: Response, _next: NextFunction)=>{

    if(req.user.id !== req.params.id || req.user.isAdmin)
        throw new AppError("You can update only your account!", 403)  
    
    if(req.body.password){
        const jwtSecret = config.get('JWT_SECRET') as string
        req.body.password = CryptoJS.AES.encrypt(req.body.password, jwtSecret).toString()

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
        
        res.status(200).json({
            status: 'success',
            data: { updatedUser },
          });
    }
})

//@desc Delete User 
//@route DELETE '/api/users/:id'
//@access private
const deleteUser = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    if(req.user.id !== req.params.id || req.user.isAdmin)
        throw new AppError("You can delete only your account!", 403)  
    
    const document = await UserModel.findByIdAndDelete(req.params.id);

    if (!document) throw new AppError(`ID (${req.params.id}) not found!`, 404);

    res.status(204).json({
        status: 'success',
        data: null,
      });
})

//@desc Get All Users 
//@route GET '/api/users/'
//@access private
const getAllUsers = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const query = req.query.new;
    if(!req.user.isAdmin){
        throw new AppError("You are not allowed to see all users!", 403)
    }

    const users = query
        ? await UserModel.find().sort({ _id: -1 }).limit(5)
        : await UserModel.find();
      res.status(200).json({status: 'success', data: users});
})

//@desc Get User Stats 
//@route GET '/api/stats'
//@access private
const getUserStats = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    const data = await UserModel.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
        status: 'success', data
    })
})

export {
    updateUser,
    deleteUser,
    getAllUsers,
    getUserStats
}
