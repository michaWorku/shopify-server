import mongoose from 'mongoose'
import { User } from '../@types/models/User'

const UserSchema = new mongoose.Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    img: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
