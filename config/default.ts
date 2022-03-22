import dotenv from 'dotenv'

dotenv.config()

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOCAL_DB_URI: process.env.MONGO_LOCAL,
  DB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN
}