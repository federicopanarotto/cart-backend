import { Schema, model } from 'mongoose';
import { CartItem } from './cart-item.entity';

const cartItemSchema = new Schema<CartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

cartItemSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    return {
      id: ret.id,
      ...ret
    };
  }
});

export const CartItemModel = model<CartItem>('CartItem', cartItemSchema, 'cart');