import express from 'express'
import {verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin, } from '../middlewares/protect'

import {
    createOrder,
    getAllOrders,
    getOrder,
    updateOrder,
    deleteOrder,
    getUserOrders,
    getMonthlyIncome
} from '../controllers/orderController'

const router = express.Router()

router
    .route('/')
        .get(verifyTokenAndAdmin, getAllOrders)
        .post(verifyToken,createOrder)

router
    .route('/:id')
        .get(verifyTokenAndAdmin, getOrder)
        .put(verifyTokenAndAdmin, updateOrder)
        .delete(verifyTokenAndAdmin, deleteOrder)

router.get('/find/:userId', verifyTokenAndAuthorization, getUserOrders)

router.get('/income', verifyTokenAndAdmin, getMonthlyIncome)

export default router