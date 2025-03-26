import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

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
    @Min(0)
    @Type(() => Number)
    maxPrice?: number;
}