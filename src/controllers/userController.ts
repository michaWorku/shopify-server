import { catchAsync } from '../helpers/catchAsync'
import {  Response, NextFunction } from 'express';
import { RequestCustom } from '../@types'
import UserModel from '../models/userModel';
import AppError from '../helpers/appError'
import {
  deleteOne,
  updateOne,
  createOne,
  getAll,
  getOne,
} from './HandlerFactory';
import { filterObj } from '../helpers/helpers';
import { createSendToken } from './authController';

//@desc Get All Users 
//@route GET '/api/users/'
//@access private
const getAllUsers = getAll(UserModel);

//@desc Get a User
//@route GET '/api/users/:id'
//@access private
const getUser = getOne(UserModel, [['_id', 'id']]);

//@desc Update User 
//@route PUT '/api/users/:id'
//@access private
const updateUser = updateOne(UserModel);

//@desc Delete User 
//@route DELETE '/api/users/:id'
//@access private
const deleteUser = deleteOne(UserModel);

//@desc Create a User 
//@route POST '/api/users/'
//@access private
const createUser = createOne(UserModel);

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

//@desc Update current user
//@route PATCH '/api/users/updateMe'
//@access private
const updateMe = catchAsync(
  async (req: RequestCustom, res: Response, _next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm)
      throw new AppError('Password cant be updated through here', 400);

    const updateFields = filterObj(req.body, 'name', 'email');

    const user = await UserModel.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
    });

    createSendToken(user, 200, res);
  }
);

//@desc Deactivate current user
//@route DELETE '/api/users/deleteMe'
//@access private
const deleteMe = catchAsync(
  async (req: RequestCustom, res: Response, _next: NextFunction) => {
    await UserModel.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
    });
  }
);

export {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserStats,
    updateMe,
    deleteMe
}
