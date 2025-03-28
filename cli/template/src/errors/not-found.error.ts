import { Request, Response, NextFunction } from "express";

export class NotFoundError extends Error {
  constructor() {
    super('Entity Not Found');
    this.name = 'NotFoundError';
  }
}

export const notFoundHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (err instanceof NotFoundError) {
    res.status(404).send({
      name: err.name,
      message: err.message
    });
  } else {
    next(err);
  }
};