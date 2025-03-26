import { Request, Response, NextFunction } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { Product } from "./product.entity";
import { QueryProductsDTO } from "./product.dto";
import { getById, find } from "./product.service";
import { NotFoundError } from "../../errors/not-found.error";

export const list = async (
  req: TypedRequest<unknown, QueryProductsDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const filtered: Product[] = await find(req.query);

    res.json(filtered);
  } catch (err) {
    next(err);
  }
}

export const get = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const id = req.params["id"];
  
    const product: Product | null = await getById(id);
    if (!product) {
      throw new NotFoundError();
    }
    res.json(product);
  } catch (err: any) {
    next(err);
  }
}