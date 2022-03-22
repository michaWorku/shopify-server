import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './connect/db'
import log from './services/logger'
import config from 'config'
import morgan from 'morgan'
import errorHandler from './middlewares/errorHandler'
import { notReachableRouteHandler } from './middlewares/notReachableRouteHandler'

import authRouter from './routes/authRoutes'
import userRouter from './routes/userRoutes'
import productRouter from './routes/productRoutes'
import cartRouter from './routes/cartRoutes'


dotenv.config();

connectDB()

const app: Express = express();

app.use(helmet());
const nodeEnv = config.get('NODE_ENV') as string
if (nodeEnv) app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello Shopify API!</h1>');
});

const PORT: String = config.get('PORT') as string

app.use('api/auth', authRouter)
app.use('api/users', userRouter)
app.use('api/products', productRouter)
app.use('api/carts', cartRouter)


app.all('*', notReachableRouteHandler);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));

process.on('unhandledRejection', (err: Error) => {
  log.error(`Name: ${err.name}`);
  log.error(`Message: ${err.message}`);
  log.error('UNHANDLED REJECTION! 🧨 SHUTTING DOWN!');
  process.exit(1)
});