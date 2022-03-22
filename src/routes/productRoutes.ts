import express from 'express'
import { verifyTokenAndAuthorization,
    verifyTokenAndAdmin, } from '../middlewares/protect'

import {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController'

const router = express.Router()

router
    .route('/')
        .get(getAllProducts)
        .post(verifyTokenAndAdmin,createProduct)

router
    .route('/:id')
        .get(getProduct)
        .put(verifyTokenAndAdmin, updateProduct)
        .delete(verifyTokenAndAdmin, deleteProduct)

export default router