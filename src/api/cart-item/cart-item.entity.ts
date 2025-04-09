import { Product } from "../product/product.entity";
import { User } from "../user/user.entity";

export type CartItem = {
  user: string | User;
  product: string | Product;
  quantity: number;
};