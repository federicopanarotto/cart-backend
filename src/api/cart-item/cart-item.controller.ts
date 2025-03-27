import { Request, Response, NextFunction } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { CartItem } from "./cart-item.entity";
import { AddCartItemDTO, UpdateCartQuantityDTO } from "./cart-item.dto";
import { getById } from "../product/product.service";
import { addToCart, getCart, removeById, update } from "./cart-item.service";
import { NotFoundError } from "../../errors/not-found.error";

export const add = async (
  req: TypedRequest<AddCartItemDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity } = req.body;
  
    const product = await getById(productId);
    if (!product) {
      throw new NotFoundError();
    }
  
    const added = await addToCart({ product: productId, quantity: quantity });
    res.status(201).json(added);
  } catch (err: any) {
    next(err);
  }
}

export const list = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const cart: CartItem[] = await getCart();
    res.json(cart);
  } catch (err: any) {
    next(err);
  }
}

export const updateQuantity = async (
  req: TypedRequest<UpdateCartQuantityDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
  
    const updated: CartItem | null = await update(id, { quantity });
    if (!updated) {
      throw new NotFoundError();
    }
    res.json(updated);
  } catch (err: any) {
    next(err);
  }
}

export const remove = async(
  req: TypedRequest<AddCartItemDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
  
    const deleted: CartItem | null = await removeById(id);
    if (!deleted) {
      throw new NotFoundError();
    }
    res.json(deleted);
  } catch (err: any) {
    next(err);
  }
}