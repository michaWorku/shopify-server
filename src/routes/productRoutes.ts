import express from 'express'

import {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController'
import { UserRoles } from '../helpers/helpers'
import { ensureAuth } from '../middlewares/ensureAuth'
import { restrictTo } from '../middlewares/restrictTo'

const router = express.Router()

router
    .route('/')
        .get(getAllProducts)
        .post(ensureAuth,restrictTo(UserRoles.ADMIN),createProduct)

router
    .route('/:id')
        .get(getProduct)
        .put(ensureAuth,restrictTo(UserRoles.ADMIN), updateProduct)
        .delete(ensureAuth,restrictTo(UserRoles.ADMIN), deleteProduct)

export default router