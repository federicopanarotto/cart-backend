import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min, registerDecorator, Validate, ValidationArguments, ValidationOptions } from "class-validator";

export class QueryProductsDTO {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    minPrice?: number;
    
    @IsNumber()
    @IsOptional()
    @IsGreaterThanMin('')
    @Type(() => Number)
    maxPrice?: number;
}

export function IsGreaterThanMin(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsGreaterThanMin',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    console.log(args.object)
                    const currentMinPrice = Object.values(args.object)[0];
                    return value >= currentMinPrice;
                },
                defaultMessage(args: ValidationArguments) {
                    return "MaxPrice value must be higher than minPrice value";
                }
            }
        })
    }
}