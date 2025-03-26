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
    delete ret._id;
    return {
      id: ret.id,
      name: ret.name,
      description: ret.description,
      netPrice: ret.netPrice,
      discount: ret.discount,
      weight: ret.weight,
    };
  }
});

export const ProductModel = model<Product>('Product', productSchema);