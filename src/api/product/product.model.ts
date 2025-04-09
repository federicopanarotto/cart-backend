import { Schema, model } from 'mongoose';
import { Product } from './product.entity';

const productSchema = new Schema<Product>({
  name: String,
  description: String,
  netPrice: Number,
  weight: Number,
  discount: Number,
});

productSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id
    delete ret._id;
    return {
      id: ret.id,
      ...ret
    };
  }
});

export const ProductModel = model<Product>('Product', productSchema);