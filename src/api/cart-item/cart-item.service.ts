import { getById } from "../product/product.service";
import { CartItem, PopulatedCartItem } from "./cart-item.entity";

export let cart: CartItem[] = [];

export async function addToCart(data: CartItem): Promise<CartItem> {
  cart.push(data);
  return data;
}

export async function getCart(): Promise<CartItem[]> {
  return cart;
}

export async function populateCartItem(source: CartItem): Promise<PopulatedCartItem>; 
export async function populateCartItem(source: CartItem[]): Promise<PopulatedCartItem[]>;
export async function populateCartItem(source: CartItem | CartItem[]) {
  if (Array.isArray(source)) {
    const promises = source.map(item => populateCartItem(item));
    return Promise.all(promises);
  }

  const productId = source.product;
  const product = await getById(productId.toString());
  return {
    ...source,
    product
  };
}