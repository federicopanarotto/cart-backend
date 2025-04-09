import { User } from "../user/user.entity";
import { CartItem } from "./cart-item.entity";
import { CartItemModel } from "./cart-item.model";

export async function addToCart(data: CartItem): Promise<CartItem> {
  const existing = await CartItemModel.findOne({ $and: [{product: data.product}, {user: data.user}]});
  if (!!existing) {
    existing.quantity += data.quantity;
    await existing.save()
    return existing.populate('product')
  }

  const newItem = await CartItemModel.create(data);
  return newItem.populate('product');
}

export async function getCart(userId: string): Promise<CartItem[]> {
  return CartItemModel.find({'user': userId}).populate('product');
}

export async function update(id: string, data: Partial<CartItem>): Promise<CartItem | null> {
  const updated = await CartItemModel.findByIdAndUpdate(id, data, {new: true}).populate('product');
  return updated;
}

export async function removeById(id: string, userId: string): Promise<CartItem | null> {
  return CartItemModel.findOneAndDelete({id: id, user: userId}).populate('product');
}