import mongoose, { Schema} from 'mongoose';
import { Cart } from '../@types/models/Cart'

const CartSchema = new mongoose.Schema<Cart>(
    {
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'User' 
    },
        products: [
          {
            productId: {
              type: String,
            },
            quantity: {
              type: Number,
              default: 1,
            },
          },
        ],
      },
      { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
