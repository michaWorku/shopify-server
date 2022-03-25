import express from 'express'

import {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController'
import { UserRoles } from '../helpers/helpers'
import { restrictTo } from '../middlewares/restrictTo'

const router = express.Router()

router
    .route('/')
        .get(getAllProducts)
        .post(restrictTo(UserRoles.ADMIN),createProduct)

router
    .route('/:id')
        .get(getProduct)
        .put(restrictTo(UserRoles.ADMIN), updateProduct)
        .delete(restrictTo(UserRoles.ADMIN), deleteProduct)

export default router