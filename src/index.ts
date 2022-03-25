import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './connect/db'
import log from './services/logger'
import config from 'config'
import morgan from 'morgan'
import cors from 'cors'
import cookiParser from 'cookie-parser'
import mongoSanitize from "express-mongo-sanitize"
import  xss from "xss-clean"
import { rateLimit } from 'express-rate-limit';
import errorHandler from './middlewares/errorHandler'
import { notReachableRouteHandler } from './middlewares/notReachableRouteHandler'

import authRouter from './routes/authRoutes'
import userRouter from './routes/userRoutes'
import productRouter from './routes/productRoutes'
import cartRouter from './routes/cartRoutes'
import orderRouter from './routes/orderRoutes'
import stripeRouter from './routes/stripeRoute'

dotenv.config();

connectDB()

const app: Express = express();

app.use(helmet());
const nodeEnv = config.get('NODE_ENV') as string
if (nodeEnv) app.use(morgan('dev'));

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
});
app.use("/api", limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors())
// Cooki parser from cookies
app.use(cookiParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello Shopify API!</h1>');
});

const PORT: String = config.get('PORT') as string

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/orders', orderRouter)
app.use('/api/checkout', stripeRouter)

app.all('*', notReachableRouteHandler);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));

process.on('unhandledRejection', (err: Error) => {
  log.error(`Name: ${err.name}`);
  log.error(`Message: ${err.message}`);
  log.error('UNHANDLED REJECTION! 🧨 SHUTTING DOWN!');
  process.exit(1)
});