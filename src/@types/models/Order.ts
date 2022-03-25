import { Document, Types} from 'mongoose';

export interface Products {
  productId: Types.ObjectId;
  quantity: string;
}

export interface Order extends Document {
  userId: Types.ObjectId,
  products: Types.DocumentArray<Products>,
  photo: string, 
  customer: string, 
  amount : number,
  method: string,
  address : {},
  status: string,
  }
