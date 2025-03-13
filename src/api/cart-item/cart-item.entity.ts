import { Product } from "../product/product.entity";

export type CartItem = {
  product:  string;
  quantity: number;
};

export type PopulatedCartItem = Omit<CartItem, 'product'> & {
  product: Product;
}