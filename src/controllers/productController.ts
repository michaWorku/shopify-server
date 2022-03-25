import { catchAsync } from '../helpers/catchAsync'
import {  Response, NextFunction } from 'express';
import { RequestCustom } from '../@types'
import ProductModel from '../models/productModel';
import AppError from '../helpers/appError'

//@desc Create Product 
//@route POST '/api/products/'
//@access private
const createProduct = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const savedProduct = await ProductModel.create(req.body)

    res.status(200).json({
        status: 'success',
        data : savedProduct
    })
})

//@desc Get All Products 
//@route GET '/api/products/'
//@access private
const getAllProducts = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    let products;

    if (qNew) {
      products = await ProductModel.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await ProductModel.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await ProductModel.find();
    }
   
    
    res.status(200).json({
        status: 'success',
        data: products
    });
})

//@desc Get Product 
//@route GET '/api/Products/:id'
//@access private
const getProduct = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const product = await ProductModel.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data : product
    });
})

//@desc Update Product 
//@route PUT '/api/Products/:id'
//@access private
const updateProduct = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    const updatedProduct = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        { new: true }
        );
        res.status(200).json({
            status: 'success',
            data : updatedProduct
        });
})

//@desc Delete Product 
//@route DELETE '/api/Products/:id'
//@access private
const deleteProduct = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    await ProductModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status:'success',
        message: "The Product has been deleted..."
    });
})



export {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct
}