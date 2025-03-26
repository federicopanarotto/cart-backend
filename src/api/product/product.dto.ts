import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { IsGreaterThanMin } from "../../lib/custom-decorators";

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
  @IsGreaterThanMin('minPrice')
  @Type(() => Number)
  maxPrice?: number;
}

export type QueryProducts = QueryProductsDTO;