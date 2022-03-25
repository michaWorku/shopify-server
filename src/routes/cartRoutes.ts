import express from 'express'
import {
    createCart,
    getAllCarts,
    getCart,
    updateCart,
    deleteCart,
    getUserCart,
    getMyCart
} from '../controllers/cartController'
import { ensureAuth } from '../middlewares/ensureAuth'
import { UserRoles } from '../helpers/helpers'
import { restrictTo } from '../middlewares/restrictTo'
import { ensureIsOwnerOrAdmin } from '../middlewares/ensureIsOwnerOrAdmin'

const router = express.Router()

router
    .route('/')
        .get(restrictTo(UserRoles.ADMIN), getAllCarts)
        .post(ensureAuth,createCart)

router
    .route('/:id')
        .get(restrictTo(UserRoles.ADMIN), getCart)
        .put(ensureIsOwnerOrAdmin, updateCart)
        .delete(ensureIsOwnerOrAdmin, deleteCart)

router.get('/:userId', restrictTo(UserRoles.ADMIN), getUserCart)
router.get('/myCarts', ensureIsOwnerOrAdmin, getMyCart)

export default router