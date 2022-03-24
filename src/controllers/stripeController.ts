import { catchAsync } from '../helpers/catchAsync'
import {  Response, NextFunction } from 'express';
import { RequestCustom } from '../@types'
// import stripe from 'stripe'
import AppError from '../helpers/appError'
import config from 'config'

// const KEY = config.get('STRIPE_KEY') as string
// const stripe = stripe(KEY)

//@desc Stripe payment
//@route POST '/checkout/payment/'
//@access private
export const createStripe = catchAsync(async ( req: RequestCustom, res: Response, next: NextFunction)=>{
    // stripe.charges.create(
    //     {
    //       source: req.body.tokenId,
    //       amount: req.body.amount,
    //       currency: "usd",
    //     },
    //     (stripeErr:any, stripeRes:any) => {
    //       if (stripeErr) {
    //           throw new AppError(stripeErr, 500)
    //       } else {
    //         res.status(200).json({
    //             status: 'success',
    //             data : stripeRes
    //         })
            
    //       }
    //     }
    //   );
})
