import { Request, Response, NextFunction } from "express";
import { getById } from "../product/product.service";
import { addToCart, getCart, update } from "./cart-item.service";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddCartItemDTO, UpdateCartQuantityDTO } from "./cart-item.dto";
import { CartItem } from "./cart-item.entity";

export const add = async (
  req: TypedRequest<AddCartItemDTO>,
  res: Response,
  next: NextFunction
) => {
  const { productId, quantity } = req.body;

  const product = await getById(productId);
  if (!product) {
    res.status(404).send();
    return;
  }

  const added = await addToCart({ product: productId, quantity: quantity });
  res.status(201).json(added);
}

export const list = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const cart: CartItem[] = await getCart();
  res.json(cart);
}

export const updateQuantity = async (
  req: TypedRequest<UpdateCartQuantityDTO>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const updated: CartItem | null = await update(id, { quantity });
  if (!updated) {
    res.status(404).send();
    return;
  }
  res.json(updated);
}