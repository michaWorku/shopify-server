import express from 'express'
import { register, login, forgotPassword, resetPassword } from '../controllers/authController'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword)

export default router