import { ValidationError as OriginalValidationError, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Request, Response, NextFunction } from "express";

export class ValidationError extends Error {
  originalErrors: OriginalValidationError[];

  constructor(errors: OriginalValidationError[]) {
    super();
    this.name = 'ValidationError';
    this.originalErrors = errors;
    this.message = this.originalErrors
      .map(err => Object.values(err.constraints as any).join('; '))
      .join('; ');
  }
}

export const validationHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    console.error(err);
    res.status(400).json({
      name: err.name,
      message: err.message,
      details: err.originalErrors.map(err => ({
        property: err.property,
        contraints: err.constraints,
        value: err.value
      }))
    });
  } else {
    next(err);
  }
}