import { Document, Types} from 'mongoose';

export interface Products {
  productId: Types.ObjectId;
  quantity: string;
}

export interface Cart extends Document {
  userId: Types.ObjectId,
  products: Types.DocumentArray<Products>
  }
