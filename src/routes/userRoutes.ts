import express from 'express'
import { verifyTokenAndAuthorization,
    verifyTokenAndAdmin, } from '../middlewares/protect'
import {
    updateUser,
    deleteUser,
    getAllUsers,
    getUserStats
} from '../controllers/userController'
const router = express.Router()



router
    .route('/:id')
        .put(verifyTokenAndAuthorization, updateUser)
        .delete(verifyTokenAndAuthorization,deleteUser)

router.get('/', verifyTokenAndAdmin, getAllUsers)

router.get('/stats',verifyTokenAndAdmin, getUserStats)

export default router