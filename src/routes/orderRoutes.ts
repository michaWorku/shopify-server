import express from 'express'

import {
    createOrder,
    getAllOrders,
    getOrder,
    updateOrder,
    deleteOrder,
    getUserOrders,
    getMonthlyIncome,
    getMyOrders
} from '../controllers/orderController'
import { UserRoles } from '../helpers/helpers';
import { ensureAuth } from '../middlewares/ensureAuth';
import { ensureIsOwnerOrAdmin } from '../middlewares/ensureIsOwnerOrAdmin';
import { restrictTo } from '../middlewares/restrictTo';

const router = express.Router()
router.use(ensureAuth);
router.get('/find/:userId', getUserOrders)

router
    .route('/')
        .get(restrictTo(UserRoles.ADMIN), getAllOrders)
        .post(ensureIsOwnerOrAdmin,createOrder)



router.get('/myOrders', ensureIsOwnerOrAdmin, getMyOrders)

router
    .route('/:id')
        .get(getOrder)
        .put(restrictTo(UserRoles.ADMIN), updateOrder)
        .delete(restrictTo(UserRoles.ADMIN), deleteOrder)

router.use(restrictTo(UserRoles.ADMIN));

router.get('/:userId', getUserOrders)
router.get('/income', getMonthlyIncome)

export default router