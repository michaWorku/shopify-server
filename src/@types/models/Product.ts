import { Document, Types} from 'mongoose';

export interface Product extends Document {
    title: string;
    desc: string;
    photo: string;
    categories:  Types.Array<string>;
    size:  Types.Array<string>;
    color:  Types.Array<string>;
    price: number;
    inStock: boolean;
  }