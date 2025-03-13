import { Product } from "../product/product.entity";

export type CartItem = {
  product: string | Product;
  quantity: number;
};