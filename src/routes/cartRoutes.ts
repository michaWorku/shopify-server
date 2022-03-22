import express from 'express'
import {verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin, } from '../middlewares/protect'

import {
    createCart,
    getAllCarts,
    getCart,
    updateCart,
    deleteCart,
    getUserCart
} from '../controllers/cartController'

const router = express.Router()

router
    .route('/')
        .get(verifyTokenAndAdmin, getAllCarts)
        .post(verifyToken,createCart)

router
    .route('/:id')
        .get(verifyTokenAndAdmin, getCart)
        .put(verifyTokenAndAuthorization, updateCart)
        .delete(verifyTokenAndAuthorization, deleteCart)

router.get('/find/:userId', getUserCart)
export default router