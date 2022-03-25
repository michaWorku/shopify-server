import { catchAsync } from '../helpers/catchAsync'
import {  Response, NextFunction } from 'express';
import { RequestCustom } from '../@types'
import OrderModel from '../models/Order';
import AppError from '../helpers/appError'

//@desc Create Order 
//@route POST '/api/orders/'
//@access private
const createOrder = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const savedOrder = await OrderModel.create(req.body)

    res.status(200).json({
        status: 'success',
        data : savedOrder
    })
})

//@desc Get All Orders 
//@route GET '/api/orders/'
//@access private
const getAllOrders = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const orders = await OrderModel.find()
    
    res.status(200).json({
        status: 'success',
        data: orders
    });
})

//@desc Get Order 
//@route GET '/api/orders/:id'
//@access private
const getOrder = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const order = await OrderModel.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data : order
    });
})

//@desc Get User Order 
//@route GET '/api/orders/:userId'
//@access private
const getUserOrders = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const orders = await OrderModel.find({ userId: req.params.userId });
    res.status(200).json({
        status: 'success',
        data : orders
    });
})

//@desc Get current user order 
//@route GET '/api/orders/myOrders'
//@access private
const getMyOrders = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
  const orders = await OrderModel.find({ userId: req.user.id });
  res.status(200).json({
      status: 'success',
      data : orders
  });
})

//@desc Update Order 
//@route PUT '/api/Orders/:id'
//@access private
const updateOrder = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const updatedOrder = await OrderModel.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        { new: true }
        );
        res.status(200).json({
            status: 'success',
            data : updatedOrder
        });
})

//@desc Delete Order 
//@route DELETE '/api/Orders/:id'
//@access private
const deleteOrder = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    await OrderModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status:'success',
        message: "The Order has been deleted..."
    });
})

//@desc Get Monthly Income
//@route DELETE '/api/orders/income'
//@access private
const getMonthlyIncome = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    const income = await OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: previousMonth },
            ...(productId && {
              products: { $elemMatch: { productId } },
            }),
          },
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);

    
      res.status(200).json({
        status: 'success',
        data : income
    });
})

export {
    createOrder,
    getAllOrders,
    getOrder,
    updateOrder,
    deleteOrder,
    getUserOrders,
    getMyOrders,
    getMonthlyIncome
}