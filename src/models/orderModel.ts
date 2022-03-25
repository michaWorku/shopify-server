import mongoose, { Schema} from 'mongoose';
import { Order } from '../@types/models/Order'

const OrderSchema = new mongoose.Schema<Order>(
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
        photo: {type: String, required: true},
        customer: {type: String, required: true},
        amount: { type: Number, required: true },
        method: {type: String, required: true},
        address: { type: Object, required: true },
        status: { type: String, default: "pending" },
      },
      { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
