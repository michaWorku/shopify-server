import { catchAsync } from '../helpers/catchAsync'
import {  Response, NextFunction } from 'express';
import { RequestCustom } from '../@types'
import CartModel from '../models/Cart';
import AppError from '../helpers/appError'

//@desc Create Cart 
//@route POST '/api/carts/'
//@access private
const createCart = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const savedCart = await CartModel.create(req.body)

    res.status(200).json({
        status: 'success',
        data : savedCart
    })
})

//@desc Get All Carts 
//@route GET '/api/carts/'
//@access private
const getAllCarts = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const carts = await CartModel.find()
    
    res.status(200).json({
        status: 'success',
        data: carts
    });
})

//@desc Get Cart 
//@route GET '/api/carts/:id'
//@access private
const getCart = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const cart = await CartModel.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data : cart
    });
})

//@desc Get User Cart 
//@route GET '/api/carts/find/:userId'
//@access private
const getUserCart = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const cart = await CartModel.findById(req.params.userId);
    res.status(200).json({
        status: 'success',
        data : cart
    });
})

//@desc Get My Cart 
//@route GET '/api/carts/:myCart'
//@access private
const getMyCart = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const cart = await CartModel.findOne({ userId: req.user.id });
    res.status(200).json({
        status: 'success',
        data : cart
    });
})

//@desc Update Cart 
//@route PUT '/api/carts/:id'
//@access private
const updateCart = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const updatedCart = await CartModel.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        { new: true }
        );
        res.status(200).json({
            status: 'success',
            data : updatedCart
        });
})

//@desc Delete Cart 
//@route DELETE '/api/carts/:id'
//@access private
const deleteCart = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    await CartModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status:'success',
        message: "The Cart has been deleted..."
    });
})



export {
    createCart,
    getAllCarts,
    getCart,
    updateCart,
    deleteCart,
    getUserCart,
    getMyCart
}