import express from 'express'
import config from 'config'
import { createStripe } from '../controllers/stripeController'

const router = express.Router()

router.post('/payment', createStripe)

export default router