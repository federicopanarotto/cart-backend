import { Request, Response, NextFunction } from "express";
import { Product } from "./product.entity";
import { getById, find } from "./product.service";
import { TypedRequest } from "../../lib/typed-request.interface";
import { QueryProductsDTO } from "./product.dto";

export const list = async (
  req: TypedRequest<unknown, QueryProductsDTO>,
  res: Response,
  next: NextFunction
) => {
  const filtered: Product[] = await find(req.query);

  res.json(filtered);
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params["id"];

  const product: Product | null = await getById(id);
  if (!product) {
    res.status(404).send();
    return;
  }

  res.json(product);
};