import { User } from "../user/user.entity";
import { CartItem } from "./cart-item.entity";
import { CartItemModel } from "./cart-item.model";

export async function addToCart(data: CartItem, userId: string): Promise<CartItem> {
  const existing = await CartItemModel.findOne(
    { product: data.product, user: userId});
  if (!!existing) {
    existing.quantity += data.quantity;
    await existing.save()
    return existing.populate('product')
  }

  const newItem = await CartItemModel.create({
    product: data.product,
    quantity: data.quantity,
    user: userId
  });
  return newItem.populate('product');
}

export async function getCart(userId: string): Promise<CartItem[]> {
  return CartItemModel.find({user: userId}).populate('product');
}

export async function update(cartItemId: string, data: Partial<CartItem>, userId: string): Promise<CartItem | null> {
  const updated = await CartItemModel.findOneAndUpdate(
    { _id: cartItemId, user: userId }, data, {new: true}).populate('product');
  return updated;
}

export async function removeById(productId: string, userId: string): Promise<CartItem | null> {
  return CartItemModel.findOneAndDelete({id: productId, user: userId}).populate('product');
}