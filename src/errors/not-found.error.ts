import { Request, Response, NextFunction } from "express";

export class NotFoundError extends Error {
  name = 'NotFoundError';
  constructor() {
    super('Entity Not Found');
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
      error: err.name, 
      message: err.message
    });
  } else {
    next(err);
  }
};