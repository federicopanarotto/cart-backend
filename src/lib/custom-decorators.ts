import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsGreaterThanMin(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsGreaterThanMin',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!relatedValue) {
            return true;
          }
          return value >= relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return `MaxPrice value must be higher than minPrice value >= ${relatedValue}`;
        }
      }
    })
  }
}