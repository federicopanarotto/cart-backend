import { plainToClass } from "class-transformer";
import { validate as classValidate } from "class-validator";
import { Response, NextFunction } from "express";
import { ValidationError } from "../errors/validation.error";
import { TypedRequest } from "./typed-request.interface";

export function validateFn<T extends object>(type: new() => T): (
  req: TypedRequest, 
  res: Response, 
  next: NextFunction
) => Promise<void>;

export function validateFn<T extends object>(type: new() => T, origin: 'body'): (
  req: TypedRequest<T>, 
  res: Response, 
  next: NextFunction
) => Promise<void>;

export function validateFn<T extends object>(type: new() => T, origin: 'query'): (
  req: TypedRequest<any, T>, 
  res: Response, 
  next: NextFunction
) => Promise<void>;

export function validateFn<T extends object>(type: new() => T, origin: 'body' | 'query' = 'body') {
  return async (req: TypedRequest<any, any>, res: Response, next: NextFunction) => {
    const data = plainToClass(type, req[origin]);
    const errors = await classValidate(data);
    if (errors.length) {
      next(new ValidationError(errors));
      return;
    }
    req[origin] = data;
    next();
  }
}