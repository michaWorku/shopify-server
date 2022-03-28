import mongoose from 'mongoose'
import { Product } from '../@types/models/Product'

const ProductSchema = new mongoose.Schema<Product>(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    photo: { type: String, required: true },
    categories: { type: [String] },
    size: { type: [String] },
    color: { type: [String] },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
